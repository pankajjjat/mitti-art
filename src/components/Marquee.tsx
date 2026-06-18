"use client";

import clsx from "clsx";

const DEFAULT_ITEMS = [
  "Madhubani",
  "Pichwai",
  "Warli",
  "Gond",
  "Miniature",
  "Resin Art",
  "Ceramics",
  "Mosaic",
  "Metal Work",
  "Botanical",
];

type MarqueeProps = {
  items?: string[];
  className?: string;
};

export default function Marquee({ items = DEFAULT_ITEMS, className }: MarqueeProps) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden",
        "before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-12 before:bg-gradient-to-r before:from-page before:to-transparent",
        "after:absolute after:inset-y-0 after:right-0 after:z-10 after:w-12 after:bg-gradient-to-l after:from-page after:to-transparent",
        className
      )}
      role="list"
      aria-label="Art categories"
    >
      <div className="flex animate-marquee gap-12 py-4">
        {/* Duplicate items so the loop is seamless */}
        {[...items, ...items].map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex-shrink-0 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted"
            role="listitem"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
