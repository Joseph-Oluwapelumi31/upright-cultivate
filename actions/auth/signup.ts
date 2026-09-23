"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { signupSchema } from "@/lib/validations/auth";

export async function signupAction(input: unknown) {
  // Validate all signup input with Zod.
  const result = signupSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      error: "Please check your signup information.",
    };
  }

  const { name, email, password } = result.data;

  // Normalize the email so that:
  // JOHN@EXAMPLE.COM
  // john@example.com
  // John@Example.com
  // are treated consistently.
  const normalizedEmail = email.trim().toLowerCase();

  // Check whether this email already belongs to a user.
  const existingUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (existingUser) {
    return {
      success: false,
      error: "An account with this email already exists.",
    };
  }

  // Never store the plain-text password.
  const passwordHash = await hashPassword(password);

  // Create the application user.
  const user = await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      passwordHash,

      // New accounts are customers by default.
      role: "CUSTOMER",
    },
  });

  return {
    success: true,
    userId: user.id,
  };
}