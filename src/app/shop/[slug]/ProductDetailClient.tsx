"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  ShoppingBag,
  Heart,
  Paintbrush,
} from "lucide-react";
import type { MittiProduct } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { formatPrice, cn, getImageUrl } from "@/lib/utils";

// ─── Props ───

type Props = {
  product: MittiProduct;
  relatedProducts: MittiProduct[];
};

// ─── Main Component ───

export default function ProductDetailClient({
  product,
  relatedProducts,
}: Props) {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [addedToCart, setAddedToCart] = useState(false);

  const addToCart = useAppStore((s) => s.addToCart);
  const isInWishlist = useAppStore((s) => s.isInWishlist);
  const toggleWishlist = useAppStore((s) => s.toggleWishlist);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);

  const images = product.images?.length
    ? product.images
    : ["/placeholder.svg"];
  const currentPrice = product.sale_price || product.price;
  const hasSale = !!product.sale_price;

  const handleAddToCart = useCallback(() => {
    addToCart({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      title: product.title,
      price: currentPrice,
      quantity,
      image: images[0] || "/placeholder.svg",
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }, [addToCart, product, currentPrice, quantity, images]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!zoom) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPos({ x, y });
    },
    [zoom]
  );

  const shareOnPinterest = useCallback(() => {
    const url = window.location.href;
    const img = getImageUrl(images[selectedImageIdx]);
    window.open(
      `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(img)}&description=${encodeURIComponent(product.title)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }, [product, images, selectedImageIdx]);

  const shareOnWhatsApp = useCallback(() => {
    const url = window.location.href;
    const text = `${product.title} — ${formatPrice(currentPrice)}\n${url}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }, [product, currentPrice]);

  const isSoldOut = product.availability === "Sold Out";

  return (
    <div className="space-y-12">
      {/* ─── Breadcrumb ─── */}
      <nav className="flex items-center gap-2 font-sans text-xs text-text-muted">
        <Link
          href="/shop"
          className="transition-colors hover:text-text"
        >
          Shop
        </Link>
        <span>/</span>
        <span className="text-text">{product.title}</span>
      </nav>

      {/* ─── Product Section ─── */}
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        {/* ─── Images ─── */}
        <div className="w-full lg:w-[55%]">
          {/* Main image with zoom */}
          <div
            className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-earth-100 cursor-crosshair"
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={handleMouseMove}
          >
            <Image
              src={getImageUrl(images[selectedImageIdx])}
              alt={product.title}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className={cn(
                "object-cover transition-opacity duration-300",
                zoom ? "opacity-0" : "opacity-100"
              )}
              priority
            />

            {/* Zoom lens */}
            {zoom && (
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${getImageUrl(images[selectedImageIdx])})`,
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  backgroundSize: "200%",
                  backgroundRepeat: "no-repeat",
                }}
              />
            )}

            {/* Sold Out overlay */}
            {isSoldOut && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span className="rounded-full bg-error px-6 py-2 font-sans text-sm font-semibold uppercase tracking-[0.08em] text-white">
                  Sold Out
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail gallery */}
          {images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIdx(idx)}
                  className={cn(
                    "relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200",
                    selectedImageIdx === idx
                      ? "border-accent"
                      : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <Image
                    src={getImageUrl(img)}
                    alt={`${product.title} — view ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─── Product Info ─── */}
        <div className="flex w-full flex-col lg:w-[45%]">
          {/* Category badge */}
          <span className="self-start rounded-full bg-earth-100 px-3 py-1 font-sans text-[0.625rem] font-medium uppercase tracking-[0.08em] text-text-muted">
            {product.category}
          </span>

          {/* Title */}
          <h1 className="mt-4 font-serif text-3xl leading-tight tracking-[-0.02em] text-text md:text-4xl">
            {product.title}
          </h1>

          {/* Price */}
          <div className="mt-4 flex items-baseline gap-3">
            {hasSale ? (
              <>
                <span className="font-serif text-3xl font-semibold text-accent">
                  {formatPrice(product.sale_price!)}
                </span>
                <span className="font-sans text-lg text-text-muted line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="rounded-full bg-accent/10 px-2.5 py-0.5 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.06em] text-accent">
                  Sale
                </span>
              </>
            ) : (
              <span className="font-serif text-3xl font-semibold text-text">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Availability */}
          <div className="mt-3 flex items-center gap-2">
            <span
              className={cn(
                "inline-block h-2 w-2 rounded-full",
                isSoldOut
                  ? "bg-error"
                  : product.availability === "Made to Order"
                    ? "bg-highlight"
                    : "bg-success"
              )}
            />
            <span className="font-sans text-sm text-text-muted">
              {product.availability}
            </span>
          </div>

          {/* Specs */}
          <div className="mt-6 space-y-3 border-y border-earth-200 py-5">
            {product.materials && (
              <div className="flex items-center gap-4">
                <span className="min-w-[100px] font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted">
                  Materials
                </span>
                <span className="font-sans text-sm text-text">
                  {product.materials}
                </span>
              </div>
            )}
            {product.dimensions && (
              <div className="flex items-center gap-4">
                <span className="min-w-[100px] font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted">
                  Dimensions
                </span>
                <span className="font-sans text-sm text-text">
                  {product.dimensions}
                </span>
              </div>
            )}
            {product.weight && (
              <div className="flex items-center gap-4">
                <span className="min-w-[100px] font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted">
                  Weight
                </span>
                <span className="font-sans text-sm text-text">
                  {product.weight}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mt-6">
            <h2 className="font-serif text-lg text-text">Description</h2>
            <p className="mt-2 font-sans text-sm leading-[1.7] text-text-muted">
              {product.description}
            </p>
          </div>

          {/* Quantity + Add to Cart */}
          <div className="mt-8 space-y-4">
            {/* Quantity selector */}
            {!isSoldOut && (
              <div className="flex items-center gap-3">
                <span className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted">
                  Qty
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-earth-300 text-text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="flex h-9 min-w-[2.5rem] items-center justify-center font-mono text-sm text-text">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-earth-300 text-text-muted transition-colors hover:border-accent hover:text-accent"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isSoldOut}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-full px-8 py-3.5 font-sans text-[0.8125rem] font-medium uppercase tracking-[0.04em] transition-all duration-200",
                  isSoldOut
                    ? "cursor-not-allowed bg-earth-200 text-text-muted"
                    : addedToCart
                      ? "bg-success text-white"
                      : "bg-accent text-white hover:bg-terra-700 shadow-sm hover:shadow-md"
                )}
              >
                <ShoppingBag size={16} />
                {isSoldOut
                  ? "Sold Out"
                  : addedToCart
                    ? "Added to Cart!"
                    : "Add to Cart"}
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-sans text-[0.8125rem] font-medium uppercase tracking-[0.04em] transition-all duration-200 border",
                  isInWishlist(product.id)
                    ? "border-accent bg-accent/5 text-accent"
                    : "border-earth-300 text-text-muted hover:border-accent hover:text-accent"
                )}
                aria-label={
                  isInWishlist(product.id)
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
              >
                <Heart
                  size={16}
                  fill={isInWishlist(product.id) ? "currentColor" : "none"}
                />
                {isInWishlist(product.id) ? "Wishlisted" : "Wishlist"}
              </button>
            </div>

            {/* Commission button */}
            <Link
              href={`/contact?commission=${product.slug}`}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-dashed border-earth-400 px-6 py-3 font-sans text-xs font-medium uppercase tracking-[0.06em] text-text-muted transition-colors hover:border-accent hover:text-accent"
            >
              <Paintbrush size={14} />
              Commission Similar Artwork
            </Link>
          </div>

          {/* Share */}
          <div className="mt-8 flex items-center gap-4">
            <span className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted">
              Share
            </span>
            <button
              type="button"
              onClick={shareOnPinterest}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-earth-100 text-text-muted transition-colors hover:bg-accent hover:text-white"
              aria-label="Share on Pinterest"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.38l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={shareOnWhatsApp}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-earth-100 text-text-muted transition-colors hover:bg-accent hover:text-white"
              aria-label="Share on WhatsApp"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ─── Related Products ─── */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-earth-200 pt-12">
          <h2 className="font-serif text-2xl text-text md:text-3xl">
            You May Also Like
          </h2>
          <p className="mt-1 font-sans text-sm text-text-muted">
            More {product.category.toLowerCase()} artworks you might love
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {relatedProducts.map((rp, idx) => (
              <RelatedProductCard key={rp.id} product={rp} priority={idx < 2} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ─── Related Product Card ───

function RelatedProductCard({
  product,
  priority,
}: {
  product: MittiProduct;
  priority?: boolean;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const imageUrl = getImageUrl(product.images?.[0]);
  const currentPrice = product.sale_price || product.price;
  const hasSale = !!product.sale_price;

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block overflow-hidden rounded-lg border border-earth-200 bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-earth-100">
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className={cn(
            "object-cover transition-all duration-500 group-hover:scale-105",
            imgLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImgLoaded(true)}
          priority={priority}
        />
        {hasSale && (
          <span className="absolute right-2 top-2 rounded-full bg-accent px-2 py-0.5 font-sans text-[0.625rem] font-semibold text-white">
            Sale
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="truncate font-serif text-sm text-text">
          {product.title}
        </h3>
        <div className="mt-1 flex items-center gap-1.5">
          {hasSale ? (
            <>
              <span className="font-sans text-xs font-semibold text-accent">
                {formatPrice(product.sale_price!)}
              </span>
              <span className="font-sans text-[0.625rem] text-text-muted line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="font-sans text-xs font-semibold text-text">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
