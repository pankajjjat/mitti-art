# Mitti — Handcrafted Indian Art

**Warm Earth meets Deep Indigo.** A premium website for Mitti, an Indian handcrafted art brand by Samuya Chaurasia.

Built with **Next.js 16** + **TypeScript** + **Tailwind v4** + **PocketBase**

## ✨ Features

- **Product Gallery** — 13 original artworks across 6 categories with filter/sort
- **Product Modal** — Full-screen overlay with story, dimensions, price
- **Cart System** — Zustand-powered slide-out drawer
- **Commission Form** — Custom order requests
- **About Section** — Artist story with stats
- **Process Timeline** — 4-step creative journey
- **Testimonials** — Client reviews carousel
- **Newsletter Signup** — Email collection
- **Responsive** — Mobile-first, fully adaptive
- **PocketBase Backend** — Self-hosted, real-time capable

## 🖼️ The Brand

| Token | Value |
|---|---|
| Primary | `#1A3C5E` Deep Navy |
| Secondary | `#8B4513` Earth Brown |
| Accent | `#C04000` Warm Terracotta |
| Sandstone | `#D4B48C` |
| Background | `#F5F0EB` Off-White |
| Font: Display | Playfair Display |
| Font: Body | Inter |

## 🚀 Getting Started

### 1. Run the Next.js dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 2. Start PocketBase (backend)

```bash
cd pocketbase

# First time only: create superuser
./pocketbase.exe superuser upsert admin@mittiart.com "your-password" --dir=pb_data

# Start the server
./pocketbase.exe serve --dir=pb_data
```

The admin dashboard will be at [http://127.0.0.1:8090/_/](http://127.0.0.1:8090/_/)

> **Note:** The `pb_migrations/` folder already contains the 4 collection schemas. When you start PocketBase with a fresh `pb_data`, it automatically creates the collections with all fields and public read access on products. 

### 3. Seed the database

```bash
# With PocketBase running, from the project root:
npx tsx scripts/seed-pb.mts
```

This populates the 13 products. The collections are already created by migrations — the script only seeds data if the database is empty.

### 4. Configure environment

Create `.env.local`:

```
NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
PB_ADMIN_EMAIL=admin@mittiart.com
PB_ADMIN_PASSWORD=your-password
```

## 🏗️ Project Structure

```
src/
├── app/
│   ├── globals.css      # Tailwind v4 theme + brand tokens
│   ├── layout.tsx       # Root layout with fonts
│   └── page.tsx         # Main single-page layout
├── components/
│   ├── Navbar.tsx       # Fixed glass-effect navigation
│   ├── Hero.tsx         # Full-bleed hero section
│   ├── ProductGrid.tsx  # Filterable/sortable grid
│   ├── ProductCard.tsx  # 3:4 aspect card
│   ├── ProductModal.tsx # Overlay product detail
│   ├── About.tsx        # Artist story
│   ├── Process.tsx      # Creative journey
│   ├── Testimonials.tsx # Client reviews
│   ├── CommissionForm.tsx # Custom orders
│   ├── Newsletter.tsx   # Email signup
│   ├── Footer.tsx       # Full footer
│   ├── CartDrawer.tsx   # Slide-out cart
│   ├── Button.tsx       # Reusable button
│   ├── SectionHeading.tsx # Section titles
│   └── Marquee.tsx      # Infinite ticker
├── lib/
│   ├── products.ts      # Static product data (fallback)
│   ├── pocketbase.ts    # PocketBase API client
│   └── store.ts         # Zustand cart store
scripts/
└── seed-pb.mts          # Database seeder
DESIGN.md                # Full brand kit
```

## 📦 Products

13 handcrafted artworks including:

- Kamal Vatika · Madhubani · ₹8,500
- Surya Om Mandala · Metal Wall Art · ₹12,000
- Shanti Padma · Carved Panel · ₹18,000
- Prakriti · Resin Art · ₹6,500
- Surya Kiran · Mosaic · ₹9,500
- Ganesha Darshan · Ceramic · ₹15,000
- Gul-e-Nasturtium · Watercolor · ₹4,500
- Suvarna Patra · Resin Art · ₹3,500
- Ekadanta · Folk Art · ₹11,000
- Alankara Gaja · Miniature · ₹14,000
- Padma Mandala · Mixed Media · ₹16,000
- Surya Pushp · Botanical · ₹4,000
- Sukhi Phool · Resin Art · ₹5,500

## 🛠️ Tech Stack

| Tool | Version |
|---|---|
| Next.js | 16.2.9 |
| TypeScript | ~5.8 |
| Tailwind CSS | v4 |
| PocketBase | 0.39.4 |
| Zustand | latest |
| React | 19.x |
| Font: Playfair Display + Inter | Google Fonts |

## 🌐 Links

- [GitHub Repository](https://github.com/pankajjjat/mitti-art)
- [PocketBase](https://github.com/pocketbase/pocketbase)
- [Next.js](https://nextjs.org/)
