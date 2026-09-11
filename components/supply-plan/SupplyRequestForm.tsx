"use client";

import { useActionState, useEffect } from "react";
import { ArrowLeft, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { useSupplyPlan } from "@/components/supply-plan/SupplyPlanProvider";
import {
  submitSupplyRequest,
  type SupplyRequestState,
} from "@/app/actions/supply-request";

type SupplyRequestFormProps = {
  frequency: string;
  businessType: string;
  onBack: () => void;
  onSuccess: () => void;
};

const initialState: SupplyRequestState = {
  success: false,
  message: "",
};

export default function SupplyRequestForm({
  frequency,
  businessType,
  onBack,
  onSuccess,
}: SupplyRequestFormProps) {
  const { items } = useSupplyPlan();

  const [state, formAction, pending] = useActionState(
    submitSupplyRequest,
    initialState
  );

  useEffect(() => {
    if (state.success) onSuccess();
  }, [onSuccess, state.success]);

  const totalQuantity = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  if (state.success) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-(--primary)/10">
          <Check
            size={24}
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>

        <h3 className="mt-6 font-(--font-display) text-3xl tracking-[-0.03em]">
          Request received
        </h3>

        <p className="mt-3 max-w-md text-sm leading-relaxed text-(--foreground)/60">
          Thanks for sharing your supply requirements.
          We&apos;ll review your request and get back to you
          soon.
        </p>

        <Button
          type="button"
          variant="primary"
          onClick={onBack}
          className="mt-7"
        >
          Back to your supply plan
        </Button>
      </div>
    );
  }

  const fieldErrors = state.fieldErrors ?? {};

  return (
    <form action={formAction} aria-busy={pending}>
      <button
        type="button"
        onClick={onBack}
        className="mb-7 inline-flex items-center gap-2 text-sm text-(--foreground)/55 transition-colors hover:text-(--primary)"
      >
        <ArrowLeft
          size={15}
          aria-hidden="true"
        />
        Back to supply plan
      </button>

      <div>
        <h3 className="font-(--font-display) text-2xl tracking-[-0.03em]">
          Request your supply
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-(--foreground)/55">
          Tell us how to reach you and where your produce
          needs to be delivered.
        </p>
      </div>

      {/* Full name */}
      <div className="mt-7">
        <label
          htmlFor="fullName"
          className="text-sm font-medium"
        >
          Full name
        </label>

        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          placeholder="Your name"
          required
          aria-invalid={Boolean(fieldErrors.fullName)}
          aria-describedby={fieldErrors.fullName ? "fullName-error" : undefined}
          className="mt-3 w-full rounded-xl border border-(--primary)/15 bg-transparent px-4 py-3 text-sm outline-none transition-colors placeholder:text-(--foreground)/35 focus:border-(--primary)/40 focus:ring-2 focus:ring-(--primary)/10"
        />

        {fieldErrors.fullName?.[0] && (
          <p id="fullName-error" className="mt-2 text-xs text-red-600">
            {fieldErrors.fullName[0]}
          </p>
        )}
      </div>

      {/* Business name */}
      <div className="mt-6">
        <label
          htmlFor="businessName"
          className="text-sm font-medium"
        >
          Business name
        </label>

        <input
          id="businessName"
          name="businessName"
          type="text"
          autoComplete="organization"
          placeholder="Your business"
          required
          aria-invalid={Boolean(fieldErrors.businessName)}
          aria-describedby={fieldErrors.businessName ? "businessName-error" : undefined}
          className="mt-3 w-full rounded-xl border border-(--primary)/15 bg-transparent px-4 py-3 text-sm outline-none transition-colors placeholder:text-(--foreground)/35 focus:border-(--primary)/40 focus:ring-2 focus:ring-(--primary)/10"
        />

        {fieldErrors.businessName?.[0] && (
          <p id="businessName-error" className="mt-2 text-xs text-red-600">
            {fieldErrors.businessName[0]}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="mt-6">
        <label
          htmlFor="email"
          className="text-sm font-medium"
        >
          Email address
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@business.com"
          required
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
          className="mt-3 w-full rounded-xl border border-(--primary)/15 bg-transparent px-4 py-3 text-sm outline-none transition-colors placeholder:text-(--foreground)/35 focus:border-(--primary)/40 focus:ring-2 focus:ring-(--primary)/10"
        />

        {fieldErrors.email?.[0] && (
          <p id="email-error" className="mt-2 text-xs text-red-600">
            {fieldErrors.email[0]}
          </p>
        )}
      </div>

      {/* Phone */}
      <div className="mt-6">
        <label
          htmlFor="phone"
          className="text-sm font-medium"
        >
          Phone number
        </label>

        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+234..."
          required
          aria-invalid={Boolean(fieldErrors.phone)}
          aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
          className="mt-3 w-full rounded-xl border border-(--primary)/15 bg-transparent px-4 py-3 text-sm outline-none transition-colors placeholder:text-(--foreground)/35 focus:border-(--primary)/40 focus:ring-2 focus:ring-(--primary)/10"
        />

        {fieldErrors.phone?.[0] && (
          <p id="phone-error" className="mt-2 text-xs text-red-600">
            {fieldErrors.phone[0]}
          </p>
        )}
      </div>

      {/* Delivery location */}
      <div className="mt-6">
        <label
          htmlFor="deliveryLocation"
          className="text-sm font-medium"
        >
          Delivery location
        </label>

        <input
          id="deliveryLocation"
          name="deliveryLocation"
          type="text"
          autoComplete="street-address"
          placeholder="Area / address"
          required
          aria-invalid={Boolean(fieldErrors.deliveryLocation)}
          aria-describedby={fieldErrors.deliveryLocation ? "deliveryLocation-error" : undefined}
          className="mt-3 w-full rounded-xl border border-(--primary)/15 bg-transparent px-4 py-3 text-sm outline-none transition-colors placeholder:text-(--foreground)/35 focus:border-(--primary)/40 focus:ring-2 focus:ring-(--primary)/10"
        />

        {fieldErrors.deliveryLocation?.[0] && (
          <p id="deliveryLocation-error" className="mt-2 text-xs text-red-600">
            {fieldErrors.deliveryLocation[0]}
          </p>
        )}
      </div>

      {/* Notes */}
      <div className="mt-6">
        <label
          htmlFor="notes"
          className="text-sm font-medium"
        >
          Additional notes
          <span className="ml-1 font-normal text-(--foreground)/40">
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
          className="mt-3 w-full resize-none rounded-xl border border-(--primary)/15 bg-transparent px-4 py-3 text-sm outline-none transition-colors placeholder:text-(--foreground)/35 focus:border-(--primary)/40 focus:ring-2 focus:ring-(--primary)/10"
        />

        {fieldErrors.notes?.[0] && (
          <p id="notes-error" className="mt-2 text-xs text-red-600">
            {fieldErrors.notes[0]}
          </p>
        )}
      </div>

      {/* Hidden supply data */}
      <input
        type="hidden"
        name="frequency"
        value={frequency}
      />

      <input
        type="hidden"
        name="businessType"
        value={businessType}
      />

      <input
        type="hidden"
        name="items"
        value={JSON.stringify(items)}
      />

      {/* Supply summary */}
      <div className="mt-7 rounded-2xl border border-(--primary)/10 bg-(--background)/50 p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            Your supply plan
          </p>

          <span className="text-xs text-(--foreground)/50">
            {totalQuantity} kg
          </span>
        </div>

        <div className="mt-4 space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-(--foreground)/60">
                {item.name}
              </span>

              <span className="font-medium">
                {item.quantity} kg
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-(--primary)/10 pt-4 text-xs text-(--foreground)/50">
          {businessType} · {frequency}
        </div>
      </div>

      {/* Server error */}
      {!state.success && state.message && (
        <p className="mt-5 text-sm text-red-600" role="alert" aria-live="polite">
          {state.message}
        </p>
      )}

      {/* Submit */}
      <div className="mt-7">
        <Button
          type="submit"
          variant="primary"
          disabled={pending || items.length === 0}
        >
          {pending
            ? "Sending request..."
            : "Send supply request →"}
        </Button>
      </div>
    </form>
  );
}