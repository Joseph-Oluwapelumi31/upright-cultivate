"use client";

import Image from "next/image";
import { Minus, Plus } from "lucide-react";

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

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({
  product,
}: ProductCardProps) {
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
  } = useSupplyPlan();

  const planItem = items.find(
    (item) => item.id === product.id
  );

  const quantity = planItem?.quantity ?? 0;

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      unit: "kg",
    });
  };

  const handleDecrease = () => {
    if (!planItem) return;

    if (planItem.quantity === 1) {
      removeItem(product.id);
      return;
    }

    updateQuantity(
      product.id,
      planItem.quantity - 1
    );
  };

  const handleIncrease = () => {
    if (!planItem) return;

    updateQuantity(
      product.id,
      planItem.quantity + 1
    );
  };

  return (
    <article className="group overflow-hidden rounded-md border border-border bg-surface transition-[border-color,transform,box-shadow] duration-normal ease-standard hover:-translate-y-0.5 hover:border-border-strong hover:shadow-sm">
      {/* Product image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 78vw"
            className="object-cover transition-transform duration-slow ease-standard group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-muted px-6 text-center">
            <span className="text-small text-muted-foreground">
              Product image coming soon
            </span>
          </div>
        )}
      </div>

      {/* Product information */}
      <div className="p-4 sm:p-5">
        <p className="mb-1 text-caption font-semibold uppercase tracking-wide text-secondary">
          {product.category.name}
        </p>

        <h3 className="font-display text-h4 leading-heading text-foreground">
          {product.name}
        </h3>

        {product.description && (
          <p className="mt-2 line-clamp-2 text-small leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        )}

        {/* Supply plan action */}
        <div className="mt-5">
          {!planItem ? (
            <button
              type="button"
              onClick={handleAdd}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-md border border-primary bg-primary px-4 text-small font-semibold text-primary-foreground transition-[transform,box-shadow] duration-normal ease-standard hover:-translate-y-px hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Plus
                aria-hidden="true"
                className="size-4"
              />
              Add to Supply Plan
            </button>
          ) : (
            <div
              className="flex h-11 items-center justify-between rounded-md border border-primary bg-primary text-primary-foreground"
              aria-label={`${product.name} quantity`}
            >
              <button
                type="button"
                onClick={handleDecrease}
                aria-label={
                  quantity === 1
                    ? `Remove ${product.name}`
                    : `Decrease ${product.name} quantity`
                }
                className="flex size-11 items-center justify-center rounded-l-md transition-colors hover:bg-primary-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2px focus-visible:outline-primary-foreground"
              >
                <Minus
                  aria-hidden="true"
                  className="size-4"
                />
              </button>

              <span className="min-w-0 text-small font-semibold">
                {quantity} {planItem.unit}
              </span>

              <button
                type="button"
                onClick={handleIncrease}
                aria-label={`Increase ${product.name} quantity`}
                className="flex size-11 items-center justify-center rounded-r-md transition-colors hover:bg-primary-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2px focus-visible:outline-primary-foreground"
              >
                <Plus
                  aria-hidden="true"
                  className="size-4"
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}