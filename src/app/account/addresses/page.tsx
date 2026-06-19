"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Plus,
  Trash2,
  Star,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Address } from "@/lib/types";

export default function AddressesPage() {
  const router = useRouter();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [defaultIndex, setDefaultIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // ─── Form state ───
  const [formData, setFormData] = useState<Address>({
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });
  const [isDefault, setIsDefault] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof Address, string>>>({});

  // ─── Auth redirect ───
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login?redirect=/account/addresses");
    }
  }, [isAuthenticated, router]);

  // ─── Load addresses from user profile ───
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    setIsLoading(false);
    const saved = user.address || [];
    setAddresses(saved);
    setDefaultIndex(0);
  }, [isAuthenticated, user]);

  if (!isAuthenticated || !user) return null;

  const updateForm = useCallback(
    (field: keyof Address, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (formErrors[field]) {
        setFormErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [formErrors]
  );

  const validateForm = useCallback((): boolean => {
    const errors: Partial<Record<keyof Address, string>> = {};
    if (!formData.line1.trim()) errors.line1 = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.pincode.trim()) errors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(formData.pincode))
      errors.pincode = "Enter a valid 6-digit pincode";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleAdd = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;

      const updatedAddresses = [...addresses, formData];
      setAddresses(updatedAddresses);
      if (isDefault) {
        setDefaultIndex(updatedAddresses.length - 1);
      }

      // Update user in store
      setUser({
        ...user,
        address: updatedAddresses,
      });

      // Reset form
      setFormData({
        line1: "",
        line2: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
      });
      setIsDefault(false);
      setShowForm(false);
    },
    [addresses, formData, isDefault, user, setUser, validateForm]
  );

  const handleDelete = useCallback(
    (index: number) => {
      const updatedAddresses = addresses.filter((_, i) => i !== index);
      setAddresses(updatedAddresses);
      if (defaultIndex === index) {
        setDefaultIndex(0);
      } else if (defaultIndex > index) {
        setDefaultIndex(defaultIndex - 1);
      }

      setUser({
        ...user,
        address: updatedAddresses,
      });
    },
    [addresses, defaultIndex, user, setUser]
  );

  const handleSetDefault = useCallback(
    (index: number) => {
      setDefaultIndex(index);
    },
    []
  );

  return (
    <div className="min-h-screen pt-24 md:pt-28">
      <div className="container-page py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/account"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-earth-300 text-text-muted transition-colors hover:border-accent hover:text-accent"
              aria-label="Back to account"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="font-serif text-3xl tracking-[-0.02em] text-text md:text-4xl">
                Saved Addresses
              </h1>
              <p className="mt-1 font-sans text-sm text-text-muted">
                Manage your shipping addresses
              </p>
            </div>
          </div>
          {!showForm && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.04em] text-white shadow-sm transition-all duration-200 hover:bg-terra-700 hover:shadow-md"
            >
              <Plus size={14} />
              Add New
            </button>
          )}
        </div>

        {/* Add New Address Form */}
        {showForm && (
          <div className="mb-8 rounded-xl border border-earth-200 bg-surface p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-lg text-text">
                Add New Address
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-earth-100 hover:text-text"
                aria-label="Close form"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-5">
              <div>
                <label
                  htmlFor="addr-line1"
                  className="block font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted"
                >
                  Address Line 1
                </label>
                <input
                  id="addr-line1"
                  type="text"
                  value={formData.line1}
                  onChange={(e) => updateForm("line1", e.target.value)}
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

              <div>
                <label
                  htmlFor="addr-line2"
                  className="block font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted"
                >
                  Address Line 2{" "}
                  <span className="text-text-muted/50">(optional)</span>
                </label>
                <input
                  id="addr-line2"
                  type="text"
                  value={formData.line2}
                  onChange={(e) => updateForm("line2", e.target.value)}
                  placeholder="Landmark, Building Name"
                  className="mt-1.5 block h-11 w-full rounded-lg border border-earth-300 bg-page px-4 font-sans text-sm text-text outline-none transition-colors placeholder:text-text-muted/50 focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="addr-city"
                    className="block font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted"
                  >
                    City
                  </label>
                  <input
                    id="addr-city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateForm("city", e.target.value)}
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
                    htmlFor="addr-state"
                    className="block font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted"
                  >
                    State
                  </label>
                  <input
                    id="addr-state"
                    type="text"
                    value={formData.state}
                    onChange={(e) => updateForm("state", e.target.value)}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="addr-pincode"
                    className="block font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted"
                  >
                    Pincode
                  </label>
                  <input
                    id="addr-pincode"
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => updateForm("pincode", e.target.value)}
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
                    htmlFor="addr-country"
                    className="block font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-text-muted"
                  >
                    Country
                  </label>
                  <input
                    id="addr-country"
                    type="text"
                    value={formData.country}
                    onChange={(e) => updateForm("country", e.target.value)}
                    placeholder="India"
                    className="mt-1.5 block h-11 w-full rounded-lg border border-earth-300 bg-page px-4 font-sans text-sm text-text outline-none transition-colors placeholder:text-text-muted/50 focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Mark as default */}
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="h-4 w-4 rounded border-earth-300 accent-accent"
                />
                <span className="font-sans text-sm text-text">
                  Set as default address
                </span>
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent px-6 py-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.04em] text-white shadow-sm transition-all duration-200 hover:bg-terra-700 hover:shadow-md"
                >
                  <Check size={14} />
                  Save Address
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-full border border-earth-300 px-6 py-3 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.04em] text-text transition-colors hover:border-accent hover:text-accent"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Addresses List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-text-muted" />
          </div>
        ) : addresses.length === 0 ? (
          /* ─── Empty State ─── */
          <div className="flex flex-col items-center py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-earth-100">
              <MapPin size={32} className="text-earth-400" />
            </div>
            <h2 className="mt-6 font-serif text-2xl text-text">
              No Addresses Saved
            </h2>
            <p className="mt-2 max-w-sm font-sans text-sm text-text-muted">
              Add a shipping address to make checkout faster and easier.
            </p>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-sans text-[0.8125rem] font-medium uppercase tracking-[0.04em] text-white shadow-sm transition-all duration-200 hover:bg-terra-700 hover:shadow-md"
            >
              <Plus size={16} />
              Add Address
            </button>
          </div>
        ) : (
          /* ─── Address Cards ─── */
          <div className="grid gap-4 md:grid-cols-2">
            {addresses.map((addr, index) => (
              <div
                key={index}
                className={cn(
                  "relative rounded-xl border bg-surface p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all",
                  defaultIndex === index
                    ? "border-accent"
                    : "border-earth-200"
                )}
              >
                {/* Default badge */}
                {defaultIndex === index && (
                  <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 font-sans text-[0.5rem] font-medium uppercase tracking-[0.08em] text-accent">
                    <Star size={10} />
                    Default
                  </span>
                )}

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
                    <MapPin size={18} className="text-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-sm font-medium text-text">
                      {addr.line1}
                    </p>
                    {addr.line2 && (
                      <p className="font-sans text-sm text-text-muted">
                        {addr.line2}
                      </p>
                    )}
                    <p className="font-sans text-sm text-text-muted">
                      {addr.city}, {addr.state} — {addr.pincode}
                    </p>
                    <p className="font-sans text-sm text-text-muted">
                      {addr.country}
                    </p>

                    {/* Actions */}
                    <div className="mt-3 flex items-center gap-3">
                      {defaultIndex !== index && (
                        <button
                          type="button"
                          onClick={() => handleSetDefault(index)}
                          className="flex items-center gap-1 font-sans text-xs text-accent underline underline-offset-4 transition-colors hover:text-terra-700"
                        >
                          <Star size={12} />
                          Set as default
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(index)}
                        className="flex items-center gap-1 font-sans text-xs text-error underline underline-offset-4 transition-colors hover:text-error/80"
                      >
                        <Trash2 size={12} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
