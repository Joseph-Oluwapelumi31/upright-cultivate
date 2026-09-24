"use client";

import { useActionState, useEffect, useState } from "react";
import { Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { useSupplyPlan } from "@/components/supply-plan/SupplyPlanProvider";
import {
  submitSupplyRequest,
  type SupplyRequestState,
} from "@/actions/supply-request";
import Link from "next/link";

interface Business {
  id: string;
  name: string;
}

interface Location {
  id: string;
  name: string;
}

type SupplyCheckoutFormProps = {
  business: Business;
  location: Location;
};

const initialState: SupplyRequestState = {
  success: false,
  message: "",
};

export default function SupplyCheckoutForm({
  business,
  location,
}: SupplyCheckoutFormProps) {
  const { items, clearPlan } = useSupplyPlan();

  const [state, formAction, pending] = useActionState(
    submitSupplyRequest,
    initialState
  );

  const [submissionKey, setSubmissionKey] = useState("");
  const [frequency, setFrequency] = useState("Weekly");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSubmissionKey(crypto.randomUUID());
    const savedFrequency = window.localStorage.getItem("upright-supply-frequency");
    if (savedFrequency) {

      setFrequency(savedFrequency);
    }
  }, []);

  useEffect(() => {
    if (state.success) {
      // Clear plan only after successful submission
      clearPlan();
    }
  }, [state.success, clearPlan]);

  const totalQuantity = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  if (state.success) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Check
            size={24}
            strokeWidth={2}
            className="text-primary"
            aria-hidden="true"
          />
        </div>

        <h3 className="mt-6 font-display text-3xl tracking-tight">
          Request received
        </h3>

        <p className="mt-3 max-w-md text-sm leading-relaxed text-foreground/60">
          Thanks for sharing your supply requirements.
          We&apos;ll review your request and get back to you
          soon.
        </p>
        
        <p className="mt-2 text-xs text-primary font-medium">
          {state.message}
        </p>

        <Button
          href="/dashboard"
          variant="primary"
          className="mt-7"
        >
          Go to Dashboard
        </Button>
      </div>
    );
  }

  const fieldErrors = state.fieldErrors ?? {};

  return (
    <div className="mx-auto max-w-xl p-6">
      <form action={formAction} aria-busy={pending}>
        <div>
          <h3 className="font-display text-2xl tracking-tight">
            Finalize your request
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-foreground/55">
            Review your delivery details before submitting the supply request.
          </p>
        </div>
        
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-primary/10 bg-background p-4">
            <p className="text-xs text-foreground/40">Business</p>
            <p className="mt-1.5 text-sm font-semibold">{business.name}</p>
            <div className="mt-2">
              <Link href="/dashboard" className="text-xs text-primary hover:underline">Change</Link>
            </div>
          </div>
          <div className="rounded-xl border border-primary/10 bg-background p-4">
            <p className="text-xs text-foreground/40">Location</p>
            <p className="mt-1.5 text-sm font-semibold">{location.name}</p>
            <div className="mt-2">
              <Link href="/dashboard" className="text-xs text-primary hover:underline">Change</Link>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-6">
          <label
            htmlFor="notes"
            className="text-sm font-medium"
          >
            Additional notes
            <span className="ml-1 font-normal text-foreground/40">
              (optional)
            </span>
          </label>

          <textarea
            id="notes"
            name="notes"
            rows={4}
            placeholder="Anything else we should know about your supply needs?"
            aria-invalid={Boolean(fieldErrors.notes)}
            aria-describedby={fieldErrors.notes ? "notes-error" : undefined}
            className="mt-3 w-full resize-none rounded-xl border border-primary/15 bg-transparent px-4 py-3 text-sm outline-none transition-colors placeholder:text-foreground/35 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
          />

          {fieldErrors.notes?.[0] && (
            <p id="notes-error" className="mt-2 text-xs text-red-600">
              {fieldErrors.notes[0]}
            </p>
          )}
        </div>

        {/* Hidden supply data */}
        <input type="hidden" name="submissionKey" value={submissionKey} />
        <input type="hidden" name="businessId" value={business.id} />
        <input type="hidden" name="locationId" value={location.id} />
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

        {/* Supply summary */}
        <div className="mt-7 rounded-2xl border border-primary/10 bg-background/50 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              Your supply plan
            </p>

            <span className="text-xs text-foreground/50">
              {totalQuantity} kg
            </span>
          </div>

          <div className="mt-4 space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-foreground/60">
                  {item.name}
                </span>

                <span className="font-medium">
                  {item.quantity} kg
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-primary/10 pt-4 text-xs text-foreground/50">
            {frequency}
          </div>
        </div>

        {/* Server error */}
        {!state.success && state.message && (
          <p className="mt-5 text-sm text-red-600" role="alert" aria-live="polite">
            {state.message}
          </p>
        )}

        {/* Submit */}
        <div className="mt-7 flex items-center justify-between gap-4">
          <Link href="/supply" className="text-sm font-semibold text-foreground/55 hover:text-foreground">
            Back to plan
          </Link>
          <Button
            type="submit"
            variant="primary"
            disabled={pending || items.length === 0}
          >
            {pending
              ? "Sending request..."
              : "Submit Supply Request →"}
          </Button>
        </div>
      </form>
    </div>
  );
}
