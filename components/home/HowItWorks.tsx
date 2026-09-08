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
  return (
    <section id="how-it-works" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="A simpler route from growing to your kitchen."
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-[2rem] bg-[var(--deep-moss)]/10 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <article key={step.number} className="bg-[var(--cream)] p-8">
              <span className="text-sm text-[var(--copper)]">
                {step.number}
              </span>

              <h3 className="mt-20 text-2xl">{step.title}</h3>

              <p className="mt-4 text-sm leading-6 text-[var(--forest)]/70">
                {step.text}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}