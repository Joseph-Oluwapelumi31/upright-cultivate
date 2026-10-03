import { vi } from "vitest";

export const prismaMock = {
  supplyRequest: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },

  business: {
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
  },

  location: {
    findFirst: vi.fn(),
  },

  product: {
    findMany: vi.fn(),
  },

  $transaction: vi.fn(),
};