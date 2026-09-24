"use server";

import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireCustomer } from "@/lib/auth/authorization";
import { createSupplyRequestSchema } from "@/lib/validations/supply-request";

export type SupplyRequestState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitSupplyRequest(
  _previousState: SupplyRequestState,
  formData: FormData
): Promise<SupplyRequestState> {
  /*
   * 1. Authenticate + authorize
   *
   * This must happen on the server.
   * Never accept userId from FormData.
   */
  const user = await requireCustomer();

  /*
   * 2. Parse items from FormData
   */
  const rawItems = formData.get("items");

  let items: unknown = [];

  try {
    items = rawItems ? JSON.parse(String(rawItems)) : [];
  } catch {
    items = [];
  }

  /*
   * 3. Convert FormData values into the shape
   * expected by our server-side schema.
   */
  const rawIsRecurring = formData.get("isRecurring");

  const rawPreferredDeliveryDate = formData.get(
    "preferredDeliveryDate"
  );

  const result = createSupplyRequestSchema.safeParse({
    submissionKey: formData.get("submissionKey"),

    businessId: formData.get("businessId"),

    locationId: formData.get("locationId"),

    frequency: formData.get("frequency"),

    preferredDeliveryDate: rawPreferredDeliveryDate
      ? String(rawPreferredDeliveryDate)
      : undefined,

    isRecurring: rawIsRecurring === "true",

    notes: formData.get("notes") || undefined,

    items,
  });

  /*
   * 4. Reject invalid input
   */
  if (!result.success) {
    return {
      success: false,
      message: "Please check the form and try again.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const data = result.data;

  /*
   * 5. Prevent duplicate submissions
   *
   * The submissionKey is generated once by the client
   * for a single form submission.
   *
   * If the same request is submitted again using the
   * same key, return the existing request instead of
   * creating another one.
   */
  const existingRequest = await prisma.supplyRequest.findUnique({
    where: {
      submissionKey: data.submissionKey,
    },

    select: {
      id: true,
      referenceNumber: true,
      status: true,
    },
  });

  if (existingRequest) {
    return {
      success: true,
      message: `Supply request ${existingRequest.referenceNumber} has already been received.`,
    };
  }

  /*
   * 6. Verify that the business belongs
   * to the authenticated customer.
   */
  const business = await prisma.business.findFirst({
    where: {
      id: data.businessId,
      userId: user.id,
      isActive: true,
    },

    select: {
      id: true,
    },
  });

  if (!business) {
    return {
      success: false,
      message: "The selected business could not be found.",
    };
  }

  /*
   * 7. Verify that the location belongs
   * to that business.
   */
  const location = await prisma.location.findFirst({
    where: {
      id: data.locationId,
      businessId: business.id,
      isActive: true,
    },

    select: {
      id: true,
    },
  });

  if (!location) {
    return {
      success: false,
      message: "The selected delivery location could not be found.",
    };
  }

  /*
   * 8. Resolve products from the database.
   *
   * We do NOT trust product name or unit
   * from the browser.
   */
  const productSlugs = [
    ...new Set(
      data.items.map((item) => item.productSlug)
    ),
  ];

  const products = await prisma.product.findMany({
    where: {
      slug: {
        in: productSlugs,
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

  /*
   * 9. Make sure every requested product
   * actually exists and is active.
   */
  if (products.length !== productSlugs.length) {
    return {
      success: false,
      message: "One or more selected products are unavailable.",
    };
  }

  const productsBySlug = new Map(
    products.map((product) => [
      product.slug,
      product,
    ])
  );

  /*
   * 10. Generate a server-controlled
   * human-readable reference.
   */
  const year = new Date().getFullYear();

  const referenceNumber = `SR-${year}-${crypto
    .randomUUID()
    .replaceAll("-", "")
    .slice(0, 8)
    .toUpperCase()}`;

  /*
   * 11. Create the request and its items
   * atomically.
   */
  try {
    const request = await prisma.$transaction(
      async (tx) => {
        return tx.supplyRequest.create({
          data: {
            referenceNumber,

            /*
             * Idempotency key.
             *
             * This is protected by a UNIQUE constraint
             * in the database.
             */
            submissionKey: data.submissionKey,

            /*
             * NEVER use userId from the client.
             */
            userId: user.id,

            businessId: business.id,

            locationId: location.id,

            /*
             * Initial status as requested.
             */
            status: "PENDING",

            frequency: data.frequency,

            preferredDeliveryDate:
              data.preferredDeliveryDate,

            isRecurring: data.isRecurring,

            notes: data.notes || null,

            items: {
              create: data.items.map((item) => {
                const product = productsBySlug.get(
                  item.productSlug
                );

                /*
                 * This should already be guaranteed
                 * by the product validation above.
                 */
                if (!product) {
                  throw new Error(
                    "PRODUCT_NOT_FOUND"
                  );
                }

                return {
                  productId: product.id,

                  /*
                   * Server-controlled snapshot.
                   */
                  productNameSnapshot: product.name,

                  /*
                   * Server-controlled unit.
                   */
                  unit: product.unit,

                  quantity: item.quantity,

                  notes: item.notes || null,
                };
              }),
            },
          },

          select: {
            id: true,
            referenceNumber: true,
            status: true,
          },
        });
      }
    );

    return {
      success: true,
      message: `Supply request ${request.referenceNumber} has been received.`,
    };
  } catch (error) {
    /*
     * 12. Handle a duplicate submission that
     * slipped through the initial findUnique()
     * because two requests arrived simultaneously.
     *
     * The database's @unique constraint on
     * submissionKey is the final protection.
     */
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: true,
        message: "This supply request has already been submitted.",
      };
    }

    /*
     * 13. Handle unexpected database errors.
     */
    console.error(
      "Failed to create supply request:",
      error
    );

    return {
      success: false,
      message:
        "We couldn't submit your supply request. Please try again.",
    };
  }
}