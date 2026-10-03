"use client";

import Image from "next/image";
import { ArrowUpRight, Check, Plus } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";

import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { useSupplyPlan } from "@/components/supply-plan/SupplyPlanProvider";

interface Product {
  id: string;
  name: string;
  description: string;
}

interface ProductGroup {
  title: string;
  description: string;
  items: Product[];
  image: string;
  alt: string;
}

const PRODUCT_IMAGES: Record<string, string> = {
  romaine: "/products/romaine_lettuce.png",
  butterhead: "/products/butterhead_lettuce.png",
  "green-leaf": "/products/green_leaf_lettuce.png",
  "red-leaf": "/products/red_leaf_lettuce.png",
  iceberg: "/products/iceberg_lettuce.png",

  kale: "/products/curly_kale.png",
  spinach: "/products/spinach.png",
  "swiss-chard": "/products/swiss_chard.png",
  arugula: "/products/arugula.png",
  watercress: "/products/watercress.png",
  "bok-choy": "/products/baby_bok_choy.png",
  "pak-choi": "/products/pak_choi.png",

  basil: "/products/basil.png",
  mint: "/products/mint.png",
  parsley: "/products/fresh_parsley.png",
  coriander: "/products/coriander_cilantro.png",

  dill: "/products/dill.png",
  chives: "/products/chives.png",
  oregano: "/products/oregano.png",
  thyme: "/products/thyme.png",
  "spring-onions": "/products/spring_onions.png",
};

export const productGroups: ProductGroup[] = [
  {
    title: "Lettuce varieties",
    description:
      "Reliable varieties for salads, sandwiches, plating, and everyday kitchen service.",
    items: [
      {
        id: "romaine",
        name: "Romaine",
        description:
          "Crisp, structured leaves that work well in salads, wraps, and sandwiches.",
      },
      {
        id: "butterhead",
        name: "Butterhead",
        description:
          "Tender, soft leaves with a delicate texture for salads and plating.",
      },
      {
        id: "green-leaf",
        name: "Green leaf",
        description:
          "Versatile leafy greens suited to salads, sandwiches, and everyday kitchen use.",
      },
      {
        id: "red-leaf",
        name: "Red leaf",
        description:
          "Vibrant red-tinted leaves that add colour and freshness to salads and dishes.",
      },
      {
        id: "iceberg",
        name: "Iceberg",
        description:
          "Crisp, refreshing leaves that hold up well in high-volume kitchen service.",
      },
    ],
    image: "/lettuce.png",
    alt: "Freshly harvested lettuce varieties",
  },

  {
    title: "Salad & cooking greens",
    description:
      "Versatile greens for fresh dishes, cooking, garnishing, and high-volume preparation.",
    items: [
      {
        id: "kale",
        name: "Kale",
        description:
          "Nutrient-rich leafy greens suited to salads, smoothies, and cooked dishes.",
      },
      {
        id: "spinach",
        name: "Spinach",
        description:
          "Tender, versatile greens for salads, cooking, smoothies, and food preparation.",
      },
      {
        id: "swiss-chard",
        name: "Swiss chard",
        description:
          "Colourful leafy greens with a rich flavour for salads and cooked dishes.",
      },
      {
        id: "arugula",
        name: "Arugula",
        description:
          "Peppery greens that add a distinctive flavour to salads, pizza, and plating.",
      },
      {
        id: "watercress",
        name: "Watercress",
        description:
          "Fresh, peppery leaves ideal for salads, garnishing, and premium dishes.",
      },
      {
        id: "bok-choy",
        name: "Bok choy",
        description:
          "Crisp Asian greens suited to stir-fries, soups, and other cooked dishes.",
      },
      {
        id: "pak-choi",
        name: "Pak choi",
        description:
          "Tender, crisp greens that work especially well in Asian-inspired dishes.",
      },
    ],
    image: "/salad-greens.png",
    alt: "Fresh salad and cooking greens",
  },

  {
    title: "Fresh culinary herbs",
    description:
      "Aromatic herbs that bring freshness and finishing detail to food and drinks.",
    items: [
      {
        id: "basil",
        name: "Basil",
        description:
          "Aromatic fresh herbs for sauces, salads, pasta, garnishing, and drinks.",
      },
      {
        id: "mint",
        name: "Mint",
        description:
          "Fresh, cooling herbs for drinks, desserts, salads, and culinary finishing.",
      },
      {
        id: "parsley",
        name: "Parsley",
        description:
          "Fresh aromatic herbs for seasoning, garnishing, sauces, and everyday cooking.",
      },
      {
        id: "coriander",
        name: "Coriander",
        description:
          "Fragrant herbs that bring freshness to sauces, salads, soups, and finished dishes.",
      },
    ],
    image: "/herbs-1.png",
    alt: "Fresh culinary herbs",
  },

  {
    title: "Kitchen staples",
    description:
      "Essential herbs and alliums for sauces, seasoning, finishing, and everyday kitchen use.",
    items: [
      {
        id: "dill",
        name: "Dill",
        description:
          "Fresh aromatic herbs that pair well with salads, seafood, sauces, and pickles.",
      },
      {
        id: "chives",
        name: "Chives",
        description:
          "Mild onion-flavoured herbs ideal for finishing dishes, sauces, and salads.",
      },
      {
        id: "oregano",
        name: "Oregano",
        description:
          "Aromatic herbs suited to sauces, marinades, pizzas, and Mediterranean dishes.",
      },
      {
        id: "thyme",
        name: "Thyme",
        description:
          "Fragrant herbs that complement roasted dishes, sauces, soups, and marinades.",
      },
      {
        id: "spring-onions",
        name: "Spring onions",
        description:
          "Fresh, crisp alliums for garnishing, salads, stir-fries, and everyday cooking.",
      },
    ],
    image: "/herbs-2.png",
    alt: "Fresh culinary herbs and kitchen staples",
  },
];

