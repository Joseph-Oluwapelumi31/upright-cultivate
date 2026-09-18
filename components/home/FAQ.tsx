"use client";

import { useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { Plus } from "lucide-react";
import Container from "@/components/ui/Container";

const faqs = [
  {
    question: "Where do you deliver?",
    answer:
      "We currently serve businesses within our delivery network in Lagos. If you're outside our current coverage area, contact us and we'll let you know whether we can accommodate your location.",
  },
  {
    question: "What produce can I order?",
    answer:
      "Our range includes leafy greens, salad and cooking greens, fresh culinary herbs, and selected kitchen staples. Availability can vary with demand and growing cycles.",
  },
  {
    question: "Can I set up recurring deliveries?",
    answer:
      "Yes. Our supply planning process is designed around recurring business requirements. You can indicate your preferred delivery frequency and quantities, and we'll work with you to establish a suitable supply plan.",
  },
  {
    question: "Can you supply the quantities my business needs?",
    answer:
      "We'll review your requested quantities against current availability and production capacity. For larger or recurring requirements, we can discuss a supply plan around your expected demand.",
  },
  {
    question: "How do you maintain freshness?",
    answer:
      "Our produce is grown in a controlled indoor environment and planned around demand. This allows us to coordinate harvesting and delivery more closely with your requirements.",
  },
  {
    question: "What happens after I submit a supply request?",
    answer:
      "Submitting a request doesn't commit you to an order. We'll review your requirements, confirm availability, discuss any necessary adjustments, and then work with you to finalize the supply arrangement.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
} satisfies Variants;

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
} satisfies Variants;

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-background py-24 sm:py-32" id="faq">
      <Container>
        <div className="mx-auto w-full max-w-4xl">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
            className="mx-auto mb-12 max-w-2xl text-center sm:mb-16"
          >
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.16em] text-secondary">
              Questions
            </p>

            <h2 className="font-display text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-foreground sm:text-5xl lg:text-6xl">
              Before you
              <span className="text-secondary"> supply with us.</span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-foreground/65 sm:text-lg">
              A few things businesses commonly want to know before getting
              started.
            </p>
          </motion.div>

          {/* FAQ cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="space-y-3"
          >
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <motion.div
                  key={faq.question}
                  variants={itemVariants}
                  className="overflow-hidden rounded-2xl border border-border bg-surface"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenIndex(isOpen ? null : index)
                    }
                    aria-expanded={isOpen}
                    className="group flex w-full items-center justify-between gap-6 px-5 py-5 text-left outline-none transition-colors hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset sm:px-7 sm:py-6"
                  >
                    <span
                      className={[
                        "font-display text-base font-medium leading-snug transition-colors sm:text-lg",
                        isOpen
                          ? "text-primary"
                          : "text-foreground group-hover:text-primary",
                      ].join(" ")}
                    >
                      {faq.question}
                    </span>

                    <span
                      className={[
                        "flex size-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                        isOpen
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground group-hover:border-primary group-hover:text-primary",
                      ].join(" ")}
                    >
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{
                          duration: 0.25,
                          ease: "easeOut",
                        }}
                      >
                        <Plus
                          aria-hidden="true"
                          className="size-4"
                          strokeWidth={1.8}
                        />
                      </motion.span>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          height: {
                            duration: 0.35,
                            ease: "easeOut",
                          },
                          opacity: {
                            duration: 0.2,
                          },
                        }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-6 pr-16 sm:px-7 sm:pb-7 sm:pr-20">
                          <p className="max-w-2xl text-sm leading-7 text-foreground/65 sm:text-base">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>

          
        </div>
      </Container>
    </section>
  );
}

