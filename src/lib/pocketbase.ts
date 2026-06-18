// ─── PocketBase Client ───
import PocketBase from "pocketbase";

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";

export const pb = new PocketBase(PB_URL);

export type PBProduct = {
  id: string;
  name: string;
  hindiName: string;
  slug: string;
  image: string;
  category: string;
  medium: string;
  price: number;
  description: string;
  story: string;
  dimensions: string;
  featured: boolean;
  sold: boolean;
  year: number;
  inStock: boolean;
  created: string;
  updated: string;
};

export type PBCommission = {
  name: string;
  email: string;
  phone?: string;
  type: string;
  description: string;
  budget?: number;
  timeline?: string;
  reference?: string;
};

export type PBSubscriber = {
  email: string;
  name?: string;
};

export async function submitCommission(data: PBCommission) {
  try {
    return await pb.collection("commissions").create(data);
  } catch (error) {
    console.error("Failed to submit commission:", error);
    throw error;
  }
}

export async function subscribeToNewsletter(data: PBSubscriber) {
  try {
    return await pb.collection("subscribers").create(data);
  } catch (error: any) {
    if (error?.status === 409) {
      // Already subscribed — not an error
      return { alreadySubscribed: true };
    }
    console.error("Failed to subscribe:", error);
    throw error;
  }
}

export async function getProducts(
  options?: {
    category?: string;
    featured?: boolean;
    limit?: number;
    page?: number;
  }
): Promise<PBProduct[]> {
  try {
    const filter: string[] = ["inStock=true"];
    if (options?.category) {
      filter.push(`category="${options.category}"`);
    }
    if (options?.featured) {
      filter.push("featured=true");
    }
    const result = await pb.collection("products").getList(options?.page || 1, options?.limit || 50, {
      filter: filter.join(" && "),
      sort: "-created",
    });
    return result.items as unknown as PBProduct[];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    // Fallback to local data
    return [];
  }
}

export async function getProduct(slug: string): Promise<PBProduct | null> {
  try {
    const result = await pb.collection("products").getFirstListItem(`slug="${slug}"`);
    return result as unknown as PBProduct;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}
