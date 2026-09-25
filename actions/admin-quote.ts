"use server";

import { Prisma, RequestStatus } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/authorization";
import {
  createQuoteSchema,
  updateQuoteSchema,
  sendQuoteSchema,
} from "@/lib/validations/quote";

export type ActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

// Only these request statuses allow creating/editing quotes
const ALLOWED_REQUEST_STATUSES: RequestStatus[] = ["PENDING", "SUBMITTED", "UNDER_REVIEW", "QUOTED"];

export async function createQuote(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const rawItems = formData.get("items");
  let items: unknown = [];
  try {
    items = rawItems ? JSON.parse(String(rawItems)) : [];
  } catch {
    items = [];
  }

  const result = createQuoteSchema.safeParse({
    requestId: formData.get("requestId"),
    validUntil: formData.get("validUntil") || undefined,
    notes: formData.get("notes") || undefined,
    adminNotes: formData.get("adminNotes") || undefined,
    additionalCharges: formData.get("additionalCharges") || undefined,
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

  // Verify the request exists and is in a valid state
  const supplyRequest = await prisma.supplyRequest.findUnique({
    where: { id: data.requestId },
    include: { business: true, location: true },
  });

  if (!supplyRequest) {
    return { success: false, message: "Supply request not found." };
  }

  if (!ALLOWED_REQUEST_STATUSES.includes(supplyRequest.status)) {
    return { success: false, message: `Cannot create a quote for a request in ${supplyRequest.status} state.` };
  }

  // Load products to verify they exist and capture their names/units
  const productIds = [...new Set(data.items.map((i) => i.productId))];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, status: "ACTIVE" },
    select: { id: true, name: true, unit: true },
  });

  if (products.length !== productIds.length) {
    return { success: false, message: "One or more selected products are invalid or inactive." };
  }

  const productsById = new Map(products.map((p) => [p.id, p]));

  // Calculate totals safely with Decimal
  let subtotal = new Prisma.Decimal(0);
  const additionalCharges = new Prisma.Decimal(data.additionalCharges || 0);

  const quoteItemsData = data.items.map((item) => {
    const product = productsById.get(item.productId)!;
    const quantity = new Prisma.Decimal(item.quantity);
    const unitPrice = new Prisma.Decimal(item.unitPrice);
    const lineTotal = quantity.mul(unitPrice);
    
    subtotal = subtotal.add(lineTotal);

    return {
      productId: product.id,
      productNameSnapshot: product.name,
      quantity,
      unit: product.unit,
      unitPrice,
      lineTotal,
    };
  });

  const total = subtotal.add(additionalCharges);

  // Generate Reference Number safely
  const year = new Date().getFullYear();
  const referenceNumber = `QT-${year}-${crypto
    .randomUUID()
    .replaceAll("-", "")
    .slice(0, 8)
    .toUpperCase()}`;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.quote.create({
        data: {
          referenceNumber,
          requestId: supplyRequest.id,
          businessId: supplyRequest.businessId,
          locationId: supplyRequest.locationId,
          status: "DRAFT",
          subtotal,
          additionalCharges,
          total,
          validUntil: data.validUntil,
          notes: data.notes || null,
          adminNotes: data.adminNotes || null,
          items: {
            create: quoteItemsData,
          },
        },
      });
    });

    return {
      success: true,
      message: `Quote ${referenceNumber} drafted successfully.`,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { success: false, message: "A reference number collision occurred. Please try again." };
    }
    console.error("Failed to create quote:", error);
    return { success: false, message: "Failed to create quote. Please try again." };
  }
}

