"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import { requireAdmin } from "@/lib/auth/authorization";
import { z } from "zod";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

const createInvoiceSchema = z.object({
  orderId: z.string().min(1, "Order ID is required."),
});

export type ActionState = {
  success: boolean;
  message: string;
};

export async function createInvoice(orderId: string): Promise<ActionState> {
  await requireAdmin();

  const result = createInvoiceSchema.safeParse({ orderId });
  if (!result.success) {
    return { success: false, message: "Invalid order ID." };
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: result.data.orderId },
      include: {
        items: true,
        business: true,
        location: true,
      },
    });

    if (!order) {
      return { success: false, message: "Order not found." };
    }

    if (order.status !== "DELIVERED") {
      return { success: false, message: "Invoices can only be created for DELIVERED orders." };
    }

    if (order.items.length === 0) {
      return { success: false, message: "Order has no items." };
    }

    const existingInvoice = await prisma.invoice.findUnique({
      where: { orderId: order.id },
    });

    if (existingInvoice) {
      return { success: false, message: "An invoice already exists for this order." };
    }

    // Calculate subtotal server-side
    let calculatedSubtotal = new Prisma.Decimal(0);
    const invoiceItemsData = order.items.map((item) => {
      calculatedSubtotal = calculatedSubtotal.add(item.lineTotal);
      return {
        productId: item.productId,
        productNameSnapshot: item.productNameSnapshot,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal,
      };
    });

    // Check financial consistency against the immutable order
    if (!calculatedSubtotal.equals(order.subtotal)) {
      console.error(`Financial integrity mismatch for order ${order.id}: Calculated subtotal ${calculatedSubtotal.toString()} does not match order subtotal ${order.subtotal.toString()}.`);
      return { success: false, message: "Financial integrity mismatch. Please contact support." };
    }

    const calculatedTotal = calculatedSubtotal.add(order.additionalCharges || 0);
    
    if (!calculatedTotal.equals(order.total)) {
      console.error(`Financial integrity mismatch for order ${order.id}: Calculated total ${calculatedTotal.toString()} does not match order total ${order.total.toString()}.`);
      return { success: false, message: "Financial integrity mismatch. Please contact support." };
    }

    await prisma.$transaction(async (tx) => {
      await tx.invoice.create({
        data: {
          orderId: order.id,
          businessId: order.businessId,
          locationId: order.locationId,
          status: "DRAFT",
          subtotal: calculatedSubtotal,
          additionalCharges: order.additionalCharges,
          total: calculatedTotal,
          currency: order.currency,
          items: {
            create: invoiceItemsData,
          },
        },
      });
    });

    revalidatePath("/admin/invoices");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/dashboard/invoices");

    return {
      success: true,
      message: "Invoice created successfully.",
    };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { success: false, message: "An invoice already exists for this order." };
    }
    console.error("Failed to create invoice:", error);
    return { success: false, message: "An unexpected error occurred while creating the invoice." };
  }
}

const issueInvoiceSchema = z.object({
  invoiceId: z.string().trim().min(1, "Invalid invoice ID."),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please provide a valid due date."),
});

export async function issueInvoice(invoiceId: string, dueDate: string): Promise<ActionState> {
  try {
    await requireAdmin();
  } catch (error: any) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      if (error.digest.includes("signin")) {
        return { success: false, message: "You must be signed in to perform this action." };
      }
      return { success: false, message: "You are not authorized to perform this action." };
    }
    throw error;
  }

  const result = issueInvoiceSchema.safeParse({ invoiceId, dueDate });
  if (!result.success) {
    return { success: false, message: result.error.issues[0].message };
  }

  try {
    const [yearStr, monthStr, dayStr] = result.data.dueDate.split("-");
    const parsedDueDate = new Date(Date.UTC(Number(yearStr), Number(monthStr) - 1, Number(dayStr)));
    
    const now = new Date();
    // Use the server's current calendar date as a baseline (UTC representation of today)
    const todayUTC = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));

    if (parsedDueDate < todayUTC) {
      return { success: false, message: "Due date cannot be in the past." };
    }

    const year = now.getFullYear();
    const invoiceNumber = `INV-${year}-${crypto
      .randomUUID()
      .replaceAll("-", "")
      .slice(0, 8)
      .toUpperCase()}`;
    const issueDate = now;

    // Atomic conditional update
    const updateResult = await prisma.invoice.updateMany({
      where: {
        id: result.data.invoiceId,
        status: "DRAFT",
      },
      data: {
        status: "ISSUED",
        invoiceNumber,
        issueDate,
        dueDate: parsedDueDate,
      },
    });

    if (updateResult.count === 0) {
      // Check if it exists at all or just not DRAFT
      const invoice = await prisma.invoice.findUnique({ where: { id: result.data.invoiceId } });
      if (!invoice) {
        return { success: false, message: "Invoice not found." };
      }
      if (invoice.status !== "DRAFT") {
        return { success: false, message: "Invoice cannot be issued because it is no longer in draft status." };
      }
      return { success: false, message: "Invoice could not be issued. It may have already been issued by another administrator." };
    }

    revalidatePath("/admin/invoices");
    revalidatePath(`/admin/invoices/${result.data.invoiceId}`);
    revalidatePath("/dashboard/invoices");

    return {
      success: true,
      message: "Invoice issued successfully.",
    };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { success: false, message: "Unable to generate a unique invoice number. Please try again." };
    }
    console.error("Failed to issue invoice:", error);
    return { success: false, message: "Unable to issue invoice. Please try again." };
  }
}
