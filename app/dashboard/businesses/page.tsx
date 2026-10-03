import { requireCustomer } from "@/lib/auth/authorization";
import { getBusinessesAction } from "@/actions/business";
import { cookies } from "next/headers";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { BusinessCard } from "@/components/business/BusinessCard";

export default async function DashboardBusinessesPage() {
  await requireCustomer();
  const result = await getBusinessesAction({ includeInactive: true });
  const businesses = result.success ? result.businesses : [];
  
  const cookieStore = await cookies();
  const selectedBusinessId = cookieStore.get("selectedBusinessId")?.value;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display">Businesses</h1>
          <p className="text-muted-foreground mt-1">Manage your business profiles</p>
        </div>
        <Button href="/dashboard/businesses/new" variant="primary">
          <Plus className="mr-2 size-4" />
          Add Business
        </Button>
      </div>

      {businesses.length === 0 ? (
        <div className="rounded-card border border-border bg-surface p-12 text-center flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2">No Businesses Found</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            You don&apos;t have any registered businesses yet. You need a business profile to place supply requests and track orders.
          </p>
          <Button href="/dashboard/businesses/new" variant="primary">
            Create your first business
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business) => (
            <BusinessCard 
              key={business.id} 
              business={business} 
              isSelected={selectedBusinessId === business.id || (businesses.length === 1)} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
