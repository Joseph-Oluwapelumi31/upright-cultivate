"use client";

import { useMemo, useState, useEffect, useActionState } from "react";
import Image from "next/image";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Minus,
  Plus,
  Search,
} from "lucide-react";
import { useSupplyPlan } from "@/components/supply-plan/SupplyPlanProvider";
import { submitSupplyRequest } from "@/actions/supply-request";
import Link from "next/link";

type PlannerStep = "plan" | "review" | "received";

const MAX_QUANTITY = 500;

const PRODUCT_IMAGES: Record<string, string> = {
  romaine: "/products/romaine_lettuce.png",
  butterhead: "/products/butterhead_lettuce.png",
  "green-leaf": "/products/green_leaf_lettuce.png",
  "red-leaf": "/products/red_leaf_lettuce.png",
  iceberg: "/products/iceberg_lettuce.png",
  kale: "/products/curly_kale.png",
  spinach: "/products/spinach.png",
  "swiss-chard": "/products/swiss_chard.png",
  arugula: "/products/arugula.png",
  watercress: "/products/watercress.png",
  "bok-choy": "/products/baby_bok_choy.png",
  "pak-choi": "/products/pak_choi.png",
  basil: "/products/basil.png",
  mint: "/products/mint.png",
  parsley: "/products/fresh_parsley.png",
  coriander: "/products/coriander_cilantro.png",
  dill: "/products/dill.png",
  chives: "/products/chives.png",
  oregano: "/products/oregano.png",
  thyme: "/products/thyme.png",
  "spring-onions": "/products/spring_onions.png",
};

function getProductImage(id: string) {
  return PRODUCT_IMAGES[id] ?? "/products/romaine_lettuce.png";
}

function getDeliveriesPerWeek(frequency: string) {
  switch (frequency) {
    case "Weekly":
      return 1;
    case "Twice a week":
      return 2;
    default:
      return null;
  }
}

function formatVolume(value: number, unit = "kg") {
  if (value === 0) return "0 kg";

  const formatted = Number.isInteger(value)
    ? value.toString()
    : value.toFixed(1).replace(/\.0$/, "");

  return `${formatted} ${unit}`;
}

