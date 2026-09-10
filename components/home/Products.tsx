
"use client";

import Image from "next/image";
import Container from "@/components/ui/Container";
import { Check } from "lucide-react";
import { useState } from "react";
import { useSupplyPlan } from "@/components/supply-plan/SupplyPlanProvider";

export const productGroups = [
  {
    title: "Lettuce varieties",
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
    alt: "Crates of freshly harvested lettuce varieties",
  },
  {
    title: "Salad & cooking greens",
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
    alt: "Bundles of leafy salad and cooking greens",
  },
  {
    title: "Fresh culinary herbs",
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
    alt: "Fresh culinary herbs bundled for market",
  },
  {
    title: "Kitchen staples",
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
      {
        id: "custom-blends",
        name: "Custom blends",
        description:
          "Tailored combinations planned around your kitchen's requirements and demand.",
      },
    ],
    image: "/herbs-2.png",
    alt: "Assorted kitchen staple herbs and spring onions",
  },
];

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(
    null
  );

  const { addItem, items } = useSupplyPlan();

  const handleProductSelect = (productId: string) => {
    setSelectedProduct((current) =>
      current === productId ? null : productId
    );
  };

  const isProductInPlan = (productId: string) => {
    return items.some((item) => item.id === productId);
  };

  return (
    <section
      id="products"
      className="bg-(--surface) px-6 py-24 sm:py-32"
    >
      <Container>
        {/* Section heading */}
        <div className="grid gap-8 md:grid-cols-[1fr_0.8fr] md:items-end">
          <div>
            <span className="mb-5 inline-block text-[11px] font-medium uppercase tracking-[0.16em] text-(--secondary)">
              Our produce
            </span>

            <h2 className="font-(--font-display) text-4xl  leading-[1] tracking-tighter text-(--primary) sm:text-5xl md:text-6xl">
              What we grow
            </h2>
          </div>

          <p className="max-w-xl text-base leading-relaxed text-(--foreground)/65 md:text-lg">
            A living catalog, planted around what your kitchen actually
            orders.
          </p>
        </div>

        {/* Product catalog */}
        <div className="mt-16">
          {productGroups.map(
            ({ title, items, image, alt }, index) => (
              <article
                key={title}
                className="group grid gap-8 border-t border-(--primary)/15 py-10 md:grid-cols-2 md:items-center md:gap-16 md:py-16"
              >
                {/* Image */}
                <div
                  className={`overflow-hidden rounded-[20px] ${
                    index % 2 !== 0
                      ? "md:order-2"
                      : "md:order-1"
                  }`}
                >
                  <Image
                    src={image}
                    alt={alt}
                    width={520}
                    height={340}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                  />
                </div>

                {/* Content */}
                <div
                  className={
                    index % 2 !== 0
                      ? "md:order-1"
                      : "md:order-2"
                  }
                >
                  <h3 className="max-w-lg  text-3xl font-medium leading-tight tracking-[-0.03em] text-(--primary) sm:text-4xl">
                    {title}
                  </h3>

                  <div className="mt-7 max-w-xl border-t border-(--primary)/15 pt-5">
                    {/* Products */}
                    <div className="flex flex-wrap gap-2">
                      {items.map((item) => {
                        const isSelected =
                          selectedProduct === item.id;

                        const isInPlan =
                          isProductInPlan(item.id);

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() =>
                              handleProductSelect(item.id)
                            }
                            aria-pressed={isSelected}
                            aria-label={`Select ${item.name}`}
                            className={`group/item inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-[background-color,border-color,color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--primary) focus-visible:ring-offset-2 ${
                              isSelected
                                ? "border-(--primary) bg-(--primary) text-white"
                                : isInPlan
                                  ? "border-(--primary)/25 bg-(--primary)/5 text-(--primary)"
                                  : "border-(--primary)/10 bg-transparent text-(--foreground)/70 hover:-translate-y-0.5 hover:border-(--primary)/30 hover:text-(--primary)"
                            }`}
                          >
                            {isInPlan && (
                              <Check
                                size={14}
                                strokeWidth={2.5}
                                aria-hidden="true"
                              />
                            )}

                            {item.name}
                          </button>
                        );
                      })}
                    </div>

                    {/* Selected product details */}
                    {items.map((item) => {
                      if (selectedProduct !== item.id) {
                        return null;
                      }

                      const isInPlan =
                        isProductInPlan(item.id);

                      return (
                        <div
                          key={`${item.id}-details`}
                          className="mt-5 rounded-2xl border border-(--primary)/10 bg-(--background)/50 p-5"
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="text-sm font-medium text-(--primary)">
                                {item.name}
                              </p>

                              <p className="mt-2 max-w-lg text-sm leading-relaxed text-(--foreground)/65">
                                {item.description}
                              </p>
                            </div>

                            <span className="shrink-0 rounded-full bg-(--highlight)/15 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-(--primary)">
                              {isInPlan
                                ? "In your plan"
                                : "Add to plan"}
                            </span>
                          </div>

                          <button
                            type="button"
                            disabled={isInPlan}
                            onClick={() => {
                              addItem({
                                id: item.id,
                                name: item.name,
                                unit: "kg",
                              });
                            }}
                            className={`mt-5 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-[transform,opacity,background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--primary) focus-visible:ring-offset-2 ${
                              isInPlan
                                ? "cursor-default bg-(--primary)/10 text-(--primary)"
                                : "bg-(--primary) text-white hover:-translate-y-0.5 hover:opacity-90"
                            }`}
                          >
                            {isInPlan ? (
                              <>
                                <Check
                                  size={15}
                                  strokeWidth={2.5}
                                  aria-hidden="true"
                                />
                                Added to supply plan
                              </>
                            ) : (
                              `Add ${item.name} to supply plan`
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </article>
            )
          )}
        </div>

        {/* Closing line */}
        <div className="border-t border-(--primary)/15 py-10">
          <p className="text-sm text-(--foreground)/60">
            From everyday staples to custom crop plans.
          </p>
        </div>
      </Container>
    </section>
  );
}

