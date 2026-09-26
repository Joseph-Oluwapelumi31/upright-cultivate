"use client";

import { useState } from "react";
import { OrderStatus } from "@/lib/generated/prisma/client";
import { updateAdminOrderStatus } from "@/actions/admin-order-mutations";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  CONFIRMED: ["PREPARING"],
  PREPARING: ["READY"],
  READY: ["OUT_FOR_DELIVERY"],
  OUT_FOR_DELIVERY: ["DELIVERED"],
  DELIVERED: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

const statusLabels: Record<OrderStatus, string> = {
  CONFIRMED: "Confirm",
  PREPARING: "Move to Preparing",
  READY: "Move to Ready",
  OUT_FOR_DELIVERY: "Move to Out for Delivery",
  DELIVERED: "Move to Delivered",
  COMPLETED: "Complete Order",
  CANCELLED: "Cancel",
};

export default function AdminOrderStatusControls({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allowedNextStatuses = validTransitions[currentStatus] || [];

  async function handleStatusChange(nextStatus: OrderStatus) {
    if (isPending) return;
    setIsPending(true);
    setError(null);

    try {
      const result = await updateAdminOrderStatus(orderId, nextStatus, currentStatus);
      if (!result.success) {
        setError(result.error || "Failed to update order status.");
      }
    } catch (e) {
      setError("An unexpected error occurred.");
    } finally {
      setIsPending(false);
    }
  }

  if (currentStatus === "COMPLETED") {
    return (
      <Card className="p-6 border-primary/20 bg-primary/5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">Order Completed</h2>
        <p className="text-sm text-foreground/80">
          This order has reached its final state and cannot be modified further.
        </p>
      </Card>
    );
  }

  if (currentStatus === "CANCELLED") {
    return (
      <Card className="p-6 border-destructive/20 bg-destructive/5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-destructive mb-2">Order Cancelled</h2>
        <p className="text-sm text-foreground/80">
          This order was cancelled and cannot be reopened.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Status Management</h2>
      
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      {allowedNextStatuses.length > 0 ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-foreground/80 mb-2">
            The order is currently <strong className="font-semibold">{currentStatus}</strong>.
          </p>
          <div className="flex flex-wrap gap-3">
            {allowedNextStatuses.map((status) => (
              <Button
                key={status}
                variant="primary"
                disabled={isPending}
                onClick={() => handleStatusChange(status)}
                aria-label={statusLabels[status]}
              >
                {isPending ? "Updating..." : statusLabels[status]}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No further forward transitions are defined for this status.
        </p>
      )}

      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Cancellation remains disabled because the V1 business specification states that post-confirmation cancellation requires admin approval but does not enumerate the permitted source statuses.
        </p>
      </div>
    </Card>
  );
}
