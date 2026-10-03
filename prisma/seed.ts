import { seedCatalog } from "./seed-data/catalog";
import "dotenv/config";
import argon2 from "argon2";
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
const seedAdminPassword = getRequiredEnv("SEED_ADMIN_PASSWORD");

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("[INFO] Starting database seed...\n");

  /*
   * ============================================================
   * ADMIN
   * ============================================================
   */

  const adminPasswordHash = await argon2.hash(seedAdminPassword);

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@uprightcultivate.com",
    },
    update: {
      name: "Upright Cultivate Admin",
      role: "ADMIN",
      passwordHash: adminPasswordHash,
      emailVerified: new Date(),
    },
    create: {
      id: "seed-admin",
      name: "Upright Cultivate Admin",
      email: "admin@uprightcultivate.com",
      role: "ADMIN",
      passwordHash: adminPasswordHash,
      emailVerified: new Date(),
    },
  });

  console.log(`[OK] Admin: ${admin.email}`);

  /*
   * ============================================================
   * CUSTOMER
   * ============================================================
   */

  const customer = await prisma.user.upsert({
    where: {
      email: "customer@example.com",
    },
    update: {
      name: "Demo Customer",
      role: "CUSTOMER",
    },
    create: {
      id: "seed-customer",
      name: "Demo Customer",
      email: "customer@example.com",
      role: "CUSTOMER",
    },
  });

  console.log(`[OK] Customer: ${customer.email}`);

  /*
   * ============================================================
   * CUSTOMER PROFILE
   * ============================================================
   */

  const customerProfile = await prisma.customerProfile.upsert({
    where: {
      userId: customer.id,
    },
    update: {
      phone: "08000000000",
      notes: "Demo customer for development",
    },
    create: {
      id: "seed-customer-profile",
      userId: customer.id,
      phone: "08000000000",
      notes: "Demo customer for development",
    },
  });

  console.log(`[OK] Customer profile: ${customerProfile.id}`);

  /*
   * ============================================================
   * BUSINESS
   * ============================================================
   */

  const business = await prisma.business.upsert({
    where: {
      id: "seed-business-green-table",
    },
    update: {
      name: "The Green Table",
      type: "RESTAURANT",
      contactName: "Demo Customer",
      contactEmail: "customer@example.com",
      contactPhone: "08000000000",
      isActive: true,
    },
    create: {
      id: "seed-business-green-table",
      userId: customer.id,
      name: "The Green Table",
      type: "RESTAURANT",
      contactName: "Demo Customer",
      contactEmail: "customer@example.com",
      contactPhone: "08000000000",
      isActive: true,
    },
  });

  console.log(`[OK] Business: ${business.name}`);

  /*
   * ============================================================
   * LOCATIONS
   * ============================================================
   */

  const lekkiLocation = await prisma.location.upsert({
    where: {
      id: "seed-location-lekki",
    },
    update: {
      name: "The Green Table — Lekki",
      address: "12 Admiralty Way",
      city: "Lekki",
      state: "Lagos",
      country: "Nigeria",
      contactName: "Demo Customer",
      contactPhone: "08000000000",
      isActive: true,
    },
    create: {
      id: "seed-location-lekki",
      businessId: business.id,
      name: "The Green Table — Lekki",
      address: "12 Admiralty Way",
      city: "Lekki",
      state: "Lagos",
      country: "Nigeria",
      contactName: "Demo Customer",
      contactPhone: "08000000000",
      isActive: true,
    },
  });

  const victoriaIslandLocation = await prisma.location.upsert({
    where: {
      id: "seed-location-vi",
    },
    update: {
      name: "The Green Table — Victoria Island",
      address: "8 Ahmadu Bello Way",
      city: "Victoria Island",
      state: "Lagos",
      country: "Nigeria",
      contactName: "Demo Customer",
      contactPhone: "08000000000",
      isActive: true,
    },
    create: {
      id: "seed-location-vi",
      businessId: business.id,
      name: "The Green Table — Victoria Island",
      address: "8 Ahmadu Bello Way",
      city: "Victoria Island",
      state: "Lagos",
      country: "Nigeria",
      contactName: "Demo Customer",
      contactPhone: "08000000000",
      isActive: true,
    },
  });

  console.log(`[OK] Location: ${lekkiLocation.name}`);
  console.log(`[OK] Location: ${victoriaIslandLocation.name}`);
  await seedCatalog(prisma);


  /*
   * ============================================================
   * COMPLETE
   * ============================================================
   */

  console.log("\n[OK] Database seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("\n[ERROR] Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });