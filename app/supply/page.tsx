import type { Metadata } from "next";

import Container from "@/components/ui/Container";
import SupplyPlanner from "@/components/supply-plan/SupplyPlanner";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Plan Your Supply | Upright Cultivate",
  description:
    "Build a fresh produce supply plan around your business needs, preferred quantities, and delivery frequency.",
};

export default async function SupplyPage() {
  const session = await auth();
  const isAuthenticated = !!session?.user;

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
          <SupplyPlanner isAuthenticated={isAuthenticated} initialGroups={groupedProducts} />
        </Container>
      </section>
    </main>
  );
}