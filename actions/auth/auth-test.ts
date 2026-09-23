"use server";

import {
  requireAuth,
  requireCustomer,
  requireAdmin,
} from "@/lib/auth/authorization";

export async function testAuthAction() {
  const user = await requireAuth();

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
}

export async function testCustomerAction() {
  const user = await requireCustomer();

  return {
    success: true,
    message: `Customer access granted to ${user.email}`,
  };
}

export async function testAdminAction() {
  const user = await requireAdmin();

  return {
    success: true,
    message: `Admin access granted to ${user.email}`,
  };
}

