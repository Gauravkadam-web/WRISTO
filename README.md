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

## 🚀 Key Features Implemented (Phases 1 — 3)

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
- **Responsive Multi-Device Layout:**
  - **Desktop (≥1024px):** Sticky 270px left facet rail + 4-column card grid with 3D mouse tilt interaction.
  - **Tablet & Mobile (<1024px):** Desktop sidebar cleanly tucked into a luxury `[ ⚙ Filters & Sort ]` trigger button opening an animated slide-over `FilterDrawer` with backdrop blur and body scroll lock.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | [Next.js 16+ (App Router)](https://nextjs.org/) + [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) (Strict Mode) |
| **Bundler & Tooling** | Turbopack |
| **Styling** | Vanilla CSS3 Custom Design Tokens (Zero Tailwind/Bootstrap Bloat) |
| **State Management** | React Context (`CartContext`, `WishlistContext`) with LocalStorage Sync |
| **Architecture Pattern** | Decoupled Service Layer (Mock in-memory today, Spring Boot REST API tomorrow) |
| **Planned Backend** | Java 21 + Spring Boot 3.3+ + PostgreSQL |

---

## 📂 Repository Structure

```
WRISTO/
├── wristo-next/                       # Production Next.js Web Application
│   ├── src/
│   │   ├── app/                       # Next.js App Router (layout, globals.css, page, watches)
│   │   ├── components/                # Modular UI (catalog, home, layout)
│   │   ├── context/                   # Cart & Wishlist context providers
│   │   ├── data/                      # 40-watch dataset, brands, categories, collections
│   │   ├── services/                  # productService.ts (decoupled data contract)
│   │   └── types/                     # product.ts, filter.ts
│   ├── public/assets/                 # Watch photography, brand logos, banners
│   ├── package.json                   # Dependencies
│   └── tsconfig.json                  # TypeScript config
├── assets/                            # Original raw assets & brand identity
├── css/                               # Vanilla CSS reference stylesheet
├── js/                                # Vanilla JS prototype scripts
├── docs/                              # Project specifications & master prompt
│   ├── WRISTO_MASTER_DEVELOPMENT_PROMPT.md
│   ├── WRISTO_Design_Tokens_and_Interactions.md
│   └── session_summary.md
├── MEMORY.md                          # Repository architectural invariants & design memory
├── PROGRESS.md                        # Milestones & roadmap tracking
├── TECHNICALDEBT.md                   # Known technical debt & architectural trade-offs
└── README.md                          # This file
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
#    Home:    http://localhost:3000
#    Catalog: http://localhost:3000/watches
```

### Production Build & Typecheck
```bash
cd wristo-next
npm run build
```

---

## 🗺️ Roadmap & Upcoming Milestones

- [x] **Milestone 1:** Luxury Hero Section Refinement ✅
- [x] **Milestone 2:** Official Brand Identity & Vector Logo Lockup ✅
- [x] **Milestone 3:** "Modern Looks. Timeless Feel." Editorial Campaign Banner ✅
- [x] **Milestone 4:** Multi-Viewport Visual Regression & Quality Assurance ✅
- [x] **Milestone 5:** Phase 3 — Production Next.js Catalog (PLP) Architecture ✅
- [ ] **Milestone 6:** Phase 4 — Product Detail Experience (PDP with image gallery, specs, caliber breakdown)
- [ ] **Milestone 7:** Phase 5 — Instant Search & Autocomplete Overlay
- [ ] **Milestone 8:** Phase 6 — Full Cart Drawer & Checkout Sequence
- [ ] **Milestone 9:** Phase 8 — AI Watch Concierge Integration (Gemini API)

---

## 📜 License

Private Horological Marketplace Project &copy; 2026 WRISTO. All rights reserved.
