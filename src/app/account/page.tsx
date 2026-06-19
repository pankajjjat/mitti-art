"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Package,
  Heart,
  MapPin,
  Palette,
  User,
  Clock,
  ShoppingBag,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatPrice, cn } from "@/lib/utils";
import { fetchOrders } from "@/lib/api";
import type { Order } from "@/lib/types";

const quickLinks = [
  {
    href: "/account/orders",
    label: "My Orders",
    icon: Package,
    description: "View and track all your orders",
  },
  {
    href: "/account/wishlist",
    label: "Wishlist",
    icon: Heart,
    description: "Saved items you love",
  },
  {
    href: "/account/addresses",
    label: "Saved Addresses",
    icon: MapPin,
    description: "Manage your shipping addresses",
  },
  {
    href: "/account/commissions",
    label: "Commission Requests",
    icon: Palette,
    description: "Track your custom art requests",
  },
  {
    href: "/account/profile",
    label: "Profile Settings",
    icon: User,
    description: "Edit your personal details",
  },
];

const statusStyles: Record<string, string> = {
  pending_payment: "bg-amber-100 text-amber-800",
  payment_submitted: "bg-blue-100 text-blue-800",
  payment_verified: "bg-green-100 text-green-800",
  in_progress: "bg-purple-100 text-purple-800",
  packed: "bg-indigo-100 text-indigo-800",
  shipped: "bg-teal-100 text-teal-800",
  delivered: "bg-emerald-100 text-emerald-800",
};

const statusLabels: Record<string, string> = {
  pending_payment: "Pending Payment",
  payment_submitted: "Payment Submitted",
  payment_verified: "Payment Verified",
  in_progress: "In Progress",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
};

export default function AccountDashboard() {
  const router = useRouter();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const user = useAppStore((s) => s.user);
  const token = useAppStore((s) => s.token);
  const wishlist = useAppStore((s) => s.wishlist);

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [orderError, setOrderError] = useState<string | null>(null);

  // ─── Auth redirect ───
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login?redirect=/account");
    }
  }, [isAuthenticated, router]);

  // ─── Fetch orders ───
  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadOrders() {
      setIsLoadingOrders(true);
      try {
        const res = await fetchOrders(token || undefined);
        if (res.success && res.data) {
          setOrders(res.data);
        } else {
          setOrderError(res.error || "Could not load orders.");
        }
      } catch {
        setOrderError("Failed to load orders.");
      } finally {
        setIsLoadingOrders(false);
      }
    }

    loadOrders();
  }, [isAuthenticated, token]);

  if (!isAuthenticated || !user) return null;

  const pendingOrders = orders.filter(
    (o) => o.status !== "delivered" && o.status !== "payment_verified"
  );

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="min-h-screen pt-24 md:pt-28">
      <div className="container-page py-8 md:py-12">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="font-serif text-3xl tracking-[-0.02em] text-text md:text-4xl">
            Welcome back, {user.name?.split(" ")[0] || "there"}
          </h1>
          <p className="mt-2 font-sans text-sm text-text-muted">
            Here&apos;s your account overview
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-earth-200 bg-surface p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <Package size={22} className="text-accent" />
              </div>
              <div>
                <p className="font-serif text-2xl font-semibold text-text">
                  {orders.length}
                </p>
                <p className="font-sans text-xs text-text-muted">
                  Total Orders
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-earth-200 bg-surface p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                <Clock size={22} className="text-amber-700" />
              </div>
              <div>
                <p className="font-serif text-2xl font-semibold text-text">
                  {pendingOrders.length}
                </p>
                <p className="font-sans text-xs text-text-muted">
                  Pending Orders
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-earth-200 bg-surface p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
                <Heart size={22} className="text-rose-600" />
              </div>
              <div>
                <p className="font-serif text-2xl font-semibold text-text">
                  {wishlist.length}
                </p>
                <p className="font-sans text-xs text-text-muted">
                  Wishlist Items
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex flex-col gap-2 rounded-xl border border-earth-200 bg-surface p-4 shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 transition-colors group-hover:bg-accent/20">
                <link.icon size={18} className="text-accent" />
              </div>
              <div>
                <p className="font-sans text-sm font-medium text-text">
                  {link.label}
                </p>
                <p className="mt-0.5 font-sans text-xs text-text-muted">
                  {link.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="rounded-xl border border-earth-200 bg-surface shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between border-b border-earth-200 px-6 py-4">
            <div>
              <h2 className="font-serif text-lg text-text">Recent Orders</h2>
              <p className="font-sans text-xs text-text-muted">
                Your last {Math.min(recentOrders.length, 5)} orders
              </p>
            </div>
            <Link
              href="/account/orders"
              className="flex items-center gap-1 font-sans text-sm text-accent underline underline-offset-4 transition-colors hover:text-terra-700"
            >
              View All
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="p-6">
            {isLoadingOrders ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={24} className="animate-spin text-text-muted" />
              </div>
            ) : orderError ? (
              <div className="rounded-lg bg-error/10 px-4 py-3">
                <p className="font-sans text-sm text-error">{orderError}</p>
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <ShoppingBag size={32} className="text-earth-400" />
                <p className="mt-3 font-sans text-sm text-text-muted">
                  No orders yet
                </p>
                <Link
                  href="/shop"
                  className="mt-3 font-sans text-sm text-accent underline underline-offset-4 transition-colors hover:text-terra-700"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-sm">
                  <thead>
                    <tr className="border-b border-earth-200 text-[0.625rem] font-medium uppercase tracking-[0.08em] text-text-muted">
                      <th className="pb-3 pr-4">Order</th>
                      <th className="pb-3 pr-4">Date</th>
                      <th className="pb-3 pr-4">Items</th>
                      <th className="pb-3 pr-4">Total</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-earth-100 last:border-0"
                      >
                        <td className="py-3 pr-4">
                          <Link
                            href={`/account/orders`}
                            className="font-mono text-xs text-accent underline underline-offset-2 transition-colors hover:text-terra-700"
                          >
                            {order.order_id}
                          </Link>
                        </td>
                        <td className="py-3 pr-4 text-text-muted">
                          {new Date(order.created).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-3 pr-4 text-text">
                          {order.items.length}
                        </td>
                        <td className="py-3 pr-4 font-medium text-text">
                          {formatPrice(order.total)}
                        </td>
                        <td className="py-3">
                          <span
                            className={cn(
                              "inline-block rounded-full px-2.5 py-1 font-sans text-[0.625rem] font-medium uppercase tracking-[0.04em]",
                              statusStyles[order.status] ||
                                "bg-earth-100 text-earth-700"
                            )}
                          >
                            {statusLabels[order.status] || order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
