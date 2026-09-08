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
    <section id="products" className="section-shell bg-(--white)">
      <Container>
        {/* Section heading */}
        <div className="section-head">
          <h2>What we grow</h2>

          <p>
            A living catalog, planted around what your kitchen actually orders.
          </p>
        </div>

        {/* Product catalog */}
        <div className="mt-16">
          {productGroups.map(({ title, items, image, alt }, index) => (
            <article
              key={title}
              className="group grid gap-8 border-t border-(--deep-moss)/15 py-10 md:grid-cols-2 md:items-center md:gap-16 md:py-16"
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
                  className="h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025] group-active:scale-[1.025]"
                />
              </div>

              {/* Content */}
              <div
                className={
                  index % 2 !== 0 ? "md:order-1" : "md:order-2"
                }
              >
                <h3 className="max-w-lg text-3xl leading-tight tracking-[-0.02em] sm:text-4xl">
                  {title}
                </h3>

                <div className="mt-7 max-w-xl border-t border-(--deep-moss)/15 pt-5">
                  <ul className="flex flex-wrap gap-x-5 gap-y-3">
                    {items.map((item) => (
                      <li
                        key={item}
                        className="relative text-sm text-(--forest)/75 after:absolute after:-right-3 after:top-1/2 after:h-1 after:w-1 after:-translate-y-1/2 after:rounded-full after:bg-(--copper)/60 last:after:hidden"
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
        <div className="border-t border-(--deep-moss)/15 py-10">
          <p className="text-sm text-(--forest)/65">
            From everyday staples to custom crop plans.
          </p>
        </div>
      </Container>
    </section>
  );
}