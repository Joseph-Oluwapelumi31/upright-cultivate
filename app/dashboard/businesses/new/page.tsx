import { requireCustomer } from "@/lib/auth/authorization";
import { BusinessForm } from "@/components/business/BusinessForm";

export default async function NewBusinessPage() {
  await requireCustomer();

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display mb-2">Add New Business</h1>
        <p className="text-muted-foreground">
          Register a new business to manage supply requests and orders.
        </p>
      </div>

      <div className="rounded-card border border-border bg-surface p-6">
        <BusinessForm />
      </div>
    </div>
  );
}