export default function SupplyPlanner({ 
  initialGroups = [],
  business,
  location
}: { 
  initialGroups?: { title: string; items: { id: string; name: string }[] }[];
  business?: { id: string; name: string; type?: string; } | null;
  location?: { id: string; name: string; } | null;
}) {
  const {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearPlan,
  } = useSupplyPlan();

  const [step, setStep] = useState<PlannerStep>("plan");
  const [frequency, setFrequency] = useState("Weekly");
  const [productQuery, setProductQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState(
    initialGroups[0]?.title ?? "",
  );
  const [plannerError, setPlannerError] = useState("");
  const businessType = business?.type || "Business";

  const [state, formAction, isPending] = useActionState(
    submitSupplyRequest,
    { success: false, message: "" }
  );

  const [submissionKey, setSubmissionKey] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSubmissionKey(crypto.randomUUID());
    const savedFrequency = window.localStorage.getItem("upright-supply-frequency");
    if (savedFrequency) setFrequency(savedFrequency);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("upright-supply-frequency", frequency);
  }, [frequency]);

  useEffect(() => {
    if (state.success) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStep("received");
      clearPlan();
    }
  }, [state.success, clearPlan]);

  const selectedIds = useMemo(
    () => new Set(items.map((item) => item.id)),
    [items],
  );

  const selectedItemsById = useMemo(
    () => new Map(items.map((item) => [item.id, item])),
    [items],
  );

  const filteredGroups = useMemo(() => {
    const query = productQuery.trim().toLowerCase();

    if (!query) return initialGroups;

    return initialGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((product) =>
          product.name.toLowerCase().includes(query),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [productQuery, initialGroups]);

  const visibleGroup = useMemo(() => {
    if (productQuery.trim()) {
      return null;
    }

    return (
      filteredGroups.find((group) => group.title === activeGroup) ??
      filteredGroups[0] ??
      null
    );
  }, [activeGroup, filteredGroups, productQuery]);

  const deliveriesPerWeek = getDeliveriesPerWeek(frequency);

  const totalsByUnit = useMemo(() => {
    return items.reduce<Record<string, number>>((totals, item) => {
      const unit = item.unit ?? "kg";
      totals[unit] = (totals[unit] ?? 0) + item.quantity;
      return totals;
    }, {});
  }, [items]);

  const deliveryVolume = useMemo(() => {
    return Object.entries(totalsByUnit)
      .map(([unit, total]) => formatVolume(total, unit))
      .join(" · ");
  }, [totalsByUnit]);

  const weeklyVolume = useMemo(() => {
    if (!deliveriesPerWeek) return "Based on your schedule";

    return Object.entries(totalsByUnit)
      .map(([unit, total]) =>
        formatVolume(total * deliveriesPerWeek, unit),
      )
      .join(" · ");
  }, [deliveriesPerWeek, totalsByUnit]);

  const itemCount = items.length;

  const handleAddProduct = (product: { id: string; name: string }) => {
    if (selectedIds.has(product.id)) return;

    addItem({
      id: product.id,
      name: product.name,
      unit: "kg",
    });

    setPlannerError("");
  };

  const handleIncrease = (id: string, quantity: number) => {
    if (quantity >= MAX_QUANTITY) return;

    updateQuantity(id, Math.min(quantity + 1, MAX_QUANTITY));
  };

  const handleDecrease = (id: string, quantity: number) => {
    if (quantity <= 1) {
      removeItem(id);
      return;
    }

    updateQuantity(id, quantity - 1);
  };

  const handleQuantityInput = (id: string, value: string) => {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) return;

    if (numericValue <= 0) {
      removeItem(id);
      return;
    }

    updateQuantity(
      id,
      Math.min(Math.floor(numericValue), MAX_QUANTITY),
    );
  };

  const handleContinue = () => {
    if (!items.length) {
      setPlannerError("Choose at least one produce item to continue.");
      return;
    }

    setPlannerError("");
    setStep("review");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReviewBack = () => {
    setStep("plan");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStartNewPlan = () => {
    setFrequency("Weekly");
    setProductQuery("");
    setPlannerError("");
    setSubmissionKey(crypto.randomUUID());
    setStep("plan");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderQuantityControl = (productId: string) => {
    const item = selectedItemsById.get(productId);

    if (!item) return null;

    return (
      <div className="flex items-center gap-1 rounded-full border border-primary/15 bg-primary/5">
        <button
          type="button"
          aria-label={`Decrease ${item.name} quantity`}
          onClick={() => handleDecrease(item.id, item.quantity)}
          className="grid size-8 shrink-0 place-items-center rounded-full transition hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <Minus size={14} strokeWidth={2.2} />
        </button>

        <div className="flex min-w-14.5 items-center justify-center gap-1">
          <input
            aria-label={`${item.name} quantity`}
            inputMode="numeric"
            value={item.quantity}
            onChange={(event) =>
              handleQuantityInput(item.id, event.target.value)
            }
            className="w-10 bg-transparent text-center text-sm font-semibold outline-none"
          />

          <span className="text-xs text-foreground/45">
            {item.unit ?? "kg"}
          </span>
        </div>

        <button
          type="button"
          aria-label={`Increase ${item.name} quantity`}
          onClick={() =>
            handleIncrease(item.id, item.quantity)
          }
          disabled={item.quantity >= MAX_QUANTITY}
          className="grid size-8 shrink-0 place-items-center rounded-full transition hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <Plus size={14} strokeWidth={2.2} />
        </button>
      </div>
    );
  };

  const renderProduct = (product: {
    id: string;
    name: string;
  }) => {
    const selected = selectedIds.has(product.id);

    return (
      <div
        key={product.id}
        className={`flex items-center gap-3 border-b border-primary/8 py-3.5 last:border-b-0 ${
          selected ? "bg-primary/2.5" : ""
        }`}
      >
        <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-background">
          <Image
            src={getProductImage(product.id)}
            alt=""
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">
            {product.name}
          </p>

          <p className="mt-0.5 text-xs text-foreground/45">
            {selected ? "Quantity per delivery" : "Add to your plan"}
          </p>
        </div>

        {selected ? (
          renderQuantityControl(product.id)
        ) : (
          <button
            type="button"
            onClick={() => handleAddProduct(product)}
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-primary/15 px-3 text-xs font-semibold text-primary transition hover:border-primary hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <Plus size={14} />
            Add
          </button>
        )}
      </div>
    );
  };

  if (step === "received") {
    return (
      <section className="bg-background py-20 text-foreground md:py-28">
        <Container>
          <div className=" max-w-2xl">
            <div className="rounded-4xl border border-primary/10 bg-white/65 p-6 shadow-sm sm:p-10">
              <div className="grid size-12 place-items-center rounded-full bg-primary text-white">
                <Check size={24} />
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-primary/60">
                Request received
              </p>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                We have your supply plan.
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-foreground/60 sm:text-base">
                Your request has been submitted. We’ll review your requirements
                and get back to you with the next steps.
              </p>

              <div className="mt-8 border-t border-primary/10 pt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground/40">
                  Your plan
                </p>

                <div className="mt-4 space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 text-sm"
                    >
                      <span className="text-foreground/70">
                        {item.name}
                      </span>

                      <span className="font-medium">
                        {formatVolume(
                          item.quantity,
                          item.unit ?? "kg",
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid gap-4 border-t border-primary/10 pt-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-foreground/40">
                      Frequency
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {frequency}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-foreground/40">
                      Business
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {businessType}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button
                  type="button"
                  onClick={handleStartNewPlan}
                  className="w-full sm:w-auto"
                >
                  Start a new plan
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section
      id="supply-planner"
      className="bg-background py-20 text-foreground md:py-28"
    >
      <Container>
        <div className="mx-auto max-w-3xl">
          {/* Intro */}
          <header className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/60">
              Supply planner
            </p>

            <h1 className="mx-auto mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Plan the supply your kitchen needs.
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-foreground/60 sm:text-base">
              Choose the produce you need, set your quantities, and tell us
              how often you’d like it delivered.
            </p>
          </header>

          {/* Progress */}
          <div className="mx-auto mt-10 flex max-w-md items-center justify-center gap-3 text-xs">
            {[
              ["01", "Produce"],
              ["02", "Review"],
              ["03", "Details"],
            ].map(([number, label], index) => {
              const activeIndex =
                step === "plan"
                  ? 0
                  : step === "review"
                    ? 1
                    : 2;

              const complete = index < activeIndex;
              const active = index === activeIndex;

              return (
                <div
                  key={number}
                  className="flex items-center gap-2"
                >
                  <div
                    className={`grid size-7 place-items-center rounded-full border text-[11px] font-semibold ${
                      active
                        ? "border-primary bg-primary text-white"
                        : complete
                          ? "border-primary/20 bg-primary/10 text-primary"
                          : "border-primary/10 text-foreground/35"
                    }`}
                  >
                    {complete ? <Check size={13} /> : number}
                  </div>

                  <span
                    className={
                      active
                        ? "font-medium text-foreground"
                        : "text-foreground/40"
                    }
                  >
                    {label}
                  </span>

                  {index < 2 && (
                    <div className="mx-1 h-px w-5 bg-primary/10 sm:w-8" />
                  )}
                </div>
              );
            })}
          </div>

          {/* PLAN */}
          {step === "plan" && (
            <div className="mt-10">
              <div className="overflow-hidden rounded-[1.75rem] border border-primary/10 bg-white/65 shadow-sm">
                {/* Selected summary */}
                <div className="border-b border-primary/10 px-5 py-4 sm:px-7">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">
                        Your supply plan
                      </p>

                      <p className="mt-1 text-xs text-foreground/45">
                        {itemCount
                          ? `${itemCount} ${
                              itemCount === 1 ? "item" : "items"
                            } selected · ${deliveryVolume} per delivery`
                          : "Add the produce your kitchen needs"}
                      </p>
                    </div>

                    {itemCount > 0 && (
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-white">
                        {itemCount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Catalogue */}
                <div className="px-5 py-6 sm:px-7 sm:py-8">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary/55">
                      Step 01
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                      Choose your produce
                    </h2>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-foreground/55">
                      Add everything you regularly need. You can adjust the
                      quantity immediately after adding it.
                    </p>
                  </div>

                  {/* Search */}
                  <div className="relative mt-6">
                    <Search
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground/35"
                    />

                    <input
                      type="search"
                      value={productQuery}
                      onChange={(event) => {
                        setProductQuery(event.target.value);
                        setPlannerError("");
                      }}
                      placeholder="Search produce..."
                      aria-label="Search produce"
                      className="h-12 w-full rounded-xl border border-primary/10 bg-background pl-11 pr-4 text-sm outline-none transition placeholder:text-foreground/35 focus:border-primary/30 focus:ring-4 focus:ring-primary/5"
                    />
                  </div>

                  {/* Mobile group selector */}
                  {!productQuery.trim() && (
                    <div className="mt-5 md:hidden">
                      <label
                        htmlFor="product-group"
                        className="mb-2 block text-xs font-medium text-foreground/45"
                      >
                        Browse category
                      </label>

                      <div className="relative">
                        <select
                          id="product-group"
                          value={activeGroup}
                          onChange={(event) =>
                            setActiveGroup(event.target.value)
                          }
                          className="h-11 w-full appearance-none rounded-xl border border-primary/10 bg-background px-4 pr-10 text-sm font-medium outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5"
                        >
                          {initialGroups.map((group) => (
                            <option
                              key={group.title}
                              value={group.title}
                            >
                              {group.title}
                            </option>
                          ))}
                        </select>

                        <ChevronDown
                          size={16}
                          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40"
                        />
                      </div>
                    </div>
                  )}

                  {/* Desktop category tabs */}
                  {!productQuery.trim() && (
                    <div className="mt-6 hidden gap-2 overflow-x-auto pb-1 md:flex">
                      {initialGroups.map((group) => (
                        <button
                          key={group.title}
                          type="button"
                          onClick={() => setActiveGroup(group.title)}
                          className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
                            activeGroup === group.title
                              ? "bg-primary text-white"
                              : "border border-primary/10 bg-background text-foreground/55 hover:border-primary/20 hover:text-foreground"
                          }`}
                        >
                          {group.title}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Products */}
                  <div className="mt-5">
                    {productQuery.trim() ? (
                      filteredGroups.length > 0 ? (
                        <div className="divide-y divide-primary/8">
                          {filteredGroups.map((group) => (
                            <div
                              key={group.title}
                              className="py-4 first:pt-0 last:pb-0"
                            >
                              <p className="mb-2 text-xs font-semibold text-foreground/40">
                                {group.title}
                              </p>

                              <div>
                                {group.items.map(renderProduct)}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-xl border border-dashed border-primary/10 px-5 py-10 text-center">
                          <p className="text-sm font-medium">
                            No produce found
                          </p>
                          <p className="mt-1 text-xs text-foreground/45">
                            Try another search term.
                          </p>
                        </div>
                      )
                    ) : visibleGroup ? (
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground/40">
                            {visibleGroup.title}
                          </p>

                          <span className="text-xs text-foreground/35">
                            {visibleGroup.items.length} items
                          </span>
                        </div>

                        <div>
                          {visibleGroup.items.map(renderProduct)}
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* Error */}
                  {plannerError && (
                    <p
                      role="alert"
                      className="mt-4 text-sm font-medium text-red-600"
                    >
                      {plannerError}
                    </p>
                  )}

                  {/* Continue */}
                  <div className="mt-7 border-t border-primary/10 pt-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs leading-5 text-foreground/45">
                        {items.length
                          ? "You can add more produce or continue with your plan."
                          : "Choose at least one produce item to continue."}
                      </p>

                      <Button
                        type="button"
                        onClick={handleContinue}
                        disabled={!items.length}
                        className="w-full sm:w-auto"
                      >
                        Continue to delivery details
                        <ArrowRight size={17} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* REVIEW */}
          {step === "review" && (
            <div className="mt-10">
              <div className="overflow-hidden rounded-[1.75rem] border border-primary/10 bg-white/65 shadow-sm">
                <div className="px-5 py-7 sm:px-8 sm:py-9">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary/55">
                    Step 02
                  </p>

                  <div className="mt-2 flex items-start justify-between gap-5">
                    <div>
                      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                        Review your supply plan
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-foreground/55">
                        Make sure everything looks right before sharing your
                        details.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleReviewBack}
                      className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      <ArrowLeft size={14} />
                      Edit
                    </button>
                  </div>

                  {/* Produce */}
                  <div className="mt-8">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground/40">
                        Produce
                      </p>

                      <span className="text-xs text-foreground/40">
                        {deliveryVolume} / delivery
                      </span>
                    </div>

                    <div className="divide-y divide-primary/8 rounded-xl border border-primary/10 bg-background px-4">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-4 py-4"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-white">
                              <Image
                                src={getProductImage(item.id)}
                                alt=""
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>

                            <span className="truncate text-sm font-medium">
                              {item.name}
                            </span>
                          </div>

                          <span className="shrink-0 text-sm font-semibold">
                            {formatVolume(
                              item.quantity,
                              item.unit ?? "kg",
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-primary/10 bg-background p-4">
                      <p className="text-xs text-foreground/40">
                        Business
                      </p>
                      <p className="mt-1.5 text-sm font-semibold">
                        {business?.name || "None"}
                      </p>
                      <div className="mt-2">
                        <Link href="/supply" className="text-xs text-primary hover:underline">Change</Link>
                      </div>
                    </div>

                    <div className="rounded-xl border border-primary/10 bg-background p-4">
                      <p className="text-xs text-foreground/40">
                        Location
                      </p>
                      <p className="mt-1.5 text-sm font-semibold">
                        {location?.name || "None"}
                      </p>
                      <div className="mt-2">
                        <Link href="/supply" className="text-xs text-primary hover:underline">Change</Link>
                      </div>
                    </div>
                  </div>

                  {/* Volume */}
                  <div className="mt-4 rounded-xl bg-primary px-5 py-5 text-white">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-xs text-white/55">
                          Estimated weekly volume
                        </p>

                        <p className="mt-1 text-xl font-semibold">
                          {weeklyVolume}
                        </p>
                      </div>

                      <p className="max-w-xs text-xs leading-5 text-white/55">
                        Final quantities and delivery schedules will be
                        confirmed with your team.
                      </p>
                    </div>
                  </div>

                  <form action={formAction}>
                    <input type="hidden" name="submissionKey" value={submissionKey} />
                    <input type="hidden" name="businessId" value={business?.id ?? ""} />
                    <input type="hidden" name="locationId" value={location?.id ?? ""} />
                    <input type="hidden" name="frequency" value={frequency} />
                    <input type="hidden" name="isRecurring" value="false" />
                    <input
                      type="hidden"
                      name="items"
                      value={JSON.stringify(
                        items.map(item => ({
                          productSlug: item.id,
                          quantity: item.quantity,
                        }))
                      )}
                    />

                    {!state.success && state.message && (
                      <p className="mb-5 text-sm text-red-600" role="alert" aria-live="polite">
                        {state.message}
                      </p>
                    )}

                    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="button"
                        onClick={handleReviewBack}
                        className="flex items-center justify-center gap-2 text-sm font-semibold text-foreground/55 transition hover:text-foreground"
                      >
                        <ArrowLeft size={16} />
                        Back to plan
                      </button>

                      <Button
                        type="submit"
                        disabled={isPending || !items.length || !business?.id || !location?.id}
                        className="w-full sm:w-auto"
                      >
                        {isPending ? "Sending request..." : "Submit Supply Request"}
                        {!isPending && <ArrowRight size={17} />}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* REQUEST step removed */}
        </div>
      </Container>
    </section>
  );
}