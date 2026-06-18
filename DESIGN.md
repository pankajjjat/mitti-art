---
version: alpha
name: Mitti
description: Handcrafted Indian art brand — Warm Earth meets Deep Indigo. Editorial minimalism with artisan soul.
colors:
  primary: "#1A3C5E"
  secondary: "#8B4513"
  tertiary: "#C75B39"
  neutral: "#F5F0EB"
  neutral-dark: "#2C1810"
  highlight: "#D4A04A"
  success: "#2D8A4E"
  error: "#C94B4B"
  info: "#5B8FB9"
typography:
  h1:
    fontFamily: Playfair Display
    fontSize: 4rem
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  h2:
    fontFamily: Playfair Display
    fontSize: 3rem
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  h3:
    fontFamily: Playfair Display
    fontSize: 2rem
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  h4:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0"
  body:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "0"
  body-large:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "0"
  caption:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.02em"
  label:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.08em"
  mono:
    fontFamily: JetBrains Mono
    fontSize: 0.8125rem
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
rounded:
  sm: 4px
  md: 8px
  lg: 16px
  xl: 24px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  4xl: 96px
  5xl: 128px
components:
  button-primary:
    backgroundColor: "{colors.tertiary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.full}"
    padding: 12px 28px
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: 500
    letterSpacing: "0.04em"
  button-primary-hover:
    backgroundColor: "{colors.secondary}"
    textColor: "#FFFFFF"
  button-outline:
    backgroundColor: transparent
    textColor: "{colors.neutral}"
    rounded: "{rounded.full}"
    padding: 12px 28px
    border: "1px solid rgba(255,255,255,0.2)"
  button-outline-hover:
    border: "1px solid {colors.highlight}"
    textColor: "{colors.highlight}"
  card-product:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.neutral-dark}"
    rounded: "{rounded.lg}"
    padding: 0
    border: "1px solid #E8E2D9"
    shadow: "0 4px 24px rgba(0,0,0,0.06)"
  card-product-hover:
    shadow: "0 8px 40px rgba(0,0,0,0.10)"
    transform: "translateY(-4px)"
  input:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.neutral-dark}"
    rounded: "{rounded.md}"
    padding: 14px 18px
    border: "1px solid #D4CDC1"
  nav-link:
    textColor: "{colors.neutral}"
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: 500
    letterSpacing: "0.06em"
  nav-link-hover:
    textColor: "{colors.highlight}"
---

## Overview

Mitti (मिट्टी) means "earth" in Hindi. The brand sits at the intersection of traditional Indian craftsmanship and contemporary design. Every visual decision — from the warm paper-like backgrounds to the deep indigo accents — is rooted in the textures, colors, and soul of the Indian subcontinent.

**Brand Personality:** Warm, Artisanal, Premium, Earthy, Contemporary
**Target Audience:** Art collectors, interior designers, gifting buyers, art lovers (₹3,500–₹18,000 price range)
**Voice:** Poetic but clear. Grounded. Proud of its Indian roots without being traditionalist.

## Colors

