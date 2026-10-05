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
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) (Strict Mode) & [Java 21 LTS](https://openjdk.org/) |
| **Backend Framework** | [Spring Boot 3.3.4](https://spring.io/projects/spring-boot) (Spring Security, Spring Data JPA, Actuator) |
| **Database & Migration** | PostgreSQL 16 + [Flyway](https://flywaydb.org/) (Migrations V1 through V11) |
| **AI Horology Concierge** | Google Gemini API + Live Catalog Tool-Calling & Deterministic Fallback |
| **Realtime Messaging** | Spring STOMP / SockJS WebSockets (`/ws-wristo`) |
| **DevOps & Containers** | Multi-stage Docker, Docker Compose, GitHub Actions CI/CD |
| **Styling** | Vanilla CSS3 Custom Design Tokens (11-step typography scale tokens, HSL luxury palettes) |
| **Testing** | JUnit 5 + MockMvc + H2 (103/103 tests green), Next.js Standalone Build (61/61 routes) |

---

## 📂 Repository Structure

```
WRISTO/
├── .github/workflows/ci.yml                     # GitHub Actions CI/CD Pipeline (Backend & Frontend)
├── docker-compose.yml                           # Local 1-command orchestration (PostgreSQL + Backend + Frontend)
├── wristo-backend/                              # Production Java 21 LTS + Spring Boot 3.3+ Backend
│   ├── Dockerfile                               # Multi-stage Eclipse Temurin 21 production container
│   ├── src/main/java/com/wristo/                # Modular Monolith Architecture (17 domain packages)
│   ├── src/main/resources/db/migration/         # Flyway Migrations (V1 to V11)
│   ├── src/test/                                # 103 Unit & MockMvc Integration Tests (100% Passing)
│   └── pom.xml                                  # Maven dependencies
├── wristo-next/                                 # Production Next.js 16+ Web Application
│   ├── Dockerfile                               # Multi-stage Node 20 standalone container
│   ├── src/app/                                 # App Router (61 SSG & Dynamic routes)
│   ├── src/components/                          # Modular UI components (catalog, home, product, search, etc.)
│   ├── src/services/                            # Decoupled service contracts
│   ├── package.json                             # Dependencies
│   └── tsconfig.json                            # Strict TypeScript Configuration
├── docs/                                        # Master specifications, SRS, parity analysis
│   ├── WRISTO_Production_Ready_SRS_v1.0.md
│   └── backend_architecture_specification.md
├── MEMORY.md                                    # Repository architectural memory & design invariants
├── PROGRESS.md                                  # Milestones & roadmap tracking
├── TECHNICALDEBT.md                             # Technical debt registry & resolution plans
└── README.md                                    # Master project documentation
```

---

## 🏁 Quickstart & Local Development

### Option 1: Single-Command Docker Compose (Full-Stack)
```bash
# Starts PostgreSQL 16, Spring Boot Backend (8080), and Next.js Frontend (3000)
docker compose up --build
```

### Option 2: Running Backend & Frontend Locally

#### 1. Backend (Java 21 + Maven + PostgreSQL)
```bash
cd wristo-backend
mvn spring-boot:run
# Swagger UI available at: http://localhost:8080/swagger-ui/index.html
# Health check available at: http://localhost:8080/actuator/health
```

#### 2. Frontend (Next.js 16+)
```bash
cd wristo-next
npm install
npm run dev
# Web application available at: http://localhost:3000
```

### Option 3: Automated Test Suites
```bash
# Backend Test Suite (103 tests)
cd wristo-backend
mvn clean test

# Frontend Production Build (61 routes)
cd wristo-next
npm run build
```

---

## 🗺️ Completed Milestones & Backend Architecture (100% Complete)

### Backend Modular Monolith Phases (Flyway V1–V11)
- [x] **Phase 1:** Foundation, Architecture, Flyway V1/V2, Global Exception Handling, Base DTOs ✅
- [x] **Phase 2:** Authentication & RBAC (JJWT 0.12.6, BCrypt), User Profiles, Seller Onboarding ✅
- [x] **Phase 3:** 40 Master Watches, Multi-Vendor Listings, PESSIMISTIC_WRITE Atomic Inventory Locking ✅
- [x] **Phase 4:** Persistent Cart, Promotional Coupon Engine, Wishlist, 9-Axis Comparison Matrix ✅
- [x] **Phase 5:** Luxury Checkout State Machine, 15m Stock Hold, Order Splitting, Multi-Gateway Payments ✅
- [x] **Phase 6:** Cryptographic Digital Authenticity Certificates, Guilloché Rosette, Provenance Ledger, VIP Account ✅
- [x] **Phase 7:** AI Watch Concierge (Gemini API), Multi-Field Search Tokenizer, STOMP WebSockets (`/ws-wristo`) ✅
- [x] **Phase 8:** Editorial Journal Public APIs, Admin CMS CRUD, Author Profiles, Lead Story Election ✅
- [x] **Phase 9 (DevOps):** Multi-Stage Dockerfiles, `docker-compose.yml`, GitHub Actions CI/CD Pipeline (`ci.yml`) ✅

---

## 📜 License

Private Horological Marketplace Project &copy; 2026 WRISTO. All rights reserved.
