import { prisma } from "@/lib/prisma";
import { requireCustomer } from "@/lib/auth/authorization";

export async function getCustomerOrders() {
  const user = await requireCustomer();

  return prisma.order.findMany({
    where: {
      business: { userId: user.id },
    },
    include: {
      business: true,
      location: true,
      quote: {
        select: {
          referenceNumber: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCustomerOrder(id: string) {
  const user = await requireCustomer();

  return prisma.order.findFirst({
    where: { 
      id,
      business: { userId: user.id },
    },
    include: {
      business: true,
      location: true,
      items: true,
      quote: {
        select: {
          id: true,
          referenceNumber: true,
        },
      },
    },
  });
}
