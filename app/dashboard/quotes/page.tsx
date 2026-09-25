import { getCustomerQuotes } from "@/actions/customer-quote-queries";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const formatCurrency = (amount: number | string, currency = "NGN") => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(Number(amount));
};

export default async function DashboardQuotesPage() {
  const quotes = await getCustomerQuotes();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 border-b border-border pb-6">
        <h1 className="text-3xl font-display font-medium text-foreground mb-1">Quotes</h1>
        <p className="text-muted-foreground text-body">Review commercial quotes for your supply requests.</p>
      </div>

      {quotes.length === 0 ? (
        <Card className="p-12 text-center flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2 text-foreground">No Quotes Yet</h2>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            When we prepare a quote for one of your supply requests, it will appear here.
          </p>
          <Button href="/dashboard/requests" variant="primary">View Requests</Button>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="hidden md:block overflow-hidden rounded-card border border-border bg-surface">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/30 border-b border-border text-xs uppercase tracking-wider">
                <tr>
                  <th scope="col" className="p-4 font-medium text-muted-foreground">Reference</th>
                  <th scope="col" className="p-4 font-medium text-muted-foreground">Request Ref</th>
                  <th scope="col" className="p-4 font-medium text-muted-foreground">Business</th>
                  <th scope="col" className="p-4 font-medium text-muted-foreground">Total</th>
                  <th scope="col" className="p-4 font-medium text-muted-foreground">Valid Until</th>
                  <th scope="col" className="p-4 font-medium text-muted-foreground">Status</th>
                  <th scope="col" className="p-4 text-right"><span className="sr-only">Action</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {quotes.map(quote => (
                  <tr key={quote.id} className="hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-medium text-foreground">{quote.referenceNumber}</td>
                    <td className="p-4 text-muted-foreground">{quote.request.referenceNumber}</td>
                    <td className="p-4 text-muted-foreground">{quote.business.name}</td>
                    <td className="p-4 font-medium">{formatCurrency(quote.total.toString(), quote.currency)}</td>
                    <td className="p-4 text-muted-foreground whitespace-nowrap">
                      {quote.validUntil ? new Date(quote.validUntil).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">
                        {quote.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/dashboard/quotes/${quote.id}`} className="text-primary hover:underline font-medium inline-flex items-center gap-1">
                        View &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden flex flex-col gap-4">
            {quotes.map(quote => (
              <Card key={quote.id} className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-foreground">{quote.referenceNumber}</div>
                    <div className="text-sm text-muted-foreground">{formatCurrency(quote.total.toString(), quote.currency)}</div>
                  </div>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">
                    {quote.status}
                  </span>
                </div>
                <div className="text-sm">
                  <div className="text-foreground">{quote.business.name}</div>
                  <div className="text-muted-foreground">Request: {quote.request.referenceNumber}</div>
                  {quote.validUntil && (
                    <div className="text-muted-foreground mt-1">Valid until: {new Date(quote.validUntil).toLocaleDateString()}</div>
                  )}
                </div>
                <div className="pt-2 border-t border-border flex justify-end">
                  <Link href={`/dashboard/quotes/${quote.id}`} className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1">
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
