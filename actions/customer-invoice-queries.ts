"use server";

import { prisma } from "@/lib/prisma";
import { requireCustomer } from "@/lib/auth/authorization";

export async function getCustomerInvoices() {
  const user = await requireCustomer();

  return prisma.invoice.findMany({
    where: {
      business: {
        userId: user.id,
      },
    },
    select: {
      id: true,
      invoiceNumber: true,
      status: true,
      total: true,
      currency: true,
      issueDate: true,
      dueDate: true,
      createdAt: true,
      business: {
        select: {
          name: true,
        },
      },
      order: {
        select: {
          orderNumber: true,
        },
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
export async function getCustomerInvoice(id: string) {
  const user = await requireCustomer();

  return prisma.invoice.findFirst({
    where: {
      id,
      business: {
        userId: user.id,
      },
    },
    select: {
      id: true,
      invoiceNumber: true,
      status: true,
      subtotal: true,
      additionalCharges: true,
      total: true,
      currency: true,
      issueDate: true,
      dueDate: true,
      notes: true,
      createdAt: true,
      items: {
        select: {
          id: true,
          productNameSnapshot: true,
          quantity: true,
          unit: true,
          unitPrice: true,
          lineTotal: true,
        },
      },
      business: {
        select: {
          name: true,
        },
      },
      location: {
        select: {
          name: true,
          address: true,
        },
      },
      order: {
        select: {
          id: true,
          orderNumber: true,
        },
      },
    },
  });
}
