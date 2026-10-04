# WRISTO — Ultra-Luxury Watch Marketplace

<div align="center">
  <img src="assets/brand/logo-horizontal-dark.png" alt="WRISTO Logo" width="340" />
  <p><em>Your Time. Your Style.</em></p>
  <p><strong>A Next-Generation Editorial Horological Boutique & Multi-Brand Discovery Platform</strong></p>
</div>

---

## 🌟 Overview

**WRISTO** is an ultra-luxury multi-brand watch marketplace built with an editorial Swiss horology design language (inspired by *A Collected Man*, *Hodinkee*, and *Revolution Magazine*). It pairs dark, cinematic horological surfaces with tactile ivory textures, instantaneous client-side performance, and strict architectural separation for a planned Java + Spring Boot + PostgreSQL backend.

---

## 🚀 Key Features Implemented

### 1. Cinematic Dark Luxury Hero Section
- High-resolution dark luxury timepiece on rock backdrop with radial vignette overlay.
- Left-side dark gradient ensuring maximum typographic contrast.
- Serif headline (*"Your Time. Your Style."*) and champagne gold CTA with hover elevation.
- Interactive video modal trigger with backdrop blur.

### 2. Official Brand Identity & Vector System
- Dual-theme horizontal logo lockup:
  - **Dark Surfaces:** Ivory wordmark (`#F7F3EC`) + bronze stylized W monogram (`#B08D6B`) + bronze tagline.
  - **Light Surfaces:** Charcoal wordmark (`#1A1A1A`) + bronze monogram.
- Anti-aliased high-DPI transparent assets with zero white bounding boxes.

### 3. "Modern Looks. Timeless Feel." Editorial Campaign Banner
- Strictly positioned in its original slot — immediately following **Trending Timepieces** and preceding **Curated Editorial Collections**.
- Contained card structure (`border-radius: 20px`, soft depth shadow) with tracked bronze `NEW ARRIVALS` eyebrow, luxury serif title, champagne CTA, and `01 —— 02 —— 03` indicator.

### 4. Production Next.js Catalog (PLP at `/watches`)
- **40-Watch Master Catalog:** Curated dataset with luxury calibers, technical specs, pricing, and ratings.
- **Spring Boot-Ready Service Layer (`src/services/productService.ts`):** Decoupled data contracts (`getCatalogProducts`) supporting multi-facet queries, pagination, and dynamic facet counts.
- **Two-Way URL State Synchronization:** All filter facets (`brand`, `movement`, `style`, `maxPrice`, `sort`, `q`) synchronize 2-way with Next.js `searchParams`.
- **Responsive Multi-Device Layout:** Sticky 270px left facet rail on desktop; luxury `[ ⚙ Filters & Sort ]` trigger opening animated `FilterDrawer` on tablet and mobile.

### 5. Product Detail Experience (PDP at `/product/[id]`)
- **Dynamic SSG Pre-rendering:** Pre-renders all 40 watches statically at build time with dynamic OpenGraph meta tags and `/watches/[id]` SEO redirect.
- **Interactive 3D Stage:** Level 3 depth cursor-tracking tilt gallery with vertical thumbnail rail and official WRISTO Authenticity Seal.
- **Macro Lightbox Modal:** Fullscreen zoom-in, zoom-out, and reset controls with keyboard `Escape` dismissal.
- **Technical Horology Matrix:** 6-cell tactile specs grid (Caliber Movement, Case Diameter, Case Material, Dial & Crystal, Strap, Water Resistance).
- **AI Style Concierge Insight:** Distinctive ivory card with gold accent bar grounded in `product.aiReason`, compatibility score (`98% Style Match`), and occasion chips.
- **Mobile Sticky Purchase Bar:** Fixed thumb-zone bar on mobile viewports revealing on scroll with watch thumbnail, price, and instant Add/Buy buttons.

