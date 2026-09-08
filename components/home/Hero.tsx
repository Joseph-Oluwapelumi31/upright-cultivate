
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowDownRight } from "lucide-react";

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background image */}
<div
  className="absolute inset-0 scale-105 bg-cover bg-center bg-no-repeat will-change-transform"
  style={{
    backgroundImage: "url('/farm-hero.jpg')",
    transform: `translateY(${scrollY * 0.25}px) scale(1.05)`,
  }}
  aria-hidden="true"
/>

{/* Dark overlay */}
<div
  className="absolute inset-0 bg-linear-to-b from-(--deep-moss)/55 via-(--deep-moss)/45 to-(--deep-moss)/70"
  aria-hidden="true"
/>
      {/* Hero content */}
      <div className="relative z-10 flex min-h-screen flex-col justify-between px-6 py-32">
        {/* Main content */}
        <div className="flex flex-1 items-center justify-center">
          <div className="max-w-3xl text-left md:text-center">
            <span className="eyebrow-tag">
              Growing better, together
            </span>

            <h1 className="hero-title">
              Upright
              <br />
              Cultivate*
            </h1>

            <p className="hero-sub mx-0 max-w-xl md:mx-auto">
              Fresh leafy greens and herbs, harvested in the city and on your
              line within hours.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="relative flex w-full justify-start md:justify-center">
          <Link href="#contact" className="hero-cta">
            Request a quote
            <ArrowDownRight size={16} strokeWidth={2.5} />
          </Link>

          {/* Scroll hint */}
          <span className="scroll-hint absolute right-0 top-1/2 hidden -translate-y-1/2 md:block">
            [ scroll down ]
          </span>
        </div>
      </div>
    </section>
  );
}

