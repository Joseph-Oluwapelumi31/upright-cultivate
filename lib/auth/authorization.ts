import { auth } from "@/auth";
import { redirect } from "next/navigation";
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
    redirect("/signin");
  }

  return user;
}

export async function requireRole(role: UserRole) {
  const user = await requireAuth();

  if (user.role !== role) {
    redirect("/");
  }

  return user;
}

export async function requireCustomer() {
  return requireRole("CUSTOMER");
}

export async function requireAdmin() {
  return requireRole("ADMIN");
}