import { describe, expect, it, vi, afterEach } from "vitest";
import { Prisma } from "@/lib/generated/prisma/client";

vi.mock("@/lib/auth/authorization", () => ({
  requireCustomer: vi.fn(),
}));

vi.mock("@/lib/prisma", async () => {
  const { prismaMock } = await import("../mocks/prisma");

  return {
    prisma: prismaMock,
  };
});

import { requireCustomer } from "@/lib/auth/authorization";
import { submitSupplyRequest } from "@/actions/supply-request";
import { prismaMock } from "@/tests/mocks/prisma";


function createValidFormData() {
  const formData = new FormData();

  formData.set(
    "submissionKey",
    "550e8400-e29b-41d4-a716-446655440000"
  );

  formData.set("businessId", "business-1");
  formData.set("locationId", "location-1");
  formData.set("frequency", "Weekly");
  formData.set("isRecurring", "true");

  formData.set(
    "items",
    JSON.stringify([
      {
        productSlug: "lettuce",
        quantity: 10,
        notes: "Fresh please",
      },
    ])
  );

  return formData;
}

describe("submitSupplyRequest", () => {
  afterEach(()=>{
    vi.clearAllMocks()
  })
  it("rejects unauthenticated users", async () => {
    vi.mocked(requireCustomer).mockRejectedValue(
      new Error("Unauthorized")
    );

    const formData = new FormData();

    await expect(
      submitSupplyRequest(
        {
          success: false,
          message: "",
        },
        formData
      )
    ).rejects.toThrow("Unauthorized");
  });

  it("rejects invalid form data", async ()=>{
    vi.mocked(requireCustomer).mockResolvedValue({
      id: "user-1",
      role: "CUSTOMER"
    })

    const formData = new FormData;

    const result = await submitSupplyRequest(
      {
        success: false,
        message: "",
      },
      formData
    );

    expect(result.success).toBe(false);
    expect(result.message).toBe("Please check the form and try again.");
    expect(result.fieldErrors).toBeDefined();
  })

  it("returns existing request form duplicate submission", async () => {
    vi.mocked(requireCustomer).mockResolvedValue({
      id: "user-1",
      role: "CUSTOMER",
    });

    vi.mocked(prismaMock.supplyRequest.findUnique).mockResolvedValue({
      id: "request-1",
      referenceNumber: "SR-2026-ABC12345",
      status: "PENDING",
    });

    const formData = createValidFormData();

    const result = await submitSupplyRequest(
      {
        success: false,
        message: "",
      },
      formData
    );

    expect(result.success).toBe(true);

    expect(result.message).toBe(
      "Supply request SR-2026-ABC12345 has already been received."
    );

  });

  it("rejects a business that does not belong to the customer", async ()=>{
    vi.mocked(requireCustomer).mockResolvedValue({
      id: "user-1",
      role: "CUSTOMER",
    })

    prismaMock.supplyRequest.findUnique.mockResolvedValue(null);
    prismaMock.business.findFirst.mockResolvedValue(null);

    const formData = createValidFormData();

    const result = await submitSupplyRequest({
      success: false,
      message: ""
    }, formData)
    expect(result.success).toBe(false);
    expect(result.message).toBe("The selected business could not be found.")
    expect(prismaMock.business.findFirst).toHaveBeenCalledWith({
      where: {
        id: "business-1",
        userId: "user-1",
        isActive: true,
      },
      select: {
        id: true,
      }
    })
  })

  it("rejects a location that does not belongs to the business", async()=>{
    vi.mocked(requireCustomer).mockResolvedValue({
      id: "user-1",
      role: "CUSTOMER",
    })

    prismaMock.supplyRequest.findUnique.mockResolvedValue(null);
    prismaMock.business.findFirst.mockResolvedValue({
      id: "business-1",
    });

    prismaMock.location.findFirst.mockResolvedValue(null)

    const formData = createValidFormData();

    const result = await submitSupplyRequest(
      {success: false, message: ""}, formData
    )

    expect(result.message).toBe("The selected delivery location could not be found.");
    expect(prismaMock.location.findFirst).toHaveBeenCalledWith({
      where: {
      id: "location-1",
      businessId: "business-1",
      isActive: true,
    },

    select: {
      id: true,
    },
  })
  });

  it("rejects unavailable products", async () => {
    vi.mocked(requireCustomer).mockResolvedValue({
      id: "user-1",
      role: "CUSTOMER",
    });

    prismaMock.supplyRequest.findUnique.mockResolvedValue(null);

    prismaMock.business.findFirst.mockResolvedValue({
      id: "business-1",
    });

    prismaMock.location.findFirst.mockResolvedValue({
      id: "location-1",
    });

    prismaMock.product.findMany.mockResolvedValue([]);

    const formData = createValidFormData();

    const result = await submitSupplyRequest(
      { success: false, message: "" },
      formData
    );

    expect(result.success).toBe(false);

    expect(result.message).toBe(
      "One or more selected products are unavailable."
    );

    expect(prismaMock.product.findMany).toHaveBeenCalledWith({
      where: {
        slug: {
          in: ["lettuce"],
        },
        status: "ACTIVE",
      },
      select: {
        id: true,
        slug: true,
        name: true,
        unit: true,
      },
    });
  });

  it("creates a supply request with trusted product data", async () => {
    vi.mocked(requireCustomer).mockResolvedValue({
      id: "user-1",
      role: "CUSTOMER",
    });

    prismaMock.supplyRequest.findUnique.mockResolvedValue(null);

    prismaMock.business.findFirst.mockResolvedValue({
      id: "business-1",
    });

    prismaMock.location.findFirst.mockResolvedValue({
      id: "location-1",
    });

    prismaMock.product.findMany.mockResolvedValue([
      {
        id: "product-1",
        slug: "lettuce",
        name: "Butterhead Lettuce",
        unit: "kg",
      },
    ]);

    const createMock = vi.fn().mockResolvedValue({
      id: "request-1",
      referenceNumber: "SR-2026-ABC12345",
      status: "PENDING",
    });

    prismaMock.$transaction.mockImplementation(async (callback) => {
      return callback({
        supplyRequest: {
          create: createMock,
        },
      });
    });

    const formData = createValidFormData();

    const result = await submitSupplyRequest(
      { success: false, message: "" },
      formData
    );

    expect(result.success).toBe(true);

    expect(result.message).toBe(
      "Supply request SR-2026-ABC12345 has been received."
    );

    expect(createMock).toHaveBeenCalledWith({
      data: {
        referenceNumber: expect.stringMatching(
          /^SR-2026-[A-Z0-9]{8}$/
        ),
        submissionKey:
          "550e8400-e29b-41d4-a716-446655440000",
        userId: "user-1",
        businessId: "business-1",
        locationId: "location-1",
        status: "PENDING",
        frequency: "Weekly",
        preferredDeliveryDate: undefined,
        isRecurring: true,
        notes: null,

        items: {
          create: [
            {
              productId: "product-1",
              productNameSnapshot: "Butterhead Lettuce",
              unit: "kg",
              quantity: 10,
              notes: "Fresh please",
            },
          ],
        },
      },

      select: {
        id: true,
        referenceNumber: true,
        status: true,
      },
    });
  });

  it("handles unexpected database errors", async () => {
    vi.mocked(requireCustomer).mockResolvedValue({
      id: "user-1",
      role: "CUSTOMER",
    });

    prismaMock.supplyRequest.findUnique.mockResolvedValue(null);

    prismaMock.business.findFirst.mockResolvedValue({
      id: "business-1",
    });

    prismaMock.location.findFirst.mockResolvedValue({
      id: "location-1",
    });

    prismaMock.product.findMany.mockResolvedValue([
      {
        id: "product-1",
        slug: "lettuce",
        name: "Butterhead Lettuce",
        unit: "kg",
      },
    ]);

    prismaMock.$transaction.mockRejectedValue(
      new Error("Database connection failed")
    );

    const formData = createValidFormData();

    const result = await submitSupplyRequest(
      { success: false, message: "" },
      formData
    );

    expect(result.success).toBe(false);

    expect(result.message).toBe(
      "We couldn't submit your supply request. Please try again."
    );
  });
  it("handles duplicate submission caused by a database unique constraint", async () => {
    vi.mocked(requireCustomer).mockResolvedValue({
      id: "user-1",
      role: "CUSTOMER",
    });

    prismaMock.supplyRequest.findUnique.mockResolvedValue(null);

    prismaMock.business.findFirst.mockResolvedValue({
      id: "business-1",
    });

    prismaMock.location.findFirst.mockResolvedValue({
      id: "location-1",
    });

    prismaMock.product.findMany.mockResolvedValue([
      {
        id: "product-1",
        slug: "lettuce",
        name: "Butterhead Lettuce",
        unit: "kg",
      },
    ]);

    const formData = createValidFormData();

    // We'll make the transaction fail with Prisma's P2002
    // unique-constraint error here.

    const error = new Prisma.PrismaClientKnownRequestError(
      "Unique constraint failed",
      {
        code: "P2002",
        clientVersion: "7.10.0",
      }
    );

    prismaMock.$transaction.mockRejectedValue(error);

    const result = await submitSupplyRequest(
      { success: false, message: "" },
      formData
    );

    expect(result.success).toBe(true);

    expect(result.message).toBe(
      "This supply request has already been submitted."
    );
  });

  it("does not access the database when form validation fails", async () => {
    vi.mocked(requireCustomer).mockResolvedValue({
      id: "user-1",
      role: "CUSTOMER",
    });
  
    const formData = new FormData();
  
    const result = await submitSupplyRequest(
      {
        success: false,
        message: "",
      },
      formData
    );
  
    expect(result.success).toBe(false);
  
    expect(prismaMock.supplyRequest.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.business.findFirst).not.toHaveBeenCalled();
    expect(prismaMock.location.findFirst).not.toHaveBeenCalled();
    expect(prismaMock.product.findMany).not.toHaveBeenCalled();
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
  });


});