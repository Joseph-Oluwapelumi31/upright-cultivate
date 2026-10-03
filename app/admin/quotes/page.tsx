import { requireAdmin } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FileSignature } from "lucide-react";

export default async function AdminQuotesPage() {
  await requireAdmin();

  const quotes = await prisma.quote.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      business: true,
      location: true,
    },
  });

  return (
    <div className="flex flex-col gap-8 max-w-[1400px]">
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold font-display text-foreground mb-1">
          Quotes
        </h1>
        <p className="text-body text-muted-foreground">
          Manage outgoing supply quotes.
        </p>
      </div>

      {quotes.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 px-4 text-center bg-muted/5 border-dashed">
          <FileSignature className="size-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">No quotes found</p>
          <p className="text-muted-foreground mb-6 max-w-md">
            There are no quotes in the system yet.
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="py-3 px-4 font-semibold text-sm">Reference</th>
                  <th className="py-3 px-4 font-semibold text-sm">Business</th>
                  <th className="py-3 px-4 font-semibold text-sm">Total</th>
                  <th className="py-3 px-4 font-semibold text-sm">Status</th>
                  <th className="py-3 px-4 font-semibold text-sm">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-muted/10 transition-colors">
                    <td className="py-3 px-4">
                      <Link href={`/admin/quotes/${quote.id}`} className="font-medium text-primary hover:underline">
                        {quote.referenceNumber}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground">
                      {quote.business.name}
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground">
                      {new Intl.NumberFormat('en-NG', { style: 'currency', currency: quote.currency }).format(Number(quote.total))}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={quote.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
