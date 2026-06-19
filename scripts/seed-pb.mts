// ─── PocketBase Seed Script ───
// Mitti Art — E-Commerce Schema
// Seeds products + testimonials, ensures collection API rules
//
// Prerequisites:
//   1. PocketBase served at PB_URL with migrations applied
//   2. Superuser exists
//
// Usage:
//   npx tsx scripts/seed-pb.mts

import PocketBase from "pocketbase";
import { products } from "../src/lib/products";

// ─── Config ────────────────────────────────────────────────────

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || "admin@mittiart.com";
const ADMIN_PASSWORD =
  process.env.PB_ADMIN_PASSWORD || "mitti@2024!ChangeMeSecure";

// ─── Helpers ───────────────────────────────────────────────────

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function mapProduct(p: (typeof products)[number]) {
  // Derive availability from legacy sold / inStock fields
  let availability: string;
  if (p.sold) {
    availability = "Sold Out";
  } else if (!p.inStock) {
    availability = "Made to Order";
  } else {
    availability = "In Stock";
  }

  return {
    title: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    // sale_price — not present in legacy data, leave unset
    category: p.category,
    materials: p.medium,
    dimensions: p.dimensions,
    // weight — not present in legacy data, leave unset
    stock: p.inStock,
    featured: p.featured || false,
    images: [p.image], // wrap single image path into array (JSON field)
    seo_title: `Mitti Art | ${p.name}`,
    seo_description: p.description.slice(0, 160),
    availability,
  };
}

// ─── API rules per collection ──────────────────────────────────

const COLLECTION_RULES: Record<
  string,
  {
    listRule: string | null;
    viewRule: string | null;
    createRule?: string | null;
    updateRule?: string | null;
    deleteRule?: string | null;
  }
> = {
  products: {
    listRule: "",
    viewRule: "",
  },
  testimonials: {
    listRule: "",
    viewRule: "",
  },
  commissions: {
    listRule:
      "@request.auth.id = user.id || @request.auth.collectionName = '_superusers'",
    viewRule:
      "@request.auth.id = user.id || @request.auth.collectionName = '_superusers'",
    createRule: "@request.auth.id != ''",
    updateRule: "@request.auth.collectionName = '_superusers'",
  },
  orders: {
    listRule:
      "@request.auth.id = user.id || @request.auth.collectionName = '_superusers'",
    viewRule:
      "@request.auth.id = user.id || @request.auth.collectionName = '_superusers'",
    createRule: "@request.auth.id != ''",
    updateRule: "@request.auth.collectionName = '_superusers'",
  },
  users: {
    listRule: "@request.auth.collectionName = '_superusers'",
    viewRule:
      "id = @request.auth.id || @request.auth.collectionName = '_superusers'",
    updateRule:
      "id = @request.auth.id || @request.auth.collectionName = '_superusers'",
  },
};

async function applyRules(
  pb: PocketBase,
  collectionName: string
): Promise<void> {
  const rules = COLLECTION_RULES[collectionName];
  if (!rules) return;

  try {
    const col = await pb.collections.getOne(collectionName, {});
    let changed = false;

    for (const [key, value] of Object.entries(rules)) {
      const field = key as keyof typeof rules;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((col as any)[field] !== value) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (col as any)[field] = value;
        changed = true;
      }
    }

    if (changed) {
      await pb.collections.update(col.id, col);
      console.log(`   📋 API rules updated for "${collectionName}"`);
    } else {
      console.log(`   ✓ API rules for "${collectionName}" already correct`);
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`   ⚠ Could not update rules for "${collectionName}": ${msg}`);
  }
}

// ─── Sample testimonials ───────────────────────────────────────

const SAMPLE_TESTIMONIALS = [
  {
    customer_name: "Priya Sharma",
    review:
      "Samuya's Madhubani painting brought the soul of Bihar into our home. The intricate details and natural pigments are even more beautiful in person. We treasure it deeply.",
    rating: 5,
    featured: true,
  },
  {
    customer_name: "Rajesh Mehta",
    review:
      "Commissioned a custom Ganesha piece for our new office. The process was incredibly personal — Samuya took the time to understand our vision. The result exceeded every expectation.",
    rating: 5,
    featured: true,
  },
  {
    customer_name: "Ananya Gupta",
    review:
      "The resin coasters with preserved neem leaves make for such unique gifts. Every guest asks about them. Sustainable, beautiful, and deeply connected to Indian heritage.",
    rating: 5,
    featured: false,
  },
];

// ─── Main ──────────────────────────────────────────────────────

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

  // Login as superuser (PocketBase v0.39+)
  await pb.collection("_superusers").authWithPassword(
    ADMIN_EMAIL,
    ADMIN_PASSWORD
  );
  console.log("✅ Logged in as superuser");

  // ── Ensure collections exist (migrations should handle this) ──
  const collections = await pb.collections.getFullList();
  const colNames = new Set(collections.map((c: any) => c.name));

  // Testimonials — create via SDK if migration hasn't been applied yet
  // NOTE: PocketBase v0.39+ uses `fields` instead of `schema` for collection creation
  if (!colNames.has("testimonials")) {
    console.log("   Testimonials collection not found — creating via SDK…");
    await pb.collections.create({
      name: "testimonials",
      type: "base",
      fields: [
        { name: "customer_name", type: "text", required: true },
        { name: "review", type: "text", required: true },
        { name: "rating", type: "number" },
        { name: "photo", type: "file" },
        { name: "featured", type: "bool" },
      ],
      listRule: "",
      viewRule: "",
    });
    console.log("✅ Testimonials collection created");
  } else {
    console.log("   ✓ Testimonials collection exists");
  }

  // ── Apply API rules on all known collections ──
  for (const name of Object.keys(COLLECTION_RULES)) {
    if (colNames.has(name) || name === "testimonials") {
      await applyRules(pb, name);
    }
  }

  // ── Seed products ──
  const existingCount = (
    await pb.collection("products").getList(1, 1)
  ).totalItems;

  if (existingCount === 0) {
    await sleep(500); // let indices settle

    for (const product of products) {
      try {
        const data = mapProduct(product);
        await pb.collection("products").create(data);
        console.log(`   ✓ ${product.name}`);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`   ✗ Failed to create ${product.name}: ${msg}`);
      }
    }
    console.log(`✅ Seeded ${products.length} products`);
  } else {
    console.log(`   ✓ Products already seeded (${existingCount} records)`);
  }

  // ── Seed testimonials ──
  const testimonialCount = (
    await pb.collection("testimonials").getList(1, 1)
  ).totalItems;

  if (testimonialCount === 0) {
    await sleep(300);

    for (const t of SAMPLE_TESTIMONIALS) {
      try {
        await pb.collection("testimonials").create(t);
        console.log(`   ✓ ${t.customer_name}`);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`   ✗ Failed to create testimonial "${t.customer_name}": ${msg}`);
      }
    }
    console.log(`✅ Seeded ${SAMPLE_TESTIMONIALS.length} testimonials`);
  } else {
    console.log(
      `   ✓ Testimonials already seeded (${testimonialCount} records)`
    );
  }

  console.log("\n🎉 PocketBase seed complete!");
  console.log(`   Admin UI: ${PB_URL}/_/`);
  console.log(`   Email: ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
}

setup().catch((e: unknown) => {
  const msg = e instanceof Error ? e.message : String(e);
  console.error("❌ Setup failed:", msg);
  process.exit(1);
});
