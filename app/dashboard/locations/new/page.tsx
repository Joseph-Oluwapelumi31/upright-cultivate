import { requireCustomer } from "@/lib/auth/authorization";
import { getBusinessesAction } from "@/actions/business";
import { redirect } from "next/navigation";
import LocationForm from "./LocationForm";

export default async function NewLocationPage() {
  await requireCustomer();

  const result = await getBusinessesAction();
  const businesses = result.success ? result.businesses : [];

  if (businesses.length === 0) {
    redirect("/dashboard/businesses/new");
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display mb-2">Add Location</h1>
        <p className="text-muted-foreground">
          Create a new delivery location for one of your businesses.
        </p>
      </div>

      <div className="rounded-card border border-border bg-surface p-6">
        <LocationForm businesses={businesses} />
      </div>
    </div>
  );
}
