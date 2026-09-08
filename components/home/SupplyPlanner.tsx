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
      className="bg-(--deep-moss) py-24 text-(--white) sm:py-32"
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
            className="rounded-4xl bg-(--white) p-7 text-(--deep-moss) sm:p-10"
          >
            <div>
              <label className="text-sm font-medium">
                What do you need?
              </label>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {produceOptions.map((produce) => (
                  <label
                    key={produce}
                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-(--deep-moss)/10 p-3 text-sm"
                  >
                    <input
                      type="checkbox"
                      name="produce"
                      value={produce}
                    />
                    {produce}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <label htmlFor="frequency" className="text-sm font-medium">
                Delivery frequency
              </label>

              <select
                id="frequency"
                className="mt-3 w-full rounded-xl border border-(--deep-moss)/15 bg-transparent px-4 py-3 outline-none"
              >
                <option>Weekly</option>
                <option>Twice a week</option>
                <option>Multiple times a week</option>
                <option>Not sure yet</option>
              </select>
            </div>

            <div className="mt-8">
              <label htmlFor="business" className="text-sm font-medium">
                Business type
              </label>

              <select
                id="business"
                className="mt-3 w-full rounded-xl border border-(--deep-moss)/15 bg-transparent px-4 py-3 outline-none"
              >
                <option>Restaurant</option>
                <option>Hotel</option>
                <option>Café</option>
                <option>Retail</option>
                <option>Catering</option>
                <option>Other</option>
              </select>
            </div>

            <div className="mt-8">
              <label htmlFor="volume" className="text-sm font-medium">
                Estimated weekly volume
              </label>

              <input
                id="volume"
                type="text"
                placeholder="e.g. 20kg"
                className="mt-3 w-full rounded-xl border border-(--deep-moss)/15 bg-transparent px-4 py-3 outline-none"
              />
            </div>

            <div className="mt-8">
              <Button>Request supply plan →</Button>
            </div>

            {submitted && (
              <p className="mt-5 text-sm text-(--olive)">
                Thanks. Your request has been captured.
              </p>
            )}
          </form>
        </div>
      </Container>
    </section>
  );
}