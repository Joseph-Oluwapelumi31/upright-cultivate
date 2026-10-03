import type { Metadata } from "next";
import { cookies } from "next/headers";

import Container from "@/components/ui/Container";
import SupplyPlanner from "@/components/supply-plan/SupplyPlanner";
import { requireCustomer } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";
import { ownsBusiness, ownsLocation } from "@/lib/auth/ownership";
import { getBusinessesAction, getBusinessAction } from "@/actions/business";
import { BusinessStep } from "@/components/business/BusinessStep";
import { LocationStep } from "@/components/location/LocationStep";

export const metadata: Metadata = {
  title: "Plan Your Supply | Upright Cultivate",
  description:
    "Build a fresh produce supply plan around your business needs, preferred quantities, and delivery frequency.",
};

export default async function SupplyPage() {
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
          <BusinessStep businesses={businesses} redirectTo="/supply" />
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
          <LocationStep businessId={activeBusiness.id} locations={activeBusiness.locations} redirectTo="/supply" />
        </Container>
      </main>
    );
  }

  // Fetch products from the database instead of using static definitions
  const dbProducts = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    include: { category: true },
    orderBy: { createdAt: "asc" },
  });

  const categoriesMap = new Map<string, { title: string; items: { id: string; name: string }[] }>();

  for (const product of dbProducts) {
    const catName = product.category.name;
    if (!categoriesMap.has(catName)) {
      categoriesMap.set(catName, { title: catName, items: [] });
    }
    categoriesMap.get(catName)!.items.push({
      id: product.slug, // SupplyPlanItem uses `id`, and we map it to `productSlug` in the form
      name: product.name,
    });
  }

  const groupedProducts = Array.from(categoriesMap.values());

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* PLANNER */}
      <section className="pb-24 sm:pb-32">
        <Container>
          <SupplyPlanner 
            initialGroups={groupedProducts} 
            business={activeBusiness}
            location={activeLocation}
          />
        </Container>
      </section>
    </main>
  );
}