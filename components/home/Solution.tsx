"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import {
  Factory,
  MapPinned,
  Sprout,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Reveal, imageReveal, stagger, itemReveal } from "@/components/ui/Reveal";
import Button from "../ui/Button";

interface ValuePoint {
  icon: LucideIcon;
  title: string;
  text: string;
}

/* Ordered to mirror the three challenges raised in the Problem section:     */
/* 1. spoilage in transit -> closer to the customer                         */
/* 2. seasonal volatility -> controlled environment                         */
/* 3. inconsistent standards -> controlled environment (consistency)        */
/* Demand-led production is the value-add beyond those three.               */
const valuePoints: ValuePoint[] = [
  {
    icon: MapPinned,
    title: "Closer to the customer",
    text: "Urban production shortens the distance between growing, harvesting and delivery, cutting the transit time that causes spoilage.",
  },
  {
    icon: Factory,
    title: "Controlled environment",
    text: "Growing indoors means weather doesn't set the terms. Greater control over conditions means quality that doesn't vary from batch to batch.",
  },
  {
    icon: Sprout,
    title: "Demand-led production",
    text: "We plan production around what your business actually needs, helping reduce unnecessary growing and waste.",
  },
];

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function Solution() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="solution-heading"
      className="bg-surface py-24 text-surface-foreground sm:py-32"
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* ---------------------------------------------------------------- */}
          {/* Image                                                              */}
          {/* ---------------------------------------------------------------- */}

          <motion.div
            variants={imageReveal}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            className="relative aspect-4/3 overflow-hidden rounded-4xl bg-surface-foreground lg:aspect-auto lg:min-h-125"
          >
            <Image
              src="/indoor-farm.jpg"
              alt="Leafy greens growing inside an indoor controlled-environment farm"
              fill
              quality={60}
              sizes="(min-width: 1280px) 560px, (min-width: 1024px) 45vw, 100vw"
              className="object-cover object-center"
            />

            {/* Image overlay */}
            <div
              className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/65 via-black/20 to-transparent p-6 pt-24"
              aria-hidden="true"
            />

            {/* Image caption */}
            <div className="absolute inset-x-0 bottom-0 p-6">
              <span className="text-xs font-medium uppercase tracking-[0.14em] text-white/85">
                Grown indoors, harvested at peak freshness
              </span>
            </div>
          </motion.div>

          {/* ---------------------------------------------------------------- */}
          {/* Content                                                            */}
          {/* ---------------------------------------------------------------- */}

          <div>
            {/* Eyebrow */}
            <Reveal>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                The solution
              </p>
            </Reveal>

            {/* Heading */}
            <Reveal delay={0.06}>
              <h2
                id="solution-heading"
                className="max-w-lg font-display text-4xl font-medium leading-[0.95] tracking-tighter sm:text-5xl lg:text-6xl"
              >
                Grow closer. Plan smarter. Deliver fresher.
              </h2>
            </Reveal>

            {/* Description */}
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-xl text-base leading-7 text-surface-foreground/70 sm:text-lg">
                Instead of relying on long transit and shifting seasons,
                Upright Cultivate uses controlled-environment aeroponic
                farming to grow fresh produce in a predictable, demand-led
                system.
              </p>
            </Reveal>

            {/* ---------------------------------------------------------------- */}
            {/* Value points                                                       */}
            {/* ---------------------------------------------------------------- */}

            <motion.ul
              variants={stagger}
              initial={shouldReduceMotion ? false : "hidden"}
              whileInView={shouldReduceMotion ? undefined : "visible"}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              className="mt-10 border-t border-surface-foreground/10"
            >
              {valuePoints.map(
                ({ icon: Icon, title, text }, index) => (
                  <motion.li
                    key={title}
                    variants={itemReveal}
                    className="group flex gap-5 border-b border-surface-foreground/10 py-6 last:border-b-0"
                  >
                    {/* Number */}
                    <span
                      className="pt-1 text-xs font-medium tabular-nums text-surface-foreground/35"
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Icon */}
                    <span
                      className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-surface-foreground/15 bg-surface-foreground/5 text-accent transition-colors duration-300 group-hover:border-accent/40 group-hover:bg-accent/10"
                      aria-hidden="true"
                    >
                      <Icon size={18} strokeWidth={2} />
                    </span>

                    {/* Text */}
                    <div>
                      <h3 className="text-lg font-medium tracking-[-0.02em] sm:text-xl">
                        {title}
                      </h3>

                      <p className="mt-2 max-w-lg text-sm leading-6 text-surface-foreground/60 sm:text-base">
                        {text}
                      </p>
                    </div>
                  </motion.li>
                ),
              )}
            </motion.ul>

            {/* ---------------------------------------------------------------- */}
            {/* CTA                                                                */}
            {/* ---------------------------------------------------------------- */}

            <Reveal delay={0.2} amount={0.3}>
              <div className="mt-8">
                <Button
                  href="/supply"
                  variant="primary"
                >
                  <p className="text-primary-foreground">Plan your supply</p>

                  
                </Button>
                <Link
                  href="#supply-planner"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-accent transition-[opacity,transform] duration-200 hover:-translate-y-0.5 hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
                >
                  
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}