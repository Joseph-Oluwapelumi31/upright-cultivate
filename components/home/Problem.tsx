"use client";

import { motion, Variants } from "motion/react";
import Container from "@/components/ui/Container";
import { AlertTriangle, Clock, TrendingUp } from "lucide-react";

const problems = [
  {
    number: "01",
    title: "High spoilage",
    text: "Produce degrades during long transit from rural farms.",
    icon: Clock,
  },
  {
    number: "02",
    title: "Seasonal volatility",
    text: "Prices and availability fluctuate wildly based on weather.",
    icon: TrendingUp,
  },
  {
    number: "03",
    title: "Inconsistent standards",
    text: "Size, cleanliness and freshness vary batch by batch.",
    icon: AlertTriangle,
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

export default function Problem() {
  return (
    <section className="section-shell" id="why">
      <Container>
        <motion.div
          className="section-head"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <h2>
            We understand
            <br />
            your challenges
          </h2>
          <p>
            Running a restaurant, hotel or supermarket takes consistent
            quality and predictable supply — the exact opposite of what
            traditional agricultural supply chains deliver.
          </p>
        </motion.div>

        <motion.div
          className="challenge-list"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {problems.map(({ number, title, text, icon: Icon }) => (
            <motion.article
              key={number}
              className="challenge-item"
              variants={item}
            >
              <span className="num">{number}</span>
              <div>
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-(--amber-glow) bg-(--white) text-(--amber-glow)">
                  <Icon size={16} strokeWidth={2.2} />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}