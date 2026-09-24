"use server";

import { prisma } from "@/lib/prisma";
import { requireCustomer } from "@/lib/auth/authorization";
import { locationSchema } from "@/lib/validations/location";
import { ownsBusiness } from "@/lib/auth/ownership";

export async function createLocationAction(businessId: string, input: unknown) {
  // 1. Validate untrusted input
  const result = locationSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      error: "Please check your location information.",
    };
  }

  // 2. Authenticate + authorize business ownership
  const user = await requireCustomer();
  const isOwner = await ownsBusiness(user.id, businessId);

  if (!isOwner) {
    throw new Error("FORBIDDEN");
  }

  // 3. Extract validated fields
  const {
    name,
    address,
    city,
    state,
    country,
    contactName,
    contactPhone,
  } = result.data;

  // 4. Create the location
  const location = await prisma.location.create({
    data: {
      businessId,
      name,
      address,
      city,
      state: state || null,
      country,
      contactName: contactName || null,
      contactPhone: contactPhone || null,
    },
  });

  return {
    success: true,
    location,
  };
}
