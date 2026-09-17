"use client";

import { motion, useReducedMotion } from "motion/react";
import Container from "@/components/ui/Container";
import {
  AlertTriangle,
  ArrowUpDown,
  PackageX,
  type LucideIcon,
} from "lucide-react";
import { Reveal, stagger, itemReveal } from "@/components/ui/Reveal";

interface Problem {
  number: string;
  title: string;
  text: string;
  icon: LucideIcon;
}

const problems: Problem[] = [
  {
    number: "01",
    title: "High spoilage",
    text: "Produce can degrade during long transit from rural farms.",
    icon: PackageX,
  },
  {
    number: "02",
    title: "Seasonal volatility",
    text: "Prices and availability can shift with changing weather.",
    icon: ArrowUpDown,
  },
  {
    number: "03",
    title: "Inconsistent standards",
    text: "Size, cleanliness and freshness can vary from batch to batch.",
    icon: AlertTriangle,
  },
];

export default function Problem() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="why"
      aria-labelledby="problem-heading"
      className="bg-background py-20 md:py-28"
    >
      <Container>
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="mb-4 inline-block text-[11px] font-medium uppercase tracking-[0.16em] text-secondary">
              The challenge
            </span>
          </Reveal>

          <Reveal delay={0.06}>
            <h2
              id="problem-heading"
              className="font-display text-4xl font-medium leading-[0.95] tracking-tighter text-primary sm:text-5xl md:text-6xl"
            >
              We understand your challenges.
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-foreground/65 md:text-lg">
              Running a restaurant, hotel or supermarket takes consistent
              quality and predictable supply — something traditional
              agricultural supply chains can make difficult to guarantee.
            </p>
          </Reveal>
        </div>

        {/* Challenges */}
        <motion.ul
          variants={stagger}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "visible"}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          className="mt-16 grid border-t border-primary/10 md:grid-cols-3"
        >
          {problems.map(({ number, title, text, icon: Icon }) => (
            <motion.li
              key={number}
              variants={itemReveal}
              className="border-b border-primary/10 py-8 md:border-b-0 md:border-r md:px-8 md:py-10 first:md:pl-0 last:md:border-r-0 last:md:pr-0"
            >
              {/* Number */}
              <span
                className="mb-6 block text-xs font-medium tracking-[0.12em] text-foreground/35"
                aria-hidden="true"
              >
                {number}
              </span>

              {/* Icon */}
              <span
                className="mb-5 flex h-10 w-10 items-center justify-center rounded-full border border-accent/30 bg-surface text-accent"
                aria-hidden="true"
              >
                <Icon size={17} strokeWidth={2} />
              </span>

              {/* Content */}
              <h3 className="text-2xl font-medium tracking-[-0.03em] text-primary">
                {title}
              </h3>

              <p className="mt-3 max-w-sm text-sm leading-relaxed text-foreground/65">
                {text}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </Container>
    </section>
  );
}