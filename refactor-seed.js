const fs = require("fs");
const path = require("path");

const seedTsPath = path.join(__dirname, "prisma/seed.ts");
const catalogTsPath = path.join(__dirname, "prisma/seed-data/catalog.ts");

let content = fs.readFileSync(seedTsPath, "utf8");
const lines = content.split("\n");

// Find the line where Product Categories start
let startLine = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("PRODUCT CATEGORIES")) {
    startLine = i - 3;
    break;
  }
}

let endLine = -1;
for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].includes("COMPLETE")) {
    // The previous block is PRODUCT AVAILABILITY, followed by console.log(...) and a );
    // Just find the block comment for COMPLETE
    endLine = i - 3; 
    break;
  }
}

const catalogLines = lines.slice(startLine, endLine);

const catalogContent = `import { PrismaClient } from "../../lib/generated/prisma/client";

export async function seedCatalog(prisma: PrismaClient) {
${catalogLines.join("\n")}
}
`;

fs.writeFileSync(catalogTsPath, catalogContent, "utf8");

const newSeedTsLines = [
  'import { seedCatalog } from "./seed-data/catalog";',
  ...lines.slice(0, startLine),
  '  await seedCatalog(prisma);',
  '',
  ...lines.slice(endLine)
];

fs.writeFileSync(seedTsPath, newSeedTsLines.join("\n"), "utf8");
