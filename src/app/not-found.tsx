import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found — Mitti Art",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-24 md:pt-28">
      {/* Artistic 404 */}
      <div className="text-center">
        <div className="relative mx-auto flex h-32 w-32 items-center justify-center md:h-40 md:w-40">
          {/* Decorative rings */}
          <div className="absolute inset-0 rounded-full border-2 border-earth-200 animate-pulse" />
          <div className="absolute inset-4 rounded-full border-2 border-earth-300" />
          <div className="absolute inset-8 rounded-full border-2 border-accent/40" />

          {/* Center */}
          <span className="relative font-serif text-5xl text-text md:text-6xl">
            404
          </span>
        </div>

        <h1 className="mt-8 font-serif text-3xl leading-[1.1] tracking-[-0.02em] text-text md:text-4xl">
          Page Not Found
        </h1>
        <p className="mx-auto mt-4 max-w-md font-sans text-base leading-relaxed text-text-muted">
          Like a painting left unfinished, this page doesn&apos;t exist yet.
          Let&apos;s get you back to the gallery.
        </p>
      </div>

      {/* Actions */}
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 font-sans text-[0.8125rem] font-medium uppercase tracking-[0.04em] text-white shadow-sm transition-all duration-200 hover:bg-terra-700 hover:shadow-md"
        >
          Back to Home
        </Link>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-full border border-earth-300 px-8 py-3.5 font-sans text-[0.8125rem] font-medium uppercase tracking-[0.04em] text-text transition-all duration-200 hover:border-accent hover:text-accent"
        >
          Browse Shop
        </Link>
      </div>

      {/* Suggested Links */}
      <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        <Link
          href="/shop"
          className="font-sans text-sm text-text-muted transition-colors hover:text-accent underline underline-offset-4"
        >
          Explore Artworks
        </Link>
        <Link
          href="/commissions"
          className="font-sans text-sm text-text-muted transition-colors hover:text-accent underline underline-offset-4"
        >
          Commission Art
        </Link>
        <Link
          href="/about"
          className="font-sans text-sm text-text-muted transition-colors hover:text-accent underline underline-offset-4"
        >
          About Mitti
        </Link>
        <Link
          href="/contact"
          className="font-sans text-sm text-text-muted transition-colors hover:text-accent underline underline-offset-4"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
