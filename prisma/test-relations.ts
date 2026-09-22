import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not defined`);
  }

  return value;
}

const connectionString = getRequiredEnv("DATABASE_URL");

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🔍 Testing Prisma relationships...\n");

  // =========================================================
  // 1. USER → CUSTOMER PROFILE → BUSINESSES → LOCATIONS
  // =========================================================

  const customer = await prisma.user.findUnique({
    where: {
      email: "customer@example.com",
    },
    include: {
      profile: true,
      businesses: {
        include: {
          locations: true,
        },
      },
    },
  });

  if (!customer) {
    throw new Error("Seed customer was not found.");
  }

  console.log("CUSTOMER");
  console.log(`Name: ${customer.name}`);
  console.log(`Email: ${customer.email}`);
  console.log(`Role: ${customer.role}`);
  console.log(`Profile phone: ${customer.profile?.phone ?? "None"}`);

  console.log(`Businesses: ${customer.businesses.length}`);

  for (const business of customer.businesses) {
    console.log(`\n  BUSINESS: ${business.name}`);
    console.log(`  Type: ${business.type}`);
    console.log(`  Contact: ${business.contactName ?? "None"}`);
    console.log(`  Contact email: ${business.contactEmail ?? "None"}`);
    console.log(`  Contact phone: ${business.contactPhone ?? "None"}`);
    console.log(`  Locations: ${business.locations.length}`);

    for (const location of business.locations) {
      console.log(`\n    LOCATION: ${location.name}`);
      console.log(`    Address: ${location.address}`);
      console.log(`    City: ${location.city}`);
      console.log(`    State: ${location.state ?? "None"}`);
      console.log(`    Country: ${location.country}`);
      console.log(`    Active: ${location.isActive ? "Yes" : "No"}`);
    }
  }

  // =========================================================
  // 2. PRODUCT → CATEGORY → PRICES → AVAILABILITY
  // =========================================================

  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
    },
    include: {
      category: true,
      prices: true,
      availability: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  if (products.length === 0) {
    throw new Error("No active products were found.");
  }

  console.log("\n\nPRODUCTS");
  console.log(`Active products: ${products.length}`);

  for (const product of products) {
    console.log(`\n  PRODUCT: ${product.name}`);
    console.log(`  Slug: ${product.slug}`);
    console.log(`  Category: ${product.category.name}`);
    console.log(`  Unit: ${product.unit}`);
    console.log(`  Status: ${product.status}`);

    console.log(`  Prices: ${product.prices.length}`);

    for (const price of product.prices) {
      console.log(
        `    ${price.currency} ${price.price} | Active: ${
          price.isActive ? "Yes" : "No"
        }`
      );
    }

    console.log(`  Availability records: ${product.availability.length}`);

    for (const availability of product.availability) {
      console.log(
        `    Available: ${availability.isAvailable ? "Yes" : "No"}`
      );

      if (availability.notes) {
        console.log(`    Notes: ${availability.notes}`);
      }
    }
  }

  // =========================================================
  // 3. BUSINESS → USER
  // =========================================================

  const business = await prisma.business.findFirst({
    where: {
      name: "The Green Table",
    },
    include: {
      user: true,
      locations: true,
    },
  });

  if (!business) {
    throw new Error("Seed business was not found.");
  }

  console.log("\n\nBUSINESS OWNER");
  console.log(`Business: ${business.name}`);
  console.log(`Owner: ${business.user.name}`);
  console.log(`Owner email: ${business.user.email}`);
  console.log(`Owner role: ${business.user.role}`);
  console.log(`Locations: ${business.locations.length}`);

  // =========================================================
  // SUCCESS
  // =========================================================

  console.log("\n========================================");
  console.log("✅ Relationship tests completed successfully.");
  console.log("========================================");
}

main()
  .catch((error) => {
    console.error("\n❌ Relationship test failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
