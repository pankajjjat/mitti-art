"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Clock,
  Package,
  ShoppingBag,
  Loader2,
  CheckCircle2,
  Circle,
  Truck,
  ShieldCheck,
  Box,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatPrice, cn, getImageUrl } from "@/lib/utils";
import { fetchOrders } from "@/lib/api";
import type { Order, OrderStatus } from "@/lib/types";

const statusLabels: Record<OrderStatus, string> = {
  pending_payment: "Pending Payment",
  payment_submitted: "Payment Submitted",
  payment_verified: "Payment Verified",
  in_progress: "In Progress",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
};

const statusStyles: Record<OrderStatus, string> = {
  pending_payment: "bg-amber-100 text-amber-800 border-amber-200",
  payment_submitted: "bg-blue-100 text-blue-800 border-blue-200",
  payment_verified: "bg-green-100 text-green-800 border-green-200",
  in_progress: "bg-purple-100 text-purple-800 border-purple-200",
  packed: "bg-indigo-100 text-indigo-800 border-indigo-200",
  shipped: "bg-teal-100 text-teal-800 border-teal-200",
  delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const timelineSteps: { status: OrderStatus; icon: typeof Circle; label: string }[] = [
  { status: "pending_payment", icon: Clock, label: "Pending Payment" },
  { status: "payment_submitted", icon: ShieldCheck, label: "Payment Submitted" },
  { status: "payment_verified", icon: CheckCircle2, label: "Payment Verified" },
  { status: "in_progress", icon: Package, label: "In Progress" },
  { status: "packed", icon: Box, label: "Packed" },
  { status: "shipped", icon: Truck, label: "Shipped" },
  { status: "delivered", icon: CheckCircle2, label: "Delivered" },
];

const statusOrder: OrderStatus[] = [
  "pending_payment",
  "payment_submitted",
  "payment_verified",
  "in_progress",
  "packed",
  "shipped",
  "delivered",
];

function getTimelineProgress(currentStatus: OrderStatus): number {
  const idx = statusOrder.indexOf(currentStatus);
  return idx >= 0 ? idx : 0;
}

export default function OrdersPage() {
  const router = useRouter();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const token = useAppStore((s) => s.token);

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // ─── Auth redirect ───
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login?redirect=/account/orders");
    }
  }, [isAuthenticated, router]);

  // ─── Fetch orders ───
  useEffect(() => {
    if (!isAuthenticated) return;

    async function load() {
      setIsLoading(true);
      try {
        const res = await fetchOrders(token || undefined);
        if (res.success && res.data) {
          setOrders(res.data);
        } else {
          setError(res.error || "Could not load orders.");
        }
      } catch {
        setError("Failed to load orders.");
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [isAuthenticated, token]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedOrder((prev) => (prev === id ? null : id));
  }, []);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen pt-24 md:pt-28">
      <div className="container-page py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <Link
            href="/account"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-earth-300 text-text-muted transition-colors hover:border-accent hover:text-accent"
            aria-label="Back to account"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="font-serif text-3xl tracking-[-0.02em] text-text md:text-4xl">
              My Orders
            </h1>
            <p className="mt-1 font-sans text-sm text-text-muted">
              Track and manage your orders
            </p>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-text-muted" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-earth-200 bg-surface p-8 text-center">
            <p className="font-sans text-sm text-error">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          /* ─── Empty State ─── */
          <div className="flex flex-col items-center py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-earth-100">
              <ShoppingBag size={32} className="text-earth-400" />
            </div>
            <h2 className="mt-6 font-serif text-2xl text-text">
              No Orders Yet
            </h2>
            <p className="mt-2 max-w-sm font-sans text-sm text-text-muted">
              You haven&apos;t placed any orders yet. Explore our collection
              and find something special.
            </p>
            <Link
              href="/shop"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-sans text-[0.8125rem] font-medium uppercase tracking-[0.04em] text-white shadow-sm transition-all duration-200 hover:bg-terra-700 hover:shadow-md"
            >
              Browse Collection
            </Link>
          </div>
        ) : (
          /* ─── Orders List ─── */
          <div className="space-y-4">
            {orders.map((order) => {
              const isExpanded = expandedOrder === order.id;
              const progressIndex = getTimelineProgress(order.status);

              return (
                <div
                  key={order.id}
                  className="rounded-xl border border-earth-200 bg-surface shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
                >
                  {/* Order Header */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(order.id)}
                    className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-earth-50/50"
                  >
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                      <div>
                        <p className="font-sans text-[0.625rem] font-medium uppercase tracking-[0.08em] text-text-muted">
                          Order ID
                        </p>
                        <p className="font-mono text-sm font-semibold text-text">
                          {order.order_id}
                        </p>
                      </div>
                      <div>
                        <p className="font-sans text-[0.625rem] font-medium uppercase tracking-[0.08em] text-text-muted">
                          Date
                        </p>
                        <p className="font-sans text-sm text-text">
                          {new Date(order.created).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="font-sans text-[0.625rem] font-medium uppercase tracking-[0.08em] text-text-muted">
                          Total
                        </p>
                        <p className="font-sans text-sm font-semibold text-text">
                          {formatPrice(order.total)}
                        </p>
                      </div>
                      <div>
                        <span
                          className={cn(
                            "inline-block rounded-full border px-3 py-1 font-sans text-[0.625rem] font-medium uppercase tracking-[0.04em]",
                            statusStyles[order.status] ||
                              "bg-earth-100 text-earth-700 border-earth-200"
                          )}
                        >
                          {statusLabels[order.status] || order.status}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 shrink-0 text-text-muted">
                      {isExpanded ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-earth-200 px-6 py-6">
                      {/* Timeline */}
                      <div className="mb-8">
                        <h4 className="mb-4 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted">
                          Order Progress
                        </h4>
                        <div className="relative">
                          {/* Progress bar background */}
                          <div className="absolute left-[11px] top-0 h-full w-0.5 bg-earth-200 md:left-0 md:top-[11px] md:h-0.5 md:w-full" />
                          {/* Progress bar fill */}
                          <div
                            className="absolute left-[11px] top-0 w-0.5 bg-accent transition-all duration-500 md:left-0 md:top-[11px] md:h-0.5"
                            style={{
                              height: `${(progressIndex / (timelineSteps.length - 1)) * 100}%`,
                              width: undefined,
                            }}
                          />
                          <div
                            className="absolute left-0 top-[11px] hidden h-0.5 bg-accent transition-all duration-500 md:block"
                            style={{
                              width: `${(progressIndex / (timelineSteps.length - 1)) * 100}%`,
                            }}
                          />

                          <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                            {timelineSteps.map((step, idx) => {
                              const isCompleted = idx <= progressIndex;
                              const isCurrent = idx === progressIndex;

                              return (
                                <div
                                  key={step.status}
                                  className={cn(
                                    "flex items-start gap-3 md:flex-col md:items-center md:text-center",
                                    isCompleted
                                      ? "text-accent"
                                      : "text-text-muted/60"
                                  )}
                                >
                                  <div
                                    className={cn(
                                      "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                                      isCompleted
                                        ? "border-accent bg-accent text-white"
                                        : "border-earth-300 bg-surface text-earth-400",
                                      isCurrent && "ring-2 ring-accent/30 ring-offset-2 ring-offset-surface"
                                    )}
                                  >
                                    <step.icon size={12} />
                                  </div>
                                  <span
                                    className={cn(
                                      "font-sans text-[0.625rem] font-medium uppercase tracking-[0.04em] leading-tight md:mt-2",
                                      isCompleted
                                        ? "text-text"
                                        : "text-text-muted/60"
                                    )}
                                  >
                                    {step.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="mb-6">
                        <h4 className="mb-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted">
                          Items ({order.items.length})
                        </h4>
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-start gap-3 rounded-lg border border-earth-100 bg-page p-3"
                            >
                              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-earth-100">
                                <Image
                                  src={getImageUrl(item.image)}
                                  alt={item.title}
                                  fill
                                  sizes="56px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-sans text-sm font-medium text-text">
                                  {item.title}
                                </p>
                                <p className="font-sans text-xs text-text-muted">
                                  Qty: {item.quantity} ×{" "}
                                  {formatPrice(item.price)}
                                </p>
                              </div>
                              <p className="shrink-0 font-sans text-sm font-semibold text-text">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping Address */}
                      {order.address && (
                        <div className="mb-6">
                          <h4 className="mb-2 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted">
                            Shipping Address
                          </h4>
                          <div className="rounded-lg border border-earth-100 bg-page p-3 font-sans text-sm text-text">
                            <p>{order.address.line1}</p>
                            {order.address.line2 && (
                              <p>{order.address.line2}</p>
                            )}
                            <p>
                              {order.address.city}, {order.address.state} —{" "}
                              {order.address.pincode}
                            </p>
                            <p>{order.address.country}</p>
                          </div>
                        </div>
                      )}

                      {/* Order Totals */}
                      <div className="space-y-1.5 font-sans text-sm">
                        <div className="flex items-center justify-between text-text-muted">
                          <span>Subtotal</span>
                          <span>{formatPrice(order.subtotal)}</span>
                        </div>
                        <div className="flex items-center justify-between text-text-muted">
                          <span>Shipping</span>
                          <span>
                            {order.shipping === 0 ? (
                              <span className="text-success">FREE</span>
                            ) : (
                              formatPrice(order.shipping)
                            )}
                          </span>
                        </div>
                        <hr className="my-2 border-earth-200" />
                        <div className="flex items-center justify-between font-medium text-text">
                          <span>Total</span>
                          <span className="font-serif text-lg font-semibold">
                            {formatPrice(order.total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
