"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Trash2,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatPrice, cn } from "@/lib/utils";
import { getProductById } from "@/lib/pocketbase";
import type { MittiProduct } from "@/lib/types";

export default function WishlistPage() {
  const router = useRouter();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const wishlist = useAppStore((s) => s.wishlist);
  const toggleWishlist = useAppStore((s) => s.toggleWishlist);
  const addToCart = useAppStore((s) => s.addToCart);

  const [products, setProducts] = useState<MittiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ─── Auth redirect ───
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login?redirect=/account/wishlist");
    }
  }, [isAuthenticated, router]);

  // ─── Fetch wishlist products ───
  useEffect(() => {
    if (!isAuthenticated || wishlist.length === 0) {
      setIsLoading(false);
      return;
    }

    async function load() {
      setIsLoading(true);
      try {
        const results = await Promise.all(
          wishlist.map((id) => getProductById(id))
        );
        setProducts(results.filter(Boolean) as MittiProduct[]);
      } catch {
        console.warn("Failed to load wishlist products");
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [isAuthenticated, wishlist]);

  const handleRemove = useCallback(
    (productId: string) => {
      toggleWishlist(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    },
    [toggleWishlist]
  );

  const handleAddToCart = useCallback(
    (product: MittiProduct) => {
      addToCart({
        id: `${product.id}-${Date.now()}`,
        productId: product.id,
        title: product.title,
        price: product.sale_price || product.price,
        quantity: 1,
        image: product.images?.[0] || "/placeholder.svg",
      });
    },
    [addToCart]
  );

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen pt-24 md:pt-28">
      <div className="container-page py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <Link
            href="/account"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-earth-300 text-text-muted transition-colors hover:border-accent hover:text-accent"
            aria-label="Back to account"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="font-serif text-3xl tracking-[-0.02em] text-text md:text-4xl">
              My Wishlist
            </h1>
            <p className="mt-1 font-sans text-sm text-text-muted">
              {wishlist.length}{" "}
              {wishlist.length === 1 ? "item" : "items"} saved
            </p>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-text-muted" />
          </div>
        ) : wishlist.length === 0 || products.length === 0 ? (
          /* ─── Empty State ─── */
          <div className="flex flex-col items-center py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-100">
              <Heart size={32} className="text-rose-400" />
            </div>
            <h2 className="mt-6 font-serif text-2xl text-text">
              Your Wishlist is Empty
            </h2>
            <p className="mt-2 max-w-sm font-sans text-sm text-text-muted">
              Save your favorite artworks here by tapping the heart icon on any
              product.
            </p>
            <Link
              href="/shop"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-sans text-[0.8125rem] font-medium uppercase tracking-[0.04em] text-white shadow-sm transition-all duration-200 hover:bg-terra-700 hover:shadow-md"
            >
              Explore Artworks
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          /* ─── Product Grid ─── */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => {
              const displayPrice = product.sale_price || product.price;
              const hasSale = !!product.sale_price;

              return (
                <article
                  key={product.id}
                  className="group relative overflow-hidden rounded-xl border border-earth-200 bg-surface shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  {/* Image */}
                  <Link href={`/shop/${product.slug}`}>
                    <div className="relative aspect-[4/3] overflow-hidden bg-earth-100">
                      <Image
                        src={
                          product.images?.[0]
                            ? product.images[0].startsWith("http")
                              ? product.images[0]
                              : `/images/${product.images[0]}`
                            : "/placeholder.svg"
                        }
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Out of stock overlay */}
                      {!product.stock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <span className="rounded-full bg-error/90 px-4 py-1.5 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-white">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="p-4">
                    <Link href={`/shop/${product.slug}`}>
                      <h3 className="truncate font-serif text-base font-semibold text-text transition-colors hover:text-accent">
                        {product.title}
                      </h3>
                    </Link>
                    {product.category && (
                      <p className="mt-0.5 font-sans text-xs text-text-muted">
                        {product.category}
                      </p>
                    )}

                    {/* Price */}
                    <div className="mt-2 flex items-center gap-2">
                      {hasSale ? (
                        <>
                          <span className="font-sans text-sm font-semibold text-accent">
                            {formatPrice(product.sale_price!)}
                          </span>
                          <span className="font-sans text-xs text-text-muted line-through">
                            {formatPrice(product.price)}
                          </span>
                        </>
                      ) : (
                        <span className="font-sans text-sm font-semibold text-text">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.stock}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-accent px-4 py-2.5 font-sans text-[0.625rem] font-medium uppercase tracking-[0.04em] text-white transition-all duration-200 hover:bg-terra-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <ShoppingBag size={12} />
                        Add to Cart
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(product.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-earth-300 text-text-muted transition-colors hover:border-error hover:text-error"
                        aria-label={`Remove ${product.title} from wishlist`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
