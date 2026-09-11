"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Container from "@/components/ui/Container";
import {
  AlertTriangle,
  Clock,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
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
    icon: Clock,
  },
  {
    number: "02",
    title: "Seasonal volatility",
    text: "Prices and availability can fluctuate with changing weather conditions.",
    icon: TrendingUp,
  },
  {
    number: "03",
    title: "Inconsistent standards",
    text: "Size, cleanliness and freshness can vary from batch to batch.",
    icon: AlertTriangle,
  },
];
export default function Problem() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [-80, 160]);

  return (
    <section
      ref={sectionRef}
      id="why"
      aria-labelledby="problem-heading"
      className="relative overflow-hidden bg-(--background) px-6 py-24 md:py-32"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute right-[4%] top-24 z-0 hidden w-44 opacity-25 md:block lg:w-56"
        style={{
          y: prefersReducedMotion ? 0 : imageY,
          rotate: 8,
        }}
      >
        <Image
          src="/products/swiss_chard.png"
          alt=""
          width={300}
          height={350}
          sizes="(min-width: 1024px) 224px, 176px"
          className="h-auto w-full"
        />
      </motion.div>

      <Container className="relative z-10">
        {/* Section heading */}
        <div className="grid gap-8 md:grid-cols-[1fr_0.8fr] md:items-end">
          <div>
            <span className="mb-5 inline-block text-[11px] font-medium uppercase tracking-[0.16em] text-(--secondary)">
              The challenge
            </span>
            <h2
              id="problem-heading"
              className="max-w-3xl  text-4xl font-medium leading-[0.95] tracking-tighter text-(--primary) sm:text-5xl md:text-6xl"
            >
              We understand
              <br />
              your challenges.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-(--foreground)/65 md:pb-1 md:text-lg">
            Running a restaurant, hotel or supermarket takes consistent
            quality and predictable supply — something traditional
            agricultural supply chains can make difficult to guarantee.
          </p>
        </div>
        {/* Challenges */}
        <ul className="mt-16 grid border-t border-(--primary)/10 md:grid-cols-3">
          {problems.map(({ number, title, text, icon: Icon }, index) => (
            <motion.li
              key={number}
              className="group relative border-b border-(--primary)/10 py-8 md:border-b-0 md:border-r md:px-8 md:py-10 first:md:pl-0 last:md:border-r-0 last:md:pr-0"
              initial={
                prefersReducedMotion
                  ? { opacity: 1, rotateX: 0, y: 0 }
                  : { opacity: 0, rotateX: -75, y: 56 }
              }
              whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{
                duration: 0.8,
                delay: prefersReducedMotion ? 0 : index * 0.14,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                transformOrigin: "top center",
                transformPerspective: 900,
                zIndex: problems.length - index,
              }}
            >
              {/* Number */}
              <span
                className="mb-8 block text-xs font-medium tracking-[0.12em] text-(--foreground)/35"
                aria-hidden="true"
              >
                {number}
              </span>
              {/* Icon */}
              <span
                className="mb-5 flex h-10 w-10 items-center justify-center rounded-full border border-(--highlight)/30 bg-(--surface) text-(--highlight) transition-transform duration-200 group-hover:scale-105"
                aria-hidden="true"
              >
                <Icon size={17} strokeWidth={2} />
              </span>
              {/* Content */}
              <h3 className="text-2xl font-medium tracking-[-0.03em] text-(--primary)">
                {title}
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-(--foreground)/60">
                {text}
              </p>
            </motion.li>
          ))}
        </ul>
      </Container>
    </section>
  );
}