import { auth } from "@/auth";
import type { UserRole } from "@/lib/generated/prisma/browser";

export async function getCurrentUser() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  return session.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  return user;
}

export async function requireRole(role: UserRole) {
  const user = await requireAuth();

  if (user.role !== role) {
    throw new Error("FORBIDDEN");
  }

  return user;
}

export async function requireCustomer() {
  return requireRole("CUSTOMER");
}

export async function requireAdmin() {
  return requireRole("ADMIN");
}