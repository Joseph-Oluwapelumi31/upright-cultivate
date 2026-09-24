"use server";

import { prisma } from "@/lib/prisma";
import { requireCustomer } from "@/lib/auth/authorization";

export async function getSupplyRequestsForUser(userId: string) {
  // Always verify the caller is actually the user they claim to be,
  // or that the caller is authenticated.
  const user = await requireCustomer();
  if (user.id !== userId) {
    throw new Error("Unauthorized");
  }

  return await prisma.supplyRequest.findMany({
    where: {
      userId,
    },
    include: {
      business: true,
      location: true,
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getSupplyRequestForUser(userId: string, requestId: string) {
  const user = await requireCustomer();
  if (user.id !== userId) {
    throw new Error("Unauthorized");
  }

  return await prisma.supplyRequest.findFirst({
    where: {
      id: requestId,
      userId, // Critical IDOR protection
    },
    include: {
      business: true,
      location: true,
      items: true,
    },
  });
}
