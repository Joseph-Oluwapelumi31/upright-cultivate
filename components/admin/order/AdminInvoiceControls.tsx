"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createInvoice, issueInvoice } from "@/actions/admin-invoice";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

type AdminInvoiceControlsProps = {
  orderId: string;
  orderStatus: string;
  invoiceId: string | null;
  invoiceStatus: string | null;
};

export default function AdminInvoiceControls({
  orderId,
  orderStatus,
  invoiceId,
  invoiceStatus,
}: AdminInvoiceControlsProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<string>("");

  async function handleCreateInvoice() {
    if (isPending) return;
    setIsPending(true);
    setError(null);

    try {
      const result = await createInvoice(orderId);
      if (!result.success) {
        setError(result.message || "Failed to create invoice.");
      } else {
        router.refresh();
      }
    } catch (e) {
      setError("An unexpected error occurred.");
    } finally {
      setIsPending(false);
    }
  }

  async function handleIssueInvoice() {
    if (isPending) return;
    if (!invoiceId) return;
    if (!dueDate) {
      setError("Please select a due date.");
      return;
    }
    
    setIsPending(true);
    setError(null);

    try {
      const result = await issueInvoice(invoiceId, dueDate);
      if (!result.success) {
        setError(result.message);
      } else {
        router.refresh();
      }
    } catch (e) {
      setError("Unable to issue invoice. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  // Only render invoice controls if the order is DELIVERED.
  if (orderStatus !== "DELIVERED") {
    return null;
  }

  return (
    <Card className="p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Financial Records</h2>
      
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      {invoiceId && invoiceStatus === "DRAFT" ? (
        <div className="flex flex-col gap-3">
          <div className="p-4 rounded-md border border-primary/20 bg-primary/5 text-primary text-sm font-medium">
            Invoice created
          </div>
          <p className="text-sm text-foreground/80 mb-2">
            The invoice is in DRAFT status. Select a due date and issue it.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={isPending}
              aria-label="Due Date"
              className="px-3 py-2 text-sm rounded-md border border-input bg-background w-auto max-w-[200px]"
            />
            <Button
              variant="primary"
              disabled={isPending}
              onClick={handleIssueInvoice}
              aria-label="Issue Invoice"
            >
              {isPending ? "Issuing..." : "Issue Invoice"}
            </Button>
            <Link 
              href={`/admin/invoices/${invoiceId}`} 
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-muted text-foreground transition-colors"
            >
              View Invoice
            </Link>
          </div>
        </div>
      ) : invoiceId && invoiceStatus === "ISSUED" ? (
        <div className="flex flex-col gap-3">
          <div className="p-4 rounded-md border border-primary/20 bg-primary/5 text-primary text-sm font-medium">
            Invoice Issued
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            <Link 
              href={`/admin/invoices/${invoiceId}`} 
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-muted text-foreground transition-colors"
            >
              View Invoice
            </Link>
          </div>
        </div>
      ) : invoiceId ? (
        <div className="flex flex-col gap-3">
          <div className="p-4 rounded-md border border-border bg-muted/5 text-foreground text-sm font-medium">
            Invoice Status: {invoiceStatus}
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            <Link 
              href={`/admin/invoices/${invoiceId}`} 
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-muted text-foreground transition-colors"
            >
              View Invoice
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-foreground/80 mb-2">
            This order is delivered. You can now generate the financial invoice.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              disabled={isPending}
              onClick={handleCreateInvoice}
              aria-label="Create Invoice"
            >
              {isPending ? "Creating..." : "Create Invoice"}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
