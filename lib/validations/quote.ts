import { z } from "zod";

const moneyRegex = /^\d+(\.\d{1,2})?$/;
const quantityRegex = /^\d+(\.\d{1,3})?$/;

const moneySchema = z
  .string()
  .trim()
  .regex(moneyRegex, "Invalid monetary value. Maximum 2 decimal places allowed.")
  .refine(
    (val) => {
      const num = Number(val);
      return !isNaN(num) && num >= 0 && num <= 100000000;
    },
    { message: "Value must be a valid positive amount within sensible limits." }
  );

const quantitySchema = z
  .string()
  .trim()
  .regex(quantityRegex, "Invalid quantity value. Maximum 3 decimal places allowed.")
  .refine(
    (val) => {
      const num = Number(val);
      return !isNaN(num) && num > 0 && num <= 100000;
    },
    { message: "Quantity must be greater than zero and within sensible limits." }
  );

export const createQuoteSchema = z.object({
  requestId: z.string().min(1, "Request ID is required."),
  validUntil: z.coerce.date().optional(),
  notes: z.string().trim().max(1000, "Notes are too long.").optional(),
  adminNotes: z.string().trim().max(1000, "Admin notes are too long.").optional(),
  additionalCharges: moneySchema.optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Product ID is required."),
        quantity: quantitySchema,
        unitPrice: moneySchema,
      })
    )
    .min(1, "A quote must have at least one item."),
});

export const updateQuoteSchema = z.object({
  quoteId: z.string().min(1, "Quote ID is required."),
  validUntil: z.coerce.date().optional().nullable(),
  notes: z.string().trim().max(1000, "Notes are too long.").optional().nullable(),
  adminNotes: z.string().trim().max(1000, "Admin notes are too long.").optional().nullable(),
  additionalCharges: moneySchema.optional().nullable(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Product ID is required."),
        quantity: quantitySchema,
        unitPrice: moneySchema,
      })
    )
    .min(1, "A quote must have at least one item."),
});

export const sendQuoteSchema = z.object({
  quoteId: z.string().min(1, "Quote ID is required."),
});

export const customerQuoteActionSchema = z.object({
  quoteId: z.string().min(1, "Quote ID is required."),
});

export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;
export type UpdateQuoteInput = z.infer<typeof updateQuoteSchema>;
export type SendQuoteInput = z.infer<typeof sendQuoteSchema>;
export type CustomerQuoteActionInput = z.infer<typeof customerQuoteActionSchema>;
