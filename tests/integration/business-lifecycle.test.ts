import { describe, it, expect, vi, beforeEach } from "vitest";
import { deleteBusinessAction, deactivateBusinessAction } from "../../actions/business";
import { requireCustomer } from "../../lib/auth/authorization";

// Mock the authorization module
vi.mock("../../lib/auth/authorization", () => ({
  requireCustomer: vi.fn(),
}));

// Mock the ownership module
vi.mock("../../lib/auth/ownership", () => ({
  ownsBusiness: vi.fn().mockResolvedValue(true),
}));

const mockPrisma = {
  business: {
    findUnique: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
  }
};

// We need to provide the actual mock object to vitest so we map `prisma` to `mockPrisma`
vi.mock("../../lib/prisma", () => ({
  prisma: {
    business: {
      findUnique: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
    }
  }
}));

// Actually we need to import prisma to assert on it
import { prisma } from "../../lib/prisma";

describe("Business Lifecycle Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("deleteBusinessAction", () => {
    it("allows deletion when the business has no history", async () => {
      vi.mocked(requireCustomer).mockResolvedValue({
        id: "user-1",
        role: "CUSTOMER",
      } as any);

      (prisma.business.findUnique as any).mockResolvedValue({
        id: "business-1",
        userId: "user-1",
        _count: {
          supplyRequests: 0,
          quotes: 0,
          orders: 0,
          invoices: 0,
        },
      });

      (prisma.business.delete as any).mockResolvedValue({ id: "business-1" });

      const result = await deleteBusinessAction("business-1");

      expect(result.success).toBe(true);
      expect((prisma.business.delete as any)).toHaveBeenCalledWith({
        where: { id: "business-1" },
      });
    });

    it("prevents deletion and returns HAS_HISTORY when history exists", async () => {
      vi.mocked(requireCustomer).mockResolvedValue({
        id: "user-1",
        role: "CUSTOMER",
      } as any);

      (prisma.business.findUnique as any).mockResolvedValue({
        id: "business-with-history",
        userId: "user-1",
        _count: {
          supplyRequests: 1,
          quotes: 0,
          orders: 0,
          invoices: 0,
        },
      });

      const result = await deleteBusinessAction("business-with-history");

      expect(result.success).toBe(false);
      expect(result).toHaveProperty("error", "HAS_HISTORY");
      expect((prisma.business.delete as any)).not.toHaveBeenCalled();
    });

    it("handles Prisma Restrict constraints when deleting", async () => {
      vi.mocked(requireCustomer).mockResolvedValue({
        id: "user-1",
        role: "CUSTOMER",
      } as any);

      (prisma.business.findUnique as any).mockResolvedValue({
        id: "business-with-locations",
        userId: "user-1",
        _count: {
          supplyRequests: 0,
          quotes: 0,
          orders: 0,
          invoices: 0,
        },
      });

      // Mock Prisma P2003 constraint error
      const error = new Error("Foreign key constraint failed");
      (error as any).code = "P2003";
      (prisma.business.delete as any).mockRejectedValue(error);

      const result = await deleteBusinessAction("business-with-locations");

      expect(result.success).toBe(false);
      expect(result).toHaveProperty("error", "HAS_LOCATIONS");
    });
  });

  describe("deactivateBusinessAction", () => {
    it("soft deletes the business by setting isActive to false", async () => {
      vi.mocked(requireCustomer).mockResolvedValue({
        id: "user-1",
        role: "CUSTOMER",
      } as any);

      (prisma.business.update as any).mockResolvedValue({ id: "business-1", isActive: false });

      const result = await deactivateBusinessAction("business-1");

      expect(result.success).toBe(true);
      expect((prisma.business.update as any)).toHaveBeenCalledWith({
        where: { id: "business-1" },
        data: { isActive: false },
      });
    });
  });
});
