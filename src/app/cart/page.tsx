"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatPrice, cn, getImageUrl } from "@/lib/utils";

export default function CartPage() {
  const items = useAppStore((s) => s.items);
  const removeFromCart = useAppStore((s) => s.removeFromCart);
  const updateQuantity = useAppStore((s) => s.updateQuantity);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const openCart = useAppStore((s) => s.openCart);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  // ─── Empty State ───
  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 md:pt-28">
        <div className="container-page py-20">
          <div className="mx-auto flex max-w-md flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-earth-100">
              <ShoppingBag size={32} className="text-earth-400" />
            </div>
            <h1 className="mt-6 font-serif text-2xl text-text md:text-3xl">
              Your Cart is Empty
            </h1>
            <p className="mt-2 font-sans text-sm text-text-muted">
              Looks like you haven&apos;t added anything to your cart yet.
              Explore our collection and find something you love.
            </p>
            <Link
              href="/shop"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 font-sans text-[0.8125rem] font-medium uppercase tracking-[0.04em] text-white shadow-sm transition-all duration-200 hover:bg-terra-700 hover:shadow-md"
            >
              Continue Shopping
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 md:pt-28">
      <div className="container-page py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl tracking-[-0.02em] text-text md:text-4xl">
              Shopping Cart
            </h1>
            <p className="mt-1 font-sans text-sm text-text-muted">
              {items.reduce((sum, i) => sum + i.quantity, 0)}{" "}
              {items.reduce((sum, i) => sum + i.quantity, 0) === 1
                ? "item"
                : "items"}
            </p>
          </div>
          <Link
            href="/shop"
            className="font-sans text-sm text-accent underline underline-offset-4 transition-colors hover:text-terra-700"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* ─── Cart Items ─── */}
          <div className="flex-1">
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-4 rounded-xl border border-earth-200 bg-surface p-4 transition-shadow hover:shadow-sm md:p-5"
                >
                  {/* Image */}
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-earth-100 md:h-28 md:w-28">
                    <Image
                      src={getImageUrl(item.image)}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 96px, 112px"
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <h3 className="truncate font-serif text-base font-semibold text-text">
                        <Link
                          href={`/shop/${item.productId}`}
                          className="hover:text-accent transition-colors"
                        >
                          {item.title}
                        </Link>
                      </h3>
                      <p className="mt-1 font-sans text-sm font-medium text-text">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Quantity + Remove row */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-earth-300 text-text-muted transition-colors hover:border-accent hover:text-accent"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="flex h-8 min-w-[2.5rem] items-center justify-center font-mono text-sm text-text">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-earth-300 text-text-muted transition-colors hover:border-accent hover:text-accent"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-sans text-sm font-semibold text-text">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.productId)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-error/10 hover:text-error"
                          aria-label={`Remove ${item.title}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* ─── Order Summary ─── */}
          <aside className="w-full shrink-0 lg:w-80">
            <div className="sticky top-28 rounded-xl border border-earth-200 bg-surface p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
              <h2 className="font-serif text-lg text-text">Order Summary</h2>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between font-sans text-sm">
                  <span className="text-text-muted">Subtotal</span>
                  <span className="text-text">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between font-sans text-sm">
                  <span className="text-text-muted">Shipping</span>
                  <span className="text-text">
                    {shipping === 0 ? (
                      <span className="text-success">FREE</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                {subtotal < 999 && subtotal > 0 && (
                  <p className="font-sans text-[0.625rem] text-text-muted/70">
                    Add {formatPrice(999 - subtotal)} more for{" "}
                    <strong className="text-success">FREE shipping</strong>
                  </p>
                )}
              </div>

              <hr className="my-4 border-earth-200" />

              <div className="flex items-center justify-between font-sans">
                <span className="font-medium text-text">Total</span>
                <span className="font-serif text-xl font-semibold text-text">
                  {formatPrice(total)}
                </span>
              </div>

              {/* Checkout button */}
              <Link
                href={isAuthenticated ? "/checkout" : "/auth/login?redirect=checkout"}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 font-sans text-[0.8125rem] font-medium uppercase tracking-[0.04em] text-white shadow-sm transition-all duration-200 hover:bg-terra-700 hover:shadow-md"
              >
                Proceed to Checkout
                <ArrowRight size={16} />
              </Link>

              {!isAuthenticated && (
                <p className="mt-3 text-center font-sans text-[0.625rem] text-text-muted/70">
                  You&apos;ll be asked to sign in or create an account to continue.
                </p>
              )}

              {/* Payment info */}
              <div className="mt-6 space-y-2">
                <p className="font-sans text-[0.625rem] text-text-muted/60">
                  <strong>Free Shipping</strong> on orders above ₹999
                </p>
                <p className="font-sans text-[0.625rem] text-text-muted/60">
                  We accept UPI, Bank Transfer, and Razorpay
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
