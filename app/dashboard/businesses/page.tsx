import { requireCustomer } from "@/lib/auth/authorization";
import { getBusinessesAction } from "@/actions/business";

export default async function DashboardBusinessesPage() {
  await requireCustomer();
  const result = await getBusinessesAction();
  const businesses = result.success ? result.businesses : [];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-display">Businesses</h1>
      </div>

      {businesses.length === 0 ? (
        <div className="rounded-card border border-border bg-surface p-12 text-center">
          <h2 className="text-xl font-semibold mb-2">No Businesses Found</h2>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            You don&apos;t have any registered businesses yet. You can create one during the supply checkout flow.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business) => (
            <div key={business.id} className="rounded-card border border-border bg-surface p-6 flex flex-col">
              <h2 className="text-lg font-semibold text-foreground mb-1">{business.name}</h2>
              <p className="text-sm font-medium text-muted-foreground mb-4">{business.type}</p>
              
              <div className="text-sm space-y-2 mb-6 flex-1">
                {business.contactName && (
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-muted-foreground mb-0.5">Contact</span>
                    <span className="text-foreground">{business.contactName}</span>
                  </div>
                )}
                {business.contactPhone && (
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-muted-foreground mb-0.5">Phone</span>
                    <span className="text-foreground">{business.contactPhone}</span>
                  </div>
                )}
                {business.contactEmail && (
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-muted-foreground mb-0.5">Email</span>
                    <span className="text-foreground">{business.contactEmail}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
