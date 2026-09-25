export default function ProductsLoading() {
  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border">
        <div className="mx-auto max-w-350 px-4 pb-10 pt-14 sm:px-6 lg:px-8 lg:pb-14 lg:pt-20">
          <div className="max-w-3xl">
            <div className="h-4 w-28 animate-pulse rounded-sm bg-muted" />

            <div className="mt-5 space-y-3">
              <div className="h-12 max-w-xl animate-pulse rounded-sm bg-muted" />
              <div className="h-12 max-w-md animate-pulse rounded-sm bg-muted" />
            </div>

            <div className="mt-6 h-6 max-w-2xl animate-pulse rounded-sm bg-muted" />
          </div>

          <div className="mt-8 h-12 max-w-2xl animate-pulse rounded-md bg-muted" />

          <div className="mt-8 flex gap-3 overflow-hidden">
            {Array.from({ length: 4 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-28 min-w-55 animate-pulse rounded-md bg-muted"
                />
              )
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-350 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="space-y-16">
          {Array.from({ length: 3 }).map(
            (_, categoryIndex) => (
              <section key={categoryIndex}>
                <div className="mb-6 space-y-2">
                  <div className="h-3 w-20 animate-pulse rounded-sm bg-muted" />
                  <div className="h-9 w-48 animate-pulse rounded-sm bg-muted" />
                </div>

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
                  {Array.from({ length: 4 }).map(
                    (_, productIndex) => (
                      <div
                        key={productIndex}
                        className="overflow-hidden rounded-md border border-border bg-surface"
                      >
                        <div className="aspect-square animate-pulse bg-muted" />

                        <div className="space-y-3 p-5">
                          <div className="h-3 w-20 animate-pulse rounded-sm bg-muted" />
                          <div className="h-6 w-32 animate-pulse rounded-sm bg-muted" />
                          <div className="h-4 w-20 animate-pulse rounded-sm bg-muted" />
                          <div className="h-11 w-full animate-pulse rounded-md bg-muted" />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </section>
            )
          )}
        </div>
      </div>
    </main>
  );
}