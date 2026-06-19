"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Star, Quote, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/lib/types";

// Fallback testimonials if PocketBase is empty
const fallbackTestimonials: Testimonial[] = [
  {
    id: "1",
    customer_name: "Ananya Sharma",
    review:
      "I commissioned a Madhubani painting for my living room, and it has become the centerpiece of our home. The level of detail is breathtaking — every time I look at it, I notice something new. Samuya truly understands how to blend tradition with contemporary aesthetics.",
    rating: 5,
    featured: true,
  },
  {
    id: "2",
    customer_name: "Rohan Mehta",
    review:
      "The ceramic lotus set I ordered exceeded every expectation. Each piece feels unique and carries the warmth of being handmade. You can literally feel the love and care in every curve. I've already ordered two more pieces for gifts.",
    rating: 5,
    featured: true,
  },
  {
    id: "3",
    customer_name: "Priya Patel",
    review:
      "Mitti Art doesn't just sell art — they tell stories. The resin ocean piece I bought reminds me of my childhood summers in Goa. The packaging was exquisite, and the personal note made the experience truly special.",
    rating: 5,
    featured: true,
  },
  {
    id: "4",
    customer_name: "Vikram Singh",
    review:
      "As an interior designer, I've sourced art from around the world. Mitti Art stands out for its authenticity. The Pichwai Lotus Pond painting brought a spiritual elegance to my client's home that no mass-produced piece could match.",
    rating: 5,
    featured: false,
  },
  {
    id: "5",
    customer_name: "Neha Kapoor",
    review:
      "I gifted the Surya Om Mandala to my mother for Diwali and she was speechless. The gold leaf work is exquisite and the spiritual energy it brings to the room is palpable. Will definitely be a repeat customer!",
    rating: 5,
    featured: false,
  },
  {
    id: "6",
    customer_name: "Arjun Nair",
    review:
      "The shipping was incredibly fast and the packaging was museum-quality. The resin coaster set with sacred leaves arrived in perfect condition. They make wonderful conversation starters at every gathering.",
    rating: 4,
    featured: false,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={cn(
            i < rating ? "fill-gold-500 text-gold-500" : "fill-earth-200 text-earth-200"
          )}
        />
      ))}
    </div>
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function TestimonialsPageClient({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [showAll, setShowAll] = useState(false);

  const allTestimonials =
    testimonials.length > 0 ? testimonials : fallbackTestimonials;
  const displayed = showAll ? allTestimonials : allTestimonials.slice(0, 6);

  const featured = allTestimonials.filter((t) => t.featured);
  const regular = allTestimonials.filter((t) => !t.featured);

  return (
    <div className="mt-14 md:mt-16">
      {/* Featured Testimonials */}
      {featured.length > 0 && (
        <div className="mb-12">
          <h2 className="mb-8 font-serif text-2xl text-text md:text-3xl">
            Featured Stories
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {featured.slice(0, 3).map((t) => (
              <div
                key={t.id}
                className="relative flex flex-col rounded-2xl border border-accent/20 bg-surface p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] md:p-8"
              >
                {/* Quote icon */}
                <Quote
                  size={24}
                  className="mb-4 shrink-0 text-accent/30"
                  aria-hidden="true"
                />

                {/* Stars */}
                <StarRating rating={t.rating} />

                {/* Review */}
                <blockquote className="mt-3 flex-1 font-sans text-sm leading-[1.8] text-text/80 md:text-base">
                  &ldquo;{t.review}&rdquo;
                </blockquote>

                {/* Customer */}
                <footer className="mt-6 flex items-center gap-3 border-t border-earth-200 pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 font-serif text-sm font-semibold text-accent">
                    {getInitials(t.customer_name)}
                  </div>
                  <div>
                    <cite className="block font-serif text-sm font-semibold text-text not-italic">
                      {t.customer_name}
                    </cite>
                    {t.photo && (
                      <span className="font-sans text-xs text-text-muted">
                        Verified Collector
                      </span>
                    )}
                  </div>
                </footer>

                {/* Featured badge */}
                <span className="absolute right-4 top-4 rounded-full bg-gold-50 px-2.5 py-0.5 font-sans text-[0.5rem] font-medium uppercase tracking-[0.08em] text-gold-700">
                  Featured
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Testimonials Grid */}
      <div>
        <h2 className="mb-8 font-serif text-2xl text-text md:text-3xl">
          All Reviews
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayed.map((t) => (
            <div
              key={t.id}
              className="flex flex-col rounded-xl border border-earth-200 bg-surface p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              {/* Stars + Name row */}
              <div className="flex items-center justify-between">
                <StarRating rating={t.rating} />
                {t.featured && (
                  <span className="rounded-full bg-gold-50 px-2 py-0.5 font-sans text-[0.5rem] font-medium uppercase tracking-[0.08em] text-gold-700">
                    Featured
                  </span>
                )}
              </div>

              <blockquote className="mt-3 flex-1 font-sans text-sm leading-[1.7] text-text/80">
                &ldquo;{t.review.length > 200
                  ? `${t.review.slice(0, 200)}…`
                  : t.review}&rdquo;
              </blockquote>

              <footer className="mt-4 flex items-center gap-3 border-t border-earth-100 pt-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 font-serif text-xs font-semibold text-accent">
                  {getInitials(t.customer_name)}
                </div>
                <cite className="font-sans text-sm font-medium text-text not-italic">
                  {t.customer_name}
                </cite>
              </footer>
            </div>
          ))}
        </div>

        {/* Show more / less */}
        {allTestimonials.length > 6 && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 rounded-full border border-earth-300 px-7 py-3.5 font-sans text-[0.8125rem] font-medium uppercase tracking-[0.04em] text-text transition-all duration-200 hover:border-accent hover:text-accent"
            >
              {showAll
                ? "Show Less"
                : `Show All ${allTestimonials.length} Reviews`}
            </button>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="mt-16 rounded-2xl bg-accent/5 border border-accent/20 p-8 md:p-12 text-center">
        <h2 className="font-serif text-2xl text-text md:text-3xl">
          Share Your Experience
        </h2>
        <p className="mt-3 font-sans text-sm text-text-muted max-w-md mx-auto">
          Loved your Mitti Art piece? We&apos;d love to hear about it. Your
          review helps other art lovers discover authentic handcrafted art.
        </p>
        <a
          href="mailto:hello@mittiart.com?subject=Testimonial%20for%20Mitti%20Art"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-sans text-[0.8125rem] font-medium uppercase tracking-[0.04em] text-white shadow-sm transition-all duration-200 hover:bg-terra-700 hover:shadow-md"
        >
          Send Your Review
        </a>
      </div>
    </div>
  );
}
