// ─── Mitti Art — Shop Page ───
// Server component that fetches products and wraps client-side filtering.

import { Suspense } from "react";
import type { Metadata } from "next";
import { getProducts, getCategories } from "@/lib/pocketbase";
import ShopContent from "./ShopContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop — Mitti Art",
  description:
    "Browse our collection of handcrafted Indian art. Canvas paintings, mandala art, religious art, and floral art — each piece 100% handcrafted.",
  openGraph: {
    title: "Shop — Mitti Art",
    description:
      "Browse our collection of handcrafted Indian art.",
    type: "website",
  },
};

export default async function ShopPage() {
  // Fetch initial products and categories on the server
  const [products, categories] = await Promise.all([
    getProducts({ sort: "-created" }),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen pt-24 md:pt-28">
      <div className="container-page py-12">
        {/* Page header */}
        <div className="mb-10">
          <h1 className="font-serif text-3xl tracking-[-0.02em] text-text md:text-4xl">
            Shop
          </h1>
          <p className="mt-2 font-sans text-sm text-text-muted">
            Discover handcrafted artworks, each with its own story.
          </p>
        </div>

        <Suspense fallback={null}>
          <ShopContent
            initialProducts={products}
            initialCategories={categories}
          />
        </Suspense>
      </div>
    </div>
  );
}
