"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import clsx from "clsx";
import type { Product } from "@/lib/products";

type ProductCardProps = {
  product: Product;
  onSelect: (product: Product) => void;
  priority?: boolean;
  className?: string;
};

function formatPrice(price: number): string {
  return `₹${price.toLocaleString("en-IN")}`;
}

export default function ProductCard({
  product,
  onSelect,
  priority = false,
  className,
}: ProductCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleClick = useCallback(() => {
    onSelect(product);
  }, [onSelect, product]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect(product);
      }
    },
    [onSelect, product]
  );

  return (
    <article
      className={clsx(
        "group relative cursor-pointer overflow-hidden rounded-lg border border-earth-200 bg-surface shadow-[0_4px_24px_rgba(0,0,0,0.06)]",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(0,0,0,0.10)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View ${product.name}`}
    >
      {/* 3:4 Aspect Ratio Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-earth-100">
        {/* Image */}
        <Image
          src={product.image}
          alt={`${product.name} — ${product.hindiName}`}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={clsx(
            "object-cover transition-all duration-500",
            "group-hover:scale-105",
            imgLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImgLoaded(true)}
          priority={priority}
        />

        {/* Gradient overlay on hover — bottom-up */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Hover info */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <h3 className="font-serif text-lg leading-tight text-white">
            {product.name}
          </h3>
          <p className="mt-0.5 font-sans text-sm text-white/70">
            {product.hindiName}
          </p>
          <p className="mt-1.5 font-sans text-xs font-medium uppercase tracking-[0.04em] text-white/60">
            {product.medium}
          </p>
          <p className="mt-2 font-sans text-sm font-semibold text-gold-500">
            {formatPrice(product.price)}
          </p>
        </div>

        {/* Category badge — always visible */}
        <span className="absolute left-3 top-3 rounded-full bg-white/20 px-3 py-1 font-sans text-[0.625rem] font-medium uppercase tracking-[0.08em] text-white backdrop-blur-md">
          {product.category}
        </span>

        {/* Sold badge */}
        {product.sold && (
          <span className="absolute right-3 top-3 rounded-full bg-error/90 px-3 py-1 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-white">
            Sold
          </span>
        )}
      </div>

      {/* Static info below image (always visible) */}
      <div className="p-4">
        <h3 className="font-serif text-base leading-tight text-text">
          {product.name}
        </h3>
        <p className="mt-0.5 font-sans text-xs text-text-muted">
          {product.hindiName}
        </p>
        <p className="mt-1 font-sans text-xs text-text-muted/80">
          {product.medium}
        </p>
        <p className="mt-2 font-sans text-sm font-semibold text-text">
          {formatPrice(product.price)}
        </p>
      </div>
    </article>
  );
}
