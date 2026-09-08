"use client";

import { useEffect, useRef } from "react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

const steps = [
  {
    number: "01",
    title: "Tell us what you need",
    text: "Share the produce, volume and delivery rhythm your business requires.",
  },
  {
    number: "02",
    title: "We plan your crop",
    text: "We align production with your expected demand.",
  },
  {
    number: "03",
    title: "We grow & harvest",
    text: "Your produce is grown in a controlled environment and harvested for delivery.",
  },
  {
    number: "04",
    title: "We deliver fresh",
    text: "Your order moves from our growing operation to your business.",
  },
];

export default function HowItWorks() {
  const cardsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const cards = cardsRef.current;

      cards.forEach((card, index) => {
        if (!card || index === cards.length - 1) return;

        const nextCard = cards[index + 1];

        if (!nextCard) return;

        const nextRect = nextCard.getBoundingClientRect();

        const start = window.innerHeight * 0.72;
        const end = window.innerHeight * 0.28;

        const progress = Math.min(
          Math.max((start - nextRect.top) / (start - end), 0),
          1
        );

        const opacity = 1 - progress * 0.65;
        const scale = 1 - progress * 0.035;

        card.style.opacity = `${opacity}`;
        card.style.transform = `scale(${scale})`;
      });

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    update();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section
      id="how-it-works"
      className="bg-(--background) py-24 sm:py-32"
    >
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="A simpler route from growing to your kitchen."
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Left side */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="max-w-sm text-base leading-relaxed text-(--foreground)/65">
              From planning your supply to delivering fresh produce, every
              step is built around your business.
            </p>
          </div>

          {/* Card stack */}
          <div className="relative">
            {steps.map((step, index) => (
              <article
                key={step.number}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className="sticky top-32 mb-6 min-h-[420px] rounded-[2rem] bg-(--surface) p-8 ring-1 ring-(--primary)/10 will-change-transform sm:p-12"
                style={{
                  zIndex: index + 1,
                }}
              >
                {/* Step number */}
                <span className="text-sm font-medium tracking-[0.08em] text-(--highlight)">
                  {step.number}
                </span>

                {/* Content */}
                <div className="mt-20 max-w-xl">
                  <h3 className="font-(--font-display) text-2xl font-medium leading-tight tracking-[-0.03em] text-(--primary) sm:text-4xl">
                    {step.title}
                  </h3>

                  <p className="mt-4 max-w-md text-sm leading-6 text-(--foreground)/65 sm:text-base">
                    {step.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}