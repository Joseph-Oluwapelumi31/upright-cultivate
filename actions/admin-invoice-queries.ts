"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/authorization";

export async function getAdminInvoice(invoiceId: string) {
  await requireAdmin();

  if (!invoiceId || typeof invoiceId !== "string") {
    return null;
  }

  return await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      business: {
        include: { user: true }
      },
      location: true,
      order: true,
      items: true,
    }
  });
}
