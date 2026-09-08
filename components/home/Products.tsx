import Image from "next/image";
import Container from "@/components/ui/Container";

const productGroups = [
  {
    title: "Lettuce varieties",
    items: ["Romaine", "Butterhead", "Green leaf", "Red leaf", "Iceberg"],
    image:
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Salad & cooking greens",
    items: ["Kale", "Spinach", "Swiss chard", "Arugula", "Watercress", "Bok choy", "Pak choi"],
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Fresh culinary herbs",
    items: ["Basil", "Mint", "Parsley", "Coriander"],
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Kitchen staples",
    items: ["Dill", "Chives", "Oregano", "Thyme", "Spring onions", "Custom blends"],
    image:
      "https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=900&q=80",
  },
];

export default function Products() {
  return (
    <section id="products" className="section-shell bg-[var(--white)]">
      <Container>
        <div className="section-head">
          <h2>What we grow</h2>
          <p>A living catalog, planted around what your kitchen actually orders.</p>
        </div>

        {productGroups.map(({ title, items, image }) => (
          <div key={title} className="catalog-group">
            <div className="specimen-img">
              <Image
                src={image}
                alt={title}
                width={520}
                height={340}
                className="h-auto w-full rounded-[20px] object-cover"
              />
            </div>
            <h3>{title}</h3>
            <div className="pill-row">
              {items.map((item) => (
                <span key={item} className="pill-tag">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}