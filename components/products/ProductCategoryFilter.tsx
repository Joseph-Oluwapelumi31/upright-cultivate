"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  PackageSearch,
  Search,
  X,
} from "lucide-react";

import Container from "@/components/ui/Container";
import ProductCard from "@/components/products/ProductCard";
import { useSupplyPlan } from "@/components/supply-plan/SupplyPlanProvider";

type Product = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  category: {
    id: string;
    name: string;
  };
};

type ProductsCatalogProps = {
  products: Product[];
};

type CategoryGroup = {
  id: string;
  name: string;
  imageUrl: string | null;
  products: Product[];
};

export default function ProductsCatalog({
  products,
}: ProductsCatalogProps) {
  const [search, setSearch] = useState("");

  const { itemCount } = useSupplyPlan();

  const normalizedSearch = search.trim().toLowerCase();
  const isSearching = normalizedSearch.length > 0;

  /*
   * Group products by category.
   *
   * The first appearance of a category determines its order.
   * The category image is calculated once here instead of
   * searching the products again during rendering.
   */
  const categories = useMemo<CategoryGroup[]>(() => {
    const groups = new Map<string, CategoryGroup>();

    for (const product of products) {
      const categoryId = product.category.id;

      const existingCategory = groups.get(categoryId);

      if (existingCategory) {
        existingCategory.products.push(product);

        if (!existingCategory.imageUrl && product.imageUrl) {
          existingCategory.imageUrl = product.imageUrl;
        }

        continue;
      }

      groups.set(categoryId, {
        id: categoryId,
        name: product.category.name,
        imageUrl: product.imageUrl,
        products: [product],
      });
    }

    return Array.from(groups.values());
  }, [products]);

  /*
   * Search by product name OR category name.
   */
  const searchResults = useMemo(() => {
    if (!isSearching) {
      return [];
    }

    return products.filter((product) => {
      const productName = product.name.toLowerCase();
      const categoryName = product.category.name.toLowerCase();

      return (
        productName.includes(normalizedSearch) ||
        categoryName.includes(normalizedSearch)
      );
    });
  }, [products, normalizedSearch, isSearching]);

  const handleSearch = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setSearch(event.target.value);
  };

  const clearSearch = () => {
    setSearch("");
  };

  /*
   * Completely empty catalog.
   */
  if (products.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <Container>
          <div className="flex min-h-[60vh] items-center justify-center py-16 lg:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <PackageSearch
                  aria-hidden="true"
                  className="size-7"
                  strokeWidth={1.6}
                />
              </div>

              <p className="mb-3 text-small font-semibold uppercase tracking-wider text-secondary">
                Fresh produce
              </p>

              <h1 className="font-display text-h2 leading-heading text-foreground">
                No products available
              </h1>

              <p className="mt-5 text-body leading-relaxed text-muted-foreground">
                We&apos;re currently updating our produce catalog.
                Please check back shortly or contact our team for
                current availability.
              </p>

              <Link
                href="/#contact"
                className="mt-8 inline-flex h-control-md items-center justify-center gap-2 rounded-md bg-primary px-5 text-small font-semibold text-primary-foreground transition-[transform,box-shadow] duration-normal ease-standard hover:-translate-y-px hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Contact Us
                <ArrowRight
                  aria-hidden="true"
                  className="size-4"
                />
              </Link>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Search + category navigation */}
      <section>
        <Container>
          {/* Search */}
          <div className="pt-8 lg:pt-10">
            <div className="max-w-2xl">
              <label
                htmlFor="product-search"
                className="sr-only"
              >
                Search products or categories
              </label>

              <div className="relative">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
                  strokeWidth={1.8}
                />

                <input
                  id="product-search"
                  type="search"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search produce or category..."
                  autoComplete="off"
                  className="h-12 w-full rounded-full border border-border bg-surface pl-12 pr-12 text-body text-foreground shadow-sm outline-none transition-[border-color,box-shadow] duration-normal placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                />

                {search && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <X
                      aria-hidden="true"
                      className="size-4"
                    />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Category navigation */}
          {!isSearching && categories.length > 0 && (
            <nav
              aria-label="Product categories"
              className="py-8 lg:py-10"
            >
              {/* Mobile: horizontal scrolling */}
              <div className="scrollbar-hidden -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 md:hidden">
                {categories.map((category) => (
                  <CategoryTile
                    key={category.id}
                    category={category}
                    mobile
                  />
                ))}
              </div>

              {/* Tablet/Desktop: grid */}
              <div className="hidden gap-4 sm:grid-cols-2 md:grid lg:grid-cols-4 lg:gap-5">
                {categories.map((category) => (
                  <CategoryTile
                    key={category.id}
                    category={category}
                  />
                ))}
              </div>
            </nav>
          )}
        </Container>
      </section>

      {/* Search results */}
      {isSearching ? (
        <section className="py-12 lg:py-16">
          <Container>
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-small font-semibold uppercase tracking-wider text-secondary">
                  Search results
                </p>

                <h2 className="mt-2 font-display text-h3 leading-heading text-foreground">
                  {searchResults.length}{" "}
                  {searchResults.length === 1
                    ? "product"
                    : "products"}{" "}
                  found
                </h2>

                <p className="sr-only" aria-live="polite">
                  {searchResults.length}{" "}
                  {searchResults.length === 1
                    ? "product"
                    : "products"}{" "}
                  found for {search}
                </p>
              </div>

              <button
                type="button"
                onClick={clearSearch}
                className="inline-flex w-fit items-center gap-2 text-small font-semibold text-secondary transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                Clear search
                <X
                  aria-hidden="true"
                  className="size-4"
                />
              </button>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
                {searchResults.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <EmptySearchState
                search={search}
                onClear={clearSearch}
              />
            )}
          </Container>
        </section>
      ) : (
        /* Category sections */
        <div className="py-12 lg:py-16">
          <Container>
            <div className="space-y-16 lg:space-y-20">
              {categories.map((category) => (
                <section
                  key={category.id}
                  id={`category-${category.id}`}
                  aria-labelledby={`category-heading-${category.id}`}
                  className="scroll-mt-28"
                >
                  <div className="mb-6 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-small font-semibold uppercase tracking-wider text-secondary">
                        Category
                      </p>

                      <h2
                        id={`category-heading-${category.id}`}
                        className="mt-1 font-display text-h3 leading-heading text-foreground"
                      >
                        {category.name}
                      </h2>
                    </div>

                    <span className="hidden text-small text-muted-foreground sm:block">
                      {category.products.length}{" "}
                      {category.products.length === 1
                        ? "product"
                        : "products"}
                    </span>
                  </div>

                  {category.products.length > 0 ? (
                    <>
                      {/* Mobile horizontal carousel */}
                      <div className="scrollbar-hidden -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 md:hidden">
                        {category.products.map((product) => (
                          <div
                            key={product.id}
                            className="w-[78vw] max-w-75 shrink-0"
                          >
                            <ProductCard product={product} />
                          </div>
                        ))}
                      </div>

                      {/* Tablet/Desktop grid */}
                      <div className="hidden grid-cols-2 gap-4 md:grid lg:grid-cols-4 lg:gap-6">
                        {category.products.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="rounded-md border border-border bg-surface p-8 text-center">
                      <p className="text-body text-muted-foreground">
                        No products available in this category.
                      </p>
                    </div>
                  )}
                </section>
              ))}
            </div>
          </Container>
        </div>
      )}

      {/* Floating plan indicator */}
      {itemCount > 0 && (
        <Link
          href="/supply"
          aria-label={`View supply plan with ${itemCount} ${
            itemCount === 1 ? "item" : "items"
          }`}
          className="fixed bottom-4 left-1/2 z-40 flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center justify-center gap-3 rounded-md border border-primary/20 bg-primary px-5 py-3 text-small font-semibold text-primary-foreground shadow-lg transition-[transform,box-shadow] duration-normal ease-standard hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:bottom-6 sm:px-6"
        >
          <span className="truncate">
            Supply Plan ({itemCount})
          </span>

          <ArrowRight
            aria-hidden="true"
            className="size-4 shrink-0"
          />
        </Link>
      )}
    </main>
  );
}

