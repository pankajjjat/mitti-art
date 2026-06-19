"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Palette,
  Loader2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  IndianRupee,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatPrice, cn } from "@/lib/utils";
import { fetchCommissions } from "@/lib/api";
import type { Commission, CommissionStatus } from "@/lib/types";

const statusLabels: Record<CommissionStatus, string> = {
  pending: "Pending Review",
  approved: "Approved",
  quoted: "Quoted",
  rejected: "Rejected",
  in_progress: "In Progress",
  completed: "Completed",
};

const statusStyles: Record<CommissionStatus, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  approved: "bg-blue-100 text-blue-800 border-blue-200",
  quoted: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  in_progress: "bg-purple-100 text-purple-800 border-purple-200",
  completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

export default function CommissionsPage() {
  const router = useRouter();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const token = useAppStore((s) => s.token);

  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // ─── Auth redirect ───
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login?redirect=/account/commissions");
    }
  }, [isAuthenticated, router]);

  // ─── Fetch commissions ───
  useEffect(() => {
    if (!isAuthenticated) return;

    async function load() {
      setIsLoading(true);
      try {
        const res = await fetchCommissions(token || undefined);
        if (res.success && res.data) {
          setCommissions(res.data);
        } else {
          setError(res.error || "Could not load commissions.");
        }
      } catch {
        setError("Failed to load commissions.");
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [isAuthenticated, token]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  if (!isAuthenticated) return null;

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
                Commission Requests
              </h1>
              <p className="mt-1 font-sans text-sm text-text-muted">
                Track your custom art request status
              </p>
            </div>
          </div>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.04em] text-white shadow-sm transition-all duration-200 hover:bg-terra-700 hover:shadow-md"
          >
            <ExternalLink size={14} />
            New Request
          </Link>
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
        ) : commissions.length === 0 ? (
          /* ─── Empty State ─── */
          <div className="flex flex-col items-center py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-earth-100">
              <Palette size={32} className="text-earth-400" />
            </div>
            <h2 className="mt-6 font-serif text-2xl text-text">
              No Commission Requests Yet
            </h2>
            <p className="mt-2 max-w-sm font-sans text-sm text-text-muted">
              Want a custom artwork made just for you? Submit a commission
              request and Samuya will create something unique.
            </p>
            <Link
              href="/#contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-sans text-[0.8125rem] font-medium uppercase tracking-[0.04em] text-white shadow-sm transition-all duration-200 hover:bg-terra-700 hover:shadow-md"
            >
              Submit a Commission
            </Link>
          </div>
        ) : (
          /* ─── Commissions List ─── */
          <div className="space-y-4">
            {commissions.map((comm) => {
              const isExpanded = expandedId === comm.id;

              return (
                <div
                  key={comm.id}
                  className="rounded-xl border border-earth-200 bg-surface shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
                >
                  {/* Header */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(comm.id)}
                    className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-earth-50/50"
                  >
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                      <div>
                        <p className="font-sans text-[0.625rem] font-medium uppercase tracking-[0.08em] text-text-muted">
                          Artwork Type
                        </p>
                        <p className="font-sans text-sm font-medium text-text">
                          {comm.artwork_type}
                        </p>
                      </div>
                      <div>
                        <p className="font-sans text-[0.625rem] font-medium uppercase tracking-[0.08em] text-text-muted">
                          Date
                        </p>
                        <p className="font-sans text-sm text-text">
                          {new Date(comm.created).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="font-sans text-[0.625rem] font-medium uppercase tracking-[0.08em] text-text-muted">
                          Budget
                        </p>
                        <p className="font-sans text-sm font-medium text-text">
                          {formatPrice(comm.budget)}
                        </p>
                      </div>
                      <div>
                        <span
                          className={cn(
                            "inline-block rounded-full border px-3 py-1 font-sans text-[0.625rem] font-medium uppercase tracking-[0.04em]",
                            statusStyles[comm.status] ||
                              "bg-earth-100 text-earth-700 border-earth-200"
                          )}
                        >
                          {statusLabels[comm.status] || comm.status}
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
                      <div className="grid gap-6 md:grid-cols-2">
                        {/* Left column */}
                        <div className="space-y-4">
                          <div>
                            <p className="font-sans text-[0.625rem] font-medium uppercase tracking-[0.08em] text-text-muted">
                              Description
                            </p>
                            <p className="mt-1 font-sans text-sm text-text">
                              {comm.description}
                            </p>
                          </div>

                          <div>
                            <p className="font-sans text-[0.625rem] font-medium uppercase tracking-[0.08em] text-text-muted">
                              Size
                            </p>
                            <p className="mt-1 font-sans text-sm text-text">
                              {comm.size}
                            </p>
                          </div>
                        </div>

                        {/* Right column */}
                        <div className="space-y-4">
                          <div>
                            <p className="font-sans text-[0.625rem] font-medium uppercase tracking-[0.08em] text-text-muted">
                              Contact
                            </p>
                            <p className="mt-1 font-sans text-sm text-text">
                              {comm.name}
                            </p>
                            <p className="font-sans text-sm text-text-muted">
                              {comm.email}
                            </p>
                            {comm.phone && (
                              <p className="font-sans text-sm text-text-muted">
                                {comm.phone}
                              </p>
                            )}
                          </div>

                          {/* Quoted price */}
                          {comm.quoted_price != null && (
                            <div className="rounded-lg border border-green-200 bg-green-50/50 p-3">
                              <p className="font-sans text-[0.625rem] font-medium uppercase tracking-[0.08em] text-green-700">
                                Quoted Price
                              </p>
                              <p className="mt-1 font-serif text-xl font-semibold text-green-800">
                                {formatPrice(comm.quoted_price)}
                              </p>
                            </div>
                          )}

                          {/* Admin notes */}
                          {comm.admin_notes && (
                            <div className="rounded-lg border border-earth-200 bg-page p-3">
                              <p className="font-sans text-[0.625rem] font-medium uppercase tracking-[0.08em] text-text-muted">
                                Notes from Artist
                              </p>
                              <p className="mt-1 font-sans text-sm text-text">
                                {comm.admin_notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Reference image */}
                      {comm.reference_image && (
                        <div className="mt-6">
                          <p className="font-sans text-[0.625rem] font-medium uppercase tracking-[0.08em] text-text-muted">
                            Reference Image
                          </p>
                          <div className="relative mt-2 aspect-video max-w-xs overflow-hidden rounded-lg border border-earth-200 bg-earth-100">
                            <Image
                              src={
                                comm.reference_image.startsWith("http")
                                  ? comm.reference_image
                                  : `/images/${comm.reference_image}`
                              }
                              alt="Commission reference"
                              fill
                              sizes="320px"
                              className="object-cover"
                            />
                          </div>
                        </div>
                      )}
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
