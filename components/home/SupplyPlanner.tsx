"use client";

import { useMemo, useState } from "react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import {
  ArrowRight,
  Check,
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

const frequencies = [
  "Weekly",
  "Twice a week",
  "Multiple times a week",
  "Not sure yet",
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

const frequencyDescriptions: Record<string, string> = {
  Weekly: "One delivery per week",
  "Twice a week": "Two deliveries per week",
  "Multiple times a week":
    "We'll discuss the best delivery schedule",
  "Not sure yet":
    "We'll help you determine a suitable schedule",
};

type PlannerStep = "plan" | "request" | "received";

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

  const handleQuantityChange = (
    id: string,
    quantity: number
  ) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }

    updateQuantity(
      id,
      Math.min(quantity, MAX_QUANTITY)
    );
  };

  const handleReview = () => {
    if (items.length === 0) return;

    setStep("request");
  };

  const handleRequestReceived = () => {
    setStep("received");
  };

  const handleStartNewPlan = () => {
    clearPlan();
    setFrequency("Weekly");
    setBusinessType("Restaurant");
    setStep("plan");
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

  const frequencyDescription =
    frequencyDescriptions[frequency];

  const planningCopy =
    frequency === "Not sure yet"
      ? "Not sure about your volume? Give us your best estimate and our team can help you work out a suitable supply plan."
      : "These quantities are estimates. We'll confirm your requirements and delivery schedule with you.";

  const filteredProductGroups = useMemo(() => {
    const query = productQuery.trim().toLowerCase();

    if (!query) return productGroups;

    return productGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((product) =>
          product.name.toLowerCase().includes(query)
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [productQuery]);

  const closePicker = () => {
    setIsPickerOpen(false);
    setProductQuery("");
  };

  return (
    <>
      <section
        id="supply-planner"
        className="bg-(--primary) py-24 text-(--primary-foreground) sm:py-32"
      >
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-20">
            {/* =====================================================
                LEFT SIDE
            ====================================================== */}
            <div className="lg:sticky lg:top-24">
              <SectionHeading
                eyebrow="Supply planner"
                title="Tell us what your kitchen needs."
                description="Build a simple supply plan based on the produce your business uses. We'll use it to understand your requirements and prepare the right supply."
                theme="dark"
              />

              <div className="mt-8 hidden items-center gap-3 text-xs text-(--primary-foreground)/45 lg:flex">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-(--primary-foreground)/20 text-(--primary-foreground)/70">
                  1
                </span>

                <span>Plan your supply</span>

                <span className="h-px w-8 bg-(--primary-foreground)/15" />

                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-(--primary-foreground)/20 text-(--primary-foreground)/70">
                  2
                </span>

                <span>Send request</span>
              </div>
            </div>

            {/* =====================================================
                MAIN CARD
            ====================================================== */}
            <div className="overflow-hidden rounded-4xl bg-(--surface) text-(--primary) shadow-[0_25px_80px_rgba(0,0,0,0.16)]">

              {/* ===================================================
                  PLAN STATE
              ==================================================== */}
              {step === "plan" && (
                <>
                  <div className="border-b border-(--primary)/10 px-6 py-5 sm:px-8">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-(--primary)/45">
                          Build your plan
                        </p>

                        <h3 className="mt-1 text-lg font-semibold tracking-tight">
                          Choose what you need
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-8 rounded-full bg-(--primary)" />
                        <span className="h-1.5 w-8 rounded-full bg-(--primary)/15" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    {/* PRODUCE */}
                    <div>
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold">
                            Your produce
                          </p>

                          <p className="mt-1 text-xs text-(--foreground)/45">
                            Choose what your business typically needs.
                          </p>
                        </div>

                        {items.length > 0 && (
                          <button
                            type="button"
                            onClick={clearPlan}
                            className="text-xs font-medium text-(--foreground)/45 transition-colors hover:text-(--primary)"
                          >
                            Clear all
                          </button>
                        )}
                      </div>

                      {/* EMPTY STATE */}
                      {items.length === 0 ? (
                        <button
                          type="button"
                          onClick={() =>
                            setIsPickerOpen(true)
                          }
                          className="group mt-5 w-full rounded-3xl border border-dashed border-(--primary)/15 bg-(--background)/40 px-6 py-9 text-center transition-colors hover:border-(--primary)/30 hover:bg-(--background)/70"
                        >
                          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-(--primary)/7">
                            <Sprout
                              size={21}
                              strokeWidth={1.7}
                              className="text-(--primary)"
                              aria-hidden="true"
                            />
                          </span>

                          <span className="mt-4 block text-sm font-semibold">
                            Add produce to your plan
                          </span>

                          <span className="mx-auto mt-2 block max-w-sm text-xs leading-relaxed text-(--foreground)/50">
                            Select the greens and herbs your
                            business uses, then set your typical
                            quantity.
                          </span>

                          <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-(--primary) px-4 py-2.5 text-xs font-semibold text-(--primary-foreground) transition-transform group-hover:-translate-y-0.5">
                            Browse produce
                            <ArrowRight
                              size={14}
                              aria-hidden="true"
                            />
                          </span>
                        </button>
                      ) : (
                        <div className="mt-5">
                          <div className="space-y-2">
                            {items.slice(0, 4).map((item) => {
                              const atMax =
                                item.quantity >= MAX_QUANTITY;

                              return (
                                <div
                                  key={item.id}
                                  className="rounded-2xl border border-(--primary)/10 bg-(--background)/45 px-4 py-3"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--primary)/7">
                                      <Sprout
                                        size={16}
                                        strokeWidth={1.7}
                                        className="text-(--primary)"
                                        aria-hidden="true"
                                      />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <p className="truncate text-sm font-semibold">
                                        {item.name}
                                      </p>

                                      <p className="mt-0.5 text-[11px] text-(--foreground)/45">
                                        {item.quantity}{" "}
                                        {item.unit} per delivery
                                      </p>
                                    </div>

                                    <div className="flex shrink-0 items-center rounded-full border border-(--primary)/10 bg-(--surface)">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleQuantityChange(
                                            item.id,
                                            item.quantity - 1
                                          )
                                        }
                                        aria-label={
                                          item.quantity === 1
                                            ? `Remove ${item.name}`
                                            : `Decrease ${item.name} quantity`
                                        }
                                        className="flex h-8 w-8 items-center justify-center rounded-full text-(--primary)/70 transition-colors hover:bg-(--primary)/5 hover:text-(--primary)"
                                      >
                                        <Minus
                                          size={13}
                                          aria-hidden="true"
                                        />
                                      </button>

                                      <span
                                        aria-live="polite"
                                        className="min-w-14 text-center text-[11px] font-semibold"
                                      >
                                        {item.quantity}{" "}
                                        {item.unit}
                                      </span>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleQuantityChange(
                                            item.id,
                                            item.quantity + 1
                                          )
                                        }
                                        aria-label={`Increase ${item.name} quantity`}
                                        disabled={atMax}
                                        className="flex h-8 w-8 items-center justify-center rounded-full text-(--primary)/70 transition-colors hover:bg-(--primary)/5 hover:text-(--primary) disabled:cursor-not-allowed disabled:opacity-25"
                                      >
                                        <Plus
                                          size={13}
                                          aria-hidden="true"
                                        />
                                      </button>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeItem(item.id)
                                      }
                                      aria-label={`Remove ${item.name}`}
                                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-(--foreground)/30 transition-colors hover:bg-(--primary)/5 hover:text-(--primary)"
                                    >
                                      <Trash2
                                        size={14}
                                        aria-hidden="true"
                                      />
                                    </button>
                                  </div>

                                  {atMax && (
                                    <p className="mt-2 text-right text-[10px] text-(--foreground)/40">
                                      Bulk volume will be confirmed
                                      directly.
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {items.length > 4 && (
                            <p className="mt-2 text-center text-[11px] text-(--foreground)/40">
                              + {items.length - 4} more produce item
                              {items.length - 4 === 1
                                ? ""
                                : "s"}
                            </p>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              setIsPickerOpen(true)
                            }
                            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-(--primary)/12 px-4 py-3 text-xs font-semibold text-(--primary)/65 transition-colors hover:border-(--primary)/25 hover:bg-(--primary)/3 hover:text-(--primary)"
                          >
                            <Plus
                              size={14}
                              aria-hidden="true"
                            />
                            Add produce
                          </button>
                        </div>
                      )}
                    </div>

                    {/* FREQUENCY + BUSINESS */}
                    <div className="mt-8 grid gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="frequency"
                          className="text-sm font-semibold"
                        >
                          Delivery frequency
                        </label>

                        <select
                          id="frequency"
                          value={frequency}
                          onChange={(event) =>
                            setFrequency(event.target.value)
                          }
                          className="mt-2.5 w-full rounded-xl border border-(--primary)/12 bg-transparent px-3.5 py-3 text-sm outline-none transition-colors focus:border-(--primary)/35 focus:ring-2 focus:ring-(--primary)/8"
                        >
                          {frequencies.map((option) => (
                            <option
                              key={option}
                              value={option}
                            >
                              {option}
                            </option>
                          ))}
                        </select>

                        <p className="mt-1.5 text-[11px] text-(--foreground)/45">
                          {frequencyDescription}
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="business"
                          className="text-sm font-semibold"
                        >
                          Business type
                        </label>

                        <select
                          id="business"
                          value={businessType}
                          onChange={(event) =>
                            setBusinessType(event.target.value)
                          }
                          className="mt-2.5 w-full rounded-xl border border-(--primary)/12 bg-transparent px-3.5 py-3 text-sm outline-none transition-colors focus:border-(--primary)/35 focus:ring-2 focus:ring-(--primary)/8"
                        >
                          {businessTypes.map((option) => (
                            <option
                              key={option}
                              value={option}
                            >
                              {option}
                            </option>
                          ))}
                        </select>

                        <p className="mt-1.5 text-[11px] text-(--foreground)/45">
                          Helps us understand your operation.
                        </p>
                      </div>
                    </div>

                    {/* SUMMARY */}
                    {items.length > 0 && (
                      <div className="mt-8 border-t border-(--primary)/10 pt-7">
                        <div>
                          <p className="text-sm font-semibold">
                            Supply plan summary
                          </p>

                          <p className="mt-1 text-xs text-(--foreground)/45">
                            Estimated volume based on your selections.
                          </p>
                        </div>

                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                          <div className="rounded-2xl bg-(--background)/65 p-4">
                            <p className="text-[10px] font-medium uppercase tracking-widest text-(--foreground)/40">
                              Per delivery
                            </p>

                            <p className="mt-2 text-sm font-semibold">
                              {deliverySummary}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-(--primary)/6 p-4">
                            <p className="text-[10px] font-medium uppercase tracking-widest text-(--foreground)/40">
                              Estimated weekly
                            </p>

                            {weeklyTotals ? (
                              <p className="mt-2 text-sm font-semibold">
                                {weeklyTotals
                                  .map(
                                    ({ quantity, unit }) =>
                                      `${quantity} ${unit}`
                                  )
                                  .join(", ")}
                              </p>
                            ) : (
                              <p className="mt-2 text-xs leading-relaxed text-(--foreground)/50">
                                We&apos;ll determine this with you.
                              </p>
                            )}
                          </div>
                        </div>

                        <p className="mt-4 text-[11px] leading-relaxed text-(--foreground)/45">
                          {planningCopy}
                        </p>
                      </div>
                    )}

                    {/* CTA */}
                    <div className="mt-8">
                      <Button
                        type="button"
                        variant="primary"
                        onClick={handleReview}
                        disabled={items.length === 0}
                      >
                        Review supply plan
                        <ArrowRight
                          size={16}
                          className="ml-1"
                          aria-hidden="true"
                        />
                      </Button>

                      {items.length === 0 && (
                        <p className="mt-2 text-center text-[11px] text-(--foreground)/40">
                          Add produce to continue.
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* ===================================================
                  RECEIVED STATE
              ==================================================== */}
              {step === "received" && (
                <>
                  {/* HEADER */}
                  <div className="border-b border-(--primary)/10 px-6 py-6 sm:px-8 sm:py-7">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-(--primary)/8">
                        <Check
                          size={20}
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-(--primary)/45">
                          Request received
                        </p>

                        <h3 className="mt-1 text-xl font-semibold tracking-tight">
                          Your supply request is with us.
                        </h3>

                        <p className="mt-2 max-w-lg text-sm leading-relaxed text-(--foreground)/55">
                          Thanks for sharing your requirements. We&apos;ll
                          review your request and get in touch to
                          confirm availability and delivery details.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    {/* REQUEST SUMMARY */}
                    <div>
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold">
                            Your request
                          </p>

                          <p className="mt-1 text-xs text-(--foreground)/45">
                            What you&apos;ve asked us to supply.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setIsPickerOpen(true)
                          }
                          className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-(--primary)/65 transition-colors hover:text-(--primary)"
                        >
                          <Pencil
                            size={13}
                            aria-hidden="true"
                          />
                          Edit produce
                        </button>
                      </div>

                      {/* PRODUCE LIST */}
                      <div className="mt-4 overflow-hidden rounded-2xl border border-(--primary)/10">
                        {items.map((item, index) => (
                          <div
                            key={item.id}
                            className={`flex items-center justify-between gap-4 px-4 py-3.5 ${
                              index !== items.length - 1
                                ? "border-b border-(--primary)/8"
                                : ""
                            }`}
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--primary)/7">
                                <Sprout
                                  size={15}
                                  strokeWidth={1.7}
                                  aria-hidden="true"
                                />
                              </div>

                              <p className="truncate text-sm font-medium">
                                {item.name}
                              </p>
                            </div>

                            <p className="shrink-0 text-sm font-semibold">
                              {item.quantity}{" "}
                              <span className="text-xs font-medium text-(--foreground)/45">
                                {item.unit}
                              </span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* DELIVERY + BUSINESS */}
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-(--background)/65 p-4">
                        <p className="text-[10px] font-medium uppercase tracking-widest text-(--foreground)/40">
                          Delivery frequency
                        </p>

                        <p className="mt-2 text-sm font-semibold">
                          {frequency}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-(--background)/65 p-4">
                        <p className="text-[10px] font-medium uppercase tracking-widest text-(--foreground)/40">
                          Business type
                        </p>

                        <p className="mt-2 text-sm font-semibold">
                          {businessType}
                        </p>
                      </div>
                    </div>

                    {/* WEEKLY ESTIMATE */}
                    {weeklyTotals && (
                      <div className="mt-3 rounded-2xl bg-(--primary)/6 p-4">
                        <p className="text-[10px] font-medium uppercase tracking-widest text-(--foreground)/40">
                          Estimated weekly volume
                        </p>

                        <p className="mt-2 text-sm font-semibold">
                          {weeklyTotals
                            .map(
                              ({ quantity, unit }) =>
                                `${quantity} ${unit}`
                            )
                            .join(", ")}
                        </p>
                      </div>
                    )}

                    {/* FOOTER ACTIONS */}
                    <div className="mt-8 border-t border-(--primary)/10 pt-6">
                      <p className="text-center text-xs text-(--foreground)/45">
                        Need to make a change? You can edit your
                        produce selections below.
                      </p>

                      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                        <button
                          type="button"
                          onClick={() =>
                            setIsPickerOpen(true)
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-(--primary)/15 px-5 py-3 text-xs font-semibold text-(--primary) transition-colors hover:bg-(--primary)/5"
                        >
                          <Pencil
                            size={14}
                            aria-hidden="true"
                          />
                          Edit produce
                        </button>

                        <button
                          type="button"
                          onClick={handleStartNewPlan}
                          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-(--primary) px-5 py-3 text-xs font-semibold text-(--primary-foreground) transition-transform hover:-translate-y-0.5"
                        >
                          Start a new plan
                          <ArrowRight
                            size={14}
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ============================================================
          SUPPLY REQUEST MODAL
      ============================================================ */}
      {step === "request" && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="supply-request-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setStep("plan");
            }
          }}
        >
          <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-4xl bg-(--surface) text-(--primary) shadow-2xl sm:rounded-4xl">
            <div className="flex items-center justify-between border-b border-(--primary)/10 px-6 py-5 sm:px-8">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-(--primary)/45">
                  Supply request
                </p>

                <h2
                  id="supply-request-title"
                  className="mt-1 text-xl font-semibold tracking-tight"
                >
                  Complete your request
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setStep("plan")}
                aria-label="Close supply request"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-(--primary)/10 text-(--primary)/60 transition-colors hover:bg-(--primary)/5 hover:text-(--primary)"
              >
                <X
                  size={18}
                  aria-hidden="true"
                />
              </button>
            </div>

            <div className="overflow-y-auto p-6 sm:p-8">
              <SupplyRequestForm
                frequency={frequency}
                businessType={businessType}
                onBack={() => setStep("plan")}
                onSuccess={handleRequestReceived}
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          PRODUCE PICKER
      ============================================================ */}
      {isPickerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="produce-picker-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closePicker();
            }
          }}
        >
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-4xl bg-(--surface) text-(--primary) shadow-2xl sm:rounded-4xl">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-(--primary)/10 px-6 py-5 sm:px-7">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-(--primary)/45">
                  Supply planner
                </p>

                <h2
                  id="produce-picker-title"
                  className="mt-1 text-xl font-semibold tracking-tight"
                >
                  Choose your produce
                </h2>

                <p className="mt-1 text-xs text-(--foreground)/45">
                  Add the produce your business regularly uses.
                </p>
              </div>

              <button
                type="button"
                onClick={closePicker}
                aria-label="Close produce picker"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-(--primary)/10 text-(--primary)/60 transition-colors hover:bg-(--primary)/5 hover:text-(--primary)"
              >
                <X
                  size={18}
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* SEARCH + PRODUCTS */}
            <div className="overflow-y-auto p-6 sm:p-7">
              <label className="relative block">
                <span className="sr-only">
                  Search produce
                </span>

                <Search
                  size={16}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--foreground)/40"
                />

                <input
                  type="search"
                  value={productQuery}
                  onChange={(event) =>
                    setProductQuery(event.target.value)
                  }
                  placeholder="Search produce"
                  className="w-full rounded-2xl border border-(--primary)/12 bg-(--background)/45 py-3 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-(--foreground)/40 focus:border-(--primary)/35 focus:ring-2 focus:ring-(--primary)/8"
                />
              </label>

              <div className="mt-6 space-y-6">
                {filteredProductGroups.map((group) => (
                  <div key={group.title}>
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-(--foreground)/45">
                      {group.title}
                    </p>

                    <div className="grid gap-2 sm:grid-cols-2">
                      {group.items.map((product) => {
                        const isInPlan = items.some(
                          (item) =>
                            item.id === product.id
                        );

                        return (
                          <button
                            key={product.id}
                            type="button"
                            disabled={isInPlan}
                            onClick={() =>
                              addItem({
                                id: product.id,
                                name: product.name,
                                unit: "kg",
                              })
                            }
                            className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition-colors ${
                              isInPlan
                                ? "border-(--primary)/15 bg-(--primary)/5 text-(--primary)/55"
                                : "border-(--primary)/10 hover:border-(--primary)/30 hover:bg-(--primary)/5"
                            }`}
                          >
                            <span className="flex min-w-0 items-center gap-2">
                              <Sprout
                                size={15}
                                className="shrink-0 text-(--secondary)"
                                aria-hidden="true"
                              />

                              <span className="truncate">
                                {product.name}
                              </span>
                            </span>

                            <span className="shrink-0 text-xs font-medium">
                              {isInPlan ? "Added" : "Add"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {filteredProductGroups.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-(--primary)/15 px-5 py-8 text-center">
                    <p className="text-sm font-semibold">
                      No produce found
                    </p>

                    <p className="mt-1 text-xs text-(--foreground)/50">
                      Try a different search term.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* FOOTER */}
            <div className="border-t border-(--primary)/10 px-6 py-4 sm:px-7">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs text-(--foreground)/45">
                  {items.length}{" "}
                  {items.length === 1 ? "item" : "items"} in your
                  plan
                </p>

                <button
                  type="button"
                  onClick={closePicker}
                  className="rounded-full bg-(--primary) px-5 py-2.5 text-xs font-semibold text-(--primary-foreground)"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

