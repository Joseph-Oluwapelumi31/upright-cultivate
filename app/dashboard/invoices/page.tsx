import { getCustomerInvoices } from "@/actions/customer-invoice-queries";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const formatCurrency = (amount: number | string, currency = "NGN") => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(Number(amount));
};

import { getInvoiceDisplayStatus, formatInvoiceStatus } from "@/lib/invoice-utils";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default async function DashboardInvoicesPage() {
  const invoices = await getCustomerInvoices();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 border-b border-border pb-6">
        <h1 className="text-3xl font-display font-medium text-foreground mb-1">Invoices</h1>
        <p className="text-muted-foreground text-body">Track and manage your commercial invoices.</p>
      </div>

      {invoices.length === 0 ? (
        <Card className="p-12 text-center flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2 text-foreground">No Invoices Yet</h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            When an order is delivered, its invoice will appear here.
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="hidden md:block overflow-hidden rounded-card border border-border bg-surface">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/30 border-b border-border text-xs uppercase tracking-wider">
                <tr>
                  <th scope="col" className="p-4 font-medium text-muted-foreground">Invoice #</th>
                  <th scope="col" className="p-4 font-medium text-muted-foreground">Order Ref</th>
                  <th scope="col" className="p-4 font-medium text-muted-foreground">Business</th>
                  <th scope="col" className="p-4 font-medium text-muted-foreground">Total</th>
                  <th scope="col" className="p-4 font-medium text-muted-foreground">Due Date</th>
                  <th scope="col" className="p-4 font-medium text-muted-foreground">Status</th>
                  <th scope="col" className="p-4 text-right"><span className="sr-only">Action</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.map(invoice => (
                  <tr key={invoice.id} className="hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-medium text-foreground">{invoice.invoiceNumber || <span className="text-muted-foreground font-normal italic">Not issued</span>}</td>
                    <td className="p-4 text-muted-foreground">{invoice.order.orderNumber}</td>
                    <td className="p-4 text-muted-foreground">{invoice.business.name}</td>
                    <td className="p-4 font-medium">{formatCurrency(invoice.total.toString(), invoice.currency)}</td>
                    <td className="p-4 text-muted-foreground whitespace-nowrap">
                      {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-US', { timeZone: 'UTC' }) : "â€”"}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={getInvoiceDisplayStatus(invoice.status, invoice.dueDate)}>{formatInvoiceStatus(getInvoiceDisplayStatus(invoice.status, invoice.dueDate))}</StatusBadge>
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/dashboard/invoices/${invoice.id}`} className="text-primary hover:underline font-medium inline-flex items-center gap-1">
                        View &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden flex flex-col gap-4">
            {invoices.map(invoice => (
              <Card key={invoice.id} className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-foreground">{invoice.invoiceNumber || <span className="text-muted-foreground font-normal italic">Not issued</span>}</div>
                    <div className="text-sm text-muted-foreground">{formatCurrency(invoice.total.toString(), invoice.currency)}</div>
                  </div>
                  <StatusBadge status={getInvoiceDisplayStatus(invoice.status, invoice.dueDate)}>{formatInvoiceStatus(getInvoiceDisplayStatus(invoice.status, invoice.dueDate))}</StatusBadge>
                </div>
                <div className="text-sm flex flex-col gap-1">
                  <div className="text-foreground">{invoice.business.name}</div>
                  <div className="text-muted-foreground">Order: {invoice.order.orderNumber}</div>
                  <div className="text-muted-foreground mt-1">Due: {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-US', { timeZone: 'UTC' }) : "â€”"}</div>
                </div>
                <div className="pt-2 border-t border-border flex justify-end">
                  <Link href={`/dashboard/invoices/${invoice.id}`} className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1">
                    View Details &rarr;
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
