import Container from "@/components/ui/Container";

const industries = [
  {
    title: "Hospitality",
    text: "Restaurants, hotels and cafés seeking premium quality garnishes and salad bases.",
  },
  {
    title: "Retail grocery",
    text: "Supermarkets and specialty stores requiring clean, packaged shelf-ready produce.",
  },
  {
    title: "Food processing",
    text: "Catering companies, meal prep businesses and commercial kitchens.",
  },
];

export default function Industries() {
  return (
    <section id="industries" className="section-shell tight">
      <Container>
        <div className="section-head">
          <h2>Trusted partners<br />we serve</h2>
        </div>

        <div className="industry-grid">
          {industries.map(({ title, text }) => (
            <div key={title} className="industry-card">
              <span className="dot" aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}