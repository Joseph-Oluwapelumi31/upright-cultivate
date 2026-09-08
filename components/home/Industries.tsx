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
  return (
    <section id="industries" className="section-shell tight">
      <Container>
        <div className="section-head">
          <h2>
            Industries
            <br />
            we serve
          </h2>
        </div>

        <div className="industry-grid">
          {industries.map(({ title, text, icon: Icon }) => (
            <div key={title} className="industry-card">
              <span
                className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-(--copper) bg-(--white) text-(--copper)"
                aria-hidden="true"
              >
                <Icon size={16} strokeWidth={2.2} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}