"use client";

import { FormEvent, useState } from "react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

const produceOptions = [
  "Lettuce",
  "Salad greens",
  "Cooking greens",
  "Basil",
  "Mint",
  "Coriander",
];

export default function SupplyPlanner() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section
      id="supply-planner"
      className="bg-(--primary) py-24 text-(--primary-foreground) sm:py-32"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionHeading
            eyebrow="Supply planner"
            title="Tell us what your kitchen needs."
            description="Give us a few details about your produce requirements and we'll use them to understand your supply needs."
          />

          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] bg-(--surface) p-7 text-(--primary) sm:p-10"
          >
            {/* Produce */}
            <div>
              <label className="text-sm font-medium">
                What do you need?
              </label>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {produceOptions.map((produce) => (
                  <label
                    key={produce}
                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-(--primary)/10 p-3 text-sm transition-colors hover:border-(--primary)/25 hover:bg-(--background)"
                  >
                    <input
                      type="checkbox"
                      name="produce"
                      value={produce}
                      className="accent-(--primary)"
                    />
                    {produce}
                  </label>
                ))}
              </div>
            </div>

            {/* Delivery frequency */}
            <div className="mt-8">
              <label htmlFor="frequency" className="text-sm font-medium">
                Delivery frequency
              </label>

              <select
                id="frequency"
                name="frequency"
                className="mt-3 w-full rounded-xl border border-(--primary)/15 bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-(--primary)/40 focus:ring-2 focus:ring-(--primary)/10"
              >
                <option>Weekly</option>
                <option>Twice a week</option>
                <option>Multiple times a week</option>
                <option>Not sure yet</option>
              </select>
            </div>

            {/* Business type */}
            <div className="mt-8">
              <label htmlFor="business" className="text-sm font-medium">
                Business type
              </label>

              <select
                id="business"
                name="business"
                className="mt-3 w-full rounded-xl border border-(--primary)/15 bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-(--primary)/40 focus:ring-2 focus:ring-(--primary)/10"
              >
                <option>Restaurant</option>
                <option>Hotel</option>
                <option>Café</option>
                <option>Retail</option>
                <option>Catering</option>
                <option>Other</option>
              </select>
            </div>

            {/* Weekly volume */}
            <div className="mt-8">
              <label htmlFor="volume" className="text-sm font-medium">
                Estimated weekly volume
              </label>

              <input
                id="volume"
                name="volume"
                type="text"
                placeholder="e.g. 20kg"
                className="mt-3 w-full rounded-xl border border-(--primary)/15 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-(--foreground)/35 transition-colors focus:border-(--primary)/40 focus:ring-2 focus:ring-(--primary)/10"
              />
            </div>

            {/* Submit */}
            <div className="mt-8">
              <Button type="submit" variant="primary">
                Request supply plan →
              </Button>
            </div>

            {submitted && (
              <p className="mt-5 text-sm text-(--secondary)">
                Thanks. Your request has been captured.
              </p>
            )}
          </form>
        </div>
      </Container>
    </section>
  );
}