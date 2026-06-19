"use client";

import { useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import clsx from "clsx";
import type { Product } from "@/lib/products";
import { useAppStore } from "@/lib/store";

type ProductModalProps = {
  product: Product | null;
  onClose: () => void;
};

function formatPrice(price: number): string {
  return `₹${price.toLocaleString("en-IN")}`;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const addItem = useAppStore((s) => s.addToCart);

  // Escape key handler
  useEffect(() => {
    if (!product) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [product, onClose]);

  // Trap / restore focus
  useEffect(() => {
    if (product) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    } else if (previousActiveElement.current) {
      previousActiveElement.current.focus();
      previousActiveElement.current = null;
    }
  }, [product]);

  // Lock body scroll
  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [product]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) onClose();
    },
    [onClose]
  );

  const handleAddToCart = useCallback(() => {
    if (product)
      addItem({
        id: `cart-${Date.now()}`,
        productId: product.slug,
        title: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
      });
  }, [product, addItem]);

  if (!product) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Product details: ${product.name}`}
    >
      <div className="relative flex w-full max-w-5xl max-h-[90vh] flex-col overflow-hidden rounded-xl bg-surface shadow-[0_32px_80px_rgba(0,0,0,0.20)] md:flex-row animate-slide-in-right">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-text-muted backdrop-blur-sm transition-colors hover:bg-white hover:text-text md:right-5 md:top-5"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Image Column */}
        <div className="relative aspect-square w-full flex-shrink-0 overflow-hidden bg-earth-100 md:h-[90vh] md:w-1/2 md:aspect-auto">
          <Image
            src={product.image}
            alt={`${product.name} — ${product.hindiName}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        {/* Details Column */}
        <div className="flex flex-1 flex-col overflow-y-auto p-6 md:p-10">
          {/* Category badge */}
          <span className="self-start rounded-full bg-earth-100 px-3 py-1 font-sans text-[0.625rem] font-medium uppercase tracking-[0.08em] text-text-muted">
            {product.category}
          </span>

          {/* Title */}
          <h2 className="mt-4 font-serif text-3xl leading-tight tracking-[-0.02em] text-text md:text-4xl">
            {product.name}
          </h2>
          <p className="mt-1 font-sans text-base text-text-muted">
            {product.hindiName}
          </p>

          {/* Medium tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-earth-300 px-3 py-1 font-sans text-[0.625rem] font-medium uppercase tracking-[0.08em] text-text-muted">
              {product.medium}
            </span>
            {product.dimensions && (
              <span className="rounded-full border border-earth-300 px-3 py-1 font-sans text-[0.625rem] font-medium uppercase tracking-[0.08em] text-text-muted">
                {product.dimensions}
              </span>
            )}
            {product.year && (
              <span className="rounded-full border border-earth-300 px-3 py-1 font-sans text-[0.625rem] font-medium uppercase tracking-[0.08em] text-text-muted">
                {product.year}
              </span>
            )}
          </div>

          {/* Price */}
          <p className="mt-6 font-serif text-3xl font-semibold text-text">
            {formatPrice(product.price)}
          </p>

          {/* Divider */}
          <hr className="my-6 border-earth-200" />

          {/* Story */}
          <div className="space-y-4">
            <p className="font-sans text-sm leading-[1.7] text-text md:text-base">
              {product.story}
            </p>
          </div>

          {/* Dimensions */}
          <div className="mt-6 flex items-center gap-2">
            <span className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted">
              Dimensions:
            </span>
            <span className="font-sans text-sm text-text">
              {product.dimensions}
            </span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.inStock || product.sold}
              className={clsx(
                "flex-1 rounded-full px-7 py-3 font-sans text-[0.8125rem] font-medium uppercase tracking-[0.04em] transition-all duration-200",
                product.inStock && !product.sold
                  ? "bg-accent text-white hover:bg-terra-700 active:bg-terra-800 shadow-sm hover:shadow-md"
                  : "cursor-not-allowed bg-earth-200 text-text-muted"
              )}
            >
              {product.sold ? "Sold" : "Add to Cart"}
            </button>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.inStock || product.sold}
              className={clsx(
                "flex-1 rounded-full border px-7 py-3 font-sans text-[0.8125rem] font-medium uppercase tracking-[0.04em] transition-all duration-200",
                product.inStock && !product.sold
                  ? "border-earth-300 text-text hover:border-accent hover:text-accent active:border-terra-800"
                  : "cursor-not-allowed border-earth-200 text-text-muted"
              )}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
