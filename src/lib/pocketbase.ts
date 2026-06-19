// ─── PocketBase Client ───
// Provides server-side data fetching functions
import PocketBase from "pocketbase";

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";

// Server-side client creator (works in server components / API routes)
export function createPocketBaseClient() {
  return new PocketBase(PB_URL);
}

// Fetch all products from PocketBase
export async function getProducts() {
  try {
    const pb = createPocketBaseClient();
    const records = await pb.collection("products").getFullList({
      sort: "-created",
    });
    return records;
  } catch {
    console.warn("⚠️  PocketBase not running, returning null");
    return null;
  }
}

// Fetch a single product by slug
export async function getProductBySlug(slug: string) {
  try {
    const pb = createPocketBaseClient();
    const records = await pb.collection("products").getList(1, 1, {
      filter: `slug = "${slug}"`,
    });
    return records.items[0] || null;
  } catch {
    return null;
  }
}

// Fetch featured products
export async function getFeaturedProducts() {
  try {
    const pb = createPocketBaseClient();
    const records = await pb.collection("products").getFullList({
      filter: "featured = true && inStock = true",
      sort: "-created",
    });
    return records;
  } catch {
    return null;
  }
}
