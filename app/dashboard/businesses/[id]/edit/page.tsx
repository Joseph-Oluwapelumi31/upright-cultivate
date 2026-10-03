import { requireCustomer } from "@/lib/auth/authorization";
import { getBusinessAction } from "@/actions/business";
import { BusinessForm } from "@/components/business/BusinessForm";
import { notFound } from "next/navigation";

export default async function EditBusinessPage({ params }: { params: Promise<{ id: string }> }) {
  await requireCustomer();
  const { id } = await params;

  let business;
  try {
    const result = await getBusinessAction(id);
    if (result.success && result.business) {
      business = result.business;
    } else {
      notFound();
    }
  } catch (error) {
    notFound();
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display mb-2">Edit Business</h1>
        <p className="text-muted-foreground">
          Update your business details.
        </p>
      </div>

      <div className="rounded-card border border-border bg-surface p-6">
        <BusinessForm initialData={business} isEdit />
      </div>
    </div>
  );
}
