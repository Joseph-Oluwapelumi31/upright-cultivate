import { requireAdmin } from "@/lib/auth/authorization";
import { getAdminSupplyRequest } from "@/actions/admin-request-queries";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AdminQuoteForm from "@/components/admin/AdminQuoteForm";

export default async function AdminCreateQuotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const request = await getAdminSupplyRequest(id);

  if (!request) {
    notFound();
  }

  const quoteableStatuses = ["PENDING", "SUBMITTED", "UNDER_REVIEW", "QUOTED"];
  if (!quoteableStatuses.includes(request.status)) {
    redirect(`/admin/requests/${id}`);
  }

  // Serialize request for the Client Component
  const requestDTO = {
    id: request.id,
    business: { name: request.business.name },
    user: { name: request.user.name },
    location: { name: request.location.name, address: request.location.address },
    items: request.items.map(item => ({
      productId: item.productId,
      productNameSnapshot: item.productNameSnapshot,
      quantity: item.quantity.toString(),
      unit: item.unit
    }))
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div>
        <Link href={`/admin/requests/${id}`} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1">
          <ArrowLeft className="size-4" /> Back to Request {request.referenceNumber}
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold font-display text-foreground mb-1">
          Create Quote
        </h1>
        <p className="text-body text-muted-foreground">
          Draft a commercial offer for {request.business.name}
        </p>
      </div>

      <AdminQuoteForm request={requestDTO} />
    </div>
  );
}
