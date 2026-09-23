import { z } from "zod";

const frequencies = [
  "Weekly",
  "Twice a week",
  "Multiple times a week",
  "Not sure yet",
] as const;

export const createSupplyRequestSchema = z.object({
  submissionKey: z
    .string()
    .uuid("Invalid submission key."),

  businessId: z
    .string()
    .min(1, "Business is required."),

  locationId: z
    .string()
    .min(1, "Location is required."),

  frequency: z.enum(frequencies, {
    error: "Please select a delivery frequency.",
  }),

  preferredDeliveryDate: z.coerce
    .date()
    .optional(),

  isRecurring: z.boolean(),

  notes: z
    .string()
    .trim()
    .max(1000, "Notes are too long.")
    .optional(),

  items: z
    .array(
      z.object({
        productSlug: z.string().min(1),

        quantity: z
          .number()
          .int()
          .min(1)
          .max(500),

        notes: z
          .string()
          .trim()
          .max(500)
          .optional(),
      })
    )
    .min(1, "Please add at least one product."),
});

export type CreateSupplyRequestInput = z.infer<
  typeof createSupplyRequestSchema
>;