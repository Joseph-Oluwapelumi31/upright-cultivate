"use client";

import { RefreshCw } from "lucide-react";

export default function ProductsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <RefreshCw
            className="size-7"
            strokeWidth={1.6}
          />
        </div>

        <p className="mb-3 text-small font-semibold uppercase tracking-wider text-secondary">
          Product catalog
        </p>

        <h1 className="font-display text-h3 leading-heading text-foreground">
          Something went wrong
        </h1>

        <p className="mt-4 text-body leading-relaxed text-muted-foreground">
          We couldn&apos;t load our products right now.
          Please try again.
        </p>

        <button
          type="button"
          onClick={reset}
          className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-small font-semibold text-primary-foreground transition-[transform,box-shadow] duration-normal ease-standard hover:-translate-y-px hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <RefreshCw className="size-4" />
          Try Again
        </button>
      </div>
    </main>
  );
}