import { z } from "zod";

const productIds = [
  "romaine",
  "butterhead",
  "green-leaf",
  "red-leaf",
  "iceberg",
  "kale",
  "spinach",
  "swiss-chard",
  "arugula",
  "watercress",
  "bok-choy",
  "pak-choi",
  "basil",
  "mint",
  "parsley",
  "coriander",
  "dill",
  "chives",
  "oregano",
  "thyme",
  "spring-onions",
  "custom-blends",
] as const;

const frequencies = [
  "Weekly",
  "Twice a week",
  "Multiple times a week",
  "Not sure yet",
] as const;

const businessTypes = [
  "Restaurant",
  "Hotel",
  "Café",
  "Retail",
  "Catering",
  "Meal prep",
  "Commercial kitchen",
  "Other",
] as const;

const productIdSchema = z.enum(productIds);

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

  frequency: z.enum(frequencies, {
    error: "Please select a delivery frequency.",
  }),

  businessType: z.enum(businessTypes, {
    error: "Please select your business type.",
  }),

  items: z
    .array(
      z.object({
        id: productIdSchema,
        name: z.string().trim().min(1).max(100),
        quantity: z
          .number()
          .int()
          .min(1, "Quantity must be at least 1 kg.")
          .max(500, "Quantity cannot exceed 500 kg."),
        unit: z.literal("kg"),
      })
    )
    .min(1, "Please add at least one product to your supply plan."),
});

export type SupplyRequestInput = z.infer<
  typeof supplyRequestSchema
>;