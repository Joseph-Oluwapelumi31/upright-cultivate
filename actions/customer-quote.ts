"use server";

import { prisma } from "@/lib/prisma";
import { requireCustomer } from "@/lib/auth/authorization";
import { customerQuoteActionSchema } from "@/lib/validations/quote";

export type ActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export async function acceptQuote(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireCustomer();

  const result = customerQuoteActionSchema.safeParse({
    quoteId: formData.get("quoteId"),
  });

  if (!result.success) {
    return { success: false, message: "Invalid quote identifier." };
  }

  const quote = await prisma.quote.findUnique({
    where: { id: result.data.quoteId },
    include: {
      request: {
        include: {
          business: true,
        },
      },
    },
  });

  if (!quote) {
    return { success: false, message: "Quote not found." };
  }

  // Verify ownership
  if (quote.request.business.userId !== user.id) {
    return { success: false, message: "You are not authorized to accept this quote." };
  }

  if (quote.status !== "SENT") {
    return { success: false, message: "Only SENT quotes can be accepted." };
  }

  if (quote.validUntil && quote.validUntil < new Date()) {
    // Optionally auto-transition to EXPIRED
    await prisma.quote.updateMany({
      where: { id: quote.id, status: "SENT" },
      data: { status: "EXPIRED" },
    });
    return { success: false, message: "This quote has expired." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Atomic state transition enforcing current status and expiry
      const updateResult = await tx.quote.updateMany({
        where: { 
          id: quote.id, 
          status: "SENT",
          OR: [
            { validUntil: null },
            { validUntil: { gte: new Date() } }
          ]
        },
        data: { status: "ACCEPTED" },
      });

      if (updateResult.count === 0) {
        throw new Error("Quote is no longer available to be accepted or has expired.");
      }
      
      // Note: Order creation will happen here in the future
      await tx.supplyRequest.update({
        where: { id: quote.requestId },
        data: { status: "ACCEPTED" },
      });
    });

    return {
      success: true,
      message: `Quote ${quote.referenceNumber} has been accepted.`,
    };
  } catch (error: any) {
    console.error("Failed to accept quote:", error);
    return { success: false, message: error.message || "Failed to accept quote. Please try again." };
  }
}

export async function rejectQuote(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireCustomer();

  const result = customerQuoteActionSchema.safeParse({
    quoteId: formData.get("quoteId"),
  });

  if (!result.success) {
    return { success: false, message: "Invalid quote identifier." };
  }

  const quote = await prisma.quote.findUnique({
    where: { id: result.data.quoteId },
    include: {
      request: {
        include: {
          business: true,
        },
      },
    },
  });

  if (!quote) {
    return { success: false, message: "Quote not found." };
  }

  // Verify ownership
  if (quote.request.business.userId !== user.id) {
    return { success: false, message: "You are not authorized to reject this quote." };
  }

  if (quote.status !== "SENT") {
    return { success: false, message: "Only SENT quotes can be rejected." };
  }

  if (quote.validUntil && quote.validUntil < new Date()) {
    await prisma.quote.updateMany({
      where: { id: quote.id, status: "SENT" },
      data: { status: "EXPIRED" },
    });
    return { success: false, message: "This quote has expired." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Atomic state transition enforcing current status
      const updateResult = await tx.quote.updateMany({
        where: { 
          id: quote.id, 
          status: "SENT",
        },
        data: { status: "REJECTED" },
      });

      if (updateResult.count === 0) {
        throw new Error("Quote is no longer available to be rejected.");
      }
      
      // We do NOT change SupplyRequest to REJECTED because the request can have multiple quotes/revisions.
    });

    return {
      success: true,
      message: `Quote ${quote.referenceNumber} has been rejected.`,
    };
  } catch (error: any) {
    console.error("Failed to reject quote:", error);
    return { success: false, message: error.message || "Failed to reject quote. Please try again." };
  }
}
