"use client";

import { useActionState } from "react";
import { updateSettingsAction } from "@/actions/settings";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import Button from "@/components/ui/Button";

type SettingsFormProps = {
  initialData: {
    name: string;
    phone: string | null;
  };
};

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateSettingsAction,
    { success: false, message: "" }
  );

  return (
    <form action={formAction} className="space-y-6 max-w-xl">
      {state.message && (
        <div className={`p-4 rounded-md text-sm ${state.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {state.message}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            name="name" 
            defaultValue={initialData.name} 
            required 
            placeholder="Jane Doe"
          />
        </div>
        
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input 
            id="phone" 
            name="phone" 
            type="tel"
            defaultValue={initialData.phone || ""} 
            placeholder="+234 800 000 0000"
          />
          <p className="mt-1 text-xs text-muted-foreground">Used for delivery updates.</p>
        </div>
      </div>

      <Button type="submit" disabled={isPending} variant="primary">
        {isPending ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  );
}
