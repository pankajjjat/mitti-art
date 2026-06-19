import type { MittiProduct } from "@/lib/types";

// ─── Brand Constants ───

export const SITE_NAME = "Mitti Art";
export const SITE_DESCRIPTION =
  "Discover handcrafted Indian art by Samuya. Canvas paintings, mandala art, Madhubani paintings, resin art, ceramics and more. Each piece is 100% handcrafted with love in India.";
export const SITE_URL = "https://mittiart.com";
export const SITE_LOCALE = "en_IN";
export const OG_IMAGE_DEFAULT = "/og-image.jpg";
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

// ─── JSON-LD Generators ───

/**
 * Generate a JSON-LD Product schema for a Mitti Product.
 * Use in a `<script type="application/ld+json">` tag.
 */
export function generateProductJsonLd(product: MittiProduct) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.seo_title || product.title,
    description: product.seo_description || product.description,
    image: product.images?.length
      ? product.images.map((img) =>
          img.startsWith("http")
            ? img
            : `${SITE_URL}${img.startsWith("/") ? "" : "/"}${img}`
        )
      : [`${SITE_URL}/og-image.jpg`],
    sku: product.id,
    mpn: product.id,
    brand: {
      "@type": "Brand",
      name: "Mitti Art",
    },
    category: product.category,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/shop/${product.slug}`,
      priceCurrency: "INR",
      price: product.sale_price ?? product.price,
      priceValidUntil: new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
      ).toISOString(),
      itemCondition: "https://schema.org/NewCondition",
      availability: product.stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Mitti Art",
      },
    },
    ...(product.materials && {
      material: product.materials,
    }),
  };
}

/**
 * Generate a JSON-LD BreadcrumbList schema.
 * Use in a `<script type="application/ld+json">` tag.
 */
export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http")
        ? item.url
        : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Build an Open Graph image URL with optional text overlay.
 * Returns the default OG image if no title is provided.
 */
export function getOpenGraphImage(title?: string): string {
  if (!title) return OG_IMAGE_DEFAULT;
  // Encode for a URL-based OG image service or just return the default
  // The default og-image.jpg can be designed with the brand name baked in.
  return OG_IMAGE_DEFAULT;
}
