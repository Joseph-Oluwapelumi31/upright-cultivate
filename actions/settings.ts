"use server";

import { prisma } from "@/lib/prisma";
import { requireCustomer } from "@/lib/auth/authorization";
import { z } from "zod";

const settingsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional().nullable(),
});

export async function updateSettingsAction(prevState: any, formData: FormData) {
  try {
    const user = await requireCustomer();
    
    const input = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string | null,
    };
    
    const result = settingsSchema.safeParse(input);
    
    if (!result.success) {
      return { success: false, message: "Invalid input data." };
    }
    
    const { name, phone } = result.data;
    
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: { name },
      });
      
      const existingProfile = await tx.customerProfile.findUnique({
        where: { userId: user.id },
      });
      
      if (existingProfile) {
        await tx.customerProfile.update({
          where: { userId: user.id },
          data: { phone },
        });
      } else {
        await tx.customerProfile.create({
          data: {
            userId: user.id,
            phone,
          },
        });
      }
    });
    
    return { success: true, message: "Settings updated successfully." };
  } catch (error) {
    console.error("Failed to update settings:", error);
    return { success: false, message: "Failed to update settings. Please try again." };
  }
}
