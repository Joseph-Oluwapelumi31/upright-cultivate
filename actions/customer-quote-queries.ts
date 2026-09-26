import { prisma } from "@/lib/prisma";
import { requireCustomer } from "@/lib/auth/authorization";

// Exclude DRAFT from customer-facing queries
const CUSTOMER_VISIBLE_STATUSES = ["SENT", "ACCEPTED", "REJECTED", "EXPIRED", "CANCELLED"] as const;

export async function getCustomerQuotes() {
  const user = await requireCustomer();

  return prisma.quote.findMany({
    where: {
      business: { userId: user.id },
      status: { in: ["SENT", "ACCEPTED", "REJECTED", "EXPIRED", "CANCELLED"] }
    },
    include: {
      business: true,
      location: true,
      request: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCustomerQuote(id: string) {
  const user = await requireCustomer();

  return prisma.quote.findFirst({
    where: { 
      id,
      business: { userId: user.id },
      status: { in: ["SENT", "ACCEPTED", "REJECTED", "EXPIRED", "CANCELLED"] }
    },
    include: {
      business: true,
      location: true,
      request: true,
      items: true,
      order: { select: { id: true } },
    },
  });
}
