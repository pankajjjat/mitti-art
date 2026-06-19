// ─── Mitti Art — Product Detail Page ───
// Dynamic metadata, image gallery, specs, add-to-cart, JSON-LD, related products.

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getRelatedProducts } from "@/lib/pocketbase";
import { getImageUrl } from "@/lib/utils";
import ProductDetailClient from "./ProductDetailClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found — Mitti Art" };
  }

  const imageUrl = getImageUrl(product.images?.[0]);

  return {
    title: product.seo_title || `${product.title} — Mitti Art`,
    description:
      product.seo_description ||
      `${product.title} — ${product.category}. Handcrafted Indian art. ${product.materials}. ${product.dimensions}.`,
    openGraph: {
      title: product.seo_title || `${product.title} — Mitti Art`,
      description:
        product.seo_description ||
        `Discover ${product.title} — handcrafted ${product.category.toLowerCase()} by Mitti Art.`,
      type: "article",
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 1600 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.seo_title || `${product.title} — Mitti Art`,
      description:
        product.seo_description ||
        `Discover ${product.title} — handcrafted ${product.category.toLowerCase()} by Mitti Art.`,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(
    product.id,
    product.category,
    4
  );

  const imageUrl = getImageUrl(product.images?.[0]);
  const currentPrice = product.sale_price || product.price;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: imageUrl || undefined,
    category: product.category,
    sku: product.id,
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://mittiart.com"}/shop/${product.slug}`,
      priceCurrency: "INR",
      price: currentPrice,
      availability:
        product.availability === "Sold Out"
          ? "https://schema.org/SoldOut"
          : product.availability === "Made to Order"
            ? "https://schema.org/MadeToOrder"
            : "https://schema.org/InStock",
      priceValidUntil: new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    ...(product.materials && { material: product.materials }),
    ...(product.dimensions && { size: product.dimensions }),
    ...(product.weight && { weight: product.weight }),
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen pt-24 md:pt-28">
        <div className="container-page py-8 md:py-12">
          <ProductDetailClient
            product={product}
            relatedProducts={relatedProducts}
          />
        </div>
      </div>
    </>
  );
}
