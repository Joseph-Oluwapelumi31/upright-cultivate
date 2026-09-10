import { z } from "zod";

export const supplyRequestSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(100, "Name is too long."),

  businessName: z
    .string()
    .trim()
    .min(2, "Please enter your business name.")
    .max(120, "Business name is too long."),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address."),

  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number.")
    .max(30, "Phone number is too long."),

  deliveryLocation: z
    .string()
    .trim()
    .min(2, "Please enter your delivery location.")
    .max(200, "Delivery location is too long."),

  notes: z
    .string()
    .trim()
    .max(1000, "Notes are too long.")
    .optional(),

  frequency: z.string().min(1, "Please select a delivery frequency."),

  businessType: z.string().min(1, "Please select your business type."),

  items: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        quantity: z.number().int().positive(),
        unit: z.literal("kg"),
      })
    )
    .min(1, "Please add at least one product to your supply plan."),
});

export type SupplyRequestInput = z.infer<
  typeof supplyRequestSchema
>;