### Earth Palette (Neutral Base)
- **Neutral / Page Background (#F5F0EB):** Warm off-white — handmade paper color. The canvas.
- **Neutral Dark / Text (#2C1810):** Dark espresso — primary text. Warm, never pure black.
- **Surface Mix (#E8E2D9):** Light clay — card borders, subtle dividers.
- **Muted (#9C8F83):** Warm stone — secondary text, captions.

### Primary Palette
- **Primary / Deep Indigo (#1A3C5E):** Indian indigo — the anchor. CTAs, headers, brand blocks.
- **Secondary / Saddle Brown (#8B4513):** Earth/wood — secondary elements, hover states.
- **Tertiary / Terracotta (#C75B39):** The accent spark — fire, energy, the artist's hand.

### Accent Palette
- **Highlight / Warm Gold (#D4A04A):** Premium touch — badges, highlights, decorative elements.
- **Success (#2D8A4E):** Add-to-cart confirmations, sold indicators.
- **Error (#C94B4B):** Errors, sold-out markers.
- **Info (#5B8FB9):** Informational badges.

### Usage Rules
- **Primary (#1A3C5E)** = headers, primary buttons on light bg, active navigation
- **Tertiary (#C75B39)** = accent buttons, hover states, decorative accents
- **Secondary (#8B4513)** = hover states, secondary emphasis
- **Neutral (#F5F0EB)** = always the page background
- **Highlight (#D4A04A)** = limited to 1-2 elements per page (premium signals)
- **Background is NEVER pure white** — always the warm F5F0EB

## Typography

### Playfair Display — The Soul (Headings)
Playfair Display carries the brand's artistic, editorial quality. Used exclusively for headings, it brings a sense of heritage and craftsmanship. The italic variant adds a poetic, handwritten touch.

**Usage:** H1, H2, H3 only. Never body text.
**Weights:** 700 (headings), 600 (sub-headings), 400 (italic for decorative text)

### Inter — The Voice (Body)
Inter provides clarity and modern edge. Clean, readable, international. Used for all body text, navigation, buttons, labels.

**Usage:** Everything except headings — body, UI, nav, buttons, captions
**Weights:** 300 (light for hero subtitles), 400 (body), 500 (buttons/nav), 600 (strong emphasis)

### JetBrains Mono — The Craft Detail (Monospace)
Used sparingly for price tags, metadata, small labels, and artistic details like the "Studio" badge.

### Type Scale
- **H1:** 4rem (64px) / 1.05 / -0.03em — Hero headlines, page titles
- **H2:** 3rem (48px) / 1.1 / -0.02em — Section headers
- **H3:** 2rem (32px) / 1.15 / -0.01em — Card titles, subsection headers
- **H4:** 1.125rem (18px) / 1.3 / Inter 600 — Product names, card titles
- **Body Large:** 1.125rem (18px) / 1.7 — Intro paragraphs, descriptions
- **Body:** 1rem (16px) / 1.7 — Standard reading text
- **Caption:** 0.8125rem (13px) / 1.5 / 0.02em tracking — Secondary info
- **Label:** 0.6875rem (11px) / 1.2 / 0.08em tracking / uppercase — Labels, nav

## Layout & Spacing

### Grid System
- **Max content width:** 1280px
- **Page padding:** 64px (desktop), 24px (tablet), 16px (mobile)
- **Product grid:** 3 columns (desktop), 2 columns (tablet), 2 columns (mobile)
- **Feature sections:** 2-column editorial layout

### Spacing Rhythm
- **Between sections:** 96-128px (5xl-6xl)
- **Within sections:** 48-64px (2xl-3xl)
- **Component gap:** 24px (lg)
- **Element gap:** 16px (md)
- **Tight spacing:** 8px (sm)

### Whitespace Philosophy
Generous whitespace is premium. Mitti uses wide margins, tall section padding, and breathing room between cards. The warm background acts as a restful canvas. Content feels like it's displayed in a gallery — not packed into a store.

## Elevation & Depth

### Shadow System
- **Level 0 (Flat):** No shadow — page background, text, icons
- **Level 1 (Subtle):** `0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)` — cards, sections
- **Level 2 (Medium):** `0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)` — product cards
- **Level 3 (Elevated):** `0 8px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)` — modals, dropdowns
- **Level 4 (Modal):** `0 32px 80px rgba(0,0,0,0.20)` — full modals

### Depth Through Color
Surfaces layer through the warm palette:
- Canvas: #F5F0EB (page background)
- Surface: #FFFFFF (cards, raised elements)
- Border: #E8E2D9 (between surfaces)

## Shapes

### Border Radius Scale
- **sm (4px):** Inputs, small UI elements
- **md (8px):** Standard elements
- **lg (16px):** Cards, containers
- **xl (24px):** Featured panels, hero sections
- **full (9999px):** Buttons, badges, pills

### Design Principles
- Buttons are always pill-shaped (full radius)
- Cards get lg (16px) radius
- Modals and featured sections get xl (24px) radius
- Inputs get md (8px) radius

## Components

### Navigation
- Fixed top, transparent → glass effect on scroll
- Logo (Playfair Display 24px) left
- Links: uppercase 11px Inter 500, 0.08em tracking
- Cart icon right
- On mobile: hamburger → slide-in drawer

### Hero Section
- Full-bleed artwork background with dark overlay
- Overlay gradients: bottom-up and vignette
- Content: Eyebrow label (mono, 11px) → H1 (64px, Playfair) → Body (18px) → Dual CTA
- Hero indicators (dots or line segments) bottom-left
- Scroll indicator bottom-right
- Marquee ticker at bottom with art medium names

### Product Cards
- Consistent 3:4 aspect ratio (portrait — best for art)
- Image fills card, slight zoom on hover
- Overlay: gradient bottom-up, title + medium + price on hover
- Category badge top-right (glass effect)
- Click opens modal, not new page

### Product Modal
- Full-screen overlay with backdrop blur
- 2-column panel: Image left, Details right
- Details: Badge → Title (English + Hindi) → Medium tags → Price → Story → Actions
- Actions: "Add to Cart" (primary) + "Buy Now" (outline)
- Close on Escape key, click-outside, or X button

### Cart Drawer
- Slide-in from right, 420px max
- Header: "Your Cart" + Close
- Items: thumb, title, Hindi name, price, quantity controls, remove
- Footer: Total → Checkout button
- Empty state: illustration + message
- Toast notification on add/remove

### Buttons
- **Primary (#C75B39):** Main CTAs — Add to Cart, Subscribe, Explore
- **Outline (border):** Secondary actions — View Gallery, Learn More
- **Ghost:** Tertiary — Continue Browsing
- All buttons: pill shape, 12px 28px padding, 13px Inter 500, 0.04em tracking

### Inputs & Forms
- White background, warm border (#D4CDC1)
- 14px 18px padding, 8px radius
- Focus: terracotta border + subtle glow
- Placeholder: muted warm (#A8988A)

## Do's and Don'ts

### Do
- Always use #F5F0EB as the page background — never pure white
- Use Playfair Display for headings, Inter for body — this contrast IS the brand
- Let product images breathe with generous card padding
- Show the Hindi name alongside English — Indian identity
- Use terracotta (#C75B39) sparingly — it's the accent, not the base
- Keep navigation minimal — art brands need to feel unhurried
- Use warm gold (#D4A04A) only for premium signals (badges, highlights)
- Maintain 3:4 aspect ratio for product images

### Don't
- Don't use pure white (#FFFFFF) as page background — it feels sterile
- Don't use Inter for headings — it removes the artistic character
- Don't use black text — always use #2C1810 (dark espresso)
- Don't overload the page with CTAs — one primary action per section
- Don't use cold blue grays — the palette is warm throughout
- Don't make buttons square — they must be pill-shaped
- Don't use images with different aspect ratios in the same grid row
- Don't hide prices — art buyers want to see price immediately
