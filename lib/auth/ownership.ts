import { prisma } from "@/lib/prisma";

export async function ownsBusiness(
  userId: string,
  businessId: string
) {
  const business = await prisma.business.findFirst({
    where: {
      id: businessId,
      userId,
    },
    select: {
      id: true,
    },
  });

  return !!business;
}

export async function ownsLocation(
  userId: string,
  locationId: string
) {
  const location = await prisma.location.findFirst({
    where: {
      id: locationId,
      business: {
        userId,
      },
    },
    select: {
      id: true,
    },
  });

  return !!location;
}

export async function ownsSupplyRequest(
  userId: string,
  requestId: string
) {
  const request = await prisma.supplyRequest.findFirst({
    where: {
      id: requestId,
      userId,
    },
    select: {
      id: true,
    },
  });

  return !!request;
}