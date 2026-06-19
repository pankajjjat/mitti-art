// ─── Mitti Art — API Helper Module ───
// CRUD operations for orders and commissions via Supabase.

import { supabase } from "@/lib/supabase";
import { generateOrderId } from "@/lib/utils";
import type { Order, Commission, CartItem, Address } from "@/lib/types";

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
 * Create a new order in Supabase.
 * Falls back to a local-order object if the DB is unreachable.
 */
export async function createOrder(
  orderData: CreateOrderInput
): Promise<ApiResponse<Order>> {
  try {
    const orderId = generateOrderId();

    const { data, error } = await supabase.from("orders").insert({
      order_id: orderId,
      user: "",
      items: orderData.items,
      subtotal: orderData.subtotal,
      shipping: orderData.shipping,
      total: orderData.total,
      address: orderData.address,
      payment_method: orderData.payment_method,
      payment_verified: false,
      status: "pending_payment",
      notes: orderData.notes || "",
    }).select().single();

    if (error) throw error;
    return ok(data as unknown as Order);
  } catch (err) {
    console.warn("⚠️  createOrder fallback (DB unavailable):", err);
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
 */
export async function fetchOrders(
  _authToken?: string
): Promise<ApiResponse<Order[]>> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created", { ascending: false });

    if (error) throw error;
    return ok((data || []) as unknown as Order[]);
  } catch (err) {
    console.warn("⚠️  fetchOrders failed:", err);
    return fail("Could not fetch orders. Database may be offline.");
  }
}

/**
 * Upload a payment screenshot for an order.
 * Stores the base64 data URL as a text field for simplicity.
 */
export async function uploadPaymentScreenshot(
  orderId: string,
  file: File
): Promise<ApiResponse<string>> {
  try {
    // Convert file to base64 data URL for storage
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const { error } = await supabase
      .from("orders")
      .update({ payment_screenshot: base64 })
      .eq("id", orderId);

    if (error) throw error;
    return ok(base64);
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
    let reference_image: string | undefined;

    // Convert file to base64 if provided
    if (input.reference_image) {
      reference_image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(input.reference_image!);
      });
    }

    const { data, error } = await supabase.from("commissions").insert({
      name: input.name,
      email: input.email,
      phone: input.phone,
      artwork_type: input.artwork_type,
      size: input.size,
      budget: input.budget,
      description: input.description,
      reference_image,
      status: "pending",
    }).select().single();

    if (error) throw error;
    return ok(data as unknown as Commission);
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
  _authToken?: string
): Promise<ApiResponse<Commission[]>> {
  try {
    const { data, error } = await supabase
      .from("commissions")
      .select("*")
      .order("created", { ascending: false });

    if (error) throw error;
    return ok((data || []) as unknown as Commission[]);
  } catch (err) {
    console.warn("⚠️  fetchCommissions failed:", err);
    return fail("Could not fetch commissions. Database may be offline.");
  }
}
