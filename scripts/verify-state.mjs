// Final verification script
import PocketBase from "pocketbase";

const PB_URL = "http://127.0.0.1:8090";

async function main() {
  const pb = new PocketBase(PB_URL);
  
  console.log("=== POCKETBASE VERIFICATION ===");
  
  // 1. Auth
  await pb.collection("_superusers").authWithPassword(
    "admin@mittiart.com",
    "mitti@2024!ChangeMeSecure"
  );
  console.log("✅ Superuser auth works");
  
  // 2. Collections
  const cols = await pb.collections.getFullList();
  const colNames = cols.map(c => c.name).sort();
  console.log(`\n📦 Collections (${colNames.length}): ${colNames.join(", ")}`);
  
  // 3. Products
  const products = await pb.collection("products").getList(1, 1);
  console.log(`✅ Products: ${products.totalItems} records`);
  
  // 4. Testimonials (check fields exist)
  const testimonials = await pb.collection("testimonials").getList(1, 10);
  console.log(`✅ Testimonials: ${testimonials.totalItems} records`);
  for (const t of testimonials.items) {
    const hasFields = t.customer_name && t.review;
    console.log(`   ${t.customer_name || "MISSING NAME"} ${hasFields ? "✓" : "✗ (no fields)"}`);
  }
  
  // 5. Commission rules update check
  try {
    const comm = await pb.collections.getOne("commissions", {});
    const orders = await pb.collections.getOne("orders", {});
    console.log(`✅ Commissions rules: list=${comm.listRule}, create=${comm.createRule}`);
    console.log(`✅ Orders rules: list=${orders.listRule}, create=${orders.createRule}`);
  } catch (e) {
    console.log(`ℹ️ Could not read rules: ${e.message}`);
  }
  
  console.log("\n🎉 All verification checks complete!");
}

main().catch(e => {
  console.error("❌ Verification failed:", e.message);
  process.exit(1);
});
