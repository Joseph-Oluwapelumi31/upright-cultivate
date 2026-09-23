import { z } from "zod";

export const businessSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Business name is required")
    .max(100, "Business name is too long"),

  type: z.enum([
    "RESTAURANT",
    "HOTEL",
    "CAFE",
    "RETAIL",
    "CATERING",
    "MEAL_PREP",
    "COMMERCIAL_KITCHEN",
    "OTHER",
  ]),

  contactName: z
    .string()
    .trim()
    .max(100)
    .optional()
    .or(z.literal("")),

  contactEmail: z
    .string()
    .trim()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),

  contactPhone: z
    .string()
    .trim()
    .max(30)
    .optional()
    .or(z.literal("")),
});