const fs = require("fs");

["prisma/seed.ts", "prisma/seed-data/catalog.ts"].forEach((f) => {
  let content = fs.readFileSync(f, "utf8");
  // The strange symbols might be parsed differently, so let's match console.log
  content = content.replace(/console\.log\(".*?Starting database seed\.\.\.\\n"\);/, 'console.log("🌱 Starting database seed...\\n");');
  content = content.replace(/console\.log\(".*?Database seed completed successfully\."\);/, 'console.log("\\n🌱 Database seed completed successfully.");');
  content = content.replace(/console\.error\("\\n.*?Seed failed:"\);/, 'console.error("\\n❌ Seed failed:");');
  content = content.replace(/console\.log\(`.*? (Admin:.*?)`\);/, 'console.log(`✅ $1`);');
  content = content.replace(/console\.log\(`.*? (Customer:.*?)`\);/, 'console.log(`✅ $1`);');
  content = content.replace(/console\.log\(`.*? (Customer profile:.*?)`\);/, 'console.log(`✅ $1`);');
  content = content.replace(/console\.log\(`.*? (Business:.*?)`\);/, 'console.log(`✅ $1`);');
  content = content.replace(/console\.log\(`.*? (Location:.*?)`\);/g, 'console.log(`✅ $1`);');
  content = content.replace(/console\.log\(".*?Product categories created"\);/, 'console.log("✅ Product categories created");');
  content = content.replace(/console\.log\(`.*? (Products created:.*?)`\);/, 'console.log(`✅ $1`);');
  content = content.replace(/console\.log\(`.*? (Product prices created:.*?)`\);/, 'console.log(`✅ $1`);');
  content = content.replace(/console\.log\(`.*? (Product availability created:.*?)`\);/, 'console.log(`✅ $1`);');
  // Also clean up any that were just letters
  content = content.replace(/console\.log\(\\n"🌱/, 'console.log("\\n🌱');

  fs.writeFileSync(f, content, "utf8");
});
