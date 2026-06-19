// ─── Mitti Art — Shared Type Definitions ───

export type ProductCategory =
  | "Canvas Art"
  | "Mandala Art"
  | "Religious Art"
  | "Floral Art";

export type ProductAvailability =
  | "In Stock"
  | "Made to Order"
  | "Sold Out";

export type OrderStatus =
  | "pending_payment"
  | "payment_submitted"
  | "payment_verified"
  | "in_progress"
  | "packed"
  | "shipped"
  | "delivered";

export type CommissionStatus =
  | "pending"
  | "approved"
  | "quoted"
  | "rejected"
  | "in_progress"
  | "completed";

// ─── Product ───

export interface MittiProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  sale_price?: number;
  category: ProductCategory;
  materials: string;
  dimensions: string;
  weight: string;
  stock: boolean;
  featured: boolean;
  images: string[];
  seo_title?: string;
  seo_description?: string;
  availability: ProductAvailability;
  created: string;
  updated: string;
}

// ─── Cart ───

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

// ─── Customer & Address ───

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address?: Address;
}

// ─── Order ───

export interface Order {
  id: string;
  order_id: string;
  user: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  address: Address;
  payment_method: string;
  payment_screenshot?: string;
  payment_verified: boolean;
  status: OrderStatus;
  notes?: string;
  created: string;
}

// ─── Commission ───

export interface Commission {
  id: string;
  user?: string;
  name: string;
  email: string;
  phone: string;
  artwork_type: string;
  size: string;
  budget: number;
  description: string;
  reference_image?: string;
  status: CommissionStatus;
  admin_notes?: string;
  quoted_price?: number;
  created: string;
}

// ─── Testimonial ───

export interface Testimonial {
  id: string;
  customer_name: string;
  review: string;
  rating: number;
  photo?: string;
  featured: boolean;
}

// ─── User Profile ───

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  address?: Address[];
  wishlist?: string[];
}
