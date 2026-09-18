"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import Container from "@/components/ui/Container";

const growingSteps = [
  {
    title: "Roots in air",
    description:
      "Plants grow with their roots suspended inside an enclosed growing environment.",
  },
  {
    title: "Nutrient mist",
    description:
      "A fine mist delivers water and nutrients directly to the root zone.",
  },
  {
    title: "Controlled environment",
    description:
      "Growing conditions are carefully managed to support consistent, healthy crops.",
  },
];

/** Tiny classNames helper so conditional classes don't duplicate logic. */
function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function GrowingSystem() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        // Skip stagger entirely when the user prefers reduced motion,
        // so nothing "moves in" sequentially — it just appears.
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  } satisfies Variants;

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 18,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.15 : 0.6,
        ease: "easeOut",
      },
    },
  } satisfies Variants;

  return (
    <section
      aria-labelledby="growing-system-heading"
      className="bg-background py-24 sm:py-32"
    >
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
        >
          {/* Intro */}
          <motion.div
            variants={itemVariants}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              Grow differently
            </p>

            <h2
              id="growing-system-heading"
              className="mt-4 font-display text-4xl font-medium leading-[0.95] tracking-tighter text-foreground sm:text-5xl lg:text-6xl"
            >
              Fresh food, grown differently.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-foreground/65 sm:text-lg sm:leading-8">
              Aeroponics lets plants grow with their roots suspended in air
              rather than conventional soil. A fine nutrient mist delivers
              what they need inside a controlled growing environment.
            </p>
          </motion.div>

          {/* Video */}
          <motion.div variants={itemVariants} className="mt-12 sm:mt-16">
            <div className="overflow-hidden rounded-[1.25rem] bg-surface">
              <div className="aspect-video">
                {/* Visually-hidden text description for assistive tech.
                    `aria-label` on <video> isn't reliably announced, so we
                    pair the element with a real text node instead. */}
                <span id="growing-system-video-desc" className="sr-only">
                  Aeroponic growing system showing plants growing with
                  suspended roots and nutrient mist.
                </span>
                <video
                  className="h-full w-full object-cover"
                  aria-describedby="growing-system-video-desc"
                  poster="/aeroponics-explainer-poster.jpg"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  <source src="/aeroponics-explainer.webm" type="video/webm" />
                  <source src="/aeroponics-explainer.mp4" type="video/mp4" />
                  {/* Fallback for browsers/agents that can't render <video> */}
                  Your browser doesn&apos;t support embedded video. You can{" "}
                  <a href="/aeroponics-explainer.mp4">
                    download the clip instead
                  </a>
                  .
                </video>
              </div>
            </div>
          </motion.div>

          {/* Process — pricing-style cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="mt-16 grid gap-4 sm:mt-20 sm:grid-cols-3 sm:gap-6"
          >
            {growingSteps.map((step) => (
              <motion.div
                key={step.title}
                variants={itemVariants}
                className={cx(
                  "flex flex-col rounded-2xl bg-surface p-6 sm:p-8",
                  "ring-1 ring-inset ring-border",
                  "transition-shadow duration-300 hover:shadow-lg hover:shadow-foreground/5"
                )}
              >
                <h3 className="text-lg font-medium tracking-[-0.02em] text-foreground sm:text-xl">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-foreground/60 sm:text-base">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Closing statement */}
          <motion.p
            variants={itemVariants}
            className="mx-auto mt-8 max-w-2xl text-center text-sm leading-6 text-foreground/55 sm:text-base"
          >
            That control helps us grow fresh produce closer to the businesses
            we supply.
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}