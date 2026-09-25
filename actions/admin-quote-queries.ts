import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/authorization";

export async function getAdminQuote(id: string) {
  await requireAdmin();

  return prisma.quote.findUnique({
    where: { id },
    include: {
      request: {
        include: {
          user: true,
        },
      },
      business: true,
      location: true,
      items: true,
    },
  });
}
