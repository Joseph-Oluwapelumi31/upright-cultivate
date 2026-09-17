import Container from "@/components/ui/Container";
import {
  Leaf,
  ShieldCheck,
  Sprout,
  Truck,
  type LucideIcon,
} from "lucide-react";

interface TrustPoint {
  label: string;
  icon: LucideIcon;
}

const points: TrustPoint[] = [
  { label: "Locally grown", icon: Leaf },
  { label: "Demand-led growing", icon: Sprout },
  { label: "Controlled environment", icon: ShieldCheck },
  { label: "Fresh to your kitchen", icon: Truck },
];

export default function TrustBar() {
  return (
    <section
      aria-label="Upright Cultivate benefits"
      className="border-b border-primary-foreground/10 bg-primary py-6"
    >
      <Container>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {points.map(({ label, icon: Icon }) => (
            <li
              key={label}
              className="group flex items-center gap-3"
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition-transform duration-200 group-hover:scale-105"
                aria-hidden="true"
              >
                <Icon size={17} strokeWidth={2.2} />
              </span>

              <span className="text-sm font-medium text-primary-foreground">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}