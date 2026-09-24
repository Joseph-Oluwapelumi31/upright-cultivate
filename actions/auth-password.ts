"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { forgotPasswordSchema, resetPasswordSchema, verifyOtpSchema } from "@/lib/validations/auth";
import crypto from "crypto";
import { AuthState } from "./auth";
import { sendPasswordResetEmail } from "@/lib/email/password-reset";

// Expiration time for OTP (15 minutes)
const OTP_EXPIRY_MS = 15 * 60 * 1000;
// Cooldown for resending OTP (1 minute)
// const OTP_COOLDOWN_MS = 60 * 1000;

function generateNumericOTP(length = 6): string {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return crypto.randomInt(min, max + 1).toString();
}

export async function forgotPasswordAction(
  _previousState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const result = forgotPasswordSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      success: false,
      message: "Please enter a valid email address.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const { email } = result.data;
  const identifier = `PASSWORD_RESET:${email}`;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    // Do not reveal whether an account exists or not
    if (user) {
      // Check for active token to enforce cooldown (not fully implemented here, keeping logic simple for now)
      await prisma.verificationToken.findFirst({
        where: { identifier }
      });
    }

    // Delete any existing tokens for this identifier to invalidate them
    await prisma.verificationToken.deleteMany({
      where: { identifier },
    });

    if (user) {
      const otp = generateNumericOTP();
      const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
      
      await prisma.verificationToken.create({
        data: {
          identifier,
          token: hashedOtp,
          expires: new Date(Date.now() + OTP_EXPIRY_MS),
        },
      });

      try {
        await sendPasswordResetEmail({
          email,
          name: "",
          otp,
        });
      } catch (emailError) {
        // If email fails, we should delete the token and report error
        await prisma.verificationToken.deleteMany({
          where: { identifier },
        });
        console.error("Resend error:", emailError);
        return {
          success: false,
          message: "Failed to send the reset email. Please try again later.",
        };
      }
    }

    // Always return success to prevent account enumeration
    return {
      success: true,
      message: "If an account with that email exists, we have sent a password reset code.",
    };
  } catch (error) {
    console.error("Forgot password error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function verifyOtpAction(
  _previousState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const result = verifyOtpSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    console.error("verifyOtpAction schema validation failed for keys:", Object.keys(result.error.flatten().fieldErrors));
    return {
      success: false,
      message: "Please check the OTP and try again.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const { email, otp, purpose } = result.data;
  const identifier = `${purpose}:${email}`;
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier,
        token: hashedOtp,
      },
    });

    if (!verificationToken) {
      return {
        success: false,
        message: "Invalid verification code.",
      };
    }

    if (verificationToken.expires < new Date()) {
      return {
        success: false,
        message: "Verification code has expired. Please request a new one.",
      };
    }

    if (purpose !== "PASSWORD_RESET") {
      return {
        success: false,
        message: "Invalid purpose for password reset.",
      };
    }

    // Verification successful, we do not delete the token yet as it is needed to perform the reset.
    return {
      success: true,
      message: "OTP verified. Proceed to reset password.",
    };
  } catch (error) {
    console.error("Verify OTP error:", error);
    return {
      success: false,
      message: "An unexpected error occurred.",
    };
  }
}

export async function resetPasswordAction(
  _previousState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const result = resetPasswordSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      success: false,
      message: "Please check your inputs and try again.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const { email, otp, password } = result.data;
  const identifier = `PASSWORD_RESET:${email}`;
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  try {
    // 1. Verify token one last time before resetting
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier,
        token: hashedOtp,
      },
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      return {
        success: false,
        message: "Invalid or expired verification code.",
      };
    }

    // 2. Hash new password
    const passwordHash = await hashPassword(password);

    // 3. Update user
    await prisma.user.update({
      where: { email },
      data: { passwordHash },
    });

    // 4. Delete token to prevent reuse (single-use OTP)
    await prisma.verificationToken.deleteMany({
      where: { identifier },
    });

    return {
      success: true,
      message: "Password reset successfully. You can now sign in.",
    };
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      success: false,
      message: "An unexpected error occurred.",
    };
  }
}
