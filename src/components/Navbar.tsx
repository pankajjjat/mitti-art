"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import clsx from "clsx";
import { useCartStore } from "@/lib/store";

const NAV_LINKS = [
  { label: "Explore", href: "#explore" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const openCart = useCartStore((s) => s.openCart);

  // Throttled scroll handler using passive listener
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-page/80 backdrop-blur-lg shadow-[0_1px_0_rgba(0,0,0,0.04)]"
            : "bg-transparent"
        )}
      >
        <nav className="container-page flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="font-serif text-2xl tracking-[-0.02em] text-text"
          >
            Mitti
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted transition-colors hover:text-text"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Cart + Hamburger */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={openCart}
              className="relative flex items-center justify-center p-2 text-text-muted transition-colors hover:text-text"
              aria-label="Open cart"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold leading-none text-white">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="flex items-center justify-center p-2 text-text-muted transition-colors hover:text-text md:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <div
        className={clsx(
          "fixed inset-0 z-40 transition-opacity duration-300 md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          onClick={closeMobile}
        />

        {/* Drawer Panel */}
        <div
          className={clsx(
            "absolute inset-y-0 right-0 w-full max-w-sm bg-page shadow-2xl transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex h-16 items-center justify-between px-6">
            <span className="font-serif text-2xl text-text">Mitti</span>
            <button
              type="button"
              onClick={closeMobile}
              className="p-2 text-text-muted hover:text-text"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="px-6 pt-8">
            <ul className="flex flex-col gap-6">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={closeMobile}
                    className="font-sans text-base font-medium text-text transition-colors hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto border-t border-earth-200 px-6 py-8">
            <p className="font-sans text-xs text-text-muted">
              Handcrafted Indian art
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
