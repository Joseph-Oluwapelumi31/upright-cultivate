"use client";

import { useActionState } from "react";
import { createLocationAction } from "@/actions/location";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import { useRouter } from "next/navigation";

export default function LocationForm({ businesses }: { businesses: any[] }) {
  const router = useRouter();
  
  const [state, formAction, isPending] = useActionState(async (prevState: unknown, formData: FormData) => {
    const businessId = formData.get("businessId") as string;
    const input = {
      name: formData.get("name") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      country: formData.get("country") as string,
      contactName: formData.get("contactName") as string,
      contactPhone: formData.get("contactPhone") as string,
    };
    
    const result = await createLocationAction(businessId, input);
    
    if (result.success) {
      router.push("/dashboard/locations");
      router.refresh();
    }
    
    return result;
  }, null);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state?.error && (
        <div className="p-4 rounded-md bg-error/10 text-error text-sm font-medium">
          {state.error}
        </div>
      )}
      
      <div>
        <Label htmlFor="businessId" className="mb-2 block">Business <span className="text-error">*</span></Label>
        <Select
          id="businessId"
          name="businessId"
          required
        >
          {businesses.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="name" className="mb-2 block">Location Name <span className="text-error">*</span></Label>
        <Input
          type="text"
          id="name"
          name="name"
          required
        />
      </div>

      <div>
        <Label htmlFor="address" className="mb-2 block">Address <span className="text-error">*</span></Label>
        <Input
          type="text"
          id="address"
          name="address"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city" className="mb-2 block">City <span className="text-error">*</span></Label>
          <Input
            type="text"
            id="city"
            name="city"
            required
          />
        </div>
        <div>
          <Label htmlFor="state" className="mb-2 block">State (Optional)</Label>
          <Input
            type="text"
            id="state"
            name="state"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="country" className="mb-2 block">Country <span className="text-error">*</span></Label>
        <Input
          type="text"
          id="country"
          name="country"
          defaultValue="Nigeria"
          required
        />
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
        <Label htmlFor="contactPhone" className="mb-2 block">Contact Phone (Optional)</Label>
        <Input
          type="text"
          id="contactPhone"
          name="contactPhone"
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? "Saving..." : "Create Location"}
        </Button>
      </div>
    </form>
  );
}
