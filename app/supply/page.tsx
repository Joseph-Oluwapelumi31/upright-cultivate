import type { Metadata } from "next";

import Container from "@/components/ui/Container";
import SupplyPlanner from "@/components/supply-plan/SupplyPlanner";

export const metadata: Metadata = {
  title: "Plan Your Supply | Upright Cultivate",
  description:
    "Build a fresh produce supply plan around your business needs, preferred quantities, and delivery frequency.",
};

export default function SupplyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* PLANNER */}
      <section className="pb-24 sm:pb-32">
        <Container>
          <SupplyPlanner />
        </Container>
      </section>
    </main>
  );
}