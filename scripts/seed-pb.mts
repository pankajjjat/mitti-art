// ─── PocketBase Migration Script ───
// Run this script after starting PocketBase to create collections and seed data
// Usage: npx tsx scripts/seed-pb.mts

import PocketBase from "pocketbase";
import { products } from "../src/lib/products";

const PB_URL = "http://127.0.0.1:8090";
const ADMIN_EMAIL = "admin@mittiart.com";
const ADMIN_PASSWORD = "mitti@2024!ChangeMe";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

  // Create admin (first time only)
  try {
    await pb.admins.create({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      passwordConfirm: ADMIN_PASSWORD,
    });
    console.log("✅ Admin created");
  } catch (e: any) {
    if (e?.status === 409) {
      console.log("   Admin already exists, logging in...");
    } else {
      console.log("   Admin may already exist, logging in...");
    }
  }

  // Login as admin
  await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
  console.log("✅ Logged in as admin");

  // ─── Create products collection ───
  const collections = await pb.collections.getFullList();

  const hasProductsCollection = collections.some(
    (c: any) => c.name === "products"
  );
  const hasCommissionsCollection = collections.some(
    (c: any) => c.name === "commissions"
  );
  const hasSubscribersCollection = collections.some(
    (c: any) => c.name === "subscribers"
  );
  const hasOrdersCollection = collections.some((c: any) => c.name === "orders");

  // Products collection
  if (!hasProductsCollection) {
    await pb.collections.create({
      name: "products",
      type: "base",
      schema: [
        { name: "name", type: "text", required: true },
        { name: "hindiName", type: "text" },
        { name: "slug", type: "text", required: true, unique: true },
        { name: "image", type: "file" },
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
      listRule: "inStock = true",
      viewRule: "inStock = true",
      createRule: "",
      updateRule: "",
      deleteRule: "",
    });
    console.log("✅ Products collection created");
  } else {
    console.log("   Products collection already exists");
  }

  // Commissions collection
  if (!hasCommissionsCollection) {
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
      listRule: "",
      viewRule: "",
      createRule: "",
      updateRule: "",
      deleteRule: "",
    });
    console.log("✅ Commissions collection created");
  }

  // Subscribers collection
  if (!hasSubscribersCollection) {
    await pb.collections.create({
      name: "subscribers",
      type: "base",
      schema: [
        { name: "email", type: "email", required: true, unique: true },
        { name: "name", type: "text" },
      ],
      listRule: "",
      viewRule: "",
      createRule: "",
      updateRule: "",
      deleteRule: "",
    });
    console.log("✅ Subscribers collection created");
  }

  // Orders collection
  if (!hasOrdersCollection) {
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
      listRule: "",
      viewRule: "",
      createRule: "",
      updateRule: "",
      deleteRule: "",
    });
    console.log("✅ Orders collection created");
  }

  // ─── Seed products ───
  if (!hasProductsCollection) {
    for (const product of products) {
      // Skip sold items for the main product listing
      // but still add them as records so admins can see
      try {
        await pb.collection("products").create({
          name: product.name,
          hindiName: product.hindiName,
          slug: product.slug,
          category: product.category,
          medium: product.medium,
          price: product.price,
          description: product.description,
          story: product.story,
          dimensions: product.dimensions,
          featured: product.featured,
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
  }

  console.log("\n🎉 PocketBase setup complete!");
  console.log(`   Admin UI: ${PB_URL}/_/`);
  console.log(`   Email: ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log("\n⚠️  IMPORTANT: Change the admin password after first login!");
}

setup().catch((e) => {
  console.error("❌ Setup failed:", e);
  process.exit(1);
});
