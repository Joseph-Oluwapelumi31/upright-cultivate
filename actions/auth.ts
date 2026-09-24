"use server";

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { signupSchema, signinSchema, verifyOtpSchema } from "@/lib/validations/auth";
import { AuthError } from "next-auth";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email/verification";

const OTP_EXPIRY_MS = 15 * 60 * 1000;
const OTP_COOLDOWN_MS = 60 * 1000;

function generateNumericOTP(length = 6): string {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return crypto.randomInt(min, max + 1).toString();
}

export type AuthState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export async function signUpAction(
  _previousState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const result = signupSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      success: false,
      message: "Please check the form and try again.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = result.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return {
        success: false,
        message: "An account with this email already exists.",
      };
    }

    // Clean up any existing pending signup for this email
    await prisma.pendingSignup.deleteMany({
      where: { email },
    });

    const passwordHash = await hashPassword(password);
    const otp = generateNumericOTP();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    await prisma.pendingSignup.create({
      data: {
        name,
        email,
        passwordHash,
        otpHash: hashedOtp,
        expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
        lastOtpSentAt: new Date(),
      },
    });

    try {
      await sendVerificationEmail({
        email,
        name,
        otp,
      });
    } catch (emailError) {
      // If email fails, delete the pending signup so it doesn't leave an unusable state
      await prisma.pendingSignup.deleteMany({
        where: { email },
      });
      console.error("Resend error:", emailError);
      return {
        success: false,
        message: "Account created but failed to send verification email. Please contact support.",
      };
    }

    return {
      success: true,
      message: `/verify-otp?email=${encodeURIComponent(email)}&purpose=EMAIL_VERIFICATION`,
    };
  } catch (error: unknown) {
    if ((error as any)?.digest?.startsWith("NEXT_REDIRECT") || (error as Error)?.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Signup error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function verifySignupOtpAction(
  _previousState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const result = verifyOtpSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      success: false,
      message: "Please check the OTP and try again.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const { email, otp } = result.data;
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  try {
    const pendingSignup = await prisma.pendingSignup.findUnique({
      where: { email },
    });

    if (!pendingSignup) {
      return {
        success: false,
        message: "This signup request is invalid or has expired. Please sign up again.",
      };
    }

    if (pendingSignup.expiresAt < new Date()) {
      await prisma.pendingSignup.delete({ where: { email } });
      return {
        success: false,
        message: "Verification code has expired. Please sign up again.",
      };
    }

    if (pendingSignup.otpHash !== hashedOtp) {
      return {
        success: false,
        message: "Invalid verification code.",
      };
    }

    // Transaction to create User and delete PendingSignup
    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          name: pendingSignup.name,
          email: pendingSignup.email,
          passwordHash: pendingSignup.passwordHash,
          emailVerified: new Date(),
          role: "CUSTOMER",
        },
      });
      await tx.pendingSignup.delete({
        where: { email },
      });
    });

    return {
      success: true,
      message: "Email verified successfully. Please sign in.",
    };
  } catch (error) {
    console.error("Verify signup OTP error:", error);
    return {
      success: false,
      message: "An unexpected error occurred.",
    };
  }
}

export async function resendSignupVerificationAction(
  _previousState: AuthState,
  formData: FormData
): Promise<AuthState> {
  // We can just parse the email manually or use a schema.
  // We will re-use verifyOtpSchema just for email parsing or do it directly.
  const emailStr = formData.get("email")?.toString() || "";
  const email = emailStr.trim().toLowerCase();
  
  if (!email || !email.includes("@")) {
    return { success: false, message: "Invalid email." };
  }

  try {
    const pendingSignup = await prisma.pendingSignup.findUnique({
      where: { email },
    });

    if (!pendingSignup) {
      return {
        success: false,
        message: "This signup request is invalid or has expired.",
      };
    }
    
    if (pendingSignup.lastOtpSentAt && (Date.now() - pendingSignup.lastOtpSentAt.getTime()) < OTP_COOLDOWN_MS) {
      return {
        success: false,
        message: "Please wait before requesting a new code.",
      };
    }

    const otp = generateNumericOTP();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    await prisma.pendingSignup.update({
      where: { email },
      data: {
        otpHash: hashedOtp,
        expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
        lastOtpSentAt: new Date(),
      },
    });

    await sendVerificationEmail({
      email,
      name: pendingSignup.name,
      otp,
    });

    return {
      success: true,
      message: "Verification code resent successfully.",
    };
  } catch (error) {
    console.error("Resend signup OTP error:", error);
    return {
      success: false,
      message: "Failed to resend the verification code.",
    };
  }
}

export async function signInAction(
  _previousState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const result = signinSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      success: false,
      message: "Please check your email and password.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password } = result.data;
  const callbackUrl = formData.get("next")?.toString() || formData.get("callbackUrl")?.toString() || "/dashboard";

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    
    return {
      success: true,
      message: callbackUrl,
    };
  } catch (error: unknown) {
    if ((error as any)?.digest?.startsWith("NEXT_REDIRECT") || (error as Error)?.message === "NEXT_REDIRECT") {
      throw error;
    }
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            message: "Invalid email or password.",
          };
        default:
          return {
            success: false,
            message: "Something went wrong.",
          };
      }
    }
    throw error;
  }
}

export async function signOutAction() {
  await signOut({ redirectTo: "/signin" });
}

export async function signInWithGoogleAction(formData: FormData) {
  const callbackUrl = formData.get("next")?.toString() || formData.get("callbackUrl")?.toString() || "/dashboard";
  await signIn("google", { redirectTo: callbackUrl });
}