### 6. Instant Search & Autocomplete Overlay (`⌘K`)
- **Global Keyboard Coordination:** `Cmd+K` / `Ctrl+K`, `/`, and `Escape` shortcuts with body scroll lock.
- **Decoupled Search Engine:** Multi-field debounced queries returning matching brands with piece count pills, suggested timepieces with query highlighting in gold, and horology specs.
- **Search History & Recents:** LocalStorage search history persistence with per-item remove and clear all history.

### 7. Full Cart Drawer & Multi-Step Luxury Checkout Sequence (`/checkout`)
- **Slide-Over Cart Drawer:** Animated reward threshold progress bar (Complimentary Leather Travel Pouch at ₹15,000+), promo code engine (`WRISTO10`, `HOROLOGYVIP`, `FIRST15`), and gift wrapping toggle.
- **Distraction-Free Isolated Checkout:** Quieter luxury header with 256-bit SSL badge, suppressing marketing navigation and footers.
- **Progressive 4-Step Stepper:** `01 Address & Contact` → `02 Horological Delivery` → `03 Secure Payment` → `04 Review & Confirm`.
- **Order Confirmation & Provenance (`/checkout/success`):** Serialized Order ID (`WRT-2026-XXXXX`), registered Certificate of Provenance ID (`CERT-CHRONO-XXXXX`), itemized receipt, and print layout.

### 8. Client Account & Provenance Ledger (`/account`)
- **5-Tab Collector Dashboard:** Overview, My Orders & Custody, Address Book, Vault Wishlist, and Security & Preferences.
- **Interactive Provenance Certificate Modal:** Vector SVG guilloché security borders, embossed gold holographic seal, collector provenance details, movement caliber serial, and printable layout.

### 9. AI Watch Concierge (`/concierge`)
- **Private Conversational Advisor:** Multi-turn chat interface simulating a private Mayfair horological advisor.
- **Semantic Scoring:** Real-time multi-factor weighted scoring across 40 watches (budget, caliber, water resistance, occasion, strap style) with structured recommendation cards.

### 10. Editorial Journal (`/journal` & `/journal/[slug]`)
- **Swiss Horology Publication:** 6 deep-dive horological essays with category filters (Collector Guides, Technical Horology, Industry Insights).
- **Dynamic SSG Pre-rendering:** Pre-renders all 6 articles with optimized serif typography, pull quotes, and inline timepiece links.

### 11. Watch Comparison Engine (`/compare`)
- **Side-by-Side Horology Matrix:** Compare up to 4 timepieces across 9 technical dimensions (Brand House, Caliber Movement, Case Diameter, Case Material, Strap Type, Dial Finish, Water Resistance, Style Aesthetic, Recommended Occasions).
- **Floating Comparison Dock:** Persistent luxury floating bottom dock with watch thumbnail chips, remove actions, and minimize pill badge.
- **Universal Triggers:** Header scale icon with live badge counter, catalog card hover "Compare" quick action, and PDP "Compare Specs" toggle.

