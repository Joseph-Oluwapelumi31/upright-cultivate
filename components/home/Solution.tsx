import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import {
  ArrowRight,
  Factory,
  MapPinned,
  Sprout,
  type LucideIcon,
} from "lucide-react";

interface ValuePoint {
  icon: LucideIcon;
  title: string;
  text: string;
}

const valuePoints: ValuePoint[] = [
  {
    icon: Factory,
    title: "Controlled environment",
    text: "Greater control over growing conditions helps us deliver more consistent quality and predictable production.",
  },
  {
    icon: Sprout,
    title: "Demand-led production",
    text: "We plan production around what your business actually needs, helping reduce unnecessary growing and waste.",
  },
  {
    icon: MapPinned,
    title: "Closer to the customer",
    text: "Urban production can shorten the distance between growing, harvesting and delivery.",
  },
];

export default function Solution() {
  return (
    <section
      aria-labelledby="solution-heading"
      className="bg-(--secondary) py-24 text-(--primary-foreground) sm:py-32"
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Image */}
          <div className="relative aspect-4/3 overflow-hidden rounded-4xl bg-(--secondary) lg:aspect-auto lg:min-h-125">
            <Image
              src="/indoor-farm.jpg"
              alt="Leafy greens growing inside an indoor controlled-environment farm"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-center"
            />

            {/* Image overlay */}
            <div
              className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/65 via-black/20 to-transparent p-6 pt-24"
              aria-hidden="true"
            />

            <div className="absolute inset-x-0 bottom-0 p-6">
              <span className="text-xs font-medium uppercase tracking-[0.14em] text-white/85">
                Grown indoors, harvested at peak freshness
              </span>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-(--accent)">
              The solution
            </p>

            <h2
              id="solution-heading"
              className="max-w-lg font-display text-4xl font-medium leading-[0.95] tracking-tighter sm:text-5xl lg:text-6xl"
            >
              Grow closer. Plan smarter. Deliver fresher.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-7 text-(--primary-foreground)/70 sm:text-lg">
              Upright Cultivate uses controlled-environment aeroponic farming
              to grow fresh produce in a predictable, demand-led system.
            </p>

            {/* Value points */}
            <div className="mt-10 border-t border-(--primary-foreground)/10 pt-8">
              <ul className="space-y-6">
                {valuePoints.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex gap-4">
                    <span
                      className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-(--primary-foreground)/20 bg-(--primary-foreground)/5 text-(--accent)"
                      aria-hidden="true"
                    >
                      <Icon size={18} strokeWidth={2.2} />
                    </span>

                    <div>
                      <h3 className=" text-xl font-medium tracking-[-0.02em]">
                        {title}
                      </h3>

                      <p className="mt-2 max-w-lg text-sm leading-6 text-(--primary-foreground)/60">
                        {text}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="mt-8">
              <Link
                href="#supply-planner"
                className="inline-flex items-center gap-2 text-sm font-medium text-(--accent) transition-[opacity,transform] duration-200 hover:-translate-y-0.5 hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)/60 focus-visible:ring-offset-4 focus-visible:ring-offset-(--secondary)"
              >
                Plan your supply
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}