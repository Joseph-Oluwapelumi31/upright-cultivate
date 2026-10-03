import { getAdminInvoice } from "@/actions/admin-invoice-queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Store, MapPin, FileSignature, User } from "lucide-react";
import { Card } from "@/components/ui/Card";

const formatCurrency = (amount: number | string, currency = "NGN") => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(Number(amount));
};

import { getInvoiceDisplayStatus, formatInvoiceStatus } from "@/lib/invoice-utils";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default async function AdminInvoiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await getAdminInvoice(id);

  if (!invoice) {
    notFound();
  }

  const { business, location, items, order } = invoice;

  return (
    <div className="flex flex-col gap-8 max-w-[1400px]">
      <div className="flex flex-col gap-4">
        <Link 
          href={`/admin/orders/${order.id}`}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="size-4" />
          Back to Order
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold font-display text-foreground">
                {invoice.invoiceNumber ? `Invoice ${invoice.invoiceNumber}` : "Draft Invoice"}
              </h1>
              <StatusBadge status={getInvoiceDisplayStatus(invoice.status, invoice.dueDate)} size="lg">{formatInvoiceStatus(getInvoiceDisplayStatus(invoice.status, invoice.dueDate))}</StatusBadge>
            </div>
            <div className="flex flex-col gap-1 mt-2 text-body text-muted-foreground">
              {invoice.issueDate ? (
                <p>Issued on {new Date(invoice.issueDate).toLocaleDateString()} at {new Date(invoice.issueDate).toLocaleTimeString()}</p>
              ) : (
                <p>Not issued</p>
              )}
              {invoice.dueDate && (
                <p>Due on {new Date(invoice.dueDate).toLocaleDateString('en-US', { timeZone: 'UTC' })}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Business & Location Context */}
          <Card className="p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Customer & Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="flex gap-3">
                <User className="size-5 text-muted-foreground shrink-0" />
                <div>
                  <div className="font-medium text-foreground">Customer</div>
                  <div className="text-muted-foreground">{business.user.name}</div>
                  <div className="text-muted-foreground text-xs mt-0.5">{business.user.email}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Store className="size-5 text-muted-foreground shrink-0" />
                <div>
                  <div className="font-medium text-foreground">Business</div>
                  <div className="text-muted-foreground">{business.name}</div>
                </div>
              </div>
              <div className="flex gap-3 md:col-span-2 border-t border-border pt-4 mt-2">
                <MapPin className="size-5 text-muted-foreground shrink-0" />
                <div>
                  <div className="font-medium text-foreground">Delivery Location</div>
                  <div className="text-muted-foreground">{location.name}</div>
                  {location.address && (
                    <div className="text-muted-foreground text-xs mt-0.5">{location.address}</div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Invoice Items */}
          <Card className="overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Invoice Items</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/30 border-b border-border text-xs uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="p-4 font-medium text-muted-foreground">Product Snapshot</th>
                    <th scope="col" className="p-4 font-medium text-muted-foreground text-right">Quantity</th>
                    <th scope="col" className="p-4 font-medium text-muted-foreground text-right">Unit Price</th>
                    <th scope="col" className="p-4 font-medium text-muted-foreground text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map((item: any) => (
                    <tr key={item.id} className="hover:bg-muted/10">
                      <td className="p-4">
                        <div className="font-medium text-foreground">{item.productNameSnapshot}</div>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        {item.quantity.toString()} {item.unit}
                      </td>
                      <td className="p-4 text-right whitespace-nowrap text-muted-foreground">
                        {formatCurrency(item.unitPrice.toString(), invoice.currency)}
                      </td>
                      <td className="p-4 text-right whitespace-nowrap font-medium text-foreground">
                        {formatCurrency(item.lineTotal.toString(), invoice.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Notes */}
          {invoice.notes && (
            <Card className="p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Notes</h2>
              <p className="text-sm text-foreground whitespace-pre-wrap">{invoice.notes}</p>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {/* Order Reference */}
          <Card className="p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Source Document</h2>
            <div className="flex gap-3 text-sm">
              <FileSignature className="size-5 text-muted-foreground shrink-0" />
              <div>
                <div className="font-medium text-foreground">Originating Order</div>
                <Link href={`/admin/orders/${order.id}`} className="text-primary hover:underline">
                  {order.orderNumber}
                </Link>
                <div className="text-muted-foreground text-xs mt-1">Order Status: {order.status}</div>
              </div>
            </div>
          </Card>

          {/* Pricing Breakdown */}
          <Card className="p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Financial Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">{formatCurrency(invoice.subtotal.toString(), invoice.currency)}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-muted-foreground">Additional Charges</span>
                <span className="font-medium text-foreground">{formatCurrency(invoice.additionalCharges?.toString() || "0", invoice.currency)}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-base font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-foreground">{formatCurrency(invoice.total.toString(), invoice.currency)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
