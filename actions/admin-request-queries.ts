"use server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/authorization";
import { RequestStatus, Prisma } from "@/lib/generated/prisma/client";

export async function getAdminSupplyRequests(options?: {
  search?: string;
  status?: RequestStatus | 'ALL';
  sort?: 'newest' | 'oldest';
  page?: number;
  limit?: number;
}) {
  await requireAdmin();
  const page = options?.page || 1;
  const limit = options?.limit || 10;
  const skip = (page - 1) * limit;

  const where: Prisma.SupplyRequestWhereInput = {
    ...(options?.status && options.status !== 'ALL' ? { status: options.status as RequestStatus } : {}),
    ...(options?.search ? {
      OR: [
        { referenceNumber: { contains: options.search, mode: 'insensitive' } },
        { business: { name: { contains: options.search, mode: 'insensitive' } } },
        { location: { name: { contains: options.search, mode: 'insensitive' } } },
        { user: { name: { contains: options.search, mode: 'insensitive' } } }
      ]
    } : {})
  };

  const [items, total] = await Promise.all([
    prisma.supplyRequest.findMany({
      where,
      include: {
        business: true,
        location: true,
        user: true,
        items: true,
      },
      orderBy: {
        createdAt: options?.sort === 'oldest' ? 'asc' : 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.supplyRequest.count({ where })
  ]);

  return { items, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getAdminSupplyRequest(requestId: string) {
  await requireAdmin();
  return await prisma.supplyRequest.findUnique({
    where: { id: requestId },
    include: {
      business: true,
      location: true,
      user: {
        include: {
          profile: true
        }
      },
      items: true,
      quotes: { include: { order: true } }
    },
  });
}
