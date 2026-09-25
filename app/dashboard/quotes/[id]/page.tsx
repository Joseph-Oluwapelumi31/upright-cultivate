import { getCustomerQuote } from "@/actions/customer-quote-queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Store, MapPin, Package, Calendar } from "lucide-react";
import { Card } from "@/components/ui/Card";
import CustomerAcceptQuoteButton from "@/components/dashboard/CustomerAcceptQuoteButton";
import CustomerRejectQuoteButton from "@/components/dashboard/CustomerRejectQuoteButton";

const formatCurrency = (amount: number | string, currency = "NGN") => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(Number(amount));
};

export default async function DashboardQuoteDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quote = await getCustomerQuote(id);

  if (!quote) {
    notFound();
  }

  const { business, location, request, items } = quote;
  const isExpired = quote.validUntil && new Date(quote.validUntil) < new Date();
  
  // Enforce correct visual status representation if backend missed an update but it's expired
  // (Though backend should handle this, UI can be defensive)
  const displayStatus = (quote.status === "SENT" && isExpired) ? "EXPIRED" : quote.status;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <Link 
          href="/dashboard/quotes" 
          className="p-2 -ml-2 rounded-full hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Back to quotes"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-display font-medium text-foreground">
                {quote.referenceNumber}
              </h1>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary/10 text-secondary border border-secondary/20">
                {displayStatus}
              </span>
            </div>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              Created {new Date(quote.createdAt).toLocaleDateString()}
            </p>
          </div>
          {displayStatus === "SENT" && (
            <div className="flex flex-wrap items-center gap-3">
              <CustomerRejectQuoteButton quoteId={quote.id} />
              <CustomerAcceptQuoteButton 
                quoteId={quote.id} 
                referenceNumber={quote.referenceNumber} 
                totalFormatted={formatCurrency(quote.total.toString(), quote.currency)} 
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Request Context */}
        <Card className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Request Context</h2>
          <div className="space-y-4 text-sm">
            <div className="flex gap-3">
              <Package className="size-5 text-muted-foreground shrink-0" />
              <div>
                <div className="font-medium text-foreground">Supply Request</div>
                <Link href={`/dashboard/requests/${request.id}`} className="text-primary hover:underline">
                  {request.referenceNumber}
                </Link>
              </div>
            </div>
            <div className="flex gap-3">
              <Store className="size-5 text-muted-foreground shrink-0" />
              <div>
                <div className="font-medium text-foreground">Business</div>
                <div className="text-muted-foreground">{business.name}</div>
              </div>
            </div>
            <div className="flex gap-3">
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

        {/* Validity */}
        <Card className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Validity</h2>
          <div className="space-y-4 text-sm">
            <div className="flex gap-3">
              <Calendar className="size-5 text-muted-foreground shrink-0" />
              <div>
                <div className="font-medium text-foreground">Valid Until</div>
                <div className={`text-base font-semibold mt-1 ${isExpired ? 'text-destructive' : 'text-foreground'}`}>
                  {quote.validUntil ? new Date(quote.validUntil).toLocaleDateString() : 'No expiry set'}
                  {isExpired && ' (Expired)'}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quote Items */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Quote Items</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/30 border-b border-border text-xs uppercase tracking-wider">
              <tr>
                <th scope="col" className="p-4 font-medium text-muted-foreground">Product</th>
                <th scope="col" className="p-4 font-medium text-muted-foreground text-right">Quantity</th>
                <th scope="col" className="p-4 font-medium text-muted-foreground text-right">Unit Price</th>
                <th scope="col" className="p-4 font-medium text-muted-foreground text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-muted/10">
                  <td className="p-4">
                    <div className="font-medium text-foreground">{item.productNameSnapshot}</div>
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    {item.quantity.toString()} {item.unit}
                  </td>
                  <td className="p-4 text-right whitespace-nowrap text-muted-foreground">
                    {formatCurrency(item.unitPrice.toString(), quote.currency)}
                  </td>
                  <td className="p-4 text-right whitespace-nowrap font-medium text-foreground">
                    {formatCurrency(item.lineTotal.toString(), quote.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pricing Breakdown & Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 h-fit order-2 lg:order-1">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Notes</h2>
          {quote.notes ? (
            <div className="text-sm text-foreground whitespace-pre-wrap">{quote.notes}</div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No additional notes provided.</p>
          )}
        </Card>

        <Card className="p-6 order-1 lg:order-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Pricing Breakdown</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium text-foreground">{formatCurrency(quote.subtotal.toString(), quote.currency)}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <span className="text-muted-foreground">Additional Charges</span>
              <span className="font-medium text-foreground">{formatCurrency(quote.additionalCharges?.toString() || "0", quote.currency)}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-base font-semibold text-foreground">Total</span>
              <span className="text-xl font-bold text-foreground">{formatCurrency(quote.total.toString(), quote.currency)}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
