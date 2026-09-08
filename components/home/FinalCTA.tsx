import Container from "@/components/ui/Container";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="bg-background px-6 py-24 sm:py-32">
      <Container>
        <div className="overflow-hidden rounded-[2.5rem] bg-accent px-6 py-16 text-center sm:px-12 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-highlight">
            Ready when you are
          </p>

          <h2 className="mx-auto mt-5 max-w-4xl font-display text-5xl font-medium leading-[0.95] tracking-tighter text-accent-foreground sm:text-6xl lg:text-7xl">
            Build a more reliable supply chain.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-foreground/70 sm:text-base">
            Tell us what your business needs and let&apos;s explore a better
            way to supply it.
          </p>

          <div className="mt-8">
            <Link
              href="#supply-planner"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-surface transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
             <p className="text-surface">Start your supply plan</p> 
              <ArrowRight size={16} strokeWidth={2.4}  className="text-surface"/>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}