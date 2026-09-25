import Container from "@/components/ui/Container";
import { getActiveProducts } from "@/lib/data/products";
import ProductCategoryFilter from "@/components/products/ProductCategoryFilter";

export default async function ProductsPage() {
  const products = await getActiveProducts();

  return (
    <main>
      {/* Product catalog */}
      <section className="pt-20">
        <Container>
          <div className="">
            <ProductCategoryFilter products={products} />
          </div>
        </Container>
      </section>
    </main>
  );
}