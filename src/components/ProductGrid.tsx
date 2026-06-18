"use client";

import { useState, useMemo } from "react";
import clsx from "clsx";
import type { Product } from "@/lib/products";
import { products, categories } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

type SortOption = "newest" | "price-asc" | "price-desc";

type ProductGridProps = {
  products?: Product[];
  onSelect: (product: Product) => void;
  className?: string;
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
];

export default function ProductGrid({
  onSelect,
  className,
}: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("newest");

  const filtered = useMemo(() => {
    let result = activeCategory
      ? products.filter((p) => p.category === activeCategory)
      : [...products];

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        // newest by id (ascending id = newer in our data) or year
        result.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
        break;
    }

    return result;
  }, [activeCategory, sort]);

  return (
    <section className={className}>
      {/* Filter Controls */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={clsx(
              "rounded-full px-4 py-1.5 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] transition-colors",
              activeCategory === null
                ? "bg-accent text-white"
                : "bg-earth-100 text-text-muted hover:bg-earth-200 hover:text-text"
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={clsx(
                "rounded-full px-4 py-1.5 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] transition-colors",
                activeCategory === cat
                  ? "bg-accent text-white"
                  : "bg-earth-100 text-text-muted hover:bg-earth-200 hover:text-text"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="self-start rounded-md border border-earth-300 bg-surface px-3 py-2 font-sans text-xs text-text outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent sm:self-auto"
          aria-label="Sort products"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="font-serif text-2xl text-text-muted">
            No artworks found
          </p>
          <p className="mt-2 font-sans text-sm text-text-muted/70">
            Try a different category or filter
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory(null);
              setSort("newest");
            }}
            className="mt-4 font-sans text-xs font-medium uppercase tracking-[0.08em] text-accent underline underline-offset-4 transition-colors hover:text-terra-700"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelect}
              priority={product.featured}
            />
          ))}
        </div>
      )}
    </section>
  );
}
