"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ownsBusiness } from "@/lib/auth/ownership";
import { requireCustomer } from "@/lib/auth/authorization";

export async function selectBusinessAction(businessId: string, redirectTo: string = "/dashboard") {
  const user = await requireCustomer();
  const isOwner = await ownsBusiness(user.id, businessId);
  
  if (!isOwner) {
    throw new Error("FORBIDDEN");
  }

  const cookieStore = await cookies();
  cookieStore.set("selectedBusinessId", businessId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  redirect(redirectTo);
}

export async function clearBusinessSelectionAction() {
  const cookieStore = await cookies();
  cookieStore.delete("selectedBusinessId");
  redirect("/dashboard");
}
