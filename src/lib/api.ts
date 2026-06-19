// ─── Mitti Art — API Helper Module ───
// Handles all PocketBase CRUD operations with fallback modes.
// Works in both PB-connected and offline/fallback states.

import { createPocketBaseClient } from "@/lib/pocketbase";
import { generateOrderId } from "@/lib/utils";
import type {
  Order,
  Commission,
  CartItem,
  Address,
} from "@/lib/types";

// ─── Response wrapper ───

interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error?: string;
}

function ok<T>(data: T): ApiResponse<T> {
  return { success: true, data };
}

function fail<T>(error: string): ApiResponse<T> {
  return { success: false, data: null, error };
}

// ─── Orders ───

export interface CreateOrderInput {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  address: Address;
  payment_method: string;
  notes?: string;
}

/**
 * Create a new order in PocketBase.
 * Falls back to a local-order object if PB is unreachable.
 */
export async function createOrder(
  orderData: CreateOrderInput
): Promise<ApiResponse<Order>> {
  try {
    const pb = createPocketBaseClient();
    const orderId = generateOrderId();

    const record = await pb.collection("orders").create({
      order_id: orderId,
      user: "", // anonymous until auth is wired
      items: orderData.items,
      subtotal: orderData.subtotal,
      shipping: orderData.shipping,
      total: orderData.total,
      address: orderData.address,
      payment_method: orderData.payment_method,
      payment_verified: false,
      status: "pending_payment",
      notes: orderData.notes || "",
    });

    return ok(record as unknown as Order);
  } catch (err) {
    console.warn("⚠️  createOrder fallback (PB unavailable):", err);
    // Return a local order object so the UI doesn't break
    const fallback: Order = {
      id: `local_${Date.now()}`,
      order_id: generateOrderId(),
      user: "",
      items: orderData.items,
      subtotal: orderData.subtotal,
      shipping: orderData.shipping,
      total: orderData.total,
      address: orderData.address,
      payment_method: orderData.payment_method,
      payment_verified: false,
      status: "pending_payment",
      notes: orderData.notes,
      created: new Date().toISOString(),
    };
    return ok(fallback);
  }
}

/**
 * Fetch all orders for the authenticated user.
 * Returns empty array on failure.
 */
export async function fetchOrders(
  authToken?: string
): Promise<ApiResponse<Order[]>> {
  try {
    const pb = createPocketBaseClient();
    if (authToken) pb.authStore.save(authToken, null);

    const records = await pb.collection("orders").getFullList({
      sort: "-created",
    });

    return ok(records as unknown as Order[]);
  } catch (err) {
    console.warn("⚠️  fetchOrders failed:", err);
    return fail("Could not fetch orders. PocketBase may be offline.");
  }
}

/**
 * Upload a payment screenshot for an order.
 */
export async function uploadPaymentScreenshot(
  orderId: string,
  file: File
): Promise<ApiResponse<string>> {
  try {
    const pb = createPocketBaseClient();
    const formData = new FormData();
    formData.append("payment_screenshot", file);

    const record = await pb.collection("orders").update(orderId, formData);

    const url = pb.files.getUrl(record, record.payment_screenshot);
    return ok(url);
  } catch (err) {
    console.warn("⚠️  uploadPaymentScreenshot failed:", err);
    return fail("Failed to upload payment screenshot.");
  }
}

// ─── Commission Requests ───

export interface SubmitCommissionInput {
  name: string;
  email: string;
  phone: string;
  artwork_type: string;
  size: string;
  budget: number;
  description: string;
  reference_image?: File | null;
}

/**
 * Submit a commission request.
 */
export async function submitCommission(
  input: SubmitCommissionInput
): Promise<ApiResponse<Commission>> {
  try {
    const pb = createPocketBaseClient();

    const payload: Record<string, unknown> = {
      name: input.name,
      email: input.email,
      phone: input.phone,
      artwork_type: input.artwork_type,
      size: input.size,
      budget: input.budget,
      description: input.description,
      status: "pending",
    };

    // If a reference image was provided, append it as a file
    if (input.reference_image) {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, val]) => {
        formData.append(key, String(val));
      });
      formData.append("reference_image", input.reference_image);

      const record = await pb.collection("commissions").create(formData);
      return ok(record as unknown as Commission);
    }

    const record = await pb.collection("commissions").create(payload);
    return ok(record as unknown as Commission);
  } catch (err) {
    console.warn("⚠️  submitCommission fallback:", err);
    const fallback: Commission = {
      id: `local_${Date.now()}`,
      name: input.name,
      email: input.email,
      phone: input.phone,
      artwork_type: input.artwork_type,
      size: input.size,
      budget: input.budget,
      description: input.description,
      status: "pending",
      created: new Date().toISOString(),
    };
    return ok(fallback);
  }
}

/**
 * Fetch all commission requests for the current user.
 */
export async function fetchCommissions(
  authToken?: string
): Promise<ApiResponse<Commission[]>> {
  try {
    const pb = createPocketBaseClient();
    if (authToken) pb.authStore.save(authToken, null);

    const records = await pb.collection("commissions").getFullList({
      sort: "-created",
    });

    return ok(records as unknown as Commission[]);
  } catch (err) {
    console.warn("⚠️  fetchCommissions failed:", err);
    return fail("Could not fetch commissions. PocketBase may be offline.");
  }
}
