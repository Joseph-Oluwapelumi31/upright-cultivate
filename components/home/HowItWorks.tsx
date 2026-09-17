"use client";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

const steps = [
  {
    number: "01",
    title: "Tell us what you need",
    text: "Share the produce, volume and delivery rhythm your business requires.",
    background: "bg-(--surface)",
    rotation: "-rotate-[1.5deg]",
  },
  {
    number: "02",
    title: "We plan your crop",
    text: "We align production with your expected demand.",
    background: "bg-[#e9eee3]",
    rotation: "rotate-[1deg]",
  },
  {
    number: "03",
    title: "We grow & harvest",
    text: "Your produce is grown in a controlled environment and harvested for delivery.",
    background: "bg-[#e8e4d5]",
    rotation: "-rotate-[0.8deg]",
  },
  {
    number: "04",
    title: "We deliver fresh",
    text: "Your order moves from our growing operation to your business.",
    background: "bg-(--accent)",
    rotation: "rotate-[1.3deg]",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="bg-(--background) py-24 sm:py-32"
    >
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="A simpler route from growing to your kitchen."
        />

        <div className="mt-16 grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          {/* Left side */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="max-w-sm text-base leading-relaxed text-(--foreground)/65 md:text-lg">
              From planning your supply to delivering fresh produce, every
              step is built around your business.
            </p>
          </div>

          {/* Stacking cards */}
          <div className="relative">
            {steps.map((step, index) => (
              <article
                key={step.number}
                className={`sticky top-32 ${step.background} ${step.rotation} relative -mb-12 min-h-105 rounded-[2rem] p-8 shadow-[0_16px_50px_rgba(16,61,38,0.08)] ring-1 ring-(--primary)/10 sm:min-h-115 sm:p-12`}
                style={{
                  zIndex: index + 1,
                }}
              >
                {/* Step number */}
                <span className="text-sm font-medium tracking-[0.1em] text-(--primary)/45">
                  {step.number}
                </span>

                {/* Content */}
                <div className="mt-20 max-w-xl sm:mt-24">
                  <h3 className="font-display text-3xl font-medium leading-[1.05] tracking-tight text-(--primary) sm:text-5xl">
                    {step.title}
                  </h3>

                  <p className="mt-5 max-w-md text-sm leading-relaxed text-(--foreground)/65 sm:text-base">
                    {step.text}
                  </p>
                </div>

                {/* Decorative corner detail */}
                <span
                  aria-hidden="true"
                  className="absolute bottom-8 right-8 h-3 w-3 rounded-full bg-(--primary)/15 sm:bottom-12 sm:right-12"
                />
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}