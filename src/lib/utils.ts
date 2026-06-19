// ─── Mitti Art — Utility Functions ───
import { clsx, type ClassValue } from "clsx";
import { v4 as uuidv4 } from "uuid";

const PB_URL =
  process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";

/**
 * Format a number as Indian-rupee price string.
 * @example formatPrice(2499) → "₹2,499"
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Generate a short, human-readable order ID.
 * @example generateOrderId() → "MITTI-3F8K2"
 */
export function generateOrderId(): string {
  const suffix = uuidv4().slice(0, 5).toUpperCase();
  return `MITTI-${suffix}`;
}

/**
 * Convert a human-readable string to a URL-friendly slug.
 * @example slugify("Kamal Vatika") → "kamal-vatika"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Truncate a string to a given length, appending ellipsis if needed.
 * @example truncate("Kamal Vatika Painting", 10) → "Kamal Vati…"
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + "…";
}

/**
 * Resolve a relative PocketBase file path to a full URL.
 * Handles collectionId/fileId filenames or plain paths.
 * @example getImageUrl("abcd1234/sample.jpg") → "http://127.0.0.1:8090/api/files/abcd1234/sample.jpg"
 */
export function getImageUrl(path: string | undefined | null): string {
  if (!path) return "/placeholder.svg";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return path; // local public file
  // PocketBase file reference — assume collectionId/fileId format
  return `${PB_URL}/api/files/${path}`;
}

/**
 * Merge class names using clsx (lightweight Tailwind merge alternative).
 * Drop-in for cn() usage.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
