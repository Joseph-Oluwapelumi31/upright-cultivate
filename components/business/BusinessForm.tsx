"use client";

import { useActionState } from "react";
import { createBusinessAction, updateBusinessAction } from "@/actions/business";
import { selectBusinessAction } from "@/actions/business-session";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import { useRouter } from "next/navigation";

export function BusinessForm({ 
  initialData, 
  isEdit = false, 
  onSuccess 
}: { 
  initialData?: any, 
  isEdit?: boolean,
  onSuccess?: () => void
}) {
  const router = useRouter();
  
  const [state, formAction, isPending] = useActionState(async (prevState: unknown, formData: FormData) => {
    const input = {
      name: formData.get("name"),
      type: formData.get("type"),
      contactName: formData.get("contactName"),
      contactEmail: formData.get("contactEmail"),
      contactPhone: formData.get("contactPhone"),
    };
    
    let result;
    if (isEdit && initialData?.id) {
      result = await updateBusinessAction(initialData.id, input);
    } else {
      result = await createBusinessAction(input);
      if (result.success && result.business) {
        // Automatically select the newly created business
        await selectBusinessAction(result.business.id, "/dashboard/businesses");
      }
    }

    if (result.success) {
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard/businesses");
        router.refresh();
      }
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
        <Label htmlFor="name" className="mb-2 block">Business Name <span className="text-error">*</span></Label>
        <Input
          type="text"
          id="name"
          name="name"
          defaultValue={initialData?.name || ""}
          required
        />
      </div>

      <div>
        <Label htmlFor="type" className="mb-2 block">Business Type <span className="text-error">*</span></Label>
        <Select
          id="type"
          name="type"
          defaultValue={initialData?.type || "RESTAURANT"}
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
          defaultValue={initialData?.contactName || ""}
        />
      </div>

      <div>
        <Label htmlFor="contactEmail" className="mb-2 block">Contact Email (Optional)</Label>
        <Input
          type="email"
          id="contactEmail"
          name="contactEmail"
          defaultValue={initialData?.contactEmail || ""}
        />
      </div>

      <div>
        <Label htmlFor="contactPhone" className="mb-2 block">Contact Phone (Optional)</Label>
        <Input
          type="text"
          id="contactPhone"
          name="contactPhone"
          defaultValue={initialData?.contactPhone || ""}
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
          {isPending ? "Saving..." : isEdit ? "Save Changes" : "Create Business"}
        </Button>
      </div>
    </form>
  );
}
