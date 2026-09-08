import Container from "@/components/ui/Container";
import { Leaf, PackageCheck, Sprout, Truck } from "lucide-react";

const points = [
  { label: "Locally grown", icon: Leaf },
  { label: "Demand-led growing", icon: Sprout },
  { label: "Controlled environment", icon: PackageCheck },
  { label: "Fresh to your kitchen", icon: Truck },
];

export default function TrustBar() {
  return (
    <section className="border-b border-[var(--deep-moss)]/10 bg-[var(--citron-beam)] py-6">
      <Container>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {points.map(({ label, icon: Icon }, index) => (
            <div key={label} className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--deep-moss)] text-[var(--citron-beam)]">
                <span className="text-[10px] font-semibold">0{index + 1}</span>
              </span>
              <Icon size={16} strokeWidth={2.2} className="text-[var(--deep-moss)]" />
              <span className="text-sm font-medium text-[var(--deep-moss)]">{label}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}