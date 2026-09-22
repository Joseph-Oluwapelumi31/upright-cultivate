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

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seed...\n");

  // =========================================================
  // ADMIN
  // =========================================================

  const adminPasswordHash = await argon2.hash(seedAdminPassword);

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@uprightcultivate.com",
    },
    update: {
      name: "Upright Cultivate Admin",
      role: "ADMIN",
      passwordHash: adminPasswordHash,
    },
    create: {
      id: "seed-admin",
      name: "Upright Cultivate Admin",
      email: "admin@uprightcultivate.com",
      role: "ADMIN",
      passwordHash: adminPasswordHash,
    },
  });

  console.log(`✓ Admin: ${admin.email}`);

  // =========================================================
  // CUSTOMER
  // =========================================================

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

  console.log(`✓ Customer: ${customer.email}`);

  // =========================================================
  // CUSTOMER PROFILE
  // =========================================================

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

  console.log(`✓ Customer profile: ${customerProfile.id}`);

  // =========================================================
  // BUSINESS
  // =========================================================

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

  console.log(`✓ Business: ${business.name}`);

  // =========================================================
  // LOCATIONS
  // =========================================================

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

  console.log(`✓ Location: ${lekkiLocation.name}`);
  console.log(`✓ Location: ${victoriaIslandLocation.name}`);

  // =========================================================
  // PRODUCT CATEGORIES
  // =========================================================

  const lettuceCategory = await prisma.productCategory.upsert({
    where: {
      slug: "lettuce-varieties",
    },
    update: {
      name: "Lettuce Varieties",
      description: "Fresh indoor-grown lettuce varieties.",
      isActive: true,
    },
    create: {
      id: "seed-category-lettuce",
      name: "Lettuce Varieties",
      slug: "lettuce-varieties",
      description: "Fresh indoor-grown lettuce varieties.",
      isActive: true,
    },
  });

  const greensCategory = await prisma.productCategory.upsert({
    where: {
      slug: "salad-cooking-greens",
    },
    update: {
      name: "Salad & Cooking Greens",
      description: "Fresh greens for salads and commercial kitchens.",
      isActive: true,
    },
    create: {
      id: "seed-category-greens",
      name: "Salad & Cooking Greens",
      slug: "salad-cooking-greens",
      description: "Fresh greens for salads and commercial kitchens.",
      isActive: true,
    },
  });

  const herbsCategory = await prisma.productCategory.upsert({
    where: {
      slug: "fresh-culinary-herbs",
    },
    update: {
      name: "Fresh Culinary Herbs",
      description: "Fresh herbs for professional kitchens.",
      isActive: true,
    },
    create: {
      id: "seed-category-herbs",
      name: "Fresh Culinary Herbs",
      slug: "fresh-culinary-herbs",
      description: "Fresh herbs for professional kitchens.",
      isActive: true,
    },
  });

  const staplesCategory = await prisma.productCategory.upsert({
    where: {
      slug: "kitchen-staples",
    },
    update: {
      name: "Kitchen Staples",
      description: "Fresh staples for commercial food operations.",
      isActive: true,
    },
    create: {
      id: "seed-category-staples",
      name: "Kitchen Staples",
      slug: "kitchen-staples",
      description: "Fresh staples for commercial food operations.",
      isActive: true,
    },
  });

  console.log("✓ Product categories created");

  // =========================================================
  // PRODUCTS
  // =========================================================

  const romaine = await prisma.product.upsert({
    where: {
      slug: "romaine-lettuce",
    },
    update: {
      name: "Romaine Lettuce",
      categoryId: lettuceCategory.id,
      description:
        "Crisp, fresh romaine lettuce grown in a controlled environment.",
      unit: "KG",
      status: "ACTIVE",
    },
    create: {
      id: "seed-product-romaine",
      categoryId: lettuceCategory.id,
      name: "Romaine Lettuce",
      slug: "romaine-lettuce",
      description:
        "Crisp, fresh romaine lettuce grown in a controlled environment.",
      unit: "KG",
      status: "ACTIVE",
    },
  });

  const butterhead = await prisma.product.upsert({
    where: {
      slug: "butterhead-lettuce",
    },
    update: {
      name: "Butterhead Lettuce",
      categoryId: lettuceCategory.id,
      description: "Tender butterhead lettuce with a soft texture.",
      unit: "KG",
      status: "ACTIVE",
    },
    create: {
      id: "seed-product-butterhead",
      categoryId: lettuceCategory.id,
      name: "Butterhead Lettuce",
      slug: "butterhead-lettuce",
      description: "Tender butterhead lettuce with a soft texture.",
      unit: "KG",
      status: "ACTIVE",
    },
  });

  const kale = await prisma.product.upsert({
    where: {
      slug: "kale",
    },
    update: {
      name: "Kale",
      categoryId: greensCategory.id,
      description: "Fresh nutrient-rich kale for salads and cooking.",
      unit: "KG",
      status: "ACTIVE",
    },
    create: {
      id: "seed-product-kale",
      categoryId: greensCategory.id,
      name: "Kale",
      slug: "kale",
      description: "Fresh nutrient-rich kale for salads and cooking.",
      unit: "KG",
      status: "ACTIVE",
    },
  });

  const basil = await prisma.product.upsert({
    where: {
      slug: "basil",
    },
    update: {
      name: "Basil",
      categoryId: herbsCategory.id,
      description: "Fresh aromatic basil for professional kitchens.",
      unit: "KG",
      status: "ACTIVE",
    },
    create: {
      id: "seed-product-basil",
      categoryId: herbsCategory.id,
      name: "Basil",
      slug: "basil",
      description: "Fresh aromatic basil for professional kitchens.",
      unit: "KG",
      status: "ACTIVE",
    },
  });

  const springOnions = await prisma.product.upsert({
    where: {
      slug: "spring-onions",
    },
    update: {
      name: "Spring Onions",
      categoryId: staplesCategory.id,
      description: "Fresh spring onions for commercial kitchens.",
      unit: "KG",
      status: "ACTIVE",
    },
    create: {
      id: "seed-product-spring-onions",
      categoryId: staplesCategory.id,
      name: "Spring Onions",
      slug: "spring-onions",
      description: "Fresh spring onions for commercial kitchens.",
      unit: "KG",
      status: "ACTIVE",
    },
  });

  console.log("✓ Products created");

  // =========================================================
  // PRODUCT PRICES
  // =========================================================

  const productPrices = [
    {
      id: "seed-price-romaine",
      productId: romaine.id,
      price: "4500",
    },
    {
      id: "seed-price-butterhead",
      productId: butterhead.id,
      price: "5000",
    },
    {
      id: "seed-price-kale",
      productId: kale.id,
      price: "4200",
    },
    {
      id: "seed-price-basil",
      productId: basil.id,
      price: "6500",
    },
    {
      id: "seed-price-spring-onions",
      productId: springOnions.id,
      price: "3500",
    },
  ];

  for (const productPrice of productPrices) {
    await prisma.productPrice.upsert({
      where: {
        id: productPrice.id,
      },
      update: {
        price: productPrice.price,
        currency: "NGN",
        isActive: true,
      },
      create: {
        id: productPrice.id,
        productId: productPrice.productId,
        price: productPrice.price,
        currency: "NGN",
        isActive: true,
      },
    });
  }

  console.log("✓ Product prices created");

  // =========================================================
  // PRODUCT AVAILABILITY
  // =========================================================

  const availability = [
    {
      id: "seed-availability-romaine",
      productId: romaine.id,
      isAvailable: true,
      notes: "Available for regular supply.",
    },
    {
      id: "seed-availability-butterhead",
      productId: butterhead.id,
      isAvailable: true,
      notes: "Available for regular supply.",
    },
    {
      id: "seed-availability-kale",
      productId: kale.id,
      isAvailable: true,
      notes: "Available for regular supply.",
    },
    {
      id: "seed-availability-basil",
      productId: basil.id,
      isAvailable: true,
      notes: "Available for regular supply.",
    },
    {
      id: "seed-availability-spring-onions",
      productId: springOnions.id,
      isAvailable: true,
      notes: "Available for regular supply.",
    },
  ];

  for (const item of availability) {
    await prisma.productAvailability.upsert({
      where: {
        id: item.id,
      },
      update: {
        isAvailable: item.isAvailable,
        notes: item.notes,
      },
      create: {
        id: item.id,
        productId: item.productId,
        isAvailable: item.isAvailable,
        notes: item.notes,
      },
    });
  }

  console.log("✓ Product availability created");

  console.log("\n🌱 Database seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("\n❌ Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
