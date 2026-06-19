// ─── Mitti Art — Data Layer (Supabase) ───
// Replaces PocketBase with Supabase. Same exports, no other file changes.

import { supabase } from "@/lib/supabase";
import type {
  MittiProduct,
  ProductCategory,
  Testimonial,
  ProductAvailability,
} from "@/lib/types";

// ─── Products ───

export interface ProductQueryParams {
  filter?: string;
  sort?: string;
  page?: number;
  perPage?: number;
  category?: ProductCategory;
  search?: string;
}

function mapProduct(record: Record<string, unknown>): MittiProduct {
  return {
    id: record.id as string,
    title: record.title as string,
    slug: record.slug as string,
    description: (record.description as string) || "",
    price: Number(record.price),
    sale_price: record.sale_price ? Number(record.sale_price) : undefined,
    category: record.category as ProductCategory,
    materials: (record.materials as string) || "",
    dimensions: (record.dimensions as string) || "",
    weight: (record.weight as string) || "",
    stock: record.stock as boolean,
    featured: record.featured as boolean,
    images: (record.images as string[]) || [],
    seo_title: record.seo_title as string | undefined,
    seo_description: record.seo_description as string | undefined,
    availability: ((record.availability as string) || "In Stock") as ProductAvailability,
    created: record.created as string,
    updated: record.updated as string,
  };
}

export async function getProducts(
  params: ProductQueryParams = {}
): Promise<MittiProduct[]> {
  try {
    const { page = 1, perPage = 50, category, search } = params;
    let query = supabase
      .from("products")
      .select("*", { count: "exact" })
      .order("created", { ascending: false })
      .range((page - 1) * perPage, page * perPage - 1);

    if (category) {
      query = query.eq("category", category);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map((r) => mapProduct(r as unknown as Record<string, unknown>));
  } catch (err) {
    console.warn("⚠️  getProducts failed:", err);
    return [];
  }
}

export async function getProductBySlug(
  slug: string
): Promise<MittiProduct | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();
    if (error) throw error;
    return data ? mapProduct(data as unknown as Record<string, unknown>) : null;
  } catch (err) {
    console.warn(`⚠️  getProductBySlug("${slug}") failed:`, err);
    return null;
  }
}

export async function getProductById(
  id: string
): Promise<MittiProduct | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data ? mapProduct(data as unknown as Record<string, unknown>) : null;
  } catch (err) {
    console.warn(`⚠️  getProductById("${id}") failed:`, err);
    return null;
  }
}

export async function getFeaturedProducts(): Promise<MittiProduct[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("featured", true)
      .eq("stock", true)
      .order("created", { ascending: false });
    if (error) throw error;
    return (data || []).map((r) => mapProduct(r as unknown as Record<string, unknown>));
  } catch (err) {
    console.warn("⚠️  getFeaturedProducts failed:", err);
    return [];
  }
}

export async function getCategories(): Promise<ProductCategory[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("category")
      .neq("category", null);
    if (error) throw error;
    const cats = new Set<ProductCategory>();
    (data || []).forEach((r) => {
      if (r.category) cats.add(r.category as ProductCategory);
    });
    return Array.from(cats);
  } catch (err) {
    console.warn("⚠️  getCategories failed:", err);
    return [];
  }
}

export async function getRelatedProducts(
  productId: string,
  category: ProductCategory,
  limit = 4
): Promise<MittiProduct[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", category)
      .neq("id", productId)
      .order("created", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data || []).map((r) => mapProduct(r as unknown as Record<string, unknown>));
  } catch (err) {
    console.warn("⚠️  getRelatedProducts failed:", err);
    return [];
  }
}

// ─── Testimonials ───

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("featured", true)
      .order("created", { ascending: false });
    if (error) throw error;
    return (data || []).map(
      (r: Record<string, unknown>) =>
        ({
          id: r.id,
          customer_name: r.customer_name,
          review: r.review,
          rating: r.rating,
          photo: r.photo || undefined,
          featured: r.featured,
        }) as Testimonial
    );
  } catch (err) {
    console.warn("⚠️  getTestimonials failed:", err);
    return [];
  }
}

// ─── Utility (kept for compat — Supabase uses URLs directly from DB) ───

export async function createPocketBaseClient() {
  console.warn("⚠️  createPocketBaseClient() is deprecated — use supabase instead");
  return null;
}

export function getFileUrl(
  _record: { id: string; collectionId?: string; collectionName?: string },
  fileName: string
): string {
  // Supabase stores full image paths in the DB
  return fileName;
}
