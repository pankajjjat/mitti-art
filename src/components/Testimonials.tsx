"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import clsx from "clsx";
import SectionHeading from "@/components/SectionHeading";

const testimonials = [
  {
    quote:
      "I commissioned a Madhubani painting for my living room, and it has become the centerpiece of our home. The level of detail is breathtaking &mdash; every time I look at it, I notice something new. Samuya truly understands how to blend tradition with contemporary aesthetics.",
    name: "Ananya Sharma",
    location: "Mumbai, Maharashtra",
  },
  {
    quote:
      "The ceramic lotus set I ordered exceeded every expectation. Each piece feels unique and carries the warmth of being handmade. You can literally feel the love and care in every curve. I&rsquo;ve already ordered two more pieces for gifts.",
    name: "Rohan Mehta",
    location: "Bangalore, Karnataka",
  },
  {
    quote:
      "Mitti Art doesn&rsquo;t just sell art &mdash; they tell stories. The resin ocean piece I bought reminds me of my childhood summers in Goa. The packaging was exquisite, and the personal note made the experience truly special.",
    name: "Priya Patel",
    location: "Ahmedabad, Gujarat",
  },
  {
    quote:
      "As an interior designer, I&rsquo;ve sourced art from around the world. Mitti Art stands out for its authenticity. The Pichwai Lotus Pond painting brought a spiritual elegance to my client&rsquo;s home that no mass-produced piece could match.",
    name: "Vikram Singh",
    location: "Delhi, NCR",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = testimonials.length;

  const goTo = useCallback(
    (index: number) => {
      setCurrent(((index % total) + total) % total);
    },
    [total]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, total]);

  // Helper: which testimonial index to show at a given position
  // We always show [current, current+1, current+2] but cap at total
  const getVisible = () => {
    const visible: number[] = [];
    for (let i = 0; i < total; i++) {
      visible.push((current + i) % total);
    }
    return visible;
  };

  const visibleIndices = getVisible();

  return (
    <section
      className="bg-earth-50/50 py-20 md:py-28"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container-page">
        <SectionHeading
          eyebrow="Testimonials"
          title="What Collectors Say"
          subtitle="Real stories from people who brought Mitti Art into their homes and lives."
        />

        {/* Carousel */}
        <div className="relative mt-14 md:mt-16">
          {/* Cards Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleIndices.slice(0, 3).map((idx, position) => (
              <div
                key={idx}
                className={clsx(
                  "flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all duration-500 md:p-8",
                  position === 0
                    ? "opacity-100 translate-y-0"
                    : "opacity-70 scale-[0.97] hidden md:flex",
                  position === 2 && "hidden lg:flex"
                )}
              >
                {/* Quote icon */}
                <Quote
                  size={24}
                  className="mb-4 shrink-0 text-accent/30"
                  aria-hidden="true"
                />

                {/* Quote text */}
                <blockquote
                  className="flex-1 font-sans text-sm leading-[1.8] text-text/80 md:text-base"
                  dangerouslySetInnerHTML={{ __html: testimonials[idx].quote }}
                />

                {/* Attribution */}
                <footer className="mt-6 border-t border-border pt-4">
                  <cite className="not-italic">
                    <span className="block font-serif text-base font-semibold text-text">
                      {testimonials[idx].name}
                    </span>
                    <span className="mt-0.5 block font-sans text-xs text-text-muted">
                      {testimonials[idx].location}
                    </span>
                  </cite>
                </footer>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="mt-10 flex items-center justify-center gap-6">
            {/* Prev Arrow */}
            <button
              type="button"
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-earth-300 bg-surface text-text-muted transition-all duration-200 hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Dot Indicators */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goTo(idx)}
                  className={clsx(
                    "h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                    idx === current
                      ? "w-6 bg-accent"
                      : "w-2 bg-earth-300 hover:bg-earth-400"
                  )}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>

            {/* Next Arrow */}
            <button
              type="button"
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-earth-300 bg-surface text-text-muted transition-all duration-200 hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
