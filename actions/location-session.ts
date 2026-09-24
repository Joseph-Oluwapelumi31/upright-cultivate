"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ownsLocation } from "@/lib/auth/ownership";
import { requireCustomer } from "@/lib/auth/authorization";

export async function selectLocationAction(locationId: string, redirectTo: string = "/dashboard") {
  const user = await requireCustomer();
  const isOwner = await ownsLocation(user.id, locationId);
  
  if (!isOwner) {
    throw new Error("FORBIDDEN");
  }

  const cookieStore = await cookies();
  cookieStore.set("selectedLocationId", locationId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  redirect(redirectTo);
}

export async function clearLocationSelectionAction() {
  const cookieStore = await cookies();
  cookieStore.delete("selectedLocationId");
  redirect("/dashboard");
}