const imageVariants = {
  enter: (direction: "left" | "right") => ({
    opacity: 0,
    x: direction === "left" ? -32 : 32,
    scale: 0.96,
  }),

  center: {
    opacity: 1,
    x: 0,
    scale: 1,
  },

  exit: (direction: "left" | "right") => ({
    opacity: 0,
    x: direction === "left" ? 32 : -32,
    scale: 0.98,
  }),
};

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(
    null
  );
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());

  const { addItem, removeItem, items } = useSupplyPlan();

  const prefersReducedMotion = useReducedMotion();

  const planIds = useMemo(
    () => new Set(items.map((item) => item.id)),
    [items]
  );

  const handleProductSelect = (id: string) => {
    setSelectedProduct((current) => (current === id ? null : id));
  };

  const markImageBroken = (src: string) => {
    setBrokenImages((current) => new Set(current).add(src));
  };

  return (
    <section
      id="products"
      aria-labelledby="products-heading"
      className="bg-(--surface) py-20 sm:py-28 lg:py-32"
    >
      <Container>
        {/* SECTION INTRO */}
        <header className="mx-auto max-w-3xl text-center">
          <span className="mb-5 block text-[10px] font-medium uppercase tracking-[0.18em] text-(--secondary) sm:text-[11px]">
            Our produce
          </span>

          <h2
            id="products-heading"
            className="font-(--font-display) text-[clamp(3rem,7vw,5.25rem)] leading-[0.9] tracking-[-0.055em] text-(--primary)"
          >
            Grown for the
            <br />
            way you serve.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-[clamp(0.95rem,1.5vw,1.125rem)] leading-[1.7] text-(--foreground)/60 sm:mt-6">
            Fresh greens and culinary herbs planned around the needs of
            restaurants, hospitality, retail, and commercial kitchens.
          </p>
        </header>

        {/* PLAN STATUS */}
        <AnimatePresence initial={false}>
          {items.length > 0 && (
            <motion.div
              initial={
                prefersReducedMotion
                  ? { opacity: 1, height: "auto" }
                  : { opacity: 0, height: 0 }
              }
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      height: 0,
                    }
              }
              transition={{
                duration: prefersReducedMotion ? 0 : 0.3,
              }}
              className="overflow-hidden"
            >
              <div className="mx-auto mt-10 flex max-w-5xl flex-wrap items-center justify-between gap-4 rounded-2xl bg-(--background) px-5 py-4 shadow-sm ring-1 ring-(--primary)/8 sm:mt-12">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-(--primary) text-(--primary-foreground)">
                    <Check size={13} strokeWidth={2.5} />
                  </span>

                  <span className="text-sm text-(--foreground)/65">
                    <strong className="font-medium text-(--primary)">
                      {items.length}
                    </strong>{" "}
                    {items.length === 1
                      ? "item selected"
                      : "items selected"}
                  </span>
                </div>

                {/* Primary: continues the supply-planning flow */}
                <Button href="/supply" variant="primary">
                  Continue to supply planner
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PRODUCT SHOWCASE */}
        <div className="mt-16 sm:mt-20">
          {productGroups.map((group, index) => {
            const isImageLeft = index % 2 === 0;

            const selectedItem = group.items.find(
              (item) => item.id === selectedProduct
            );

            // Fall back to the group hero image if a product has no
            // dedicated image mapped, or if that image failed to load.
            const rawImage = selectedItem
              ? PRODUCT_IMAGES[selectedItem.id]
              : group.image;

            const displayedImage =
              rawImage && !brokenImages.has(rawImage)
                ? rawImage
                : group.image;

            return (
              <article
                key={group.title}
                className="grid gap-8 border-t border-(--primary)/12 py-12 sm:gap-10 sm:py-16 md:grid-cols-[1.08fr_0.92fr] md:gap-20 md:py-20"
              >
                {/* IMAGE */}
                <div
                  className={`relative flex min-h-70 min-w-0 items-center justify-center overflow-hidden rounded-3xl bg-(--background) sm:min-h-85 md:min-h-110 ${
                    isImageLeft ? "md:order-1" : "md:order-2"
                  }`}
                >
                  <AnimatePresence
                    initial={false}
                    mode="sync"
                    custom={isImageLeft ? "left" : "right"}
                  >
                    <motion.div
                      key={displayedImage}
                      custom={isImageLeft ? "left" : "right"}
                      variants={imageVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : {
                              x: {
                                type: "spring",
                                stiffness: 240,
                                damping: 26,
                              },
                              scale: {
                                type: "spring",
                                stiffness: 240,
                                damping: 26,
                              },
                              opacity: {
                                duration: 0.3,
                              },
                            }
                      }
                      className="absolute inset-0"
                    >
                      <Image
                        src={displayedImage}
                        alt={
                          selectedItem
                            ? `Fresh ${selectedItem.name}`
                            : group.alt
                        }
                        fill
                        sizes="(min-width: 768px) 55vw, 100vw"
                        onError={() => markImageBroken(displayedImage)}
                        className="object-contain p-2 transition-transform duration-700 ease-out hover:scale-[1.025] sm:p-4"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* CONTENT */}
                <div
                  className={`min-w-0 flex flex-col justify-center ${
                    isImageLeft ? "md:order-2" : "md:order-1"
                  }`}
                >
                  <h3 className="max-w-xl font-(--font-display) text-[clamp(2.25rem,5vw,3.5rem)] leading-[0.95] tracking-[-0.045em] text-(--primary)">
                    {group.title}
                  </h3>

                  <p className="mt-4 max-w-md text-[clamp(0.875rem,1.2vw,1rem)] leading-[1.7] text-(--foreground)/55 sm:mt-5">
                    {group.description}
                  </p>

                  {/* PRODUCT SELECTOR */}
                  <div className="mt-7 min-w-0 max-w-full sm:mt-9">
                    <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.16em] text-(--foreground)/35">
                      Select produce
                    </p>

                    <div className="max-w-full overflow-x-auto overscroll-x-contain pb-2">
                      <div className="flex w-max gap-2">
                        {group.items.map((item) => {
                          const isSelected =
                            selectedProduct === item.id;

                          const isInPlan = planIds.has(item.id);

                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() =>
                                handleProductSelect(item.id)
                              }
                              aria-pressed={isSelected}
                              className={`group inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--primary) focus-visible:ring-offset-2 ${
                                isSelected
                                  ? "border-(--primary) bg-(--primary) text-(--primary-foreground) shadow-sm shadow-(--primary)/20"
                                  : "border-(--primary)/12 bg-(--background) text-(--foreground)/65 hover:border-(--primary)/30 hover:bg-(--background) hover:text-(--primary) hover:shadow-sm"
                              }`}
                            >
                              {isInPlan && (
                                <Check
                                  size={13}
                                  strokeWidth={2.5}
                                  aria-hidden="true"
                                />
                              )}

                              <span>{item.name}</span>

                              {!isInPlan && (
                                <Plus
                                  size={13}
                                  className="opacity-40 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:opacity-70"
                                  aria-hidden="true"
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* SELECTED PRODUCT */}
                  {/* mode="wait" here (vs. "sync" on the image) is intentional:
                      the panel's content fully exits before the next product's
                      details enter, avoiding two descriptions overlapping. */}
                  <AnimatePresence initial={false} mode="wait">
                    {selectedItem && (
                      <motion.div
                        key={selectedItem.id}
                        initial={
                          prefersReducedMotion
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 8 }
                        }
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={
                          prefersReducedMotion
                            ? { opacity: 0 }
                            : {
                                opacity: 0,
                                y: -5,
                              }
                        }
                        transition={{
                          duration: prefersReducedMotion ? 0 : 0.24,
                        }}
                        className="mt-7 rounded-2xl bg-(--background) p-5 shadow-sm ring-1 ring-(--primary)/8 sm:mt-8 sm:p-6"
                      >
                        <div className="flex items-start justify-between gap-5 sm:gap-6">
                          <div>
                            <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-(--foreground)/35">
                              Selected
                            </span>

                            <h4 className="mt-1 text-[clamp(1.125rem,2vw,1.25rem)] font-medium tracking-tight text-(--primary)">
                              {selectedItem.name}
                            </h4>
                          </div>

                          {planIds.has(selectedItem.id) && (
                            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-(--secondary)/10 px-2.5 py-1 text-xs font-medium text-(--secondary)">
                              <Check
                                size={14}
                                strokeWidth={2.5}
                              />
                              In plan
                            </span>
                          )}
                        </div>

                        <p className="mt-3 max-w-md text-[clamp(0.875rem,1.2vw,1rem)] leading-[1.7] text-(--foreground)/60">
                          {selectedItem.description}
                        </p>

                        <div className="mt-5">
                          {planIds.has(selectedItem.id) ? (
                            <button
                              type="button"
                              onClick={() =>
                                removeItem(selectedItem.id)
                              }
                              className="text-sm font-medium text-(--foreground)/50 underline decoration-(--foreground)/20 underline-offset-4 transition-colors hover:text-(--primary) hover:decoration-(--primary)/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--primary) focus-visible:ring-offset-4"
                            >
                              Remove from supply plan
                            </button>
                          ) : (
                            <Button
                              type="button"
                              variant="primary"
                              onClick={() =>
                                addItem({
                                  id: selectedItem.id,
                                  name: selectedItem.name,
                                  unit: "kg",
                                })
                              }
                            >
                              Add to supply plan
                              <ArrowUpRight size={15} />
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </article>
            );
          })}
        </div>

        {/* FINAL CTA */}
        <div className="rounded-2xl bg-(--background) px-6 py-7 shadow-sm ring-1 ring-(--primary)/8 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-(--font-display) text-[clamp(1.5rem,3vw,2rem)] tracking-[-0.03em] text-(--primary)">
                Need something specific?
              </p>

              <p className="mt-1 text-sm leading-[1.6] text-(--foreground)/55">
                We can plan around your kitchen&apos;s requirements.
              </p>
            </div>

            <Button href="/supply" variant="primary">
              Plan your supply
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}