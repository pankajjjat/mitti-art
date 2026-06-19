"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Heart,
  MapPin,
  Palette,
  User,
  LogOut,
  ChevronRight,
} from "lucide-react";
import clsx from "clsx";
import { useAppStore } from "@/lib/store";

const sidebarLinks = [
  {
    href: "/account",
    label: "Overview",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/account/orders",
    label: "My Orders",
    icon: Package,
  },
  {
    href: "/account/wishlist",
    label: "Wishlist",
    icon: Heart,
  },
  {
    href: "/account/addresses",
    label: "Addresses",
    icon: MapPin,
  },
  {
    href: "/account/commissions",
    label: "Commissions",
    icon: Palette,
  },
  {
    href: "/account/profile",
    label: "Profile",
    icon: User,
  },
];

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];

  if (segments.length === 0) return crumbs;

  // Account root
  crumbs.push({ label: "Account", href: "/account" });

  // Sub-page
  if (segments.length > 1) {
    const subPage = segments[1];
    const link = sidebarLinks.find((l) => l.href === `/account/${subPage}`);
    if (link) {
      crumbs.push({ label: link.label, href: link.href });
    } else {
      crumbs.push({
        label: subPage.charAt(0).toUpperCase() + subPage.slice(1),
        href: `/account/${subPage}`,
      });
    }
  }

  return crumbs;
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const user = useAppStore((s) => s.user);
  const logout = useAppStore((s) => s.logout);

  // Auth check
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login?redirect=/account");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <div className="min-h-screen pt-24 md:pt-28">
      <div className="container-page py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 font-sans text-xs text-text-muted">
          <Link href="/" className="hover:text-text transition-colors">
            Home
          </Link>
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-2">
              <ChevronRight size={12} />
              {i === breadcrumbs.length - 1 ? (
                <span className="text-text">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="hover:text-text transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl tracking-[-0.02em] text-text md:text-4xl">
            My Account
          </h1>
          <p className="mt-1 font-sans text-sm text-text-muted">
            Welcome back, {user.name?.split(" ")[0] || "there"}
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* ─── SIDEBAR (Desktop) ─── */}
          <aside className="hidden w-56 shrink-0 lg:block">
            <nav className="space-y-1">
              {sidebarLinks.map((link) => {
                const isActive = link.exact
                  ? pathname === link.href
                  : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={clsx(
                      "flex items-center gap-3 rounded-lg px-4 py-2.5 font-sans text-sm transition-colors",
                      isActive
                        ? "bg-accent/10 font-medium text-accent"
                        : "text-text-muted hover:bg-earth-100 hover:text-text"
                    )}
                  >
                    <link.icon size={18} />
                    {link.label}
                  </Link>
                );
              })}

              {/* Divider */}
              <hr className="my-3 border-earth-200" />

              {/* Logout */}
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 font-sans text-sm text-error transition-colors hover:bg-error/10"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </nav>
          </aside>

          {/* ─── MOBILE TABS ─── */}
          <div className="lg:hidden -mx-4 overflow-x-auto">
            <div className="flex gap-1 px-4 pb-2 border-b border-earth-200">
              {sidebarLinks.map((link) => {
                const isActive = link.exact
                  ? pathname === link.href
                  : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={clsx(
                      "flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 font-sans text-xs font-medium transition-colors",
                      isActive
                        ? "bg-accent text-white"
                        : "text-text-muted hover:bg-earth-100 hover:text-text"
                    )}
                  >
                    <link.icon size={14} />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ─── CONTENT ─── */}
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