### 12. Launch Hardening, Rich SEO & Dynamic Sitemap
- **58 Statically Pre-rendered Routes:** Dynamic `sitemap.ts` indexing all core pages, 40 watch PDPs, and 6 journal articles.
- **Structured Schema Markup:** `Organization`, `WebSite`, `Product`, `AggregateRating`, and `BreadcrumbList` JSON-LD schemas.
- **Resilience Infrastructure:** Luxury horological 404 recovery page (`not-found.tsx`), global error boundary (`error.tsx`), and skip-to-content links.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | [Next.js 16+ (App Router)](https://nextjs.org/) + [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) (Strict Mode) |
| **Bundler & Tooling** | Turbopack |
| **Styling** | Vanilla CSS3 Custom Design Tokens (11-step typography scale tokens, HSL luxury palettes) |
| **State Management** | React Context (`CartContext`, `WishlistContext`, `SearchContext`, `ComparisonContext`) with LocalStorage Sync |
| **Architecture Pattern** | Decoupled Service Layer (`productService`, `orderService`, `accountService`, `journalService`) |
| **Planned Backend** | Java 21 + Spring Boot 3.3+ + PostgreSQL |

---

## 📂 Repository Structure

```
WRISTO/
├── wristo-next/                                 # Production Next.js 16+ Web Application
│   ├── src/
│   │   ├── app/                                 # App Router (61 SSG & Dynamic routes)
│   │   │   ├── layout.tsx                       # Root Layout (Fonts, Cart/Wishlist/Comparison/Search Providers)
│   │   │   ├── globals.css                      # Master Design Tokens, 11-step typography scale
│   │   │   ├── page.tsx                         # Home / Discover Page
│   │   │   ├── wishlist/                        # Dedicated Standalone Wishlist Page (/wishlist)
│   │   │   ├── cart/                            # Dedicated Standalone Shopping Cart Page (/cart)
│   │   │   ├── brands/                          # Curated Brand Houses Showcase Page (/brands)
│   │   │   ├── watches/                         # Catalog PLP Route (/watches)
│   │   │   ├── product/[id]/                    # Dynamic SSG Product Detail Pages (40 watches)
│   │   │   ├── compare/                         # Watch Comparison Matrix Route (/compare)
│   │   │   ├── checkout/                        # Multi-Step Checkout (/checkout) & Confirmation (/checkout/success)
│   │   │   ├── account/                         # Client Account & Provenance Ledger (/account)
│   │   │   ├── concierge/                       # AI Watch Concierge (/concierge)
│   │   │   ├── journal/                         # Editorial Journal (/journal & /journal/[slug])
│   │   │   ├── not-found.tsx                    # Luxury 404 Recovery Screen
│   │   │   ├── error.tsx                        # Global Fault Boundary
│   │   │   ├── robots.ts                        # SEO robots.txt Generator
│   │   │   └── sitemap.ts                       # Dynamic XML Sitemap (58 indexed routes)
│   │   ├── components/                          # Modular UI components (catalog, home, layout, product, comparison, search, checkout, account)
│   │   ├── context/                             # CartContext, WishlistContext, SearchContext, ComparisonContext
│   │   ├── data/                                # 40-watch master dataset, brands, categories
│   │   ├── services/                            # productService.ts, orderService.ts, accountService.ts, journalService.ts
│   │   └── types/                               # product.ts, filter.ts, order.ts, account.ts, journal.ts
│   ├── public/assets/                           # Watch photography, brand logos, banners, SVG seals
│   ├── package.json                             # Dependencies
│   └── tsconfig.json                            # Strict TypeScript Configuration
├── prompts/                                     # Master Prompts Archive (All major engineering & design prompts)
│   ├── README.md                                # Prompts Directory Index & Catalog
│   ├── 01_master_architecture_and_brand_system.md
│   ├── 02_core_commerce_phases_1_to_10.md
│   ├── 03_desktop_parity_roadmap_milestones_1_to_5.md
│   ├── 04_backend_architecture_and_spring_boot_spec.md
│   └── 05_gsap_scroll_scrubbed_watch_animation.md
├── assets/                                      # Original raw image & brand assets
├── css/                                         # Original vanilla CSS reference stylesheet
├── js/                                          # Original vanilla JS prototype scripts
├── docs/                                        # Master specifications, architecture docs, parity analysis
│   ├── WRISTO_MASTER_DEVELOPMENT_PROMPT.md
│   ├── WRISTO_Design_Tokens_and_Interactions.md
│   ├── WRISTO_Production_Ready_SRS_v1.0.md
│   ├── backend_architecture_specification.md
│   ├── desktop_web_parity_analysis.md
│   └── session_summary.md
├── screenshots/                                 # Centralized multi-viewport visual QA regression captures
├── MEMORY.md                                    # Repository architectural memory & design invariants
├── PROGRESS.md                                  # Milestones & roadmap tracking
├── TECHNICALDEBT.md                             # Technical debt registry & resolution plans
└── README.md                                    # This file
```

---

## 🏁 Quickstart & Local Development

### Prerequisites
- Node.js 18.18+ or Node.js 20+
- npm or pnpm

### Running the Production Next.js App
```bash
# 1. Navigate to the Next.js directory
cd wristo-next

# 2. Install dependencies
npm install

# 3. Start the Turbopack development server
npm run dev

# 4. Open in your browser:
#    Home:        http://localhost:3000
#    Catalog:     http://localhost:3000/watches
#    Wishlist:    http://localhost:3000/wishlist
#    Cart:        http://localhost:3000/cart
#    Brands:      http://localhost:3000/brands
#    Compare:     http://localhost:3000/compare
#    Concierge:   http://localhost:3000/concierge
#    Journal:     http://localhost:3000/journal
#    Account:     http://localhost:3000/account
#    Checkout:    http://localhost:3000/checkout
```

### Production Build & Typecheck
```bash
cd wristo-next
npm run build
```

---

## 🗺️ Roadmap & Milestones

### Core Architecture & Commerce Lifecycle (100% Completed)
- [x] **Milestone 1:** Luxury Hero Section Refinement ✅
- [x] **Milestone 2:** Official Brand Identity & Vector Logo Lockup ✅
- [x] **Milestone 3:** "Modern Looks. Timeless Feel." Editorial Campaign Banner ✅
- [x] **Milestone 4:** Multi-Viewport Visual Regression & Quality Assurance ✅
- [x] **Milestone 5:** Phase 3 — Production Next.js Catalog (PLP) Architecture ✅
- [x] **Milestone 6:** Phase 4 — Product Detail Experience (PDP with 3D tilt, zoom gallery, specs matrix) ✅
- [x] **Milestone 7:** Phase 5 — Instant Search & Autocomplete Overlay (`⌘K`) ✅
- [x] **Milestone 8:** Typography & Design Token Scale Alignment (Section 3 Parity) ✅
- [x] **Milestone 9:** Phase 6 — Full Cart Drawer, Promo Engine & Multi-Step Luxury Checkout Sequence ✅
- [x] **Milestone 10:** Phase 7 — Client Account & Provenance Ledger (`/account`) ✅
- [x] **Milestone 11:** Phase 8 — AI Watch Concierge (`/concierge`) ✅
- [x] **Milestone 12:** Phase 9 — Editorial Journal (`/journal` & `/journal/[slug]`) ✅
- [x] **Milestone 13:** Phase 10 — Launch Hardening, Rich SEO & Dynamic Sitemap (57 routes, `eb9b5ad`) ✅
- [x] **Milestone 14:** Desktop Web Parity & Content Audit (`docs/desktop_web_parity_analysis.md`) ✅
- [x] **Milestone 15:** Desktop Parity Milestone 1 — Watch Comparison Engine (`8ccebb4`, 58 routes) ✅

### Desktop Parity Roadmap (100% Complete)
- [x] **Parity Milestone 1:** Watch Comparison Engine (Floating dock, `/compare` matrix, quick actions, `8935832`) ✅
- [x] **Parity Milestone 2:** Homepage Parity & Section Restoration (Popular Brands strip, Curated Occasions 4 tall cards, App promo, Blog preview, Trust strip copy, `2ba36df`) ✅
- [x] **Parity Milestone 3:** Catalog / PLP Enhancements (Shop by Category left jump list, 4 circular category chips, card bottom status pills, `d9ef911`) ✅
- [x] **Parity Milestone 4:** Dedicated Standalone Desktop Pages (`/wishlist`, `/cart`, `/brands`, Account persona updated to `Gaurav Kadam`, `8853fbb`) ✅
- [x] **Parity Milestone 5:** Header, Footer & Search Copy Polish (Pune contact details, social links, payment gateway badges, search keywords, `8853fbb`) ✅

---

## 🛠️ Backend Architecture & Specification

For complete details on the target Java 21 + Spring Boot 3.3+ microframework, PostgreSQL schema, Flyway migrations, Redis caching, and REST API contracts matching this Next.js frontend, see the master specification:
- 📖 **[Backend Architecture & API Specification](file:///e:/WRISTO/docs/backend_architecture_specification.md)**

---

## 📜 License

Private Horological Marketplace Project &copy; 2026 WRISTO. All rights reserved.
