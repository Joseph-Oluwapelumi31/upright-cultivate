"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Minus,
  Pencil,
  Plus,
  Search,
  Sprout,
  Trash2,
  X,
} from "lucide-react";
import { useSupplyPlan } from "@/components/supply-plan/SupplyPlanProvider";
import SupplyRequestForm from "@/components/supply-plan/SupplyRequestForm";
import { productGroups } from "@/components/home/Products";

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

const frequencies = [
  {
    value: "Weekly",
    description: "One delivery every week",
  },
  {
    value: "Twice a week",
    description: "Two deliveries every week",
  },
  {
    value: "Multiple times a week",
    description: "For higher-frequency supply",
  },
  {
    value: "Not sure yet",
    description: "We'll help work out the right schedule",
  },
];

const businessTypes = [
  "Restaurant",
  "Hotel",
  "Café",
  "Retail",
  "Catering",
  "Meal prep",
  "Commercial kitchen",
  "Other",
];

const MAX_QUANTITY = 500;

const deliveriesPerWeek: Record<string, number | null> = {
  Weekly: 1,
  "Twice a week": 2,
  "Multiple times a week": null,
  "Not sure yet": null,
};

type PlannerStep = "plan" | "review" | "request" | "received";

type ActiveOption = "frequency" | "business" | null;

