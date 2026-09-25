import { requireAdmin } from "@/lib/auth/authorization";
import { getAdminQuote } from "@/actions/admin-quote-queries";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Store, MapPin, Package, User, Pencil, Send } from "lucide-react";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import AdminSendQuoteButton from "@/components/admin/AdminSendQuoteButton";

export default async function AdminQuoteDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const quote = await getAdminQuote(id);

  if (!quote) {
    notFound();
  }

  const { request, business, location, items } = quote;
  const isDraft = quote.status === "DRAFT";

  const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: quote.currency }).format(Number(amount));
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div>
        <Link href={`/admin/requests/${request.id}`} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1">
          <ArrowLeft className="size-4" /> Back to Request
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground mb-1">
            Quote {quote.referenceNumber}
          </h1>
          <div className="text-body text-muted-foreground space-x-2">
            <span>Created on {new Date(quote.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>Last updated {new Date(quote.updatedAt).toLocaleDateString()}</span>
            {quote.validUntil && (
              <>
                <span>•</span>
                <span>Valid until {new Date(quote.validUntil).toLocaleDateString()}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary/10 text-secondary border border-secondary/20">
            {quote.status}
          </span>
          {isDraft && (
            <>
              <Button href={`/admin/quotes/${quote.id}/edit`} variant="secondary" className="py-1 h-9">
                <Pencil className="size-4" />
                Edit Quote
              </Button>
              <AdminSendQuoteButton
                quoteId={quote.id}
                referenceNumber={quote.referenceNumber}
                businessName={business.name}
                totalFormatted={formatCurrency(quote.total.toString())}
                validUntilFormatted={quote.validUntil ? new Date(quote.validUntil).toLocaleDateString() : null}
              />
            </>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Customer & Delivery Context */}
          <div className="grid sm:grid-cols-2 gap-6">
            <Card className="flex flex-col">
              <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-3">
                <Store className="size-4 text-muted-foreground" />
                <h2 className="font-semibold text-foreground">Customer & Request</h2>
              </div>
              <div className="p-4 space-y-3 text-sm">
                <div>
                  <span className="block text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Business</span>
                  <span className="font-medium text-foreground">{business.name}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Contact</span>
                  <span className="text-foreground">{request.user.name} ({request.user.email})</span>
                </div>
                <div>
                  <span className="block text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Supply Request</span>
                  <Link href={`/admin/requests/${request.id}`} className="text-primary hover:underline font-medium">
                    {request.referenceNumber}
                  </Link>
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-secondary/10 text-secondary border border-secondary/20 uppercase tracking-wider">
                    {request.status}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="flex flex-col">
              <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-3">
                <MapPin className="size-4 text-muted-foreground" />
                <h2 className="font-semibold text-foreground">Delivery Context</h2>
              </div>
              <div className="p-4 space-y-3 text-sm">
                <div>
                  <span className="block text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Location</span>
                  <span className="font-medium text-foreground">{location.name}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">Address</span>
                  <span className="text-foreground">{location.address}, {location.city}</span>
                </div>
              </div>
            </Card>
          </div>

          <Card className="overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-3">
              <Package className="size-4 text-muted-foreground" />
              <h2 className="font-semibold text-foreground">Quote Items</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/30 border-b border-border text-xs uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="p-4 font-medium text-muted-foreground">Product</th>
                    <th scope="col" className="p-4 font-medium text-muted-foreground">Quantity</th>
                    <th scope="col" className="p-4 font-medium text-muted-foreground">Unit Price</th>
                    <th scope="col" className="p-4 font-medium text-muted-foreground text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map(item => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium text-foreground">{item.productNameSnapshot}</td>
                      <td className="p-4 text-foreground">{item.quantity.toString()} {item.unit}</td>
                      <td className="p-4 text-foreground">{formatCurrency(item.unitPrice.toString())}</td>
                      <td className="p-4 text-right font-medium text-foreground">
                        {formatCurrency(item.lineTotal.toString())}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {(quote.notes || quote.adminNotes) && (
            <div className="grid sm:grid-cols-2 gap-6">
              {quote.notes && (
                <Card className="p-4 bg-muted/10 border-dashed">
                  <h2 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Customer Notes</h2>
                  <p className="text-sm text-foreground whitespace-pre-wrap">{quote.notes}</p>
                </Card>
              )}
              {quote.adminNotes && (
                <Card className="p-4 bg-primary/5 border-dashed border-primary/20">
                  <h2 className="text-xs font-semibold mb-2 text-primary/70 uppercase tracking-wider">Admin Notes</h2>
                  <p className="text-sm text-foreground whitespace-pre-wrap">{quote.adminNotes}</p>
                </Card>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Financial Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">{formatCurrency(quote.subtotal.toString())}</span>
              </div>
              
              {quote.additionalCharges && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Additional Charges</span>
                  <span className="font-medium text-foreground">{formatCurrency(quote.additionalCharges.toString())}</span>
                </div>
              )}
            </div>
            
            <div className="border-t border-border pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-xl font-display font-bold text-foreground">{formatCurrency(quote.total.toString())}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
