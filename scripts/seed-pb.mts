// ─── PocketBase Migration Script ───
// Run this script AFTER PocketBase is started and superuser is created
//
// Step 1: Create superuser (one-time)
//   ./pocketbase superuser upsert admin@mittiart.com "your-password" --dir=pb_data
//
// Step 2: Start PocketBase
//   ./pocketbase serve
//
// Step 3: Run this script
//   npx tsx scripts/seed-pb.mts
//
// Or combine step 1+2:
//   ./pocketbase superuser upsert admin@mittiart.com "your-password" --dir=pb_data && ./pocketbase serve

import PocketBase from "pocketbase";
import { products } from "../src/lib/products";

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || "admin@mittiart.com";
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD || "mitti@2024!ChangeMeSecure";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createCollection(pb: any, data: any) {
  // PocketBase v0.39+ creates collections via the SDK's collections service
  return pb.collections.create(data);
}

async function setup() {
  const pb = new PocketBase(PB_URL);

  console.log("⏳ Connecting to PocketBase...");

  // Wait for server to be ready
  for (let i = 0; i < 30; i++) {
    try {
      await pb.health.check();
      break;
    } catch {
      console.log(`   Waiting for server (${i + 1}/30)...`);
      await sleep(1000);
    }
  }

  console.log("✅ Connected");

  // Login as superuser using the _superusers collection (PocketBase v0.39+)
  await pb.collection("_superusers").authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
  console.log("✅ Logged in as superuser");

  // ─── Create collections ───
  const collections = await pb.collections.getFullList();
  const exists = (name: string) => collections.some((c: any) => c.name === name);

  // Products collection
  if (!exists("products")) {
    await pb.collections.create({
      name: "products",
      type: "base",
      schema: [
        { name: "name", type: "text", required: true },
        { name: "hindiName", type: "text" },
        { name: "slug", type: "text", required: true, unique: true },
        { name: "image", type: "text" },
        { name: "category", type: "text", required: true },
        { name: "medium", type: "text" },
        { name: "price", type: "number", required: true },
        { name: "description", type: "text" },
        { name: "story", type: "text" },
        { name: "dimensions", type: "text" },
        { name: "featured", type: "bool" },
        { name: "sold", type: "bool" },
        { name: "year", type: "number" },
        { name: "inStock", type: "bool" },
      ],
      listRule: null,
      viewRule: null,
    });
    console.log("✅ Products collection created");
  } else {
    console.log("   Products collection already exists");
  }

  // Commissions collection
  if (!exists("commissions")) {
    await pb.collections.create({
      name: "commissions",
      type: "base",
      schema: [
        { name: "name", type: "text", required: true },
        { name: "email", type: "email", required: true },
        { name: "phone", type: "text" },
        { name: "type", type: "text" },
        { name: "description", type: "text" },
        { name: "budget", type: "number" },
        { name: "timeline", type: "text" },
        { name: "reference", type: "text" },
      ],
      listRule: null,
      viewRule: null,
    });
    console.log("✅ Commissions collection created");
  }

  // Subscribers collection
  if (!exists("subscribers")) {
    await pb.collections.create({
      name: "subscribers",
      type: "base",
      schema: [
        { name: "email", type: "email", required: true, unique: true },
        { name: "name", type: "text" },
      ],
      listRule: null,
      viewRule: null,
    });
    console.log("✅ Subscribers collection created");
  }

  // Orders collection
  if (!exists("orders")) {
    await pb.collections.create({
      name: "orders",
      type: "base",
      schema: [
        { name: "customerName", type: "text", required: true },
        { name: "customerEmail", type: "email", required: true },
        { name: "customerPhone", type: "text" },
        { name: "address", type: "text" },
        { name: "items", type: "json" },
        { name: "total", type: "number" },
        { name: "status", type: "text" },
        { name: "notes", type: "text" },
      ],
      listRule: null,
      viewRule: null,
    });
    console.log("✅ Orders collection created");
  }

  // ─── Seed products ───
  if (!exists("products")) {
    // Wait a moment for collection to be fully indexed
    await sleep(500);
    for (const product of products) {
      try {
        await pb.collection("products").create({
          name: product.name,
          hindiName: product.hindiName,
          slug: product.slug,
          image: `/images/${product.image}`,
          category: product.category,
          medium: product.medium,
          price: product.price,
          description: product.description,
          story: product.story,
          dimensions: product.dimensions,
          featured: product.featured || false,
          sold: product.sold || false,
          year: product.year || 2024,
          inStock: product.inStock,
        });
        console.log(`   ✓ ${product.name}`);
      } catch (e: any) {
        console.error(`   ✗ Failed to create ${product.name}: ${e?.message}`);
      }
    }
    console.log("✅ Products seeded");
  } else {
    console.log("   Products already seeded");
  }

  console.log("\n🎉 PocketBase setup complete!");
  console.log(`   Admin UI: ${PB_URL}/_/`);
  console.log(`   Email: ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
}

setup().catch((e) => {
  console.error("❌ Setup failed:", e.message || e);
  process.exit(1);
});
