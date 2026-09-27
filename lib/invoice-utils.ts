import { InvoiceStatus } from "@/lib/generated/prisma/client";

/**
 * Derives the display status for an invoice.
 * An invoice is OVERDUE if it is ISSUED and its dueDate is strictly before
 * the current UTC calendar date.
 */
export function getInvoiceDisplayStatus(
  status: InvoiceStatus,
  dueDate: Date | null,
  now: Date = new Date()
): InvoiceStatus {
  if (status === "ISSUED" && dueDate !== null) {
    // Construct today's calendar date at UTC midnight
    const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    
    // dueDate is constructed at UTC midnight, so a simple < comparison against todayUTC works.
    if (dueDate.getTime() < todayUTC.getTime()) {
      return "OVERDUE";
    }
  }

  return status;
}

/**
 * Formats the given InvoiceStatus for UI presentation.
 */
export function formatInvoiceStatus(status: InvoiceStatus | string): string {
  const statusMap: Record<string, string> = {
    DRAFT: "Draft",
    ISSUED: "Issued",
    PAID: "Paid",
    OVERDUE: "Overdue",
    CANCELLED: "Cancelled"
  };
  return statusMap[status as string] || status;
}
