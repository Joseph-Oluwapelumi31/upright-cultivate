import Container from "@/components/ui/Container";
import { ArrowRight, Factory, MapPinned, Sprout } from "lucide-react";

const valuePoints = [
  {
    icon: Factory,
    title: "Controlled environment",
    text: "A controlled growing environment gives us greater control over consistency and production planning.",
  },
  {
    icon: Sprout,
    title: "Demand-led production",
    text: "We plan production around what your business actually needs.",
  },
  {
    icon: MapPinned,
    title: "Closer to the customer",
    text: "Urban production can shorten the distance between growing, harvesting and delivery.",
  },
];

export default function Solution() {
  return (
    <section className="bg-[var(--forest-floor)] py-24 text-[var(--white)] sm:py-32">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="editorial-photo photo-a" aria-label="Indoor cultivation image">
            <span className="photo-caption">Grown indoors, harvested at peak freshness</span>
          </div>

          <div>
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--citron-beam)]">
              The solution
            </div>
            <h2 className="max-w-lg text-4xl font-medium leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
              Grow closer. Plan smarter. Deliver fresher.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-[var(--white)]/70 sm:text-lg">
              Upright Cultivate uses controlled-environment aeroponic farming to grow fresh produce in a predictable, demand-led system.
            </p>

            <div className="mt-10 space-y-6 border-t border-[var(--white)]/10 pt-8">
              {valuePoints.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-4">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--white)]/20 bg-[var(--white)]/5 text-[var(--citron-beam)]">
                    <Icon size={18} strokeWidth={2.2} />
                  </div>
                  <div>
                    <h3 className="text-xl">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--white)]/60">{text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <a href="#contact" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--citron-beam)]">
                Plan your supply
                <ArrowRight size={16} strokeWidth={2.5} />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}