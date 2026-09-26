import { requireAdmin } from "@/lib/auth/authorization";
import { getAdminQuote } from "@/actions/admin-quote-queries";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AdminQuoteForm from "@/components/admin/AdminQuoteForm";

export default async function AdminEditQuotePage({
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

  // Only DRAFT quotes can be edited
  if (quote.status !== "DRAFT") {
    redirect(`/admin/quotes/${id}`);
  }

  // Serialize request for the Client Component
  // Note: getAdminQuote includes business and location on the quote itself, not nested in request.
  const requestDTO = {
    id: quote.request.id,
    business: { name: quote.business.name },
    user: { name: quote.request.user.name },
    location: { name: quote.location.name, address: quote.location.address },
    items: quote.request.items ? quote.request.items.map((item: any) => ({
      productId: item.productId,
      productNameSnapshot: item.productNameSnapshot,
      quantity: item.quantity.toString(),
      unit: item.unit
    })) : []
  };

  // Serialize quote for the Client Component
  const quoteDTO = {
    id: quote.id,
    additionalCharges: quote.additionalCharges?.toString() || null,
    validUntil: quote.validUntil ? quote.validUntil.toISOString() : null,
    notes: quote.notes,
    adminNotes: quote.adminNotes,
    items: quote.items.map((item: any) => ({
      productId: item.productId,
      productNameSnapshot: item.productNameSnapshot,
      quantity: item.quantity.toString(),
      unitPrice: item.unitPrice.toString(),
      unit: item.unit
    }))
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div>
        <Link href={`/admin/quotes/${id}`} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1">
          <ArrowLeft className="size-4" /> Back to Quote {quote.referenceNumber}
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold font-display text-foreground mb-1">
          Edit Quote
        </h1>
        <p className="text-body text-muted-foreground">
          Update the draft quote for {quote.business.name}
        </p>
      </div>

      <AdminQuoteForm request={requestDTO} quote={quoteDTO} />
    </div>
  );
}
