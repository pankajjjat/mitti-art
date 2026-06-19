// ─── Mitti Art — Enhanced PocketBase Client ───
// Provides server-side & client-side data fetching with proper error handling.

import PocketBase from "pocketbase";
import type {
  MittiProduct,
  ProductCategory,
  Testimonial,
} from "@/lib/types";

const PB_URL =
  process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";

// ─── Client factory ───

/**
 * Create a new PocketBase client instance.
 * Safe to call in server components, API routes, and client components.
 */
export function createPocketBaseClient() {
  return new PocketBase(PB_URL);
}

/**
 * Create an authenticated PocketBase client from a cookie/token string.
 * Use this in server components / API routes where the token is available
 * from the request cookie.
 */
export function createAuthenticatedClient(token: string) {
  const pb = createPocketBaseClient();
  pb.authStore.save(token, null);
  return pb;
}

// ─── Products ───

export interface ProductQueryParams {
  filter?: string;
  sort?: string;
  page?: number;
  perPage?: number;
  category?: ProductCategory;
  search?: string;
}

/**
 * Fetch products with optional filtering, sorting, and pagination.
 * Safe for SSR — returns empty array on error instead of throwing.
 */
export async function getProducts(
  params: ProductQueryParams = {}
): Promise<MittiProduct[]> {
  try {
    const pb = createPocketBaseClient();
    const { page = 1, perPage = 50, filter, sort, category, search } = params;

    // Build filter string
    const filters: string[] = [];
    if (filter) filters.push(filter);
    if (category) filters.push(`category = "${category}"`);
    if (search) {
      filters.push(
        `(title ~ "${search}" || description ~ "${search}")`
      );
    }

    const mergedFilter = filters.length > 0 ? filters.join(" && ") : "";

    const result = await pb.collection("products").getList(page, perPage, {
      ...(mergedFilter && { filter: mergedFilter }),
      sort: sort || "-created",
    });

    return result.items as unknown as MittiProduct[];
  } catch (err) {
    console.warn("⚠️  getProducts failed:", err);
    return [];
  }
}

/**
 * Fetch a single product by its slug.
 */
export async function getProductBySlug(
  slug: string
): Promise<MittiProduct | null> {
  try {
    const pb = createPocketBaseClient();
    const result = await pb.collection("products").getList(1, 1, {
      filter: `slug = "${slug}"`,
    });
    return (result.items[0] as unknown as MittiProduct) || null;
  } catch (err) {
    console.warn(`⚠️  getProductBySlug("${slug}") failed:`, err);
    return null;
  }
}

/**
 * Fetch a single product by its PocketBase ID.
 */
export async function getProductById(
  id: string
): Promise<MittiProduct | null> {
  try {
    const pb = createPocketBaseClient();
    const record = await pb.collection("products").getOne(id);
    return record as unknown as MittiProduct;
  } catch (err) {
    console.warn(`⚠️  getProductById("${id}") failed:`, err);
    return null;
  }
}

/**
 * Fetch all featured products.
 */
export async function getFeaturedProducts(): Promise<MittiProduct[]> {
  try {
    const pb = createPocketBaseClient();
    const records = await pb.collection("products").getFullList({
      filter: "featured = true && stock = true",
      sort: "-created",
    });
    return records as unknown as MittiProduct[];
  } catch (err) {
    console.warn("⚠️  getFeaturedProducts failed:", err);
    return [];
  }
}

/**
 * Get all distinct product categories.
 */
export async function getCategories(): Promise<ProductCategory[]> {
  try {
    const products = await getProducts({ perPage: 200 });
    const cats = new Set<ProductCategory>();
    products.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats);
  } catch (err) {
    console.warn("⚠️  getCategories failed:", err);
    return [];
  }
}

/**
 * Get related products (same category, excluding current product).
 */
export async function getRelatedProducts(
  productId: string,
  category: ProductCategory,
  limit = 4
): Promise<MittiProduct[]> {
  try {
    const pb = createPocketBaseClient();
    const result = await pb.collection("products").getList(1, limit + 1, {
      filter: `category = "${category}" && id != "${productId}"`,
      sort: "-created",
    });
    return result.items.slice(0, limit) as unknown as MittiProduct[];
  } catch (err) {
    console.warn("⚠️  getRelatedProducts failed:", err);
    return [];
  }
}

// ─── Testimonials ───

/**
 * Fetch approved/featured testimonials.
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const pb = createPocketBaseClient();
    const records = await pb.collection("testimonials").getFullList({
      filter: "featured = true",
      sort: "-created",
    });
    return records as unknown as Testimonial[];
  } catch (err) {
    console.warn("⚠️  getTestimonials failed:", err);
    return [];
  }
}

// ─── Utility ───

/**
 * Get a full PocketBase file URL for a given record's file field.
 */
export function getFileUrl(
  record: { id: string; collectionId?: string; collectionName?: string },
  fileName: string
): string {
  try {
    const pb = createPocketBaseClient();
    return pb.files.getUrl(record, fileName);
  } catch {
    return "";
  }
}
