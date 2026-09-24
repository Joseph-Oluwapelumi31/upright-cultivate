"use client";

import { useActionState, useEffect } from "react";
import { createLocationAction } from "@/actions/location";
import { selectLocationAction } from "@/actions/location-session";
import Button from "@/components/ui/Button";

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
}

export function LocationStep({
  businessId,
  locations,
  redirectTo = "/dashboard",
}: {
  businessId: string;
  locations: Location[];
  redirectTo?: string;
}) {
  const [state, formAction, isPending] = useActionState(
    async (prevState: unknown, formData: FormData) => {
      const input = {
        name: formData.get("name"),
        address: formData.get("address"),
        city: formData.get("city"),
        state: formData.get("state"),
        country: formData.get("country"),
        contactName: formData.get("contactName"),
        contactPhone: formData.get("contactPhone"),
      };

      const result = await createLocationAction(businessId, input);
      if (result.success && result.location) {
        await selectLocationAction(result.location.id, redirectTo);
      }
      return result;
    },
    null
  );

  useEffect(() => {
    if (locations.length === 1) {
      selectLocationAction(locations[0].id, redirectTo);
    }
  }, [locations, redirectTo]);

  if (locations.length === 1) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p>Loading your location...</p>
      </div>
    );
  }

  if (locations.length > 1) {
    return (
      <div className="mx-auto max-w-md p-6">
        <h2 className="mb-6 text-2xl font-bold">Select a Location</h2>
        <div className="flex flex-col gap-4">
          {locations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => selectLocationAction(loc.id, redirectTo)}
              className="flex flex-col items-start rounded-lg border p-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <span className="font-semibold">{loc.name}</span>
              <span className="text-sm text-gray-500">
                {loc.address}, {loc.city}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h2 className="mb-6 text-2xl font-bold">Create a Location</h2>
      <form action={formAction} className="flex flex-col gap-4">
        {state?.error && <p className="text-red-500">{state.error}</p>}

        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Location Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full rounded-md border p-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label
            htmlFor="address"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            required
            className="w-full rounded-md border p-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="city"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              required
              className="w-full rounded-md border p-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label
              htmlFor="state"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              State (Optional)
            </label>
            <input
              type="text"
              id="state"
              name="state"
              className="w-full rounded-md border p-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="country"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            required
            defaultValue="Nigeria"
            className="w-full rounded-md border p-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label
            htmlFor="contactName"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Contact Name (Optional)
          </label>
          <input
            type="text"
            id="contactName"
            name="contactName"
            className="w-full rounded-md border p-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label
            htmlFor="contactPhone"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Contact Phone (Optional)
          </label>
          <input
            type="text"
            id="contactPhone"
            name="contactPhone"
            className="w-full rounded-md border p-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <Button type="submit" disabled={isPending} className="mt-4">
          {isPending ? "Creating..." : "Create Location"}
        </Button>
      </form>
    </div>
  );
}
