"use server";

import { supplyRequestSchema } from "@/lib/validations/supply-request";

export type SupplyRequestState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitSupplyRequest(
  _previousState: SupplyRequestState,
  formData: FormData
): Promise<SupplyRequestState> {
  const rawItems = formData.get("items");

  let items: unknown = [];

  try {
    items = rawItems
      ? JSON.parse(String(rawItems))
      : [];
  } catch {
    items = [];
  }

  const result = supplyRequestSchema.safeParse({
    fullName: formData.get("fullName"),
    businessName: formData.get("businessName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    deliveryLocation: formData.get("deliveryLocation"),
    notes: formData.get("notes") || "",
    frequency: formData.get("frequency"),
    businessType: formData.get("businessType"),
    items,
  });

  if (!result.success) {
    return {
      success: false,
      message: "Please check the form and try again.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const data = result.data;

  /*
   * Phase 3 — Step 4:
   *
   * Store the request in the database.
   *
   * Phase 3 — Step 4b:
   *
   * Send an email notification.
   */

  console.log("New supply request:", data);

  return {
    success: true,
    message:
      "Your supply request has been received.",
  };
}