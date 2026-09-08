import Container from "@/components/ui/Container";
import { AlertTriangle, Leaf, SlidersHorizontal } from "lucide-react";

const problems = [
  {
    number: "01",
    title: "High spoilage",
    text: "Produce degrades during long transit from rural farms.",
    icon: Leaf,
  },
  {
    number: "02",
    title: "Seasonal volatility",
    text: "Prices and availability fluctuate wildly based on weather.",
    icon: SlidersHorizontal,
  },
  {
    number: "03",
    title: "Inconsistent standards",
    text: "Size, cleanliness and freshness vary batch by batch.",
    icon: AlertTriangle,
  },
];

export default function Problem() {
  return (
    <section className="section-shell" id="why">
      <Container>
        <div className="section-head">
          <h2>We understand<br />your challenges</h2>
          <p>
            Running a restaurant, hotel or supermarket takes consistent quality and predictable supply — the exact opposite of what traditional agricultural supply chains deliver.
          </p>
        </div>

        <div className="challenge-list">
          {problems.map(({ number, title, text, icon: Icon }) => (
            <article key={number} className="challenge-item">
              <span className="num">{number}</span>
              <div>
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--amber-glow)] bg-[var(--white)] text-[var(--amber-glow)]">
                  <Icon size={16} strokeWidth={2.2} />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}