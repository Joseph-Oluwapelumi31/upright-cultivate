import { z } from "zod";

export const locationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Location name is required")
    .max(100, "Location name is too long"),

  address: z
    .string()
    .trim()
    .min(5, "Address is required")
    .max(255, "Address is too long"),

  city: z
    .string()
    .trim()
    .min(2, "City is required")
    .max(100, "City is too long"),

  state: z
    .string()
    .trim()
    .max(100)
    .optional()
    .or(z.literal("")),

  country: z
    .string()
    .trim()
    .min(2, "Country is required")
    .max(100, "Country is too long")
    .default("Nigeria"),

  contactName: z
    .string()
    .trim()
    .max(100)
    .optional()
    .or(z.literal("")),

  contactPhone: z
    .string()
    .trim()
    .max(30)
    .optional()
    .or(z.literal("")),
});
