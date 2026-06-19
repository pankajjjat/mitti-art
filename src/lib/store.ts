"use client";

// ─── Mitti Art — Enhanced Zustand Store ───
// Cart, Wishlist, Auth, and UI state, all persisted to localStorage.

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";
import type { UserProfile, Address, CartItem } from "@/lib/types";

// ─── Cart ───

interface CartState {
  items: CartItem[];
  cartOpen: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
  shipping: () => number;
  total: () => number;
}

// ─── Wishlist ───

interface WishlistState {
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

// ─── Auth ───

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    name: string,
    email: string,
    password: string,
    passwordConfirm: string
  ) => Promise<boolean>;
  logout: () => void;
  setUser: (user: UserProfile | null) => void;
}

// ─── UI ───

interface UIState {
  wishlistOpen: boolean;
  mobileMenuOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleWishlistPanel: () => void;
  setMobileMenuOpen: (open: boolean) => void;
}

// ─── Combined Store ───

export type AppStore = CartState & WishlistState & AuthState & UIState;

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // ─────────── Cart ───────────

      items: [],
      cartOpen: false,

      addToCart: (item: CartItem) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        });
      },

      removeFromCart: (productId: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ cartOpen: true }),
      closeCart: () => set({ cartOpen: false }),
      toggleCart: () => set((s) => ({ cartOpen: !s.cartOpen })),

      totalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      shipping: () => {
        const sub = get().subtotal();
        // Free shipping above ₹999, otherwise ₹99
        return sub >= 999 ? 0 : 99;
      },

      total: () => {
        const sub = get().subtotal();
        const ship = get().shipping();
        return sub + ship;
      },

      // ─────────── Wishlist ───────────

      wishlist: [],

      toggleWishlist: (productId: string) => {
        set((state) => {
          const exists = state.wishlist.includes(productId);
          return {
            wishlist: exists
              ? state.wishlist.filter((id) => id !== productId)
              : [...state.wishlist, productId],
          };
        });
      },

      isInWishlist: (productId: string) =>
        get().wishlist.includes(productId),

      clearWishlist: () => set({ wishlist: [] }),

      // ─────────── Auth ───────────

      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;

          const profile: UserProfile = {
            id: data.user.id,
            name: data.user.user_metadata?.name || email,
            email: data.user.email || email,
            phone: data.user.phone || undefined,
            avatar: data.user.user_metadata?.avatar_url || undefined,
            address: [],
            wishlist: [],
          };

          set({
            user: profile,
            token: data.session?.access_token || null,
            isAuthenticated: true,
          });

          return true;
        } catch (err) {
          console.warn("⚠️  Login failed:", err);
          return false;
        }
      },

      signup: async (
        name: string,
        email: string,
        password: string,
        passwordConfirm: string
      ) => {
        try {
          if (password !== passwordConfirm) {
            throw new Error("Passwords do not match");
          }

          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { name },
            },
          });
          if (error) throw error;

          // Auto-login after signup
          return await get().login(email, password);
        } catch (err) {
          console.warn("⚠️  Signup failed:", err);
          return false;
        }
      },

      logout: () => {
        supabase.auth.signOut();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          wishlist: [],
        });
      },

      setUser: (user: UserProfile | null) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      // ─────────── UI ───────────

      wishlistOpen: false,
      mobileMenuOpen: false,

      openWishlist: () => set({ wishlistOpen: true }),
      closeWishlist: () => set({ wishlistOpen: false }),
      toggleWishlistPanel: () =>
        set((s) => ({ wishlistOpen: !s.wishlistOpen })),

      setMobileMenuOpen: (open: boolean) =>
        set({ mobileMenuOpen: open }),
    }),
    {
      name: "mitti-art-store",
      // Only persist cart, wishlist, and auth token — not UI transient state
      partialize: (state) => ({
        items: state.items,
        wishlist: state.wishlist,
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      // Merge rehydrated state on startup
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as Partial<AppStore>),
      }),
    }
  )
);