function CategoryTile({
  category,
  mobile = false,
}: {
  category: CategoryGroup;
  mobile?: boolean;
}) {
  return (
    <Link
      href={`#category-${category.id}`}
      className={[
        "group relative block overflow-hidden rounded-md border border-border bg-surface",
        "transition-[border-color,transform,box-shadow] duration-normal ease-standard",
        "hover:-translate-y-px hover:border-border-strong hover:shadow-sm",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        mobile
          ? "min-w-55 sm:min-w-60"
          : "min-w-0",
      ].join(" ")}
    >
      <div className="relative aspect-16/8 overflow-hidden">
        {category.imageUrl ? (
          <Image
            src={category.imageUrl}
            alt=""
            fill
            sizes={
              mobile
                ? "(min-width: 640px) 240px, 220px"
                : "(min-width: 1024px) 25vw, 50vw"
            }
            className="object-cover transition-transform duration-slow ease-standard group-hover:scale-[1.03]"
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-primary"
          />
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/35 to-transparent"
        />

        <div className="absolute inset-x-4 bottom-3 flex items-end justify-between gap-3">
          <span className="font-display text-h4 leading-heading text-primary-foreground">
            {category.name}
          </span>

          <span
            aria-hidden="true"
            className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-primary-foreground/15 text-primary-foreground backdrop-blur-sm transition-transform duration-normal group-hover:translate-x-0.5"
          >
            <ArrowRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function EmptySearchState({
  search,
  onClear,
}: {
  search: string;
  onClear: () => void;
}) {
  return (
    <div className="flex min-h-80 items-center justify-center rounded-md border border-border bg-surface px-6 py-12">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <Search
            aria-hidden="true"
            className="size-6"
            strokeWidth={1.7}
          />
        </div>

        <h3 className="font-display text-h4 leading-heading text-foreground">
          No products found
        </h3>

        <p className="mt-3 text-body leading-relaxed text-muted-foreground">
          We couldn&apos;t find anything matching{" "}
          <span className="font-semibold text-foreground">
            &quot;{search}&quot;
          </span>
          . Try another search or browse our categories.
        </p>

        <button
          type="button"
          onClick={onClear}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-md border border-border bg-surface px-5 text-small font-semibold text-foreground transition-[border-color,transform] duration-normal ease-standard hover:-translate-y-px hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Clear search
        </button>
      </div>
    </div>
  );
}
