"use server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/authorization";
import { OrderStatus, Prisma } from "@/lib/generated/prisma/client";

export async function getAdminOrders(options?: {
  search?: string;
  status?: OrderStatus | 'ALL';
  sort?: 'newest' | 'oldest';
  page?: number;
  limit?: number;
}) {
  await requireAdmin();
  const page = options?.page || 1;
  const limit = options?.limit || 10;
  const skip = (page - 1) * limit;

  const where: Prisma.OrderWhereInput = {
    ...(options?.status && options.status !== 'ALL' ? { status: options.status as OrderStatus } : {}),
    ...(options?.search ? {
      OR: [
        { orderNumber: { contains: options.search, mode: 'insensitive' } },
        { business: { name: { contains: options.search, mode: 'insensitive' } } },
        { location: { name: { contains: options.search, mode: 'insensitive' } } },
        { business: { user: { name: { contains: options.search, mode: 'insensitive' } } } }
      ]
    } : {})
  };

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      select: {
        id: true,
        orderNumber: true,
        status: true,
        total: true,
        currency: true,
        createdAt: true,
        business: {
          select: { name: true, user: { select: { name: true } } }
        },
        location: {
          select: { name: true }
        }
      },
      orderBy: {
        createdAt: options?.sort === 'oldest' ? 'asc' : 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.order.count({ where })
  ]);

  return { items, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getAdminOrder(orderId: string) {
  await requireAdmin();
  return await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      business: {
        include: { user: true }
      },
      location: true,
      quote: true,
      items: true,
    }
  });
}
