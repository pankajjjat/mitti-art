// Fix testimonials collection and re-seed
import PocketBase from "pocketbase";

const PB_URL = "http://127.0.0.1:8090";
const ADMIN_EMAIL = "admin@mittiart.com";
const ADMIN_PASSWORD = "mitti@2024!ChangeMeSecure";

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

async function main() {
  const pb = new PocketBase(PB_URL);

  // Login
  await pb.collection("_superusers").authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
  console.log("✅ Logged in as superuser");

  // Check if testimonials collection exists
  let exists = false;
  try {
    await pb.collections.getOne("testimonials");
    exists = true;
  } catch {
    exists = false;
  }

  if (exists) {
    // Delete the empty records first
    const records = await pb.collection("testimonials").getList(1, 10);
    for (const r of records.items) {
      await pb.collection("testimonials").delete(r.id);
      console.log(`   Deleted empty record ${r.id}`);
    }

    // Delete the collection
    const col = await pb.collections.getOne("testimonials");
    await pb.collections.delete(col.id);
    console.log("✅ Deleted testimonials collection");
  }

  // Re-create with proper fields (PocketBase v0.39+ uses 'fields' not 'schema')
  await pb.collections.create({
    name: "testimonials",
    type: "base",
    fields: [
      {
        name: "customer_name",
        type: "text",
        required: true,
      },
      {
        name: "review",
        type: "text",
        required: true,
      },
      {
        name: "rating",
        type: "number",
      },
      {
        name: "photo",
        type: "file",
      },
      {
        name: "featured",
        type: "bool",
      },
    ],
    listRule: "",
    viewRule: "",
  });
  console.log("✅ Re-created testimonials collection with proper fields");

  // Seed testimonials
  for (const t of SAMPLE_TESTIMONIALS) {
    try {
      await pb.collection("testimonials").create(t);
      console.log(`   ✓ ${t.customer_name}`);
    } catch (err) {
      console.error(`   ✗ Failed: ${err.message}`);
    }
  }
  console.log(`✅ Seeded ${SAMPLE_TESTIMONIALS.length} testimonials`);

  // Verify
  const records = await pb.collection("testimonials").getList(1, 10);
  console.log(`\nVerification: ${records.totalItems} testimonials`);
  records.items.forEach(r => {
    console.log(`  ${r.customer_name}: "${r.review?.substring(0, 50)}..." (rating: ${r.rating}, featured: ${r.featured})`);
  });

  console.log("\n🎉 Testimonials fixed successfully!");
}

main().catch(e => {
  console.error("❌ Failed:", e.message);
  process.exit(1);
});
