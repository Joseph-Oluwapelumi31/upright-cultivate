"use client";

import { motion, useReducedMotion } from "motion/react";
import Container from "@/components/ui/Container";
import { ChefHat, ShoppingBasket, UtensilsCrossed } from "lucide-react";

const industries = [
  {
    title: "Hospitality",
    text: "Restaurants, hotels and cafés seeking consistent quality across greens, herbs and fresh garnishes.",
    icon: ChefHat,
  },
  {
    title: "Retail grocery",
    text: "Supermarkets and specialty stores requiring consistent, fresh and market-ready produce.",
    icon: ShoppingBasket,
  },
  {
    title: "Commercial kitchens",
    text: "Catering companies, meal-prep businesses and food-service operations requiring dependable weekly supply.",
    icon: UtensilsCrossed,
  },
];

export default function Industries() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="industries"
      className="bg-(--background)  py-20 sm:py-24 md:py-28"
    >
      <Container>
        {/* Section heading */}
        <div className="mb-14 md:mb-16">
          <span className="mb-5 inline-block text-[11px] font-medium uppercase tracking-[0.16em] text-(--secondary)">
            Who we serve
          </span>

          <h2 className=" text-4xl font-medium leading-[0.95] tracking-tighter text-(--primary) sm:text-5xl md:text-6xl">
            Industries
            <br />
            we serve
          </h2>
        </div>

        {/* Industry cards */}
        <div className="grid border-t border-(--primary)/15 md:grid-cols-3">
          {industries.map(({ title, text, icon: Icon }, index) => (
            <motion.article
              key={title}
              className="border-b border-(--primary)/15 py-8 md:border-b-0 md:border-r md:px-8 md:py-10 first:md:pl-0 last:md:border-r-0 last:md:pr-0"
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
                ease: "easeOut",
              }}
              style={{
                transformOrigin: "top center",
                transformPerspective: 900,
                zIndex: industries.length - index,
              }}
            >
              <div
                className="mb-8 flex h-10 w-10 items-center justify-center rounded-full border border-(--accent)/30 bg-(--surface) text-(--accent)"
                aria-hidden="true"
              >
                <Icon size={17} strokeWidth={2.2} />
              </div>

              <h3 className=" text-2xl font-medium tracking-[-0.03em] text-(--primary)">
                {title}
              </h3>

              <p className="mt-3 max-w-sm text-sm leading-relaxed text-(--foreground)/65">
                {text}
              </p>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}