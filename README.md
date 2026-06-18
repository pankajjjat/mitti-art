# Mitti — Handcrafted Indian Art

**Warm Earth meets Deep Indigo.** A premium Next.js e-commerce website for Mitti, an Indian handcrafted art brand by Samuya Chaurasia.

## ✨ Features

- **Next.js 16** with App Router, TypeScript & Tailwind v4
- **Editorial gallery layout** — story-first, product-second design
- **Product catalog** — 13 handcrafted artworks with categories, filters & sorting
- **Product modal** — full-screen overlay with image, details, story & add-to-cart
- **Shopping cart** — slide-out drawer with quantity controls & checkout
- **Responsive design** — mobile-first with 2-column grid on mobile, 3 on desktop
- **Animations** — fade-up on scroll, marquee ticker, product hover effects
- **Commission form** — custom order requests with mailto integration
- **PocketBase backend** — open-source backend for products, commissions & subscribers
- **SEO optimized** — meta tags, Open Graph, structured product data

## 🎨 Brand Kit

See [DESIGN.md](./DESIGN.md) for the complete brand identity system including:
- Color palette (Warm Earth, Deep Indigo, Terracotta, Gold)
- Typography (Playfair Display + Inter + JetBrains Mono)
- Component styling, spacing, elevation & layout principles

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### PocketBase Setup

The website can run fully with static product data. For the backend features (commission form, newsletter, admin panel):

1. **Start PocketBase:**

   ```bash
   cd pocketbase
   ./pocketbase serve
   ```

2. **Seed the database:**

   ```bash
   npx tsx scripts/seed-pb.mts
   ```

3. **Admin UI:** [http://127.0.0.1:8090/_/](http://127.0.0.1:8090/_/)

4. **Update `.env.local`** if your PocketBase URL is different.

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
mitti-art/
├── src/
│   ├── app/
│   │   ├── globals.css        # Tailwind v4 theme + brand tokens
│   │   ├── layout.tsx         # Root layout with fonts + navbar + footer
│   │   └── page.tsx           # Home page (all sections)
│   ├── components/
│   │   ├── Button.tsx         # Reusable button (primary/outline/ghost)
│   │   ├── Navbar.tsx         # Fixed nav with glass effect
│   │   ├── Hero.tsx           # Full-bleed hero with dual CTA
│   │   ├── Marquee.tsx        # Infinite scrolling category ticker
│   │   ├── ProductGrid.tsx    # Filterable/sortable product grid
│   │   ├── ProductCard.tsx    # 3:4 aspect ratio product card
│   │   ├── ProductModal.tsx   # Full-screen product detail modal
│   │   ├── About.tsx          # Artist story + stats section
│   │   ├── Process.tsx        # 4-step creative process timeline
│   │   ├── Testimonials.tsx   # Auto-rotating testimonial carousel
│   │   ├── CommissionForm.tsx # Custom order request form
│   │   ├── Newsletter.tsx     # Email signup section
│   │   ├── Footer.tsx         # Full footer with links + social
│   │   ├── CartDrawer.tsx     # Slide-out shopping cart
│   │   └── SectionHeading.tsx # Reusable section header
│   └── lib/
│       ├── products.ts        # Product data (13 artworks)
│       ├── store.ts           # Zustand cart store
│       └── pocketbase.ts      # PocketBase client + API helpers
├── public/
│   ├── images/                # Product images
│   └── favicon.svg
├── pocketbase/
│   └── pocketbase.exe         # PocketBase executable
├── scripts/
│   └── seed-pb.mts           # DB migration + seed script
├── DESIGN.md                  # Full brand kit
└── README.md
```

## 🛒 Cart & Checkout

- **Add to Cart** from the product modal
- **Cart drawer** slides in from the right with quantity controls
- **Checkout** opens a pre-filled email to hello@mittiart.com with order details
- For fully automated checkout, integrate Razorpay or a payment gateway

## 🔧 PocketBase API

| Collection    | Endpoint              | Notes                        |
|---------------|-----------------------|------------------------------|
| Products      | `/api/collections/products/records` | Read-only for guests |
| Commissions   | `/api/collections/commissions/records` | Create only |
| Subscribers   | `/api/collections/subscribers/records` | Create only (unique email) |
| Orders        | `/api/collections/orders/records` | Admin only |

## 🌐 Deployment

- **Frontend:** Deploy to Vercel (`vercel --prod`)
- **Backend:** Deploy PocketBase to Railway, Fly.io, or a VPS
- Set `NEXT_PUBLIC_POCKETBASE_URL` to your PocketBase instance URL

## 📝 License

All rights reserved. Mitti Art © 2024 Samuya Chaurasia.
