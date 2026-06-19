"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Menu,
  X,
  Heart,
  Search,
  User,
  ChevronDown,
  LogOut,
  Package,
  Settings,
  LogIn,
  UserPlus,
  ExternalLink,
} from "lucide-react";
import clsx from "clsx";
import { useAppStore } from "@/lib/store";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Commissions", href: "/commissions" },
  { label: "About", href: "/about" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const totalItems = useAppStore((s) => s.totalItems());
  const openCart = useAppStore((s) => s.openCart);
  const wishlist = useAppStore((s) => s.wishlist);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const user = useAppStore((s) => s.user);
  const logout = useAppStore((s) => s.logout);

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
    document.body.style.overflow = mobileOpen || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, searchOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setAccountDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when overlay opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const isActive = useCallback(
    (href: string) => {
      if (href === "/") return pathname === "/";
      return pathname.startsWith(href);
    },
    [pathname]
  );

  return (
    <>
      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-page/85 backdrop-blur-lg shadow-[0_1px_0_rgba(0,0,0,0.06)]"
            : "bg-transparent"
        )}
      >
        <nav className="container-page flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="font-serif text-2xl tracking-[-0.02em] text-text hover:opacity-80 transition-opacity"
          >
            Mitti
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={clsx(
                    "px-3 py-2 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] transition-colors rounded-full",
                    isActive(link.href)
                      ? "text-accent bg-accent/8"
                      : "text-text-muted hover:text-text hover:bg-earth-100/50"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center justify-center p-2 text-text-muted transition-colors hover:text-text rounded-full hover:bg-earth-100/50"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              className="relative flex items-center justify-center p-2 text-text-muted transition-colors hover:text-text rounded-full hover:bg-earth-100/50"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold leading-none text-white">
                  {wishlist.length > 99 ? "99+" : wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              type="button"
              onClick={openCart}
              className="relative flex items-center justify-center p-2 text-text-muted transition-colors hover:text-text rounded-full hover:bg-earth-100/50"
              aria-label="Open cart"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold leading-none text-white">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>

            {/* Account */}
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setAccountDropdownOpen((v) => !v)}
                className="flex items-center justify-center p-2 text-text-muted transition-colors hover:text-text rounded-full hover:bg-earth-100/50"
                aria-label="Account"
              >
                <User size={20} />
              </button>

              {/* Dropdown */}
              {accountDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-earth-200 bg-surface shadow-lg animate-fade-in">
                  {isAuthenticated && user ? (
                    <div>
                      <div className="px-4 py-3 border-b border-earth-100">
                        <p className="font-serif text-sm font-semibold text-text truncate">
                          {user.name}
                        </p>
                        <p className="font-sans text-xs text-text-muted truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="p-1.5">
                        <Link
                          href="/account"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 font-sans text-sm text-text transition-colors hover:bg-earth-100"
                        >
                          <User size={16} className="text-text-muted" />
                          My Account
                        </Link>
                        <Link
                          href="/account/orders"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 font-sans text-sm text-text transition-colors hover:bg-earth-100"
                        >
                          <Package size={16} className="text-text-muted" />
                          My Orders
                        </Link>
                        <Link
                          href="/account/wishlist"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 font-sans text-sm text-text transition-colors hover:bg-earth-100"
                        >
                          <Heart size={16} className="text-text-muted" />
                          Wishlist
                        </Link>
                        <Link
                          href="/account/commissions"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 font-sans text-sm text-text transition-colors hover:bg-earth-100"
                        >
                          <Settings size={16} className="text-text-muted" />
                          Commission Requests
                        </Link>
                      </div>
                      <div className="border-t border-earth-100 p-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setAccountDropdownOpen(false);
                          }}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 font-sans text-sm text-error transition-colors hover:bg-error/10"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-1.5">
                      <Link
                        href="/auth/login"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 font-sans text-sm text-text transition-colors hover:bg-earth-100"
                      >
                        <LogIn size={16} className="text-text-muted" />
                        Sign In
                      </Link>
                      <Link
                        href="/auth/signup"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 font-sans text-sm text-text transition-colors hover:bg-earth-100"
                      >
                        <UserPlus size={16} className="text-text-muted" />
                        Create Account
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Hamburger */}
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
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          onClick={closeMobile}
        />
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

          <nav className="px-6 pt-4">
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMobile}
                    className={clsx(
                      "block rounded-lg px-4 py-3 font-sans text-base font-medium transition-colors",
                      isActive(link.href)
                        ? "text-accent bg-accent/8"
                        : "text-text hover:bg-earth-100"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Divider */}
            <hr className="my-4 border-earth-200" />

            {/* Account section in mobile */}
            {isAuthenticated && user ? (
              <div>
                <div className="px-4 py-2">
                  <p className="font-serif text-sm font-semibold text-text">
                    {user.name}
                  </p>
                  <p className="font-sans text-xs text-text-muted">
                    {user.email}
                  </p>
                </div>
                <ul className="flex flex-col gap-1 mt-2">
                  <li>
                    <Link
                      href="/account"
                      onClick={closeMobile}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 font-sans text-sm text-text transition-colors hover:bg-earth-100"
                    >
                      <User size={16} className="text-text-muted" />
                      My Account
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/account/orders"
                      onClick={closeMobile}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 font-sans text-sm text-text transition-colors hover:bg-earth-100"
                    >
                      <Package size={16} className="text-text-muted" />
                      My Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/account/wishlist"
                      onClick={closeMobile}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 font-sans text-sm text-text transition-colors hover:bg-earth-100"
                    >
                      <Heart size={16} className="text-text-muted" />
                      Wishlist
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        closeMobile();
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-4 py-3 font-sans text-sm text-error transition-colors hover:bg-error/10"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div>
                <ul className="flex flex-col gap-1">
                  <li>
                    <Link
                      href="/auth/login"
                      onClick={closeMobile}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 font-sans text-sm text-text transition-colors hover:bg-earth-100"
                    >
                      <LogIn size={16} className="text-text-muted" />
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/auth/signup"
                      onClick={closeMobile}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 font-sans text-sm text-text transition-colors hover:bg-earth-100"
                    >
                      <UserPlus size={16} className="text-text-muted" />
                      Create Account
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 border-t border-earth-200 px-6 py-6">
            <p className="font-sans text-xs text-text-muted">
              Handcrafted Indian art &mdash; Mitti
            </p>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 backdrop-blur-sm pt-[15vh]">
          <div
            className="absolute inset-0"
            onClick={() => setSearchOpen(false)}
          />
          <div className="relative w-full max-w-xl mx-4 animate-fade-in">
            <div className="relative">
              <Search
                size={20}
                className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search artworks, categories..."
                className="h-16 w-full rounded-2xl border border-earth-200 bg-surface pl-14 pr-14 font-sans text-lg text-text outline-none shadow-xl transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
                    setSearchOpen(false);
                  }
                  if (e.key === "Escape") setSearchOpen(false);
                }}
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-earth-100 hover:text-text"
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </div>
            <p className="mt-3 text-center font-sans text-xs text-white/60">
              Press &ldquo;Enter&rdquo; to search or &ldquo;Esc&rdquo; to close
            </p>
          </div>
        </div>
      )}
    </>
  );
}
