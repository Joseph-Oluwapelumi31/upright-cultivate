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
  console.log("[INFO] Starting production database seed...\n");

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

  await seedCatalog(prisma);

  /*
   * ============================================================
   * COMPLETE
   * ============================================================
   */

  console.log("\n[OK] Production database seed completed successfully.");
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
