"use client";

import { useActionState, useEffect } from "react";
import { createBusinessAction } from "@/actions/business";
import { selectBusinessAction } from "@/actions/business-session";
import Button from "@/components/ui/Button";

interface Business {
  id: string;
  name: string;
  type: string;
}

export function BusinessStep({ businesses, redirectTo = "/dashboard" }: { businesses: Business[], redirectTo?: string }) {
  const [state, formAction, isPending] = useActionState(async (prevState: unknown, formData: FormData) => {
    const input = {
      name: formData.get("name"),
      type: formData.get("type"),
      contactName: formData.get("contactName"),
      contactEmail: formData.get("contactEmail"),
      contactPhone: formData.get("contactPhone"),
    };
    
    const result = await createBusinessAction(input);
    if (result.success && result.business) {
      await selectBusinessAction(result.business.id, redirectTo);
    }
    return result;
  }, null);

  useEffect(() => {
    if (businesses.length === 1) {
      selectBusinessAction(businesses[0].id, redirectTo);
    }
  }, [businesses, redirectTo]);

  if (businesses.length === 1) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p>Loading your business...</p>
      </div>
    );
  }

  if (businesses.length > 1) {
    return (
      <div className="mx-auto max-w-md p-6">
        <h2 className="mb-6 text-2xl font-bold">Select a Business</h2>
        <div className="flex flex-col gap-4">
          {businesses.map((b) => (
            <button
              key={b.id}
              onClick={() => selectBusinessAction(b.id, redirectTo)}
              className="flex flex-col items-start rounded-lg border p-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <span className="font-semibold">{b.name}</span>
              <span className="text-sm text-gray-500">{b.type}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h2 className="mb-6 text-2xl font-bold">Create a Business</h2>
      <form action={formAction} className="flex flex-col gap-4">
        {state?.error && <p className="text-red-500">{state.error}</p>}
        
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">Business Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full rounded-md border p-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="type" className="mb-1 block text-sm font-medium text-gray-700">Business Type</label>
          <select
            id="type"
            name="type"
            required
            className="w-full rounded-md border p-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="RESTAURANT">Restaurant</option>
            <option value="HOTEL">Hotel</option>
            <option value="CAFE">Cafe</option>
            <option value="RETAIL">Retail</option>
            <option value="CATERING">Catering</option>
            <option value="MEAL_PREP">Meal Prep</option>
            <option value="COMMERCIAL_KITCHEN">Commercial Kitchen</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="contactName" className="mb-1 block text-sm font-medium text-gray-700">Contact Name (Optional)</label>
          <input
            type="text"
            id="contactName"
            name="contactName"
            className="w-full rounded-md border p-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="contactEmail" className="mb-1 block text-sm font-medium text-gray-700">Contact Email (Optional)</label>
          <input
            type="email"
            id="contactEmail"
            name="contactEmail"
            className="w-full rounded-md border p-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="contactPhone" className="mb-1 block text-sm font-medium text-gray-700">Contact Phone (Optional)</label>
          <input
            type="text"
            id="contactPhone"
            name="contactPhone"
            className="w-full rounded-md border p-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <Button type="submit" disabled={isPending} className="mt-4">
          {isPending ? "Creating..." : "Create Business"}
        </Button>
      </form>
    </div>
  );
}
