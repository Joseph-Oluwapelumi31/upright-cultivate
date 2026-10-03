import { PrismaClient } from "../../lib/generated/prisma/client";

export async function seedCatalog(prisma: PrismaClient) {

  /*
   * ============================================================
   * PRODUCT CATEGORIES
   * ============================================================
   */

  const lettuceCategory = await prisma.productCategory.upsert({
    where: {
      slug: "lettuce-varieties",
    },
    update: {
      name: "Lettuce varieties",
      description:
        "Reliable varieties for salads, sandwiches, plating, and everyday kitchen service.",
      isActive: true,
    },
    create: {
      id: "seed-category-lettuce",
      name: "Lettuce varieties",
      slug: "lettuce-varieties",
      description:
        "Reliable varieties for salads, sandwiches, plating, and everyday kitchen service.",
      isActive: true,
    },
  });

  const greensCategory = await prisma.productCategory.upsert({
    where: {
      slug: "salad-cooking-greens",
    },
    update: {
      name: "Salad & cooking greens",
      description:
        "Versatile greens for fresh dishes, cooking, garnishing, and high-volume preparation.",
      isActive: true,
    },
    create: {
      id: "seed-category-greens",
      name: "Salad & cooking greens",
      slug: "salad-cooking-greens",
      description:
        "Versatile greens for fresh dishes, cooking, garnishing, and high-volume preparation.",
      isActive: true,
    },
  });

  const herbsCategory = await prisma.productCategory.upsert({
    where: {
      slug: "fresh-culinary-herbs",
    },
    update: {
      name: "Fresh culinary herbs",
      description:
        "Aromatic herbs that bring freshness and finishing detail to food and drinks.",
      isActive: true,
    },
    create: {
      id: "seed-category-herbs",
      name: "Fresh culinary herbs",
      slug: "fresh-culinary-herbs",
      description:
        "Aromatic herbs that bring freshness and finishing detail to food and drinks.",
      isActive: true,
    },
  });

  const staplesCategory = await prisma.productCategory.upsert({
    where: {
      slug: "kitchen-staples",
    },
    update: {
      name: "Kitchen staples",
      description:
        "Essential herbs and alliums for sauces, seasoning, finishing, and everyday kitchen use.",
      isActive: true,
    },
    create: {
      id: "seed-category-staples",
      name: "Kitchen staples",
      slug: "kitchen-staples",
      description:
        "Essential herbs and alliums for sauces, seasoning, finishing, and everyday kitchen use.",
      isActive: true,
    },
  });

  console.log("[OK] Product categories created");

  /*
   * ============================================================
   * PRODUCTS
   * ============================================================
   */

  const products = [
    /*
     * ----------------------------------------------------------
     * LETTUCE VARIETIES
     * ----------------------------------------------------------
     */

    {
      id: "seed-product-romaine",
      categoryId: lettuceCategory.id,
      name: "Romaine",
      slug: "romaine",
      description:
        "Crisp, structured leaves that work well in salads, wraps, and sandwiches.",
      imageUrl: "/products/romaine_lettuce.png",
      unit: "KG" as const,
      status: "ACTIVE" as const,
    },

    {
      id: "seed-product-butterhead",
      categoryId: lettuceCategory.id,
      name: "Butterhead",
      slug: "butterhead",
      description:
        "Tender, soft leaves with a delicate texture for salads and plating.",
      imageUrl: "/products/butterhead_lettuce.png",
      unit: "KG" as const,
      status: "ACTIVE" as const,
    },

    {
      id: "seed-product-green-leaf",
      categoryId: lettuceCategory.id,
      name: "Green leaf",
      slug: "green-leaf",
      description:
        "Versatile leafy greens suited to salads, sandwiches, and everyday kitchen use.",
      imageUrl: "/products/green_leaf_lettuce.png",
      unit: "KG" as const,
      status: "ACTIVE" as const,
    },

    {
      id: "seed-product-red-leaf",
      categoryId: lettuceCategory.id,
      name: "Red leaf",
      slug: "red-leaf",
      description:
        "Vibrant red-tinted leaves that add colour and freshness to salads and dishes.",
      imageUrl: "/products/red_leaf_lettuce.png",
      unit: "KG" as const,
      status: "ACTIVE" as const,
    },

    {
      id: "seed-product-iceberg",
      categoryId: lettuceCategory.id,
      name: "Iceberg",
      slug: "iceberg",
      description:
        "Crisp, refreshing leaves that hold up well in high-volume kitchen service.",
      imageUrl: "/products/iceberg_lettuce.png",
      unit: "KG" as const,
      status: "ACTIVE" as const,
    },

    /*
     * ----------------------------------------------------------
     * SALAD & COOKING GREENS
     * ----------------------------------------------------------
     */

    {
      id: "seed-product-kale",
      categoryId: greensCategory.id,
      name: "Kale",
      slug: "kale",
      description:
        "Nutrient-rich leafy greens suited to salads, smoothies, and cooked dishes.",
      imageUrl: "/products/curly_kale.png",
      unit: "KG" as const,
      status: "ACTIVE" as const,
    },

    {
      id: "seed-product-spinach",
      categoryId: greensCategory.id,
      name: "Spinach",
      slug: "spinach",
      description:
        "Tender, versatile greens for salads, cooking, smoothies, and food preparation.",
      imageUrl: "/products/spinach.png",
      unit: "KG" as const,
      status: "ACTIVE" as const,
    },

    {
      id: "seed-product-swiss-chard",
      categoryId: greensCategory.id,
      name: "Swiss chard",
      slug: "swiss-chard",
      description:
        "Colourful leafy greens with a rich flavour for salads and cooked dishes.",
      imageUrl: "/products/swiss_chard.png",
      unit: "KG" as const,
      status: "ACTIVE" as const,
    },

    {
      id: "seed-product-arugula",
      categoryId: greensCategory.id,
      name: "Arugula",
      slug: "arugula",
      description:
        "Peppery greens that add a distinctive flavour to salads, pizza, and plating.",
      imageUrl: "/products/arugula.png",
      unit: "KG" as const,
      status: "ACTIVE" as const,
    },

    {
      id: "seed-product-watercress",
      categoryId: greensCategory.id,
      name: "Watercress",
      slug: "watercress",
      description:
        "Fresh, peppery leaves ideal for salads, garnishing, and premium dishes.",
      imageUrl: "/products/watercress.png",
      unit: "KG" as const,
      status: "ACTIVE" as const,
    },

    {
      id: "seed-product-bok-choy",
      categoryId: greensCategory.id,
      name: "Bok choy",
      slug: "bok-choy",
      description:
        "Crisp Asian greens suited to stir-fries, soups, and other cooked dishes.",
      imageUrl: "/products/baby_bok_choy.png",
      unit: "KG" as const,
      status: "ACTIVE" as const,
    },

    {
      id: "seed-product-pak-choi",
      categoryId: greensCategory.id,
      name: "Pak choi",
      slug: "pak-choi",
      description:
        "Tender, crisp greens that work especially well in Asian-inspired dishes.",
      imageUrl: "/products/pak_choi.png",
      unit: "KG" as const,
      status: "ACTIVE" as const,
    },

    /*
     * ----------------------------------------------------------
     * FRESH CULINARY HERBS
     * ----------------------------------------------------------
     */

    {
      id: "seed-product-basil",
      categoryId: herbsCategory.id,
      name: "Basil",
      slug: "basil",
      description:
        "Aromatic fresh herbs for sauces, salads, pasta, garnishing, and drinks.",
      imageUrl: "/products/basil.png",
      unit: "KG" as const,
      status: "ACTIVE" as const,
    },

    {
      id: "seed-product-mint",
      categoryId: herbsCategory.id,
      name: "Mint",
      slug: "mint",
      description:
        "Fresh, cooling herbs for drinks, desserts, salads, and culinary finishing.",
      imageUrl: "/products/mint.png",
      unit: "KG" as const,
      status: "ACTIVE" as const,
    },

    {
      id: "seed-product-parsley",
      categoryId: herbsCategory.id,
      name: "Parsley",
      slug: "parsley",
      description:
        "Fresh aromatic herbs for seasoning, garnishing, sauces, and everyday cooking.",
      imageUrl: "/products/fresh_parsley.png",
      unit: "KG" as const,
      status: "ACTIVE" as const,
    },

    {
      id: "seed-product-coriander",
      categoryId: herbsCategory.id,
      name: "Coriander",
      slug: "coriander",
      description:
        "Fragrant herbs that bring freshness to sauces, salads, soups, and finished dishes.",
      imageUrl: "/products/coriander_cilantro.png",
      unit: "KG" as const,
      status: "ACTIVE" as const,
    },

    /*
     * ----------------------------------------------------------
     * KITCHEN STAPLES
     * ----------------------------------------------------------
     */

    {
      id: "seed-product-dill",
      categoryId: staplesCategory.id,
      name: "Dill",
      slug: "dill",
      description:
        "Fresh aromatic herbs that pair well with salads, seafood, sauces, and pickles.",
      imageUrl: "/products/dill.png",
      unit: "KG" as const,
      status: "ACTIVE" as const,
    },

    {
      id: "seed-product-chives",
      categoryId: staplesCategory.id,
      name: "Chives",
      slug: "chives",
      description:
        "Mild onion-flavoured herbs ideal for finishing dishes, sauces, and salads.",
      imageUrl: "/products/chives.png",
      unit: "KG" as const,
      status: "ACTIVE" as const,
    },

    {
      id: "seed-product-oregano",
      categoryId: staplesCategory.id,
      name: "Oregano",
      slug: "oregano",
      description:
        "Aromatic herbs suited to sauces, marinades, pizzas, and Mediterranean dishes.",
      imageUrl: "/products/oregano.png",
      unit: "KG" as const,
      status: "ACTIVE" as const,
    },

    {
      id: "seed-product-thyme",
      categoryId: staplesCategory.id,
      name: "Thyme",
      slug: "thyme",
      description:
        "Fragrant herbs that complement roasted dishes, sauces, soups, and marinades.",
      imageUrl: "/products/thyme.png",
      unit: "KG" as const,
      status: "ACTIVE" as const,
    },

    {
      id: "seed-product-spring-onions",
      categoryId: staplesCategory.id,
      name: "Spring onions",
      slug: "spring-onions",
      description:
        "Fresh, crisp alliums for garnishing, salads, stir-fries, and everyday cooking.",
      imageUrl: "/products/spring_onions.png",
      unit: "KG" as const,
      status: "ACTIVE" as const,
    },
  ];

  /*
   * ============================================================
   * PRODUCT UPSERTS
   * ============================================================
   */

  for (const product of products) {
    await prisma.product.upsert({
      where: {
        slug: product.slug,
      },
      update: {
        name: product.name,
        categoryId: product.categoryId,
        description: product.description,
        imageUrl: product.imageUrl,
        unit: product.unit,
        status: product.status,
      },
      create: product,
    });
  }

  console.log(`[OK] Products created: ${products.length}`);

  /*
   * ============================================================
   * PRODUCT PRICES
   * ============================================================
   */

  const productPrices = [
    // Lettuce varieties
    { slug: "romaine", price: "4500" },
    { slug: "butterhead", price: "5000" },
    { slug: "green-leaf", price: "4500" },
    { slug: "red-leaf", price: "5000" },
    { slug: "iceberg", price: "4800" },

    // Salad & cooking greens
    { slug: "kale", price: "4200" },
    { slug: "spinach", price: "4000" },
    { slug: "swiss-chard", price: "4500" },
    { slug: "arugula", price: "5500" },
    { slug: "watercress", price: "5000" },
    { slug: "bok-choy", price: "4500" },
    { slug: "pak-choi", price: "4500" },

    // Fresh culinary herbs
    { slug: "basil", price: "6500" },
    { slug: "mint", price: "5500" },
    { slug: "parsley", price: "5000" },
    { slug: "coriander", price: "5000" },

    // Kitchen staples
    { slug: "dill", price: "6000" },
    { slug: "chives", price: "6000" },
    { slug: "oregano", price: "6500" },
    { slug: "thyme", price: "6500" },
    { slug: "spring-onions", price: "3500" },
  ];

  for (const productPrice of productPrices) {
    const product = await prisma.product.findUnique({
      where: {
        slug: productPrice.slug,
      },
    });

    if (!product) {
      throw new Error(
        `Cannot create price: product "${productPrice.slug}" was not found.`,
      );
    }

    await prisma.productPrice.upsert({
      where: {
        id: `seed-price-${product.slug}`,
      },
      update: {
        productId: product.id,
        price: productPrice.price,
        currency: "NGN",
        isActive: true,
      },
      create: {
        id: `seed-price-${product.slug}`,
        productId: product.id,
        price: productPrice.price,
        currency: "NGN",
        isActive: true,
      },
    });
  }

  console.log(`[OK] Product prices created: ${productPrices.length}`);

  /*
   * ============================================================
   * PRODUCT AVAILABILITY
   * ============================================================
   */

  for (const product of products) {
    const seededProduct = await prisma.product.findUnique({
      where: {
        slug: product.slug,
      },
    });

    if (!seededProduct) {
      throw new Error(
        `Cannot create availability: product "${product.slug}" was not found.`,
      );
    }

    await prisma.productAvailability.upsert({
      where: {
        id: `seed-availability-${product.slug}`,
      },
      update: {
        productId: seededProduct.id,
        isAvailable: true,
        estimatedDate: null,
        notes: "Available for regular supply.",
      },
      create: {
        id: `seed-availability-${product.slug}`,
        productId: seededProduct.id,
        isAvailable: true,
        estimatedDate: null,
        notes: "Available for regular supply.",
      },
    });
  }

  console.log(`[OK] Product availability created: ${products.length}`);
}
