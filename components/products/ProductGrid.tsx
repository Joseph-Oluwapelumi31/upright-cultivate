import type { getActiveProducts } from "@/lib/data/products";
import ProductCard  from "./ProductCard";

type Products = Awaited<ReturnType<typeof getActiveProducts>>;

type ProductGridProps = {
  products: Products;
};

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="border border-border bg-surface px-6 py-12 text-center">
        <h2 className="font-display text-2xl font-semibold text-foreground">
          No products available
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Our product catalogue is currently being updated. Please check back
          shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}