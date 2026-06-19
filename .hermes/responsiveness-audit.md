# Responsiveness & Spacing Audit — Mitti Art

## ✅ GOOD - Already Responsive
- Navbar: mobile drawer, body scroll lock, hamburger menu
- Footer: 1→2→4 col grid, mobile stacking
- CartDrawer: full-width on mobile, scroll lock, escape key
- ProductGrid (home): 2→2→3 cols
- ShopContent: 2→3 cols with mobile filter drawer
- ProductDetail: flex-col→lg:flex-row, zoom lens
- ProductModal: stacked→row on desktop
- Checkout: lg:grid-cols-5 with sidebar
- Account layout: sidebar→mobile scrollable tabs
- Account dashboard: stats grid 1→3 cols, quick links 1→2→3→5 cols
- Commissions: process 2 col, examples 3 col
- About: 2 col hero, 2→4 stats, 2→4 process
- Contact: 5 col form layout, stacked on mobile

## 🚨 ISSUES FOUND

### Critical Bugs
1. **Checkout** — Early return (lines 78-79) before useCallback hooks → "Rendered fewer hooks" error
2. **Contact** — WhatsApp number masked (`+919****3210` → `+918770858280`)
3. **Hero** — "Explore Collection" links to `#explore` (no element with that id)
4. **About CTA** — "Request a Commission" links to `/#contact` — no `id="contact"` on home page
5. **Newsletter** — No `id="newsletter"` wrapper for footer link `/#newsletter`

### UX/Responsive Issues
6. **Shop cards** — Wishlist button `opacity-0 group-hover:opacity-100` — never visible on touch devices
7. **Footer** — Links to /faq, /shipping, /returns — these pages don't exist (404)

### Minor Spacing
8. Container padding 1rem (16px) on mobile — standard and fine
9. Hero title text-5xl (48px) on mobile — crisp but fine
10. Testimonials carousel 1→2→3 cards — good
