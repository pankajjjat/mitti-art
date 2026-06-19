"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import clsx from "clsx";
import { useAppStore } from "@/lib/store";

function formatPrice(price: number): string {
  return `₹${price.toLocaleString("en-IN")}`;
}

export default function CartDrawer() {
  const items = useAppStore((s) => s.items);
  const isOpen = useAppStore((s) => s.cartOpen);
  const closeCart = useAppStore((s) => s.closeCart);
  const removeItem = useAppStore((s) => s.removeFromCart);
  const updateQuantity = useAppStore((s) => s.updateQuantity);
  const totalPrice = useAppStore((s) => s.total);
  const totalItems = useAppStore((s) => s.totalItems);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        closeCart();
      }
    },
    [closeCart]
  );

  const handleCheckout = () => {
    const subject = encodeURIComponent("Order Inquiry — Mitti Art");
    const itemLines = items
      .map(
        (item) =>
          `${item.title} × ${item.quantity} = ${formatPrice(item.price * item.quantity)}`
      )
      .join("\n");
    const total = formatPrice(totalPrice());
    const body = encodeURIComponent(
      `Hi Mitti Art team,\n\nI'd like to place an order for the following items:\n\n${itemLines}\n\nTotal: ${total}\n\nPlease let me know the next steps for payment and shipping.\n\nThank you!`
    );
    window.open(`mailto:hello@mittiart.com?subject=${subject}&body=${body}`);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={clsx(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-surface shadow-2xl",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4 md:px-6">
          <h2 className="font-serif text-xl text-text">Your Cart</h2>
          <button
            type="button"
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-earth-100 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items or Empty State */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-earth-100">
              <ShoppingBag
                size={28}
                className="text-earth-400"
                aria-hidden="true"
              />
            </div>
            <div>
              <p className="font-serif text-lg text-text">Your cart is empty</p>
              <p className="mt-1 font-sans text-sm text-text-muted">
                Looks like you haven&rsquo;t added anything yet.
              </p>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-accent transition-colors hover:text-terra-700"
            >
              Continue Browsing
              <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="flex-1 overflow-y-auto px-5 py-5 md:px-6">
              <ul className="space-y-5">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-4 rounded-lg border border-border bg-page p-3"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-earth-100">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <h3 className="truncate font-serif text-sm font-semibold text-text">
                          {item.title}
                        </h3>
                        <p className="truncate font-sans text-xs text-text-muted">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      {/* Quantity controls */}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity - 1
                              )
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:border-accent hover:text-accent"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="flex h-7 min-w-[2rem] items-center justify-center font-mono text-xs text-text">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity + 1
                              )
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:border-accent hover:text-accent"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-error/10 hover:text-error"
                          aria-label={`Remove ${item.title}`}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer — Total + Checkout */}
            <div className="border-t border-border px-5 py-5 md:px-6">
              <div className="flex items-center justify-between">
                <span className="font-sans text-sm text-text-muted">
                  {totalItems()} item{totalItems() !== 1 ? "s" : ""}
                </span>
                <span className="font-serif text-xl font-semibold text-text">
                  {formatPrice(totalPrice())}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 font-sans text-[0.8125rem] font-medium uppercase tracking-[0.04em] text-white shadow-sm transition-all duration-200 hover:bg-terra-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                Checkout
                <ArrowRight size={16} />
              </button>

              <p className="mt-3 text-center font-sans text-[0.625rem] leading-relaxed text-text-muted/70">
                We&rsquo;ll send you an invoice with shipping options via email.
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
