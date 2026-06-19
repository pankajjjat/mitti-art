import Link from "next/link";
import { ArrowRight } from "lucide-react";
import clsx from "clsx";

type CategoryCardProps = {
  name: string;
  slug: string;
  image?: string;
  count?: number;
  description?: string;
  className?: string;
};

const gradientMap: Record<string, string> = {
  "Canvas Art": "from-indigo-900/80 via-indigo-800/60 to-indigo-700/40",
  "Mandala Art": "from-terra-900/80 via-terra-800/60 to-terra-700/40",
  "Religious Art": "from-amber-900/80 via-amber-800/60 to-amber-700/40",
  "Resin Art": "from-emerald-900/80 via-emerald-800/60 to-emerald-700/40",
  "Folk Art": "from-rose-900/80 via-rose-800/60 to-rose-700/40",
  "Ceramic": "from-orange-900/80 via-orange-800/60 to-orange-700/40",
  "Mixed Media": "from-violet-900/80 via-violet-800/60 to-violet-700/40",
  default: "from-primary via-primary/80 to-primary/60",
};

export default function CategoryCard({
  name,
  slug,
  image,
  count,
  description,
  className,
}: CategoryCardProps) {
  const gradient = gradientMap[name] || gradientMap.default;

  return (
    <Link
      href={`/shop?category=${encodeURIComponent(slug)}`}
      className={clsx(
        "group relative block overflow-hidden rounded-xl border border-earth-200 bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
        className
      )}
    >
      {/* Background Image or Gradient */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {image ? (
          <div
            className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${image})` }}
          />
        ) : null}
        {/* Gradient overlay */}
        <div
          className={clsx(
            "absolute inset-0 bg-gradient-to-br transition-opacity duration-300",
            gradient,
            image ? "opacity-80 group-hover:opacity-90" : "opacity-100"
          )}
        />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <h3 className="font-serif text-xl font-semibold leading-tight text-white md:text-2xl">
            {name}
          </h3>
          {description && (
            <p className="mt-1 font-sans text-sm text-white/70 line-clamp-2">
              {description}
            </p>
          )}
          <div className="mt-3 flex items-center gap-2">
            <span className="font-sans text-xs font-medium uppercase tracking-[0.06em] text-white/80">
              {count ? `${count} artworks` : "Explore"}
            </span>
            <ArrowRight
              size={14}
              className="text-accent transition-transform duration-200 group-hover:translate-x-1"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
