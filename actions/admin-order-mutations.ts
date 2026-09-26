"use server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/authorization";
import { OrderStatus } from "@/lib/generated/prisma/client";
import { revalidatePath } from "next/cache";

const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  CONFIRMED: ["PREPARING"],
  PREPARING: ["READY"],
  READY: ["OUT_FOR_DELIVERY"],
  OUT_FOR_DELIVERY: ["DELIVERED"],
  DELIVERED: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

export async function updateAdminOrderStatus(orderId: string, nextStatus: OrderStatus, expectedCurrentStatus: OrderStatus) {
  await requireAdmin();

  // Validate the status transitions
  const allowedNextStatuses = validTransitions[expectedCurrentStatus];
  if (!allowedNextStatuses || !allowedNextStatuses.includes(nextStatus)) {
    return {
      success: false,
      error: "That status transition is not allowed."
    };
  }

  // Atomic conditional update to handle concurrency
  const result = await prisma.order.updateMany({
    where: {
      id: orderId,
      status: expectedCurrentStatus, // Ensure it hasn't changed
    },
    data: {
      status: nextStatus,
    },
  });

  if (result.count === 0) {
    return {
      success: false,
      error: "This order was updated by another administrator. Refresh and try again."
    };
  }

  // Revalidate relevant pages
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/dashboard/orders");
  revalidatePath(`/dashboard/orders/${orderId}`);

  return { success: true };
}
