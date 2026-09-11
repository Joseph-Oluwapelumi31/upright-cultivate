"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import Container from "@/components/ui/Container";


export default function Hero() {
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  const y = useTransform(scrollY, [0, 1000], [0, 250]);

  return (
    
    <section
      aria-labelledby="hero-heading"
      className="relative min-h-screen overflow-hidden bg-primary"
    >
      {/* Background */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 scale-105"
        style={{
          y: prefersReducedMotion ? 0 : y,
        }}
      >
        <Image
          src="/farm-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-b from-primary/55 via-primary/45 to-primary/75"
      />

      {/* Content */}
      <Container>
        <div className="relative z-10 flex min-h-screen items-center  py-32 ">
          <div className="mx-auto w-full max-w-350">
            <div className="max-w-5xl">
              {/* Eyebrow */}
              <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-white/85 backdrop-blur-sm">
                Growing better, together
              </span>

              {/* Heading */}
              <h1
                id="hero-heading"
                className="mt-6 max-w-4xl font-display text-5xl font-medium leading-[0.95] tracking-[-0.055em] text-white sm:text-6xl md:text-7xl lg:text-[clamp(4.5rem,8vw,8rem)]"
              >
                Fresh greens.
                <br />
                Grown for your kitchen.
              </h1>

              {/* Description */}
              <p className="mt-8 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
                Premium leafy greens and culinary herbs, grown locally in
                controlled environments and harvested around your demand.
              </p>

              {/* Actions */}
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link
                  href="#supply-planner"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-accent-foreground transition-[transform,opacity] duration-200 hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                >
                  Request a supply plan
                  <ArrowDownRight size={16} strokeWidth={2.5} />
                </Link>

                <Link
                  href="#products"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-medium text-white backdrop-blur-md transition-[background-color,transform] duration-200 hover:bg-white/20 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                >
                  Explore produce
                  <ArrowDownRight size={15} strokeWidth={2.2} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
      
    </section>
  );
}