import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import type { SignupInput } from "@/lib/validations/auth";

type SignupUserResult =
  | {
      success: false;
      error: string;
    }
  | {
      success: true;
      message: string;
      user: {
        id: string;
        name: string;
        email: string;
        role: "CUSTOMER" | "ADMIN";
        emailVerified: Date | null;
        createdAt: Date;
      };
      session: {
        token: string;
        expiresAt: Date;
      };
    };

export async function signupUser({
  name,
  email,
  password,
}: SignupInput): Promise<SignupUserResult> {
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return {
      success: false,
      error: "An account with this email already exists",
    };
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true,
      createdAt: true,
    },
  });

  const session = await createSession(user.id);

  return {
    success: true,
    message: "Account created successfully",
    user,
    session: {
      token: session.token,
      expiresAt: session.expiresAt,
    },
  };
}