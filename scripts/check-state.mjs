// Check current PB state
import PocketBase from "pocketbase";

const PB_URL = "http://127.0.0.1:8090";

async function main() {
  const pb = new PocketBase(PB_URL);
  
  // Login
  await pb.collection("_superusers").authWithPassword(
    "admin@mittiart.com",
    "mitti@2024!ChangeMeSecure"
  );
  console.log("✅ Logged in");
  
  // Check testimonials collection
  try {
    const col = await pb.collections.getOne("testimonials");
    console.log("Testimonials collection fields:");
    col.fields.forEach(f => console.log(`  - ${f.name} (${f.type})`));
  } catch (e) {
    console.log("Testimonials collection not found:", e.message);
  }
  
  // Check testimonials records
  try {
    const records = await pb.collection("testimonials").getList(1, 10);
    console.log(`\nTestimonials records: ${records.totalItems}`);
    records.items.forEach(r => {
      console.log(`  ID: ${r.id}`, JSON.stringify(r));
    });
  } catch (e) {
    console.log("Error fetching testimonials:", e.message);
  }
}

main().catch(e => {
  console.error("Failed:", e.message);
  process.exit(1);
});
