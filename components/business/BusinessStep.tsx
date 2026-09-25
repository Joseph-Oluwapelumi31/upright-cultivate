"use client";

import { useActionState, useEffect } from "react";
import { createBusinessAction } from "@/actions/business";
import { selectBusinessAction } from "@/actions/business-session";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";

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
              className="flex flex-col items-start rounded-md border border-border p-4 hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <span className="font-semibold text-foreground">{b.name}</span>
              <span className="text-sm text-muted-foreground">{b.type}</span>
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
        {state?.error && <p className="text-error">{state.error}</p>}
        
        <div>
          <Label htmlFor="name" className="mb-2 block">Business Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            required
          />
        </div>

        <div>
          <Label htmlFor="type" className="mb-2 block">Business Type</Label>
          <Select
            id="type"
            name="type"
            required
          >
            <option value="RESTAURANT">Restaurant</option>
            <option value="HOTEL">Hotel</option>
            <option value="CAFE">Cafe</option>
            <option value="RETAIL">Retail</option>
            <option value="CATERING">Catering</option>
            <option value="MEAL_PREP">Meal Prep</option>
            <option value="COMMERCIAL_KITCHEN">Commercial Kitchen</option>
            <option value="OTHER">Other</option>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="contactName" className="mb-2 block">Contact Name (Optional)</Label>
          <Input
            type="text"
            id="contactName"
            name="contactName"
          />
        </div>

        <div>
          <Label htmlFor="contactEmail" className="mb-2 block">Contact Email (Optional)</Label>
          <Input
            type="email"
            id="contactEmail"
            name="contactEmail"
          />
        </div>

        <div>
          <Label htmlFor="contactPhone" className="mb-2 block">Contact Phone (Optional)</Label>
          <Input
            type="text"
            id="contactPhone"
            name="contactPhone"
          />
        </div>

        <Button type="submit" disabled={isPending} className="mt-4">
          {isPending ? "Creating..." : "Create Business"}
        </Button>
      </form>
    </div>
  );
}
