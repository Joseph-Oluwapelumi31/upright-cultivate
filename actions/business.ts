"use server";

import { prisma } from "@/lib/prisma";
import { requireCustomer } from "@/lib/auth/authorization";
import { businessSchema } from "@/lib/validations/business";
import { ownsBusiness } from "@/lib/auth/ownership";
export async function createBusinessAction(input: unknown) {
  // 1. Validate untrusted input
  const result = businessSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      error: "Please check your business information.",
    };
  }

  // 2. Authenticate + authorize
  const user = await requireCustomer();

  // 3. Extract only validated client-controlled fields
  const {
    name,
    type,
    contactName,
    contactEmail,
    contactPhone,
  } = result.data;

  // 4. Create using the authenticated user's ID
  const business = await prisma.business.create({
    data: {
      userId: user.id,
      name,
      type,
      contactName: contactName || null,
      contactEmail: contactEmail || null,
      contactPhone: contactPhone || null,
    },
  });

  return {
    success: true,
    business: {
      id: business.id,
      name: business.name,
      type: business.type,
    },
  };
}



export async function getBusinessAction(businessId: string) {
  // 1. Get authenticated customer
  const user = await requireCustomer();

  // 2. Check ownership on the server
  const isOwner = await ownsBusiness(user.id, businessId);

  if (!isOwner) {
    throw new Error("FORBIDDEN");
  }

  // 3. Only query the resource after ownership is confirmed
  const business = await prisma.business.findUnique({
    where: {
      id: businessId,
    },
    include: {
      locations: true,
    },
  });

  if (!business) {
    throw new Error("BUSINESS_NOT_FOUND");
  }

  return {
    success: true,
    business,
  };
}

export async function updateBusinessAction(
  businessId: string,
  input: unknown
) {
  const user = await requireCustomer();

  const result = businessSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      error: "Please check your business information.",
    };
  }

  const business = await prisma.business.findFirst({
    where: {
      id: businessId,
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (!business) {
    throw new Error("BUSINESS_NOT_FOUND");
  }

  const updatedBusiness = await prisma.business.update({
    where: {
      id: business.id,
    },
    data: {
      name: result.data.name,
      type: result.data.type,
      contactName: result.data.contactName || null,
      contactEmail: result.data.contactEmail || null,
      contactPhone: result.data.contactPhone || null,
    },
  });

  return {
    success: true,
    business: updatedBusiness,
  };
}

