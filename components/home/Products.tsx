import Image from "next/image";
import Container from "@/components/ui/Container";

const productGroups = [
  {
    title: "Lettuce varieties",
    items: ["Romaine", "Butterhead", "Green leaf", "Red leaf", "Iceberg"],
    image: "/lettuce.png",
    alt: "Crates of freshly harvested lettuce varieties",
  },
  {
    title: "Salad & cooking greens",
    items: [
      "Kale",
      "Spinach",
      "Swiss chard",
      "Arugula",
      "Watercress",
      "Bok choy",
      "Pak choi",
    ],
    image: "/salad-greens.png",
    alt: "Bundles of leafy salad and cooking greens",
  },
  {
    title: "Fresh culinary herbs",
    items: ["Basil", "Mint", "Parsley", "Coriander"],
    image: "/herbs-1.png",
    alt: "Fresh culinary herbs bundled for market",
  },
  {
    title: "Kitchen staples",
    items: [
      "Dill",
      "Chives",
      "Oregano",
      "Thyme",
      "Spring onions",
      "Custom blends",
    ],
    image: "/herbs-2.png",
    alt: "Assorted kitchen staple herbs and spring onions",
  },
];

export default function Products() {
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

            <h2 className="font-(--font-display) text-4xl font-medium leading-[1] tracking-[-0.05em] text-(--primary) sm:text-5xl md:text-6xl">
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
          {productGroups.map(({ title, items, image, alt }, index) => (
            <article
              key={title}
              className="group grid gap-8 border-t border-(--primary)/15 py-10 md:grid-cols-2 md:items-center md:gap-16 md:py-16"
            >
              {/* Image */}
              <div
                className={`overflow-hidden rounded-[20px] ${
                  index % 2 !== 0 ? "md:order-2" : "md:order-1"
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
                  index % 2 !== 0 ? "md:order-1" : "md:order-2"
                }
              >
                <h3 className="max-w-lg font-(--font-display) text-3xl font-medium leading-tight tracking-[-0.03em] text-(--primary) sm:text-4xl">
                  {title}
                </h3>

                <div className="mt-7 max-w-xl border-t border-(--primary)/15 pt-5">
                  <ul className="flex flex-wrap gap-x-5 gap-y-3">
                    {items.map((item) => (
                      <li
                        key={item}
                        className="relative text-sm text-(--foreground)/70 after:absolute after:-right-3 after:top-1/2 after:h-1 after:w-1 after:-translate-y-1/2 after:rounded-full after:bg-(--highlight)/60 last:after:hidden"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
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