import { prisma } from "@/lib/prisma";

export async function getActiveProducts() {
  const now = new Date();

  return prisma.product.findMany({
    where: {
      status: "ACTIVE",
    },
    include: {
      category: true,
      prices: {
        where: {
          isActive: true,
          effectiveFrom: {
            lte: now,
          },
          OR: [
            {
              effectiveUntil: null,
            },
            {
              effectiveUntil: {
                gt: now,
              },
            },
          ],
        },
        orderBy: {
          effectiveFrom: "desc",
        },
        take: 1,
      },
      availability: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function getProductBySlug(slug: string) {
  const now = new Date();

  return prisma.product.findFirst({
    where: {
      slug,
      status: "ACTIVE",
    },
    include: {
      category: true,
      prices: {
        where: {
          isActive: true,
          effectiveFrom: {
            lte: now,
          },
          OR: [
            {
              effectiveUntil: null,
            },
            {
              effectiveUntil: {
                gt: now,
              },
            },
          ],
        },
        orderBy: {
          effectiveFrom: "desc",
        },
        take: 1,
      },
      availability: true,
    },
  });
}

export async function getActiveProductCategories() {
  return prisma.productCategory.findMany({
    where: {
      isActive: true,
      products: {
        some: {
          status: "ACTIVE",
        },
      },
    },
    include: {
      products: {
        where: {
          status: "ACTIVE",
        },
        orderBy: {
          name: "asc",
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}