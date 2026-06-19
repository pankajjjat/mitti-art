"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  CreditCard,
  FileImage,
  Info,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatPrice, cn } from "@/lib/utils";
import { createOrder, uploadPaymentScreenshot } from "@/lib/api";
import type { Address } from "@/lib/types";

const UPI_ID = "saumya.chaurasia04@upi";
const PAYEE_NAME = "Saumya Chaurasia";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useAppStore((s) => s.items);
  const clearCart = useAppStore((s) => s.clearCart);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const user = useAppStore((s) => s.user);
  const token = useAppStore((s) => s.token);

  // ─── Computed ───
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  // ─── Auth redirect ───
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login?redirect=/checkout");
    }
  }, [isAuthenticated, router]);

  // ─── Form state ───
  const [address, setAddress] = useState<Address>({
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const [step, setStep] = useState<"address" | "payment" | "confirm">("address");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<{
    orderId: string;
    message: string;
  } | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof Address, string>>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Redirect if cart empty ───
  useEffect(() => {
    if (isAuthenticated && items.length === 0 && !orderResult) {
      router.replace("/cart");
    }
  }, [isAuthenticated, items, orderResult, router]);

  if (!isAuthenticated) return null;
  if (items.length === 0 && !orderResult) return null;

  // ─── Handlers ───

  const updateAddress = useCallback(
    (field: keyof Address, value: string) => {
      setAddress((prev) => ({ ...prev, [field]: value }));
      if (formErrors[field]) {
        setFormErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [formErrors]
  );

  const validateAddress = useCallback((): boolean => {
    const errors: Partial<Record<keyof Address, string>> = {};
    if (!address.line1.trim()) errors.line1 = "Address line 1 is required";
    if (!address.city.trim()) errors.city = "City is required";
    if (!address.state.trim()) errors.state = "State is required";
    if (!address.pincode.trim()) errors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(address.pincode))
      errors.pincode = "Enter a valid 6-digit pincode";
    if (!address.country.trim()) errors.country = "Country is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [address]);

  const handleAddressSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (validateAddress()) {
        setStep("payment");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [validateAddress]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setScreenshotFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const clearScreenshot = useCallback(() => {
    setScreenshotFile(null);
    setScreenshotPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleSubmitPayment = useCallback(async () => {
    if (!screenshotFile) {
      alert("Please upload a payment screenshot before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderRes = await createOrder({
        items,
        subtotal,
        shipping,
        total,
        address,
        payment_method: paymentMethod,
        notes,
      });

      if (!orderRes.success || !orderRes.data) {
        throw new Error(orderRes.error || "Failed to create order");
      }

      const orderId = orderRes.data.id;

      // Upload screenshot
      const uploadRes = await uploadPaymentScreenshot(orderId, screenshotFile);
      if (!uploadRes.success) {
        console.warn("Screenshot upload had an issue:", uploadRes.error);
      }

      setOrderResult({
        orderId: orderRes.data.order_id,
        message: `Your order ${orderRes.data.order_id} has been placed successfully! We will notify you once the payment is verified.`,
      });

      clearCart();
      setStep("confirm");
    } catch (err) {
      console.error("Checkout error:", err);
      alert(
        "There was a problem processing your order. Please try again or contact us at hello@mittiart.com"
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    screenshotFile,
    items,
    subtotal,
    shipping,
    total,
    address,
    paymentMethod,
    notes,
    clearCart,
  ]);

  // ─── Confirmation View ───
  if (orderResult) {
    return (
      <div className="min-h-screen pt-24 md:pt-28">
        <div className="container-page py-16">
          <div className="mx-auto max-w-lg text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
              <CheckCircle size={40} className="text-success" />
            </div>
            <h1 className="mt-6 font-serif text-3xl text-text md:text-4xl">
              Order Confirmed!
            </h1>
            <p className="mt-2 font-sans text-sm text-text-muted">
              {orderResult.message}
            </p>

            <div className="mt-8 rounded-xl border border-earth-200 bg-surface p-6 shadow-sm">
              <p className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted">
                Order ID
              </p>
              <p className="mt-1 font-mono text-lg font-semibold text-text">
                {orderResult.orderId}
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <Link
                href="/account/orders"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 font-sans text-[0.8125rem] font-medium uppercase tracking-[0.04em] text-white shadow-sm transition-all duration-200 hover:bg-terra-700 hover:shadow-md"
              >
                View My Orders
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/shop"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-earth-300 px-7 py-3.5 font-sans text-[0.8125rem] font-medium uppercase tracking-[0.04em] text-text transition-all duration-200 hover:border-accent hover:text-accent"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Address Form ───
  if (step === "address") {
    return (
      <div className="min-h-screen pt-24 md:pt-28">
        <div className="container-page py-8 md:py-12">
          <div className="mx-auto max-w-3xl">
            {/* Header */}
            <div className="mb-8 flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-earth-300 text-text-muted transition-colors hover:border-accent hover:text-accent"
                aria-label="Go back"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h1 className="font-serif text-3xl tracking-[-0.02em] text-text md:text-4xl">
                  Checkout
                </h1>
                <p className="mt-1 font-sans text-sm text-text-muted">
                  Step 1 of 2 — Shipping Address
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-8 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent font-mono text-xs text-white">
                1
              </div>
              <div className="h-px flex-1 bg-earth-300" />
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-earth-300 font-mono text-xs text-text-muted">
                2
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-5">
              {/* Form */}
              <form
                onSubmit={handleAddressSubmit}
                className="lg:col-span-3"
              >
                <div className="rounded-xl border border-earth-200 bg-surface p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] md:p-8">
                  <h2 className="font-serif text-lg text-text">
                    Shipping Address
                  </h2>

                  <div className="mt-6 space-y-5">
                    {/* Line 1 */}
                    <div>
                      <label
                        htmlFor="line1"
                        className="block font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted"
                      >
                        Address Line 1
                      </label>
                      <input
                        id="line1"
                        type="text"
                        value={address.line1}
                        onChange={(e) => updateAddress("line1", e.target.value)}
                        placeholder="House/Flat No., Street, Area"
                        className={cn(
                          "mt-1.5 block h-11 w-full rounded-lg border bg-page px-4 font-sans text-sm text-text outline-none transition-colors placeholder:text-text-muted/50 focus:ring-1",
                          formErrors.line1
                            ? "border-error focus:border-error focus:ring-error"
                            : "border-earth-300 focus:border-accent focus:ring-accent"
                        )}
                      />
                      {formErrors.line1 && (
                        <p className="mt-1 font-sans text-xs text-error">
                          {formErrors.line1}
                        </p>
                      )}
                    </div>

                    {/* Line 2 */}
                    <div>
                      <label
                        htmlFor="line2"
                        className="block font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted"
                      >
                        Address Line 2{" "}
                        <span className="text-text-muted/50">(optional)</span>
                      </label>
                      <input
                        id="line2"
                        type="text"
                        value={address.line2}
                        onChange={(e) => updateAddress("line2", e.target.value)}
                        placeholder="Landmark, Building Name"
                        className="mt-1.5 block h-11 w-full rounded-lg border border-earth-300 bg-page px-4 font-sans text-sm text-text outline-none transition-colors placeholder:text-text-muted/50 focus:border-accent focus:ring-1 focus:ring-accent"
                      />
                    </div>

                    {/* City + State */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="city"
                          className="block font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted"
                        >
                          City
                        </label>
                        <input
                          id="city"
                          type="text"
                          value={address.city}
                          onChange={(e) => updateAddress("city", e.target.value)}
                          placeholder="Mumbai"
                          className={cn(
                            "mt-1.5 block h-11 w-full rounded-lg border bg-page px-4 font-sans text-sm text-text outline-none transition-colors placeholder:text-text-muted/50 focus:ring-1",
                            formErrors.city
                              ? "border-error focus:border-error focus:ring-error"
                              : "border-earth-300 focus:border-accent focus:ring-accent"
                          )}
                        />
                        {formErrors.city && (
                          <p className="mt-1 font-sans text-xs text-error">
                            {formErrors.city}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="state"
                          className="block font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted"
                        >
                          State
                        </label>
                        <input
                          id="state"
                          type="text"
                          value={address.state}
                          onChange={(e) =>
                            updateAddress("state", e.target.value)
                          }
                          placeholder="Maharashtra"
                          className={cn(
                            "mt-1.5 block h-11 w-full rounded-lg border bg-page px-4 font-sans text-sm text-text outline-none transition-colors placeholder:text-text-muted/50 focus:ring-1",
                            formErrors.state
                              ? "border-error focus:border-error focus:ring-error"
                              : "border-earth-300 focus:border-accent focus:ring-accent"
                          )}
                        />
                        {formErrors.state && (
                          <p className="mt-1 font-sans text-xs text-error">
                            {formErrors.state}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Pincode + Country */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="pincode"
                          className="block font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted"
                        >
                          Pincode
                        </label>
                        <input
                          id="pincode"
                          type="text"
                          value={address.pincode}
                          onChange={(e) =>
                            updateAddress("pincode", e.target.value)
                          }
                          placeholder="400001"
                          maxLength={6}
                          className={cn(
                            "mt-1.5 block h-11 w-full rounded-lg border bg-page px-4 font-sans text-sm text-text outline-none transition-colors placeholder:text-text-muted/50 focus:ring-1",
                            formErrors.pincode
                              ? "border-error focus:border-error focus:ring-error"
                              : "border-earth-300 focus:border-accent focus:ring-accent"
                          )}
                        />
                        {formErrors.pincode && (
                          <p className="mt-1 font-sans text-xs text-error">
                            {formErrors.pincode}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="country"
                          className="block font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted"
                        >
                          Country
                        </label>
                        <input
                          id="country"
                          type="text"
                          value={address.country}
                          onChange={(e) =>
                            updateAddress("country", e.target.value)
                          }
                          placeholder="India"
                          className={cn(
                            "mt-1.5 block h-11 w-full rounded-lg border bg-page px-4 font-sans text-sm text-text outline-none transition-colors placeholder:text-text-muted/50 focus:ring-1",
                            formErrors.country
                              ? "border-error focus:border-error focus:ring-error"
                              : "border-earth-300 focus:border-accent focus:ring-accent"
                          )}
                        />
                        {formErrors.country && (
                          <p className="mt-1 font-sans text-xs text-error">
                            {formErrors.country}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label
                        htmlFor="notes"
                        className="block font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted"
                      >
                        Order Notes{" "}
                        <span className="text-text-muted/50">(optional)</span>
                      </label>
                      <textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        placeholder="Any special instructions or preferences..."
                        className="mt-1.5 block w-full rounded-lg border border-earth-300 bg-page px-4 py-3 font-sans text-sm text-text outline-none transition-colors placeholder:text-text-muted/50 focus:border-accent focus:ring-1 focus:ring-accent"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <Link
                      href="/cart"
                      className="font-sans text-sm text-accent underline underline-offset-4 transition-colors hover:text-terra-700"
                    >
                      Back to Cart
                    </Link>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-sans text-[0.8125rem] font-medium uppercase tracking-[0.04em] text-white shadow-sm transition-all duration-200 hover:bg-terra-700 hover:shadow-md"
                    >
                      Continue to Payment
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </form>

              {/* Order Summary Sidebar */}
              <aside className="lg:col-span-2">
                <div className="sticky top-28 rounded-xl border border-earth-200 bg-surface p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                  <h3 className="font-serif text-lg text-text">
                    Order Summary
                  </h3>

                  <div className="mt-5 space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3"
                      >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-earth-100">
                          <Image
                            src={
                              item.image.startsWith("http")
                                ? item.image
                                : `/images/${item.image}`
                            }
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
                            Qty: {item.quantity}
                          </p>
                          <p className="font-sans text-xs font-semibold text-text">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <hr className="my-4 border-earth-200" />

                  <div className="space-y-2 font-sans text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-text-muted">Subtotal</span>
                      <span className="text-text">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-muted">Shipping</span>
                      <span className="text-text">
                        {shipping === 0 ? (
                          <span className="text-success">FREE</span>
                        ) : (
                          formatPrice(shipping)
                        )}
                      </span>
                    </div>
                  </div>

                  <hr className="my-4 border-earth-200" />

                  <div className="flex items-center justify-between">
                    <span className="font-sans font-medium text-text">
                      Total
                    </span>
                    <span className="font-serif text-xl font-semibold text-text">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Payment Step ───
  return (
    <div className="min-h-screen pt-24 md:pt-28">
      <div className="container-page py-8 md:py-12">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep("address")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-earth-300 text-text-muted transition-colors hover:border-accent hover:text-accent"
                aria-label="Back to address"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h1 className="font-serif text-3xl tracking-[-0.02em] text-text md:text-4xl">
                  Payment
                </h1>
                <p className="mt-1 font-sans text-sm text-text-muted">
                  Step 2 of 2 — Complete your payment
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent font-mono text-xs text-white">
                ✓
              </div>
              <div className="h-px flex-1 bg-accent/50" />
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent font-mono text-xs text-white">
                2
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-5">
            {/* Payment Section */}
            <div className="space-y-6 lg:col-span-3">
              {/* Payment Instructions */}
              <div className="rounded-xl border border-earth-200 bg-surface p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] md:p-8">
                <h2 className="font-serif text-lg text-text">
                  Payment Instructions
                </h2>

                <div className="mt-4 rounded-lg bg-terra-50/50 p-4">
                  <div className="flex items-start gap-3">
                    <Info
                      size={18}
                      className="mt-0.5 shrink-0 text-accent"
                    />
                    <div className="space-y-2 font-sans text-sm text-text/80">
                      <p>
                        Please pay the exact amount of{" "}
                        <strong className="text-text">
                          {formatPrice(total)}
                        </strong>{" "}
                        to the UPI ID below or scan the QR code.
                      </p>
                      <p>
                        After payment, upload the screenshot or transaction
                        reference below and click &ldquo;Submit&rdquo;.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-3 font-sans text-sm">
                  <div className="flex items-center justify-between rounded-lg border border-earth-200 bg-page px-4 py-3">
                    <span className="text-text-muted">UPI ID</span>
                    <span className="font-mono font-medium text-text">
                      {UPI_ID}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-earth-200 bg-page px-4 py-3">
                    <span className="text-text-muted">Payee Name</span>
                    <span className="font-medium text-text">{PAYEE_NAME}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-earth-200 bg-page px-4 py-3">
                    <span className="text-text-muted">Amount</span>
                    <span className="font-serif text-lg font-semibold text-text">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="rounded-xl border border-earth-200 bg-surface p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] md:p-8">
                <h3 className="font-serif text-base text-text">
                  Scan to Pay (UPI)
                </h3>
                <div className="mt-4 flex justify-center">
                  <div className="relative h-56 w-56 overflow-hidden rounded-xl border border-earth-200 bg-page p-4">
                    {/* Placeholder QR SVG */}
                    <svg
                      viewBox="0 0 200 200"
                      className="h-full w-full"
                      aria-label="UPI QR Code"
                    >
                      <rect width="200" height="200" fill="#f5f0eb" rx="12" />
                      {/* Decorative QR pattern */}
                      <rect x="20" y="20" width="40" height="40" fill="#2c1810" rx="4" />
                      <rect x="140" y="20" width="40" height="40" fill="#2c1810" rx="4" />
                      <rect x="80" y="80" width="40" height="40" fill="#2c1810" rx="4" />
                      <rect x="20" y="140" width="40" height="40" fill="#2c1810" rx="4" />
                      <rect x="140" y="140" width="40" height="40" fill="#2c1810" rx="4" />
                      <rect x="50" y="50" width="20" height="20" fill="#c75b39" rx="2" />
                      <rect x="110" y="50" width="20" height="20" fill="#c75b39" rx="2" />
                      <rect x="50" y="110" width="20" height="20" fill="#c75b39" rx="2" />
                      <rect x="110" y="110" width="20" height="20" fill="#c75b39" rx="2" />
                      <rect x="80" y="140" width="20" height="20" fill="#c75b39" rx="2" />
                      <rect x="20" y="80" width="20" height="20" fill="#c75b39" rx="2" />
                      <rect x="140" y="80" width="20" height="20" fill="#c75b39" rx="2" />
                      {/* Center logo area */}
                      <rect x="80" y="55" width="40" height="10" fill="#f5f0eb" rx="2" />
                      <text
                        x="100"
                        y="148"
                        textAnchor="middle"
                        fontFamily="Inter, sans-serif"
                        fontSize="8"
                        fill="#9c8f83"
                      >
                        MITTI ART
                      </text>
                    </svg>
                  </div>
                </div>
                <p className="mt-3 text-center font-sans text-[0.625rem] text-text-muted/60">
                  Scan with any UPI app (GPay, PhonePe, Paytm)
                </p>
              </div>

              {/* Upload Screenshot */}
              <div className="rounded-xl border border-earth-200 bg-surface p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] md:p-8">
                <h3 className="font-serif text-base text-text">
                  Upload Payment Screenshot
                </h3>

                <div className="mt-4">
                  {screenshotPreview ? (
                    <div className="relative">
                      <div className="relative mx-auto aspect-[3/4] max-w-xs overflow-hidden rounded-lg border border-earth-200 bg-page">
                        <Image
                          src={screenshotPreview}
                          alt="Payment screenshot preview"
                          fill
                          sizes="(max-width: 480px) 100vw, 320px"
                          className="object-contain"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={clearScreenshot}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
                        aria-label="Remove screenshot"
                      >
                        <X size={14} />
                      </button>
                      <p className="mt-2 text-center font-sans text-xs text-text-muted">
                        {screenshotFile?.name}
                      </p>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          fileInputRef.current?.click();
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-earth-300 bg-page px-6 py-10 transition-colors hover:border-accent hover:bg-terra-50/30"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-earth-100">
                        <Upload
                          size={20}
                          className="text-text-muted"
                        />
                      </div>
                      <p className="mt-3 font-sans text-sm font-medium text-text">
                        Click to upload payment screenshot
                      </p>
                      <p className="mt-1 font-sans text-xs text-text-muted">
                        PNG, JPG or WEBP (max 5MB)
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                    aria-label="Upload payment screenshot"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="button"
                onClick={handleSubmitPayment}
                disabled={isSubmitting || !screenshotFile}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-4 font-sans text-[0.875rem] font-medium uppercase tracking-[0.04em] text-white shadow-sm transition-all duration-200 hover:bg-terra-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing Order…
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Submit Payment & Place Order
                  </>
                )}
              </button>
            </div>

            {/* Order Summary Sidebar */}
            <aside className="lg:col-span-2">
              <div className="sticky top-28 rounded-xl border border-earth-200 bg-surface p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                <h3 className="font-serif text-lg text-text">
                  Order Summary
                </h3>

                <div className="mt-5 space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3"
                    >
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-earth-100">
                        <Image
                          src={
                            item.image.startsWith("http")
                              ? item.image
                              : `/images/${item.image}`
                          }
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
                          Qty: {item.quantity}
                        </p>
                        <p className="font-sans text-xs font-semibold text-text">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <hr className="my-4 border-earth-200" />

                {/* Shipping address summary */}
                <div className="mb-4">
                  <p className="font-sans text-[0.625rem] font-medium uppercase tracking-[0.08em] text-text-muted">
                    Shipping To
                  </p>
                  <p className="mt-1 font-sans text-sm text-text">
                    {address.line1}
                    {address.line2 && `, ${address.line2}`}
                  </p>
                  <p className="font-sans text-sm text-text-muted">
                    {address.city}, {address.state} — {address.pincode}
                  </p>
                </div>

                <hr className="mb-4 border-earth-200" />

                <div className="space-y-2 font-sans text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Subtotal</span>
                    <span className="text-text">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Shipping</span>
                    <span className="text-text">
                      {shipping === 0 ? (
                        <span className="text-success">FREE</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>
                </div>

                <hr className="my-4 border-earth-200" />

                <div className="flex items-center justify-between">
                  <span className="font-sans font-medium text-text">
                    Total
                  </span>
                  <span className="font-serif text-xl font-semibold text-text">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