export default function SupplyPlanner() {
  const {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearPlan,
  } = useSupplyPlan();

  const [frequency, setFrequency] = useState("Weekly");
  const [businessType, setBusinessType] = useState("Restaurant");
  const [step, setStep] = useState<PlannerStep>("plan");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [productQuery, setProductQuery] = useState("");
  const [activeOption, setActiveOption] =
    useState<ActiveOption>(null);
  const [addedProductId, setAddedProductId] =
    useState<string | null>(null);
  const [plannerError, setPlannerError] = useState("");

  const getProductImage = (id: string) => {
    return PRODUCT_IMAGES[id];
  };

  const handleQuantityChange = (
    id: string,
    quantity: number
  ) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }

    updateQuantity(id, Math.min(quantity, MAX_QUANTITY));
  };

  const handleReview = () => {
    if (items.length === 0) {
      setPlannerError(
        "Start by choosing at least one produce item. You can add as many as your kitchen regularly needs."
      );
      setIsPickerOpen(true);
      return;
    }

    setPlannerError("");
    setStep("review");
  };

  const handleAddProduct = (product: {
    id: string;
    name: string;
  }) => {
    const alreadyAdded = items.some(
      (item) => item.id === product.id
    );

    if (alreadyAdded) return;

    addItem({
      id: product.id,
      name: product.name,
      unit: "kg",
    });

    setAddedProductId(product.id);

    window.setTimeout(() => {
      setAddedProductId(null);
    }, 900);
  };

  const handleRequestReceived = () => {
    setStep("received");
  };

  const handleStartNewPlan = () => {
    clearPlan();
    setFrequency("Weekly");
    setBusinessType("Restaurant");
    setPlannerError("");
    setStep("plan");
  };

  const handleEditProduce = () => {
    setStep("plan");
    setPlannerError("");
    setIsPickerOpen(true);
  };

  const totalsByUnit = useMemo(() => {
    return items.reduce<Record<string, number>>(
      (totals, item) => {
        totals[item.unit] =
          (totals[item.unit] ?? 0) + item.quantity;

        return totals;
      },
      {}
    );
  }, [items]);

  const deliverySummary = Object.entries(totalsByUnit)
    .map(([unit, quantity]) => `${quantity} ${unit}`)
    .join(", ");

  const weeklyTotals = useMemo(() => {
    const deliveries = deliveriesPerWeek[frequency];

    if (!deliveries) return null;

    return Object.entries(totalsByUnit)
      .map(([unit, quantity]) => ({
        unit,
        quantity: quantity * deliveries,
      }))
      .sort((a, b) => b.quantity - a.quantity);
  }, [frequency, totalsByUnit]);

  const filteredProductGroups = useMemo(() => {
    const query = productQuery.trim().toLowerCase();

    if (!query) return productGroups;

    return productGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((product) =>
          product.name
            .toLowerCase()
            .includes(query)
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [productQuery]);

  const closePicker = () => {
    setIsPickerOpen(false);
    setProductQuery("");
    setPlannerError("");
  };

  const closeOptionPicker = () => {
    setActiveOption(null);
  };

  const selectedFrequency =
    frequencies.find(
      (option) => option.value === frequency
    ) ?? frequencies[0];

  return (
    <section
      id="supply-planner"
      className="relative overflow-hidden bg-(--background) py-24 text-(--foreground) md:py-32"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-start lg:gap-20">
          {/* LEFT */}
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              eyebrow="Supply planner"
              title="Plan your weekly supply."
              description="Tell us what your kitchen needs and we'll help you work out a reliable supply plan."
              theme="light"
            />

            <div className="mt-10 hidden lg:block">
              <div className="flex items-center gap-3 text-sm">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    step === "plan" ||
                    step === "review" ||
                    step === "request" ||
                    step === "received"
                      ? "bg-(--accent) text-(--primary)"
                      : "bg-(--primary)/10 text-(--primary)/50"
                  }`}
                >
                  <Check
                    size={15}
                    strokeWidth={2.5}
                  />
                </div>

                <span className="text-(--foreground)/80">
                  Choose produce
                </span>
              </div>

              <div className="ml-4 h-8 w-px bg-white/15" />

              <div className="flex items-center gap-3 text-sm">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    step !== "plan"
                      ? "bg-(--accent) text-(--primary)"
                      : "bg-(--primary)/10 text-(--primary)/50"
                  }`}
                >
                  {step !== "plan" ? (
                    <Check
                      size={15}
                      strokeWidth={2.5}
                    />
                  ) : (
                    "2"
                  )}
                </div>

                <span className="text-(--foreground)/80">
                  Review & request
                </span>
              </div>
            </div>
          </div>

          {/* MAIN CARD */}
          <div className="overflow-hidden rounded-4xl bg-(--background) text-(--foreground) shadow-2xl">
            {/* PLAN */}
            {step === "plan" && (
              <div className="p-5 sm:p-7 md:p-9">
                <div className="flex flex-col gap-4 border-b border-black/8 pb-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--primary)/50">
                      Step 01
                    </p>

                    <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                      What do you need?
                    </h3>

                    <p className="mt-2 max-w-lg text-sm leading-6 text-black/55">
                      Select the produce your kitchen regularly
                      needs. You can adjust quantities at any time.
                    </p>
                  </div>

                  {items.length > 0 && (
                    <div className="shrink-0 rounded-full bg-(--primary)/7 px-3.5 py-2 text-xs font-semibold text-(--primary)/70">
                      {items.length}{" "}
                      {items.length === 1
                        ? "item"
                        : "items"}{" "}
                      selected
                    </div>
                  )}
                </div>

                {items.length === 0 ? (
                  <div className="py-14 text-center sm:py-20">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-(--primary)/7">
                      <Sprout
                        size={28}
                        strokeWidth={1.5}
                        className="text-(--primary)/55"
                      />
                    </div>

                    <h4 className="mt-5 font-display text-xl font-semibold">
                      Start with your produce
                    </h4>

                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-black/50">
                      Choose the greens and herbs your kitchen
                      needs on a regular basis.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setPlannerError("");
                        setIsPickerOpen(true);
                      }}
                      className="mt-7 inline-flex items-center gap-2 rounded-full bg-(--secondary) px-5 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      Browse produce
                      <ArrowRight size={16} />
                    </button>

                    {plannerError && (
                      <p className="mx-auto mt-4 max-w-sm text-sm font-medium text-red-600">
                        {plannerError}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="pt-6">
                    <div className="space-y-2">
                      {items.map((item) => {
                        const image =
                          getProductImage(item.id);

                        return (
                          <div
                            key={item.id}
                            className="group flex items-center gap-3 rounded-2xl border border-black/7 bg-white/50 p-3 transition-colors duration-300 hover:bg-white"
                          >
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-(--background)">
                              {image && (
                                <Image
                                  src={image}
                                  alt={item.name}
                                  fill
                                  sizes="48px"
                                  className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
                                />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold">
                                {item.name}
                              </p>

                              <p className="mt-0.5 text-xs text-black/45">
                                Per delivery
                              </p>
                            </div>

                            <div className="flex shrink-0 items-center rounded-xl border border-black/8 bg-white">
                              <button
                                type="button"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                aria-label={`Decrease ${item.name}`}
                                className="flex h-9 w-9 items-center justify-center text-black/45 transition-colors hover:text-black"
                              >
                                <Minus size={14} />
                              </button>

                              <span className="min-w-12 text-center text-sm font-semibold">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                                aria-label={`Increase ${item.name}`}
                                className="flex h-9 w-9 items-center justify-center text-black/45 transition-colors hover:text-black"
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            <span className="hidden w-7 text-xs text-black/40 sm:block">
                              {item.unit}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                removeItem(item.id)
                              }
                              aria-label={`Remove ${item.name}`}
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-black/30 transition-colors hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setPlannerError("");
                        setIsPickerOpen(true);
                      }}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-black/12 py-3.5 text-sm font-semibold text-black/55 transition-colors hover:border-black/25 hover:bg-white"
                    >
                      <Plus size={16} />
                      Add more produce
                    </button>

                    {/* OPTIONS */}
                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveOption("frequency")
                        }
                        className="group rounded-2xl border border-black/8 bg-white/60 p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
                              Delivery frequency
                            </p>

                            <p className="mt-2 text-sm font-semibold">
                              {frequency}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-black/45">
                              {selectedFrequency.description}
                            </p>
                          </div>

                          <ChevronDown
                            size={16}
                            className="mt-0.5 text-black/35 transition-transform duration-300 group-hover:translate-y-0.5"
                          />
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setActiveOption("business")
                        }
                        className="group rounded-2xl border border-black/8 bg-white/60 p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
                              Business type
                            </p>

                            <p className="mt-2 text-sm font-semibold">
                              {businessType}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-black/45">
                              Helps us understand your supply
                              needs.
                            </p>
                          </div>

                          <ChevronDown
                            size={16}
                            className="mt-0.5 text-black/35 transition-transform duration-300 group-hover:translate-y-0.5"
                          />
                        </div>
                      </button>
                    </div>

                    {/* SUMMARY */}
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-(--primary)/6 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-(--primary)/45">
                          Per delivery
                        </p>

                        <p className="mt-2 text-lg font-semibold text-(--primary)">
                          {deliverySummary}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-(--primary)/6 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-(--primary)/45">
                          Estimated weekly
                        </p>

                        <p className="mt-2 text-lg font-semibold text-(--primary)">
                          {weeklyTotals
                            ? weeklyTotals
                                .map(
                                  ({ quantity, unit }) =>
                                    `${quantity} ${unit}`
                                )
                                .join(", ")
                            : "We'll work this out with you"}
                        </p>
                      </div>
                    </div>

                    {plannerError && (
                      <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {plannerError}
                      </div>
                    )}

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
                      <Button
                        type="button"
                        onClick={handleReview}
                        className="w-full sm:w-auto"
                      >
                        Review supply plan
                        <ArrowRight size={16} />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* REVIEW */}
            {step === "review" && (
              <div className="p-5 sm:p-7 md:p-9">
                <div className="flex items-start justify-between gap-4 border-b border-black/8 pb-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--primary)/50">
                      Step 02
                    </p>

                    <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                      Review your supply plan
                    </h3>

                    <p className="mt-2 max-w-lg text-sm leading-6 text-black/55">
                      Check everything before you send your
                      request. Nothing here is a final order.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep("plan")}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/8 text-black/45 transition-colors hover:bg-white hover:text-black"
                    aria-label="Edit supply plan"
                  >
                    <Pencil size={16} />
                  </button>
                </div>

                <div className="pt-6">
                  <div className="rounded-2xl border border-black/7 bg-white/50 p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
                          Selected produce
                        </p>

                        <p className="mt-1 text-sm text-black/45">
                          {items.length}{" "}
                          {items.length === 1
                            ? "item"
                            : "items"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleEditProduce}
                        className="text-xs font-semibold text-(--primary) hover:underline"
                      >
                        Edit produce
                      </button>
                    </div>

                    <div className="mt-5 space-y-2">
                      {items.map((item) => {
                        const image =
                          getProductImage(item.id);

                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 rounded-xl bg-(--background) p-3"
                          >
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-white">
                              {image && (
                                <Image
                                  src={image}
                                  alt={item.name}
                                  fill
                                  sizes="40px"
                                  className="object-contain p-1"
                                />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold">
                                {item.name}
                              </p>
                            </div>

                            <p className="shrink-0 text-sm font-semibold">
                              {item.quantity}{" "}
                              <span className="font-normal text-black/45">
                                {item.unit}
                              </span>
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-(--primary)/6 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-(--primary)/45">
                        Delivery
                      </p>

                      <p className="mt-2 text-sm font-semibold">
                        {frequency}
                      </p>

                      <p className="mt-1 text-xs text-black/45">
                        {selectedFrequency.description}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-(--primary)/6 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-(--primary)/45">
                        Business
                      </p>

                      <p className="mt-2 text-sm font-semibold">
                        {businessType}
                      </p>

                      <p className="mt-1 text-xs text-black/45">
                        Supply plan for your operation.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-black/7 bg-white/50 p-5">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
                          Estimated weekly volume
                        </p>

                        <p className="mt-2 text-2xl font-semibold tracking-tight">
                          {weeklyTotals
                            ? weeklyTotals
                                .map(
                                  ({ quantity, unit }) =>
                                    `${quantity} ${unit}`
                                )
                                .join(", ")
                            : "To be determined"}
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 text-xs leading-5 text-black/45">
                      This is an estimate based on your selected
                      delivery frequency. We&apos;ll confirm the right
                      quantities with you before any order is
                      fulfilled.
                    </p>
                  </div>

                  <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={() => setStep("plan")}
                      className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-black/50 transition-colors hover:bg-white hover:text-black"
                    >
                      <ArrowLeft size={16} />
                      Edit plan
                    </button>

                    <Button
                      type="button"
                      onClick={() => setStep("request")}
                      className="w-full sm:w-auto"
                    >
                      Continue to request
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* RECEIVED */}
            {step === "received" && (
              <div className="p-5 sm:p-7 md:p-9">
                <div className="rounded-3xl bg-(--secondary) p-6 text-white sm:p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--accent) text-(--primary)">
                    <Check
                      size={23}
                      strokeWidth={2.5}
                    />
                  </div>

                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                    Request received
                  </p>

                  <h3 className="mt-2 max-w-xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                    We have your supply plan.
                  </h3>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">
                    Your request has been submitted. We&apos;ll
                    review the details and follow up to confirm
                    availability, quantities and delivery.
                  </p>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
                        Your requested produce
                      </p>

                      <p className="mt-1 text-sm text-black/45">
                        {items.length}{" "}
                        {items.length === 1
                          ? "item"
                          : "items"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {items.map((item) => {
                      const image =
                        getProductImage(item.id);

                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 rounded-2xl border border-black/7 bg-white/50 p-3"
                        >
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-(--background)">
                            {image && (
                              <Image
                                src={image}
                                alt={item.name}
                                fill
                                sizes="40px"
                                className="object-contain p-1"
                              />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">
                              {item.name}
                            </p>

                            <p className="mt-0.5 text-xs text-black/45">
                              Per delivery
                            </p>
                          </div>

                          <p className="text-sm font-semibold">
                            {item.quantity}{" "}
                            <span className="font-normal text-black/45">
                              {item.unit}
                            </span>
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-(--primary)/6 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-(--primary)/45">
                        Delivery
                      </p>

                      <p className="mt-2 text-sm font-semibold">
                        {frequency}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-(--primary)/6 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-(--primary)/45">
                        Business
                      </p>

                      <p className="mt-2 text-sm font-semibold">
                        {businessType}
                      </p>
                    </div>
                  </div>

                  {weeklyTotals && (
                    <div className="mt-4 rounded-2xl border border-black/7 bg-white/50 p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
                        Estimated weekly volume
                      </p>

                      <p className="mt-2 text-xl font-semibold">
                        {weeklyTotals
                          .map(
                            ({ quantity, unit }) =>
                              `${quantity} ${unit}`
                          )
                          .join(", ")}
                      </p>
                    </div>
                  )}

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={handleEditProduce}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-black/60 transition-colors hover:bg-white hover:text-black"
                    >
                      <Pencil size={15} />
                      Edit produce
                    </button>

                    <Button
                      type="button"
                      onClick={handleStartNewPlan}
                      className="w-full sm:w-auto"
                    >
                      Start a new plan
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* PRODUCT PICKER */}
      {isPickerOpen && (
        <div
          className="fixed inset-0 z-100 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="produce-picker-title"
        >
          <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-4xl bg-(--background) text-(--foreground) shadow-2xl sm:max-h-[88vh] sm:rounded-4xl">
            {/* HEADER */}
            <div className="border-b border-black/8 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--primary)/45">
                    Produce
                  </p>

                  <h3
                    id="produce-picker-title"
                    className="mt-1 font-display text-2xl font-semibold tracking-tight"
                  >
                    Choose your produce
                  </h3>

                  <p className="mt-1 max-w-lg text-sm text-black/50">
                    Select everything your kitchen may need.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closePicker}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/8 text-black/40 transition-colors hover:bg-black/3 hover:text-black"
                  aria-label="Close produce picker"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="relative mt-5">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
                />

                <input
                  type="search"
                  value={productQuery}
                  onChange={(event) =>
                    setProductQuery(event.target.value)
                  }
                  placeholder="Search lettuce, herbs, kale..."
                  className="h-12 w-full rounded-xl border border-black/8 bg-white pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-black/35 focus:border-(--primary)/30 focus:ring-4 focus:ring-(--primary)/7"
                />
              </div>
            </div>

            {/* PRODUCTS */}
            <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
              {filteredProductGroups.length === 0 ? (
                <div className="flex min-h-60 flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--primary)/7">
                    <Search
                      size={22}
                      className="text-(--primary)/50"
                    />
                  </div>

                  <h4 className="mt-4 font-display text-lg font-semibold">
                    No produce found
                  </h4>

                  <p className="mt-1 max-w-xs text-sm leading-6 text-black/45">
                    Try a different search term or browse the
                    available produce.
                  </p>

                  <button
                    type="button"
                    onClick={() => setProductQuery("")}
                    className="mt-4 text-sm font-semibold text-(--primary)"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="space-y-7">
                  {filteredProductGroups.map((group) => (
                    <div key={group.title}>
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-black/40">
                          {group.title}
                        </h4>

                        <span className="text-xs text-black/30">
                          {group.items.length}
                        </span>
                      </div>

                      <div className="grid gap-2">
                        {group.items.map((product) => {
                          const isInPlan = items.some(
                            (item) =>
                              item.id === product.id
                          );

                          const image =
                            getProductImage(product.id);

                          const wasJustAdded =
                            addedProductId === product.id;

                          return (
                            <button
                              key={product.id}
                              type="button"
                              disabled={isInPlan}
                              onClick={() =>
                                handleAddProduct({
                                  id: product.id,
                                  name: product.name,
                                })
                              }
                              className={`group flex w-full items-center gap-3 rounded-2xl border p-2.5 text-left transition-all duration-300 ${
                                isInPlan
                                  ? "cursor-default border-(--primary)/10 bg-(--primary)/5"
                                  : "border-black/7 bg-white/40 hover:-translate-y-0.5 hover:border-black/12 hover:bg-white hover:shadow-sm"
                              }`}
                            >
                              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-(--background)">
                                {image && (
                                  <Image
                                    src={image}
                                    alt={product.name}
                                    fill
                                    sizes="64px"
                                    className={`object-contain p-1 transition-transform duration-500 ${
                                      !isInPlan
                                        ? "group-hover:scale-105"
                                        : ""
                                    }`}
                                  />
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold">
                                  {product.name}
                                </p>

                                <p className="mt-1 text-xs text-black/40">
                                  {isInPlan
                                    ? "Already in your plan"
                                    : "Add to supply plan"}
                                </p>
                              </div>

                              <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                                  isInPlan || wasJustAdded
                                    ? "bg-(--secondary) text-white"
                                    : "bg-black/5 text-black/40 group-hover:bg-(--secondary) group-hover:text-white"
                                }`}
                              >
                                {isInPlan ||
                                wasJustAdded ? (
                                  <Check size={16} />
                                ) : (
                                  <Plus size={17} />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="border-t border-black/8 bg-white/70 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">
                    {items.length}{" "}
                    {items.length === 1
                      ? "produce selected"
                      : "produce items selected"}
                  </p>

                  <p className="mt-0.5 text-xs text-black/40">
                    You can change quantities next.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closePicker}
                  className="rounded-full bg-(--secondary) px-5 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OPTION PICKER */}
      {activeOption && (
        <div
          className="fixed inset-0 z-110 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="option-picker-title"
        >
          <div className="w-full max-w-lg overflow-hidden rounded-t-4xl bg-(--background) text-(--foreground) shadow-2xl sm:rounded-4xl">
            <div className="flex items-start justify-between gap-4 border-b border-black/8 p-5 sm:p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--primary)/45">
                  Supply plan
                </p>

                <h3
                  id="option-picker-title"
                  className="mt-1 font-display text-2xl font-semibold tracking-tight"
                >
                  {activeOption === "frequency"
                    ? "How often do you need delivery?"
                    : "What type of business are you?"}
                </h3>
              </div>

              <button
                type="button"
                onClick={closeOptionPicker}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/8 text-black/40 transition-colors hover:bg-black/3 hover:text-black"
                aria-label="Close options"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto p-5 sm:p-6">
              {activeOption === "frequency" ? (
                <div className="space-y-2">
                  {frequencies.map((option) => {
                    const selected =
                      frequency === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setFrequency(option.value);
                          setActiveOption(null);
                        }}
                        className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 ${
                          selected
                            ? "border-(--primary) bg-(--primary)/5"
                            : "border-black/7 bg-white/50 hover:bg-white"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            selected
                              ? "bg-(--secondary) text-white"
                              : "bg-black/5 text-black/35"
                          }`}
                        >
                          {selected ? (
                            <Check size={17} />
                          ) : (
                            <div className="h-2 w-2 rounded-full bg-current" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold">
                            {option.value}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-black/45">
                            {option.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {businessTypes.map((type) => {
                    const selected =
                      businessType === type;

                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setBusinessType(type);
                          setActiveOption(null);
                        }}
                        className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 ${
                          selected
                            ? "border-(--primary) bg-(--primary)/5"
                            : "border-black/7 bg-white/50 hover:bg-white"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            selected
                              ? "bg-(--secondary) text-white"
                              : "bg-black/5 text-black/35"
                          }`}
                        >
                          {selected ? (
                            <Check size={17} />
                          ) : (
                            <div className="h-2 w-2 rounded-full bg-current" />
                          )}
                        </div>

                        <p className="text-sm font-semibold">
                          {type}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REQUEST MODAL */}
      {step === "request" && (
        <div
          className="fixed inset-0 z-120 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="request-title"
        >
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-4xl bg-(--background) text-(--foreground) shadow-2xl sm:max-h-[88vh] sm:rounded-4xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/8 bg-(--background)/95 p-5 backdrop-blur-xl sm:p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--primary)/45">
                  Final step
                </p>

                <h3
                  id="request-title"
                  className="mt-1 font-display text-2xl font-semibold tracking-tight"
                >
                  Tell us where to reach you
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setStep("review")}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/8 text-black/40 transition-colors hover:bg-black/3 hover:text-black"
                aria-label="Close request form"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              <SupplyRequestForm
                frequency={frequency}
                businessType={businessType}
                onBack={() => setStep("review")}
                onSuccess={handleRequestReceived}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}