export async function updateQuote(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const rawItems = formData.get("items");
  let items: unknown = [];
  try {
    items = rawItems ? JSON.parse(String(rawItems)) : [];
  } catch {
    items = [];
  }

  const result = updateQuoteSchema.safeParse({
    quoteId: formData.get("quoteId"),
    validUntil: formData.get("validUntil") || undefined,
    notes: formData.get("notes") || undefined,
    adminNotes: formData.get("adminNotes") || undefined,
    additionalCharges: formData.get("additionalCharges") || undefined,
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

  // Load existing quote
  const quote = await prisma.quote.findUnique({
    where: { id: data.quoteId },
    include: { request: true },
  });

  if (!quote) {
    return { success: false, message: "Quote not found." };
  }

  if (quote.status !== "DRAFT") {
    return { success: false, message: "Only DRAFT quotes can be edited." };
  }

  if (!ALLOWED_REQUEST_STATUSES.includes(quote.request.status)) {
    return { success: false, message: `Cannot update a quote for a request in ${quote.request.status} state.` };
  }

  // Load products
  const productIds = [...new Set(data.items.map((i) => i.productId))];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, status: "ACTIVE" },
    select: { id: true, name: true, unit: true },
  });

  if (products.length !== productIds.length) {
    return { success: false, message: "One or more selected products are invalid or inactive." };
  }

  const productsById = new Map(products.map((p) => [p.id, p]));

  // Calculate totals safely
  let subtotal = new Prisma.Decimal(0);
  const additionalCharges = new Prisma.Decimal(data.additionalCharges || 0);

  const quoteItemsData = data.items.map((item) => {
    const product = productsById.get(item.productId)!;
    const quantity = new Prisma.Decimal(item.quantity);
    const unitPrice = new Prisma.Decimal(item.unitPrice);
    const lineTotal = quantity.mul(unitPrice);
    
    subtotal = subtotal.add(lineTotal);

    return {
      productId: product.id,
      productNameSnapshot: product.name,
      quantity,
      unit: product.unit,
      unitPrice,
      lineTotal,
    };
  });

  const total = subtotal.add(additionalCharges);

  try {
    await prisma.$transaction(async (tx) => {
      await tx.quote.update({
        where: { id: quote.id },
        data: {
          subtotal,
          additionalCharges,
          total,
          validUntil: data.validUntil,
          notes: data.notes || null,
          adminNotes: data.adminNotes || null,
          items: {
            deleteMany: {},
            create: quoteItemsData,
          },
        },
      });
    });

    return {
      success: true,
      message: `Quote updated successfully.`,
    };
  } catch (error) {
    console.error("Failed to update quote:", error);
    return { success: false, message: "Failed to update quote. Please try again." };
  }
}

export async function sendQuote(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const result = sendQuoteSchema.safeParse({
    quoteId: formData.get("quoteId"),
  });

  if (!result.success) {
    return { success: false, message: "Invalid quote identifier." };
  }

  const quote = await prisma.quote.findUnique({
    where: { id: result.data.quoteId },
    include: { items: true, request: true },
  });

  if (!quote) {
    return { success: false, message: "Quote not found." };
  }

  if (quote.status !== "DRAFT") {
    return { success: false, message: "Only DRAFT quotes can be sent." };
  }

  if (!ALLOWED_REQUEST_STATUSES.includes(quote.request.status)) {
    return { success: false, message: `Cannot send a quote for a request in ${quote.request.status} state.` };
  }

  if (quote.items.length === 0) {
    return { success: false, message: "Cannot send a quote with no items." };
  }

  // Financial invariant check before sending
  const calculatedSubtotal = quote.items.reduce((acc, item) => acc.add(item.lineTotal), new Prisma.Decimal(0));
  if (!calculatedSubtotal.equals(quote.subtotal)) {
    return { success: false, message: "Quote financial state is inconsistent (subtotal mismatch). Please edit and save." };
  }
  const calculatedTotal = calculatedSubtotal.add(quote.additionalCharges || 0);
  if (!calculatedTotal.equals(quote.total)) {
    return { success: false, message: "Quote financial state is inconsistent (total mismatch). Please edit and save." };
  }

  // Enforce validUntil if present
  if (quote.validUntil && quote.validUntil < new Date()) {
    return { success: false, message: "The quote expiration date has already passed. Please update it." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Transition Quote to SENT conditionally
      const updateResult = await tx.quote.updateMany({
        where: { id: quote.id, status: "DRAFT" },
        data: { status: "SENT" },
      });

      if (updateResult.count === 0) {
        throw new Error("Concurrency failure: Quote is no longer in DRAFT state.");
      }

      // Transition SupplyRequest to QUOTED
      await tx.supplyRequest.update({
        where: { id: quote.requestId },
        data: { status: "QUOTED" },
      });
    });

    return {
      success: true,
      message: `Quote ${quote.referenceNumber} has been sent.`,
    };
  } catch (error: any) {
    console.error("Failed to send quote:", error);
    return { success: false, message: error.message || "Failed to send quote." };
  }
}
