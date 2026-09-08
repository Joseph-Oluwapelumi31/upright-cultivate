import Link from "next/link";
import { ArrowDownRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="site-hero">
      <div className="hero-photo" aria-hidden="true" />

      <div className="hero-body">
        <span className="eyebrow-tag">Growing better, together</span>
        <h1 className="hero-title">Upright<br />Cultivate*</h1>
        <p className="hero-sub">
          Fresh leafy greens and herbs, harvested in the city and on your line within hours.
        </p>
      </div>

      <div className="hero-bottom">
        <Link href="#contact" className="hero-cta">
          Request a quote
          <ArrowDownRight size={16} strokeWidth={2.5} />
        </Link>
        <span className="scroll-hint">[ scroll down ]</span>
      </div>
    </section>
  );
}