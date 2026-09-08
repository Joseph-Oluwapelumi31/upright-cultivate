import Container from "@/components/ui/Container";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="overflow-hidden rounded-[2.5rem] bg-[var(--citron-beam)] px-6 py-16 text-center sm:px-12 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--harvest-copper)]">
            Ready when you are
          </p>

          <h2 className="mx-auto mt-5 max-w-4xl text-5xl font-medium leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl text-[var(--deep-moss)]">
            Build a more reliable supply chain.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-[var(--forest-floor)]/75 sm:text-base">
            Tell us what your business needs and let&apos;s explore a better way to supply it.
          </p>

          <div className="mt-8">
            <Link href="#supply-planner" className="inline-flex items-center gap-2 rounded-full bg-[var(--deep-moss)] px-6 py-3 text-sm font-semibold text-[var(--white)] transition-transform duration-200 hover:-translate-y-0.5">
              Start your supply plan
              <ArrowRight size={16} strokeWidth={2.4} />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}