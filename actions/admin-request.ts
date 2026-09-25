"use server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/authorization";
import { RequestStatus } from "@/lib/generated/prisma/client";
import { revalidatePath } from "next/cache";

export async function updateSupplyRequestStatus(requestId: string, status: RequestStatus) {
  await requireAdmin();
  
  const request = await prisma.supplyRequest.findUnique({
    where: { id: requestId }
  });
  
  if (!request) {
    return { error: "Request not found" };
  }
  
  // Basic business rules
  if (request.status === 'CANCELLED' && status !== 'CANCELLED') {
    return { error: "Cannot un-cancel a request directly. Customer must submit a new request." };
  }

  await prisma.supplyRequest.update({
    where: { id: requestId },
    data: { status }
  });
  
  revalidatePath('/admin/requests');
  revalidatePath(`/admin/requests/${requestId}`);
  return { success: true };
}

export async function updateSupplyRequestAdminNotes(requestId: string, adminNotes: string) {
  await requireAdmin();
  
  await prisma.supplyRequest.update({
    where: { id: requestId },
    data: { adminNotes }
  });
  
  revalidatePath(`/admin/requests/${requestId}`);
  return { success: true };
}
