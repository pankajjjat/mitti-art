"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { MittiProduct, ProductCategory } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { formatPrice, cn, getImageUrl } from "@/lib/utils";

// ─── Types ───

type SortOption = "newest" | "price-asc" | "price-desc";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
];

const CATEGORIES: ProductCategory[] = [
  "Canvas Art",
  "Mandala Art",
  "Religious Art",
  "Floral Art",
];

const AVAILABILITY_OPTIONS = [
  { value: "In Stock", label: "In Stock" },
  { value: "Made to Order", label: "Made to Order" },
] as const;

// ─── Props ───

type ShopContentProps = {
  initialProducts: MittiProduct[];
  initialCategories: ProductCategory[];
};

// ─── Component ───

export default function ShopContent({
  initialProducts,
}: ShopContentProps) {
  const searchParams = useSearchParams();

  // State from URL or defaults
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [activeCategory, setActiveCategory] = useState<ProductCategory | null>(
    (searchParams.get("category") as ProductCategory) || null
  );
  const [availability, setAvailability] = useState<string | null>(
    searchParams.get("availability") || null
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || 50000,
  ]);
  const [sort, setSort] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || "newest"
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const addToCart = useAppStore((s) => s.addToCart);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Lock body when mobile filters open
  useEffect(() => {
    document.body.style.overflow = mobileFiltersOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileFiltersOpen]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Search filter
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Availability filter
    if (availability) {
      result = result.filter((p) => p.availability === availability);
    }

    // Price range filter
    result = result.filter(
      (p) => (p.sale_price || p.price) >= priceRange[0] && (p.sale_price || p.price) <= priceRange[1]
    );

    // Sort
    switch (sort) {
      case "price-asc":
        result.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
        break;
      case "price-desc":
        result.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
        break;
      case "newest":
      default:
        result.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
        break;
    }

    return result;
  }, [initialProducts, debouncedSearch, activeCategory, availability, priceRange, sort]);

  const activeFilterCount = [
    activeCategory,
    availability,
    debouncedSearch,
  ].filter(Boolean).length;

  const handleAddToCart = useCallback(
    (product: MittiProduct, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      addToCart({
        id: `${product.id}-${Date.now()}`,
        productId: product.id,
        title: product.title,
        price: product.sale_price || product.price,
        quantity: 1,
        image: product.images[0] || "/placeholder.svg",
      });
    },
    [addToCart]
  );

  const clearFilters = useCallback(() => {
    setSearch("");
    setDebouncedSearch("");
    setActiveCategory(null);
    setAvailability(null);
    setPriceRange([0, 50000]);
    setSort("newest");
  }, []);

  // ─── Render ───

  return (
    <>
      {/* Search + Mobile filter toggle */}
      <div className="mb-6 flex items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search artworks..."
            className="h-11 w-full rounded-lg border border-earth-300 bg-surface pl-10 pr-4 font-sans text-sm text-text outline-none transition-colors placeholder:text-text-muted/60 focus:border-accent focus:ring-1 focus:ring-accent"
          />
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(""); setDebouncedSearch(""); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="flex h-11 items-center gap-2 rounded-lg border border-earth-300 bg-surface px-4 font-sans text-sm text-text transition-colors hover:border-accent hover:text-accent lg:hidden"
        >
          <SlidersHorizontal size={16} />
          Filters
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* ─── SIDEBAR FILTERS (Desktop) ─── */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="space-y-8">
            {/* Categories */}
            <div>
              <h3 className="mb-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted">
                Category
              </h3>
              <ul className="space-y-1.5">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveCategory(null)}
                    className={cn(
                      "w-full rounded-md px-3 py-1.5 text-left font-sans text-sm transition-colors",
                      activeCategory === null
                        ? "bg-accent/10 font-medium text-accent"
                        : "text-text-muted hover:bg-earth-100 hover:text-text"
                    )}
                  >
                    All Categories
                  </button>
                </li>
                {CATEGORIES.map((cat) => (
                  <li key={cat}>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveCategory(activeCategory === cat ? null : cat)
                      }
                      className={cn(
                        "w-full rounded-md px-3 py-1.5 text-left font-sans text-sm transition-colors",
                        activeCategory === cat
                          ? "bg-accent/10 font-medium text-accent"
                          : "text-text-muted hover:bg-earth-100 hover:text-text"
                      )}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Availability */}
            <div>
              <h3 className="mb-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted">
                Availability
              </h3>
              <ul className="space-y-1.5">
                {AVAILABILITY_OPTIONS.map((opt) => (
                  <li key={opt.value}>
                    <label className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 transition-colors hover:bg-earth-100">
                      <input
                        type="radio"
                        name="availability"
                        checked={availability === opt.value}
                        onChange={() =>
                          setAvailability(
                            availability === opt.value ? null : opt.value
                          )
                        }
                        className="h-3.5 w-3.5 accent-accent"
                      />
                      <span className="font-sans text-sm text-text">
                        {opt.label}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="mb-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted">
                Price Range
              </h3>
              <div className="space-y-3 px-3">
                <input
                  type="range"
                  min={0}
                  max={50000}
                  step={500}
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className="w-full accent-accent"
                />
                <div className="flex items-center justify-between font-sans text-xs text-text-muted">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>
            </div>

            {/* Clear filters */}
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="w-full rounded-full border border-earth-300 px-4 py-2 font-sans text-xs font-medium uppercase tracking-[0.06em] text-text-muted transition-colors hover:border-accent hover:text-accent"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </aside>

        {/* ─── PRODUCT GRID ─── */}
        <div className="flex-1">
          {/* Sort + Results count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="font-sans text-xs text-text-muted">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "artwork" : "artworks"}
            </p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="rounded-lg border border-earth-300 bg-surface px-3 py-2 font-sans text-xs text-text outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Products */}
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-earth-100">
                <Search size={24} className="text-earth-400" />
              </div>
              <p className="mt-4 font-serif text-xl text-text-muted">
                No artworks found
              </p>
              <p className="mt-1 font-sans text-sm text-text-muted/70">
                Try adjusting your filters or search terms
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 font-sans text-sm font-medium text-accent underline underline-offset-4 transition-colors hover:text-terra-700"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 lg:gap-5">
              {filteredProducts.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={idx < 4}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── MOBILE FILTERS DRAWER ─── */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm overflow-y-auto bg-page shadow-2xl animate-slide-in-right">
            <div className="flex items-center justify-between border-b border-earth-200 px-6 py-4">
              <h2 className="font-serif text-lg text-text">Filters</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-earth-100 hover:text-text"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-8 px-6 py-6">
              {/* Categories */}
              <div>
                <h3 className="mb-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted">
                  Category
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveCategory(null)}
                    className={cn(
                      "rounded-full px-4 py-1.5 font-sans text-xs font-medium transition-colors",
                      activeCategory === null
                        ? "bg-accent text-white"
                        : "bg-earth-100 text-text-muted hover:bg-earth-200"
                    )}
                  >
                    All
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() =>
                        setActiveCategory(activeCategory === cat ? null : cat)
                      }
                      className={cn(
                        "rounded-full px-4 py-1.5 font-sans text-xs font-medium transition-colors",
                        activeCategory === cat
                          ? "bg-accent text-white"
                          : "bg-earth-100 text-text-muted hover:bg-earth-200"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <h3 className="mb-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted">
                  Availability
                </h3>
                <div className="flex flex-wrap gap-2">
                  {AVAILABILITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        setAvailability(
                          availability === opt.value ? null : opt.value
                        )
                      }
                      className={cn(
                        "rounded-full px-4 py-1.5 font-sans text-xs font-medium transition-colors",
                        availability === opt.value
                          ? "bg-accent text-white"
                          : "bg-earth-100 text-text-muted hover:bg-earth-200"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="mb-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted">
                  Max Price: {formatPrice(priceRange[1])}
                </h3>
                <input
                  type="range"
                  min={0}
                  max={50000}
                  step={500}
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className="w-full accent-accent"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex-1 rounded-full border border-earth-300 px-5 py-2.5 font-sans text-xs font-medium uppercase tracking-[0.06em] text-text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 rounded-full bg-accent px-5 py-2.5 font-sans text-xs font-medium uppercase tracking-[0.06em] text-white transition-colors hover:bg-terra-700"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Product Card ───

function ProductCard({
  product,
  priority,
  onAddToCart,
}: {
  product: MittiProduct;
  priority?: boolean;
  onAddToCart: (product: MittiProduct, e: React.MouseEvent) => void;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const isInWishlist = useAppStore((s) => s.isInWishlist);
  const toggleWishlist = useAppStore((s) => s.toggleWishlist);

  const currentPrice = product.sale_price || product.price;
  const hasSale = !!product.sale_price;
  const imageUrl = getImageUrl(product.images?.[0]);

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group relative block overflow-hidden rounded-lg border border-earth-200 bg-surface shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(0,0,0,0.10)]"
    >
      {/* Image container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-earth-100">
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={cn(
            "object-cover transition-all duration-500 group-hover:scale-105",
            imgLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImgLoaded(true)}
          priority={priority}
        />

        {/* Category badge */}
        <span className="absolute left-3 top-3 rounded-full bg-white/80 px-3 py-1 font-sans text-[0.625rem] font-medium uppercase tracking-[0.08em] text-text backdrop-blur-sm">
          {product.category}
        </span>

        {/* Sale badge */}
        {hasSale && (
          <span className="absolute right-3 top-3 rounded-full bg-accent px-3 py-1 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-white">
            Sale
          </span>
        )}

        {/* Availability badge */}
        {product.availability === "Sold Out" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-full bg-error px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.08em] text-white">
              Sold Out
            </span>
          </div>
        )}

        {/* Wishlist button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-text-muted opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-accent group-hover:opacity-100"
          aria-label={
            isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isInWishlist(product.id) ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={2}
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-serif text-sm leading-tight text-text md:text-base">
          {product.title}
        </h3>
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

        {/* Add to Cart */}
        {product.availability !== "Sold Out" && (
          <button
            type="button"
            onClick={(e) => onAddToCart(product, e)}
            className="mt-3 w-full rounded-full bg-primary/10 px-4 py-2 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-primary transition-all duration-200 hover:bg-primary hover:text-white"
          >
            Add to Cart
          </button>
        )}
      </div>
    </Link>
  );
}
