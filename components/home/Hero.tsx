"use client";

import { ArrowDownRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "../ui/Button";
export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative min-h-screen overflow-hidden"
    >
      Background video
      <div aria-hidden="true" className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/farm-hero.jpg"
          className="h-full w-full object-cover object-center saturate-[0.8]"
        >
          <source src="/videos/farm-hero.mp4" type="video/mp4" />
        </video>
      </div>

      Atmospheric overlay
      <div
        aria-hidden="true"
        className="
          absolute inset-0
          bg-linear-to-b
          from-primary/65
          via-primary/45
          to-primary/75
        "
      />

      {/* Additional text-side depth */}
      <div
        aria-hidden="true"
        className="
          absolute inset-0
          bg-linear-to-r
          from-primary/70
          via-primary/30
          to-transparent
        "
      />

      {/* Content */}
      <Container>
        <div className="relative z-10 flex min-h-screen items-center py-32 md:py-40">
          <div className="w-full max-w-7xl">
            <div className="max-w-4xl">

              {/* Heading */}
              <h1
                id="hero-heading"
                className="max-w-4xl font-display text-[clamp(3.5rem,5vw,6.5rem)] font-medium leading-none tracking-tighter text-primary-foreground"
              >
                Fresh greens.
                <br />
                Grown for your kitchen.
              </h1>

              {/* Description */}
              <p
                className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg"
              >
                Premium leafy greens and culinary herbs, grown locally in
                controlled environments and harvested around your demand.
              </p>

              {/* Actions */}
              <div className="mt-9 flex flex-wrap items-center gap-3">
                {/* Primary CTA */}
                <Button 
                  href="#supply-planner"
                  variant="accent"
                >
                  <p className="text-accent-foreground">Request a supply plan</p>

                </Button>

                {/* Secondary CTA */}
                <Button href="#products" variant="secondary">
                  <p className="text-secondary-foreground">Explore produce</p>
                </Button>
                
              </div>

            </div>
          </div>
        </div>
      </Container>

      {/* Bottom scroll indicator */}
      <div
        aria-hidden="true"
        className="
          absolute
          bottom-8
          left-1/2
          hidden
          -translate-x-1/2
          items-center
          gap-2
          text-xs
          font-medium
          uppercase
          tracking-[0.16em]
          text-primary-foreground/60
          md:flex
        "
      >
        <span>Scroll to explore</span>
        <ArrowDownRight size={14} />
      </div>
    </section>
  );
}