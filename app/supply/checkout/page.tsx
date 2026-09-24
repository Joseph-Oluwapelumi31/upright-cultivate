import { requireCustomer } from "@/lib/auth/authorization";
import { cookies } from "next/headers";
import { ownsBusiness, ownsLocation } from "@/lib/auth/ownership";
import { getBusinessesAction, getBusinessAction } from "@/actions/business";
import { BusinessStep } from "@/components/business/BusinessStep";
import { LocationStep } from "@/components/location/LocationStep";
import Container from "@/components/ui/Container";
import SupplyCheckoutForm from "@/components/supply-plan/SupplyCheckoutForm";

export default async function SupplyCheckoutPage() {
  const user = await requireCustomer();
  const cookieStore = await cookies();
  const selectedBusinessId = cookieStore.get("selectedBusinessId")?.value;
  const selectedLocationId = cookieStore.get("selectedLocationId")?.value;

  let activeBusiness = null;
  if (selectedBusinessId) {
    const isOwner = await ownsBusiness(user.id, selectedBusinessId);
    if (isOwner) {
      try {
        const result = await getBusinessAction(selectedBusinessId);
        if (result.success) {
          activeBusiness = result.business;
        }
      } catch {
        // Business not found or other error
      }
    }
  }

  if (!activeBusiness) {
    const result = await getBusinessesAction();
    const businesses = result.success ? result.businesses : [];
    return (
      <main className="min-h-screen bg-background text-foreground py-20">
        <Container>
          <BusinessStep businesses={businesses} redirectTo="/supply/checkout" />
        </Container>
      </main>
    );
  }

  let activeLocation = null;
  if (selectedLocationId) {
    const isOwner = await ownsLocation(user.id, selectedLocationId);
    if (isOwner) {
      activeLocation = activeBusiness.locations.find((l: { id: string }) => l.id === selectedLocationId);
    }
  }

  if (!activeLocation) {
    return (
      <main className="min-h-screen bg-background text-foreground py-20">
        <Container>
          <LocationStep businessId={activeBusiness.id} locations={activeBusiness.locations} redirectTo="/supply/checkout" />
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground py-20">
      <Container>
        <SupplyCheckoutForm business={activeBusiness} location={activeLocation} />
      </Container>
    </main>
  );
}
