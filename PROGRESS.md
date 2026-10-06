# WRISTO — Project Progress & Milestone Tracker

**Brand:** WRISTO  
**Project:** Luxury Watch E-Commerce Web Application  
**Status:** All 8 Full-Stack Backend Modules + Desktop Parity Milestones 1–5 + Production DevOps 100% Complete & Verified.  
**Backend Status:** Java 21 + Spring Boot 3.3+ (103/103 Tests Green) + PostgreSQL Flyway (V1–V11) + Docker + GitHub Actions CI.  
**Total Production Routes:** 61 Statically Pre-rendered SSG & Dynamic Routes.  
**GitHub Remote:** `https://github.com/Gauravkadam-web/WRISTO.git` (Branch: `main`, Latest Push: `ce3d1d3`)  
**Last Updated:** October 2026  

---

## 1. Completed Milestones

### Milestone 1: Luxury Hero Section Refinement ✅
- **Objective:** Recreate the cinematic dark luxury hero section matching the reference design.
- **Achievements:**
  - Integrated high-resolution dark luxury watch on rock backdrop (`assets/hero/hero-watch-dark.png`).
  - Added left-side dark gradient overlay (`rgba(10,10,10,0.95)` to `transparent`) ensuring maximum contrast for editorial typography.
  - Serif headline *"Your Time. Your Style."* with luxury line-height and letter-spacing.
  - Champagne gold primary button *"Explore Collection →"* with hover elevation.
  - Secondary button *"Watch Video"* triggering an interactive luxury video modal with backdrop blur.
  - Editorial pagination indicator (`01 / 03`) and three subtle active carousel dots.
  - Minimalist trust strip integrated below hero without bulky cards.

---

### Milestone 2: Official Brand Identity & Vector Logo Lockup ✅
- **Objective:** Replace plain text WRISTO header with the official brand identity from the design board.
- **Achievements:**
  - Extracted and generated transparent, anti-aliased PNG assets:
    - `assets/brand/logo-horizontal-dark.png`: Ivory wordmark (`#F7F3EC`) + bronze stylized W monogram (`#B08D6B`) + bronze tagline *"YOUR TIME. YOUR STYLE."*.
    - `assets/brand/logo-horizontal-light.png`: Charcoal wordmark (`#1A1A1A`) + bronze monogram for light backgrounds.
  - Implemented responsive logo in the header with zero white bounding boxes.
  - Verified sharp rendering on desktop, tablet, and mobile displays.

---

### Milestone 3: "Modern Looks. Timeless Feel." Editorial Banner Refinement ✅
- **Objective:** Refine the editorial banner section matching the reference design, preserving its original homepage position and contained card structure.
- **Achievements:**
  - **Position Confirmed:** Strictly positioned in its original slot — immediately following **Trending Timepieces** and preceding **Curated Editorial Collections**.
  - **Contained Card Structure:** Styled inside `.container` as `.banner-editorial-card` with `border-radius: 20px`, `border: 1px solid rgba(255,255,255,0.08)`, and a soft depth shadow.
  - **Two-Column Grid Layout:**
    - **Left Column:** Pure `#0E0E0E` background with generous padding, tracked bronze eyebrow `NEW ARRIVALS`, luxury serif headline (`Playfair Display`, 42px), clean description copy, champagne button `Explore Now →`, and bottom-left `01 —— 02 —— 03` indicator.
    - **Right Column:** Photographic watch visual with jacket cuff, clean crop from `assets/banners/banner-modern-looks.png`, seamless `#0E0E0E` seam overlay, and bottom-right `STYLE IN EVERY DETAIL` glassmorphic badge.
  - **Responsive Layout:**
    - Desktop (1440px): 1.15fr / 1fr grid with seamless horizontal transition.
    - Tablet (768px): Proportional spacing and font scaling.
    - Mobile (375px): Vertical stacking (`order: -1` on visual), watch visual isolated at 96% center with 190% zoom so no ghost raster text is visible.

---

### Milestone 4: Multi-Viewport Visual Regression & Quality Assurance ✅
- **Objective:** Verify flawless rendering across screen dimensions using headless Chrome.
- **Verification Outputs (stored in `screenshots/`):**
  - `screenshots/banner_verify_1440.png`: Desktop verification (1440×3000px) — 100% pixel-perfect.
  - `screenshots/banner_verify_768.png`: Tablet verification (768×3600px) — responsive grid and clean alignment.
  - `screenshots/banner_verify_375_clean.png`: Mobile verification (375×4200px) — flawless vertical stacking without cropped text artifacts.

---

### Milestone 5: Phase 3 — Production Next.js Catalog (PLP) Architecture ✅
- **Objective:** Build enterprise-grade, Spring Boot-ready Product Listing Page (`/watches`) in Next.js 16+ App Router.
- **Achievements:**
  - **Decoupled Architecture:** `productService.ts` handles all filtering, search, sorting, and facet counting. Swapping to Spring Boot API requires zero UI component edits.
  - **40-Watch Master Data:** Typed dataset with luxury calibers, specs, ratings, and high-res photography.
  - **Two-Way URL Sync:** All filter selections (`brand`, `movement`, `style`, `maxPrice`, `sort`) sync seamlessly with URL searchParams.
  - **Multi-Viewport Layout:**
    - Desktop (1440px): Sticky left facet rail + 4-column card grid with 3D tilt interaction.
    - Tablet (768px) & Mobile (375px): Desktop sidebar hides cleanly, replaced by luxury `[ ⚙ Filters & Sort ]` trigger opening animated `FilterDrawer` with backdrop blur and body scroll lock.
  - **Verification Outputs (stored in `screenshots/`):**
    - `screenshots/watches_desktop_1440.png`: 1440px desktop catalog view.
    - `screenshots/watches_tablet_768.png`: 768px tablet catalog view.
    - `screenshots/watches_mobile_375.png`: 375px mobile catalog view.

---

### Milestone 6: Phase 4 — Product Detail Experience (PDP) Architecture ✅
- **Objective:** Build enterprise-grade, Spring Boot-ready Product Detail Page (`/product/[id]`) with dynamic SSG, Level 3 3D tilt, zoom gallery, technical horology matrix, AI concierge styling, and mobile sticky thumb purchase bar.
- **Achievements:**
  - **Dynamic Route & SSG Pre-rendering:** Implemented `/product/[id]` with `generateStaticParams()` pre-rendering all 40 watches at build time with dynamic OpenGraph meta tags. Added `/watches/[id]` SEO redirect.
  - **Level 3 3D Tilt Gallery:** Main watch stage features subtle 3D cursor-tracking tilt (`perspective: 1200px`, `rotateX: 1-3deg`, `rotateY: 2-4deg`, spring reset) with vertical thumbnail rail and official WRISTO Authenticity Seal.
  - **Lightbox Macro Inspection:** Click-to-enlarge modal with zoom-in, zoom-out, and reset controls with keyboard `Escape` support.
  - **Content Hierarchy & Indian Pricing:** Serif headline (`Playfair Display`), tracked brand eyebrow, rating verification, INR currency formatting with savings badge (`SAVE ₹X (Y% OFF)`), and tax notes.
  - **AI Style Concierge Insight:** Contextual horological style reasoning card grounded in `product.aiReason`, compatibility score (`98% Style Match`), and occasion chips.
  - **Technical Horology Matrix:** 6-cell tactile specifications grid covering Caliber Movement, Case Diameter, Case Material, Dial & Crystal, Strap & Clasp, and Water Resistance.
  - **Luxury Trust Disclosures:** 4 expandable accordion cards covering 100% Authenticity, Insured Shipping, 30-Day Returns, and 2-Year International Warranty.
  - **Cart & Wishlist Integration:** Stepper (`− 1 +`), `[ Add to Cart ]` with cart drawer slide-over, `[ Buy Now → ]` champagne CTA, and wishlist toggle.
  - **Coordinated Watches:** 4-card companion timepieces grid powered by `getSimilarProducts()`.
  - **Mobile Sticky Purchase Bar:** Fixed thumb-zone bar on viewports `< 768px` revealing on scroll with watch thumbnail, price, and instant Add/Buy buttons.
- **Verification Outputs (stored in `screenshots/`):**
  - `screenshots/pdp_desktop_1440.png`: 1440px desktop PDP view (WRT-001 Atlas Black).
  - `screenshots/pdp_tablet_768.png`: 768px tablet PDP view.
  - `screenshots/pdp_mobile_375.png`: 375px mobile PDP view with stacked action ergonomics.
  - `screenshots/pdp_wrt005_desktop.png`: 1440px desktop PDP view (WRT-005 Regent Green Automatic).

---

### Milestone 7: Phase 5 — Instant Search & Autocomplete Overlay ✅
- **Objective:** Build enterprise-grade, Spring Boot-ready Instant Search modal overlay with keyboard shortcuts (`⌘K` / `Ctrl+K`, `/`, `ESC`), debounced autocomplete suggestions, query highlighting, recent search history persistence, brand pills, empty state recovery, and multi-viewport responsive luxury styling.
- **Achievements:**
  - **Decoupled Search Engine:** Added `getSearchSuggestions(query)` in `productService.ts` returning typed `SearchSuggestionsResult`.
  - **Global Search Context & Shortcuts:** Built `SearchContext.tsx` with `useSearch()`, global `Cmd+K` / `Ctrl+K`, `/`, and `Escape` listeners, with automatic body scroll locking.
  - **Header Trigger & Shortcut Badge:** Replaced static link in `Header.tsx` with interactive `<button>` displaying subtle `⌘K` keyboard badge on desktop viewports.
  - **Search Modal & Subcomponents:** `SearchInput.tsx`, `SearchRecentAndPopular.tsx`, `SearchSuggestionsList.tsx`, `SearchEmptyState.tsx`.
- **Verification Outputs (stored in `screenshots/`):**
  - `screenshots/search_desktop_1440.png`: 1440px desktop idle search modal.
  - `screenshots/search_suggestions_1440.png`: 1440px desktop suggestions with brand match, query highlighting, and prices.
  - `screenshots/search_empty_1440.png`: 1440px desktop empty state with horological recovery guidance.
  - `screenshots/search_mobile_375.png`: 375px mobile idle search modal.
  - `screenshots/search_mobile_suggestions_375.png`: 375px mobile suggestions with vertically stacked price column.

---

### Milestone 8: Typography & Design Token Scale Alignment (Section 3 Parity) ✅
- **Objective:** Eliminate typography divergence from Section 3 of `WRISTO_Design_Tokens_and_Interactions.md`, establish the complete 11-step scale tokens system, retire SaaS `Sora` headings in favor of Swiss editorial `Playfair Display` (`--font-serif`) and commerce `Inter` (`--font-body`), and eliminate all manual inline font style band-aids across TSX components.
- **Achievements:**
  - **11-Step Token Scale System:** Added `--type-display-xl` (64px) to `--type-label` (11px) in `globals.css` with utility classes (`.type-display-xl`, `.type-heading-xl`, etc.).
  - **Authoritative 2-Family Restoration:**
    - `.section-title`, `.pdp-model-title`, `.collection-title`: Migrated to `var(--font-serif)`.
    - `.card-title`, `.drawer-title`, `.footer-heading`: Migrated to `var(--font-body)` (`Inter`).
  - **Eliminated All Inline Band-Aids:** Cleaned up `WatchesClient.tsx`, `page.tsx`, `Hero.tsx`, `ProductCard.tsx`, `CartDrawer.tsx`, and `ProductGrid.tsx`.

---

### Milestone 9: Phase 6 — Full Cart Drawer, Promo Engine & Multi-Step Luxury Checkout Sequence ✅
- **Objective:** Implement end-to-end luxury commerce transaction flow matching Section 40 of `docs/WRISTO_Design_Tokens_and_Interactions.md`.
- **Achievements:**
  - **Decoupled Architecture (`order.ts` & `orderService.ts`):** Complete TypeScript contracts and decoupled service with coupon validation engine (`WRISTO10`, `HOROLOGYVIP`, `FIRST15`), delivery options, PIN code auto-lookup, and order persistence.
  - **Extended Cart Context (`CartContext.tsx`):** Added coupons, gift wrapping toggle, handwritten calligraphy note, auto-recalculating totals with horological gift threshold (Complimentary Leather Travel Pouch at ₹15,000+).
  - **Enhanced Slide-Over Cart Drawer (`CartDrawer.tsx`):** Integrated animated reward progress bar, promo code chip with one-click remove (`✕`), gift wrapping toggle with note textarea, line item quantity steppers (`− 1 +`), and total settlement breakdown.
  - **Distraction-Free Luxury Checkout Route (`/checkout`):**
    - Quieter luxury header (`CheckoutHeader.tsx`): WRISTO emblem + 256-bit SSL Security badge + Concierge helpline.
    - 4-step progressive stepper (`CheckoutStepper.tsx`): 01 Address & Contact → 02 Horological Delivery → 03 Secure Payment → 04 Review & Confirm.
    - Modular step forms: `AddressStep.tsx`, `DeliveryStep.tsx`, `PaymentStep.tsx`, `ReviewStep.tsx`, `OrderSummarySidebar.tsx`.
  - **Authentic Horological Order Confirmation (`/checkout/success`):**
    - Serialized Order ID (`WRT-2026-XXXXX`), Certificate of Provenance ID (`CERT-CHRONO-XXXXX`), itemized receipt, and `[ 🖨️ Print Certificate & Receipt ]` action.

---

### Milestone 10: Phase 7 — Client Account & Provenance Ledger (`/account`) ✅
- **Objective:** Build private client portal displaying collector status, order tracking, address book, and interactive provenance certificates.
- **Achievements:**
  - Built `/account` route (`page.tsx` + `AccountClient.tsx`).
  - Implemented decoupled `accountService.ts` with customer profiles, past orders, and security settings.
  - 5-tab dashboard: Overview, My Orders & Custody, Address Book, Vault Wishlist, Security & Preferences.
  - Built `ProvenanceCertificateModal.tsx`: SVG guilloché security borders, embossed gold holographic seal, collector provenance details, movement caliber serial, and printable format.

---

### Milestone 11: Phase 8 — AI Watch Concierge (`/concierge`) ✅
- **Objective:** Deploy private conversational horological advisor powered by multi-factor semantic matching.
- **Achievements:**
  - Built `/concierge` route (`page.tsx` + `ConciergeClient.tsx`).
  - Interactive multi-turn chat stream with custom horological reasoning engine.
  - Multi-factor scoring against 40 watches (budget, movement, water resistance, occasion, strap style).
  - Structured recommendation cards embedded in conversation with direct PDP links and 3D preview cards.

---

### Milestone 12: Phase 9 — Editorial Journal (`/journal` & `/journal/[slug]`) ✅
- **Objective:** Build Swiss horology editorial journal with deep-dive collector guides and dynamic SSG pre-rendering.
- **Achievements:**
  - Built `/journal` index (`JournalClient.tsx`) with category filters (Collector Guides, Technical Horology, Industry Insights).
  - Built dynamic SSG route `/journal/[slug]` (`generateStaticParams()` pre-rendering all 6 articles).
  - Decoupled `journalService.ts` with rich article data, read times, tags, and horological photography.

---

### Milestone 13: Phase 10 — Launch Hardening, Rich SEO & Dynamic Sitemap ✅
- **Objective:** Enterprise search indexing, structured JSON-LD schemas, fault recovery, and accessibility hardening.
- **Achievements:**
  - Built dynamic `sitemap.ts` pre-rendering 57 indexed URLs (core routes + 40 watches + 6 articles).
  - Configured `robots.ts` with `/checkout` and `/account` crawl protection.
  - Integrated JSON-LD structured schemas (`Organization`, `WebSite`, `Product`, `AggregateRating`, `BreadcrumbList`).
  - Built luxury 404 recovery screen (`not-found.tsx`), global error boundary (`error.tsx`), and skip-to-content links.
  - Committed and pushed to `main` as `eb9b5ad`.

---

### Milestone 14: Desktop Web Parity & Content Audit ✅
- **Objective:** Exhaustive audit comparing reference image boards (`10_28_21 PM.png`, `10_32_53 PM.png`) and `WRISTO_Design_Tokens_and_Interactions.md` against active codebase.
- **Achievements:**
  - Documented 13-panel desktop screen analysis in [`docs/desktop_web_parity_analysis.md`](file:///e:/WRISTO/docs/desktop_web_parity_analysis.md).
  - Identified all missing sections, copywriting discrepancies (TrustStrip, footer, search keywords, account persona), and the omitted Watch Comparison Engine.
  - Created 5-Milestone Desktop Parity Roadmap.

---

### Milestone 15: The Watch Comparison Engine (Desktop Parity Milestone 1) ✅
- **Objective:** Restore the interactive Side-by-Side Horology Matrix from the preview prototype (`js/app.js` lines 1145–1230).
- **Achievements:**
  - Built `ComparisonContext.tsx`: Max 4 watches, localStorage persistence, toast feedback notifications.
  - Built `FloatingComparisonDock.tsx`: Bottom luxury floating tray with thumbnail slots, remove actions, and "Compare Now &rarr;" button.
  - Built `/compare` route (`page.tsx` + `ComparisonClient.tsx`): 9-spec technical matrix comparing Brand, Caliber, Diameter, Material, Strap, Dial, Water Resistance, Style, and Occasions, with Add to Cart / Buy Now per column.
  - Connected `Header.tsx` (scale icon with live badge counter), `ProductCard.tsx` (card hover "Compare" quick action), and `ProductActions.tsx` (PDP secondary toggle).
  - Updated `sitemap.ts` to 58 pages.
  - Tested 100% clean production build (`npm run build` with 0 errors).
  - Committed and pushed to `main` as `8ccebb4`.

---

## 2. Current Architecture & File Manifest

| File / Folder | Role & Status |
|---|---|
| `wristo-next/` | Production Next.js 16+ application (App Router, React 19, TypeScript). |
| `wristo-next/src/app/globals.css` | Master design tokens, 11-step typography scale tokens, responsive rules. |
| `wristo-next/src/context/SearchContext.tsx` | Global search state & shortcut coordinator (`Cmd+K`, `/`, `ESC`). |
| `wristo-next/src/context/CartContext.tsx` | Global cart, coupon engine, gift wrapping, auto-recalculated order totals. |
| `wristo-next/src/context/WishlistContext.tsx` | Global wishlist state with localStorage persistence. |
| `wristo-next/src/context/ComparisonContext.tsx` | Global watch comparison state (max 4 items, localStorage sync). |
| `wristo-next/src/components/comparison/FloatingComparisonDock.tsx` | Bottom floating comparison dock with thumbnail chips & minimize pill. |
| `wristo-next/src/app/compare/` | Dedicated Side-by-Side Horology Matrix route (`page.tsx` + `ComparisonClient.tsx`). |
| `wristo-next/src/app/wishlist/` | Dedicated Standalone Wishlist page route (`page.tsx` + `WishlistClient.tsx`). |
| `wristo-next/src/app/cart/` | Dedicated Standalone Shopping Cart page route (`page.tsx` + `CartPageClient.tsx`). |
| `wristo-next/src/app/brands/` | Curated Brand Houses showcase page route (`page.tsx` + `BrandsClient.tsx`). |
| `wristo-next/src/components/search/` | Complete Phase 5 search overlay suite (`SearchModal`, `SearchInput`, `SearchRecentAndPopular`, `SearchSuggestionsList`, `SearchEmptyState`). |
| `wristo-next/src/app/product/[id]/` | Dynamic SSG Product Detail Page route (`page.tsx` + `ProductDetailClient.tsx`). |
| `wristo-next/src/app/watches/[id]/` | SEO alias redirecting to `/product/[id]`. |
| `wristo-next/src/components/product/` | Modular PDP components (Gallery, Header, Pricing, Variants, Actions, SpecsGrid, AIInsight, TrustAccordions, StickyBar, CoordinatedWatches). |
| `wristo-next/src/app/watches/` | Catalog PLP route (`page.tsx` + `WatchesClient.tsx`). |
| `wristo-next/src/components/catalog/` | Modular catalog UI (Sidebar, Drawer, Grid, Card, ActiveFilterBar, CategoryNav, SortSelect, Pagination, ShopByCategoryList, CircularCategoryChips). |
| `wristo-next/src/app/checkout/` | Dedicated checkout route (`page.tsx` + `CheckoutClient.tsx`). |
| `wristo-next/src/app/checkout/success/` | Order confirmation route (`page.tsx` + `SuccessClient.tsx`). |
| `wristo-next/src/components/checkout/` | Modular checkout components (Header, Stepper, Address, Delivery, Payment, Review, Sidebar). |
| `wristo-next/src/app/account/` | Client Account & Provenance Ledger route (`page.tsx` + `AccountClient.tsx`). |
| `wristo-next/src/components/account/` | ProvenanceCertificateModal (SVG guilloché borders & holographic seal). |
| `wristo-next/src/app/concierge/` | AI Watch Concierge route (`page.tsx` + `ConciergeClient.tsx`). |
| `wristo-next/src/app/journal/` | Editorial Journal index (`page.tsx` + `JournalClient.tsx`). |
| `wristo-next/src/app/journal/[slug]/` | Dynamic SSG Article Reader (`page.tsx`). |
| `wristo-next/src/app/sitemap.ts` | Dynamic XML sitemap generator (58 indexed routes). |
| `wristo-next/src/app/robots.ts` | SEO robots.txt generator. |
| `wristo-next/src/app/not-found.tsx` | Luxury horological 404 recovery screen. |
| `wristo-next/src/app/error.tsx` | Global fault boundary. |
| `wristo-next/src/services/` | Decoupled data contracts (`productService.ts`, `orderService.ts`, `accountService.ts`, `journalService.ts`). |
| `prompts/` | Master Prompts Archive (All 5 major design & implementation prompts + index `README.md`). |
| `docs/backend_architecture_specification.md` | Master Java 21 + Spring Boot 3.3+ + PostgreSQL 16 Architecture & REST API Spec. |
| `docs/WRISTO_Production_Ready_SRS_v1.0.md` | Production Software Requirements Specification (SRS). |
| `docs/desktop_web_parity_analysis.md` | Master Desktop Web Parity & Copywriting Gap Analysis. |
| `screenshots/` | Centralized repository for all visual QA regression captures (35+ screenshots). |
| `index.html` | Vanilla HTML/CSS/JS prototype host. |
| `MEMORY.md` | Core repository memory documenting architectural invariants and design tokens. |
| `PROGRESS.md` | This project tracker and roadmap. |
| `TECHNICALDEBT.md` | Known technical debt and refactoring registry. |

---

## 3. Desktop Parity Roadmap (100% Complete & Verified)

- [x] **Milestone 1: Watch Comparison Engine** ✅ (Committed & Pushed as `8935832`)
  - `ComparisonContext.tsx` (max 4 watches, localStorage persistence, toast feedback).
  - `FloatingComparisonDock.tsx` (floating tray + minimize pill).
  - `/compare` route & `ComparisonClient.tsx` (9-spec technical matrix, Add to Cart / Buy Now).
  - `Header.tsx` comparison counter badge + `ProductCard.tsx` card hover action + `ProductActions.tsx` PDP toggle.
  - Production build: 58/58 static routes compiled cleanly.

- [x] **Milestone 2: Homepage Parity & Section Restoration** ✅ (Committed & Pushed as `2ba36df`)
  - Popular Brands strip (6 brand cards + crown bezel banner: *"Explore Premium Brands. Authentic. Trusted. Always. [ Browse Brands &rarr; ]"*).
  - Curated Occasions section (4 tall lifestyle cards: Formal, Casual, Sports, Luxury with 8K ultra-HD photography + carousel controls `01 < >`).
  - Mobile App promo (`AppPromoSection.tsx` with 3D phone mockup + store badges).
  - From Our Blog (`BlogPreviewSection.tsx` with 3 preview cards linking to `/journal`).
  - Trust Strip copy alignment (`100% Authentic | Brand Warranty`, `Free Shipping | Across India`, `Easy Returns | Within 7 Days`, `Secure | Payments`).

- [x] **Milestone 3: Catalog / PLP Enhancements** ✅ (Committed & Pushed as `d9ef911`)
  - Shop by Category left jump list in sidebar (`ShopByCategoryList.tsx`).
  - Under-header 4 Circular Category Chips (`CircularCategoryChips.tsx` for Analog, Chronograph, Smart, Dress).
  - Distinct bottom card pill badges (`Best Seller`, `Trending`, `Premium`, `New Arrival`, `Limited Edition`).
  - Dynamic category header titles (`Men's Watches`, `Women's Watches`, `All Timepieces`).

- [x] **Milestone 4: Dedicated Standalone Desktop Pages** ✅ (Implemented & Build-Verified)
  - Dedicated `/wishlist` full-page table layout (`WishlistClient.tsx`) with thumbnail, brand, model, price, stock status pill, quick Add to Cart, and remove actions (Panel 8 parity).
  - Dedicated `/cart` 2-column full-page layout (`CartPageClient.tsx`) with specs, quantity steppers, promo code validation, sticky order summary card, and trust guarantees (Panel 9 parity).
  - Dedicated `/brands` curated brand houses showcase page (`BrandsClient.tsx`).
  - Account persona updated in `accountService.ts` to `Gaurav Kadam` (`gauravkadam@gmail.com`, `+91 98765 43210`, Pune, Maharashtra, Grand Complication Patron tier).

- [x] **Milestone 5: Header, Footer & Search Copy Polish** ✅ (Implemented & Build-Verified)
  - Header links updated in `Header.tsx` (`Home | Men | Women | Collections | Brands | Accessories | Journal | AI Concierge`) and rewired Wishlist to `/wishlist`.
  - Footer contact info in `Footer.tsx`: Pune, Maharashtra, `+91 98765 43210`, `support@wristo.com`, social media links, brand tagline *"Your Time. Your Style."*, and payment badges (`VISA`, `Mastercard`, `Maestro`, `UPI`, `Net Banking`).
  - Search modal keywords in `SearchModal.tsx`: `Titan`, `Fastrack`, `Casio`, `Chronograph`, `Smart Watch`, `Automatic`, `AUREN`, `Rose Gold`.
  - Production build: **61/61 static and dynamic routes compiled cleanly with 0 TypeScript/ESLint errors.**

---

## 4. Backend Implementation Roadmap (Java 21 + Spring Boot 3.3+ + PostgreSQL)

- [x] **Phase 1: Foundation, Architecture & Database Setup** ✅ (Implemented, Verified & Pushed)
  - Created `wristo-backend/` project with Spring Boot 3.3.4, Java 21 LTS, and Maven.
  - Configured 100% environment-driven settings with `.env.example` templates at root and backend.
  - Setup Flyway migration engine: `V1__init_core_schema.sql` (brands, categories, watches, watch_specs, users, addresses) & `V2__seed_initial_brands_and_categories.sql`.
  - Implemented modular packages: `common/dto` (`ApiResponse`, `ApiErrorResponse`, `PageResponse`), `common/entity` (`BaseAuditEntity`), `exception` (`GlobalExceptionHandler`, `BusinessException`, `ResourceNotFoundException`), `config` (`SecurityBaseConfig`, `CorsConfig`, `OpenApiConfig`, `JpaConfig`).
  - Implemented health check (`/api/v1/health`) and initial catalog endpoints (`/api/v1/watches`, `/api/v1/brands`, `/api/v1/categories`).
  - Verified 100% test success (5/5 automated unit & integration tests passing in `mvn test`).

- [x] **Phase 2: Authentication, Authorization (JWT) & Seller Onboarding** ✅ (Implemented & Test-Verified)
  - Flyway Migrations: `V3__init_auth_and_seller_schema.sql` (refresh tokens, sellers, seller users, seller documents, seller brand authorizations) & `V4__seed_admin_and_demo_users.sql` (super admin, collector, verified demo seller).
  - Security Core & JWT: `JwtTokenProvider.java` (jjwt 0.12.6, HMAC-SHA256, access + refresh token lifecycle), `JwtAuthenticationEntryPoint.java`, `JwtAuthenticationFilter.java`, `CustomUserDetailsService.java`, `UserPrincipal.java`.
  - Auth Module: `User.java`, `UserAddress.java`, `RefreshToken.java`, `AuthService.java`, `UserService.java`, `AuthController.java` (`/auth/register`, `/auth/login`, `/auth/refresh-token`, `/auth/logout`, `/auth/me`), `UserController.java` (`/user/profile`, `/user/addresses/**`).
  - Seller & RBAC Module: `Seller.java`, `SellerUser.java`, `SellerDocument.java`, `SellerBrandAuthorization.java`, `SellerService.java`, `AdminSellerService.java`, `SellerController.java` (`/seller/onboard`, `/seller/me`, `/seller/staff/**`, `/seller/documents`, `/seller/brand-authorizations`), `AdminSellerController.java` (`/admin/sellers/**` for approval, rejection, and KYC/brand verification).
  - Security Config: Registered `JwtAuthenticationFilter` in filter chain with strict RBAC: `/admin/**` -> `hasRole('ADMIN')`, `/seller/**` -> `hasAnyRole('SELLER', 'SELLER_STAFF', 'ADMIN')`, `/user/**` -> `authenticated()`.
  - Test Suite: **20/20 automated unit and integration tests passing in `mvn test` (100% green)** across `JwtTokenProviderTest`, `AuthControllerTest`, `UserControllerTest`, `SellerControllerTest`, `AdminSellerControllerTest`, `CatalogControllerTest`, `HealthCheckControllerTest`, and `WristoApplicationTests`.
- [x] **Phase 3: Catalog, Seller Listings & Inventory** ✅ (Implemented & 100% Test-Verified)
  - **Flyway Migrations:**
    - `V5__seed_master_40_watches_and_specs.sql`: Canonical dataset of 40 luxury timepieces with full technical horology specs (calibers, power reserves, water resistance, crystal materials, case finishing, complications) synchronized with frontend dataset.
    - `V6__init_seller_listings_and_inventory_schema.sql`: Multi-vendor seller listing schema (`seller_listings`), inventory tracking (`inventories`), inventory movement audit log (`inventory_movements`), and inventory reservation system (`inventory_reservations`).
    - `V7__seed_demo_seller_listings_and_inventory.sql`: Seeded live demo seller listings and stock for verified boutique `seller-auren-in`.
  - **Catalog Module (`/api/v1/watches/**`, `/api/v1/brands`, `/api/v1/categories`):**
    - Multi-facet catalog search with dynamic facet aggregation (`CatalogFacetsResponse` computing live counts for brands, movements, styles, case sizes, and price bounds).
    - Single timepiece endpoint (`/watches/{id}`) with full horology specs (`WatchDetailResponse`).
    - Similar watches recommendation endpoint (`/watches/{id}/similar`).
    - Active seller listings comparison endpoint (`/watches/{id}/listings`).
    - Public brand houses (`/brands`) and categories (`/categories`) listing APIs.
  - **Seller Listing Module (`/api/v1/seller/listings/**`):**
    - Multi-vendor seller listing creation with automatic initial inventory provisioning (`CreateSellerListingRequest`, `SellerListingResponse`).
    - Unique SKU isolation per seller and conflict detection.
    - Seller listing updates (`UpdateSellerListingRequest`) and listing status state machine (`PENDING_APPROVAL`, `ACTIVE`, `INACTIVE`, `SUSPENDED`, `OUT_OF_STOCK`).
  - **Admin Listing Governance (`/api/v1/admin/listings/**`):**
    - Admin listing review, approval, and rejection with audit reasons (`AdminListingApprovalRequest`, `AdminListingService`).
  - **Inventory & Movement Management (`/api/v1/seller/inventory/**`):**
    - Atomic stock adjustments with row-level locking (`PESSIMISTIC_WRITE`) preventing negative inventory or concurrency drift.
    - Movement audit logging (`RESTOCK`, `SALE`, `RESERVATION_HOLD`, `RESERVATION_RELEASE`, `RETURN`, `DAMAGE`, `MANUAL_ADJUSTMENT`).
    - Transactional reservation lifecycle (`reserveStock`, `confirmReservation`, `releaseReservation`) with automatic expiration checks.
  - **Backend Test Suite:** **35/35 automated unit and integration tests passing in `mvn test` (100% green)** across `CatalogControllerTest`, `SellerListingControllerTest`, `AdminListingControllerTest`, `SellerInventoryControllerTest`, `SellerControllerTest`, `AdminSellerControllerTest`, `AuthControllerTest`, `UserControllerTest`, `JwtTokenProviderTest`, `HealthCheckControllerTest`, and `WristoApplicationTests`.
  - **Frontend Verification:** Next.js 16.3.7 Turbopack build verified (**61/61 static & dynamic routes compiled cleanly**).

- [x] **Phase 4: Cart, Wishlist & Comparison Backend Services** ✅ (Implemented & 100% Test-Verified)
  - **Database Migration:** `V8__init_cart_wishlist_coupon_schema.sql` (promotional vouchers `coupons`, persistent `carts`, `cart_items`, client `wishlists`, `wishlist_items`, foreign keys, indices, and seed vouchers: `WRISTO10`, `HOROLOGYVIP`, `FIRST15`, `VAULT20`).
  - **Promotional Coupon Engine (`/api/v1/coupons/**`, `/api/v1/admin/coupons/**`):**
    - Public coupon validation (`/coupons/validate`) computing percentage and fixed discounts against minimum cart thresholds.
    - Public active promotions discovery (`/coupons/active`).
    - Administrative coupon lifecycle management (`/admin/coupons/**` with RBAC `ADMIN` role).
  - **Shopping Cart & Stateless Calculations (`/api/v1/cart/**`):**
    - Dual guest (`X-Session-ID`) and authenticated user cart lifecycle with atomic session merging.
    - Real-time stock validation during add/update (`/cart/items/**`).
    - Promotional coupon application (`/cart/coupon`), luxury gift wrapping with handwritten calligraphy notes (`/cart/gift-options`), and delivery tier configuration (`/cart/delivery-options`).
    - Stateless totals calculation (`/cart/calculate-totals`) computing subtotal, discount, gift wrap fee, White-Glove delivery fee, 18% GST, and complimentary travel pouch threshold.
  - **Collector Vault Wishlist Management (`/api/v1/wishlist/**`):**
    - Authenticated customer wishlist endpoints (`/wishlist`, `/wishlist/items/{watchId}`, `/wishlist/toggle/{watchId}`, `/wishlist/check/{watchId}`).
    - Atomic move-to-cart workflow (`/wishlist/items/{watchId}/move-to-cart`).
  - **9-Axis Horological Comparison Matrix (`/api/v1/compare/**`):**
    - Public comparison matrix engine (`/compare?ids=WRT-001,WRT-002`) validating 2 to 4 watches and returning 9 technical horology dimensions (Movement, Case Diameter, Case Material, Dial Finish, Strap Material, Water Resistance, Power Reserve, Crystal Glass, Warranty Period).
  - **Backend Test Suite:** **56/56 automated unit and integration tests passing in `mvn test` (100% green)** across `CouponControllerTest`, `CartControllerTest`, `WishlistControllerTest`, `ComparisonControllerTest`, `CatalogControllerTest`, `SellerListingControllerTest`, `AdminListingControllerTest`, `SellerInventoryControllerTest`, `SellerControllerTest`, `AdminSellerControllerTest`, `AuthControllerTest`, `UserControllerTest`, `JwtTokenProviderTest`, `HealthCheckControllerTest`, and `WristoApplicationTests`.
  - **Frontend Verification:** Next.js 16.3.7 Turbopack build verified (**61/61 static & dynamic routes compiled cleanly**).

- [x] **Phase 5: Order Processing, Luxury Checkout & Payment Integration** ✅ (Implemented & 100% Test-Verified)
  - **Database Migration:** `V9__init_orders_checkout_payments_schema.sql` (luxury `orders`, `order_items`, `order_status_history`, `payments`, `checkout_sessions`, foreign keys with cascading/set-null constraints, and high-performance indices).
  - **Luxury Checkout State Machine (`/api/v1/checkout/**`):**
    - Multi-step checkout state machine (`/checkout/initiate`, `/checkout/{sessionId}`, `/checkout/{sessionId}/shipping-address`, `/checkout/{sessionId}/delivery-tier`, `/checkout/{sessionId}/payment-method`, `/checkout/{sessionId}/complete`).
    - 15-minute stock hold via `InventoryService` preventing concurrent double-allocation of rare timepieces.
    - Automatic generation of sequential luxury order reference numbers (`WRT-2026-XXXXX`) and cryptographic authenticity certificate identifiers (`CERT-CHRONO-XXXXX`).
    - Seamless cart clearing, payment recording, and reservation resolution upon successful checkout completion.
  - **Customer Order Tracking & History (`/api/v1/orders/**`):**
    - Authenticated collector order history (`/orders/my-orders`) with pagination support.
    - Reference-based and public email-verified order inspection (`/orders/{orderNumber}`).
    - Safe order cancellation (`/orders/{orderNumber}/cancel`) with automatic inventory restock and return movement audit logging.
  - **Admin Boutique Order Moderation (`/api/v1/admin/orders/**`):**
    - Comprehensive admin order listing with multi-status filtering and sorting (`/admin/orders`).
    - Horological order lifecycle progression (`/admin/orders/{orderNumber}/status`) enforcing state machine transitions (`PENDING_PAYMENT` -> `CONFIRMED` -> `PROCESSING_VAULT` -> `DISPATCHED` -> `DELIVERED`).
    - Armored courier tracking assignment and estimated delivery scheduling.
  - **Payment Gateway Adapter & Webhooks (`/api/v1/payments/**`):**
    - Multi-gateway intent initialization (`/payments/create-intent` supporting Razorpay, Stripe, and Mock Sandbox).
    - Cryptographic HMAC-SHA256 signature verification (`/payments/verify`).
    - Asynchronous payment webhook ingestion (`/payments/webhook`) handling payment captured, failed, and refund events.
  - **Backend Test Suite:** **66/66 automated unit and integration tests passing in `mvn test` (100% green)** across `CheckoutControllerTest`, `OrderControllerTest`, `AdminOrderControllerTest`, `PaymentControllerTest`, `CouponControllerTest`, `CartControllerTest`, `WishlistControllerTest`, `ComparisonControllerTest`, `CatalogControllerTest`, `SellerListingControllerTest`, `AdminListingControllerTest`, `SellerInventoryControllerTest`, `SellerControllerTest`, `AdminSellerControllerTest`, `AuthControllerTest`, `UserControllerTest`, `JwtTokenProviderTest`, `HealthCheckControllerTest`, and `WristoApplicationTests`.
  - **Frontend Verification:** Next.js 16.3.7 Turbopack build verified (**61/61 static & dynamic routes compiled cleanly**).

- [x] **Phase 6: Client Account, Provenance Ledger & Certificates** ✅ (Implemented & 100% Test-Verified)
  - **Database Migration:** `V10__init_provenance_ledger_and_certificates_schema.sql` (VIP tiers `collector_profiles`, digital `authenticity_certificates`, immutable chain `provenance_records`, horological service histories `watch_service_records`, foreign keys with cascading constraints, and high-performance indices).
  - **Collector VIP Tier & Profile Management (`/api/v1/account/**`):**
    - Dynamic VIP tier calculation (`STANDARD`, `BRONZE`, `SILVER`, `GOLD`, `PLATINUM`, `VIP_BLACK`) based on accumulated order volume and VIP perks calculation (Dedicated Horologist, Bespoke Concierge, Priority Allocation, Vault Storage).
    - Collector profile retrieval (`/account/profile`) and update (`/account/profile/update`).
    - Collector dashboard summary (`/account/dashboard`) aggregating total portfolio value, active certificates count, recent service events, and VIP progression metrics.
    - Collector addresses book management (`/account/addresses/**`).
  - **Digital Provenance Ledger & Horological Chain of Custody (`/api/v1/provenance/**`):**
    - Chronological provenance audit trail (`/provenance/watch/{watchId}`) detailing full ownership lifecycle (`MANUFACTURE`, `PRIMARY_SALE`, `SECONDARY_SALE`, `SERVICE_EVENT`, `VAULT_TRANSFER`, `INSPECTION`).
    - Horological service history tracking (`/provenance/service-records/watch/{watchId}`) recording certified interventions (`FULL_OVERHAUL`, `POLISHING`, `WATER_RESISTANCE_TEST`, `REGULATION_TIMING`, `STRAP_REPLACEMENT`, `AUTHENTICATION`).
    - Certificate issuance & transfer workflow (`/provenance/certificate/{certificateNumber}/transfer`) transferring custody and creating immutable ledger records.
  - **Public Authenticity Verification & Cryptographic Seals (`/api/v1/provenance/verify/**`):**
    - Public, unauthenticated cryptographic verification endpoint (`/provenance/verify/{certificateNumber}`) accessible via physical QR scan and web lookup.
    - Returns certified provenance status, manufacture timestamp, movement caliber, serial number, digital signature checksum, and current custody status.
  - **Admin & Master Horologist Governance (`/api/v1/admin/provenance/**`):**
    - Certified service record creation (`/admin/provenance/service-records`) recording horological center, master watchmaker name, warranty extension, and diagnostic notes.
    - Certificate status lifecycle management (`/admin/provenance/certificates/{certificateNumber}/status` supporting `ACTIVE`, `TRANSFERRED`, `REVOKED`, `EXPIRED`).
  - **Automated Checkout Issuance:** Seamless integration in `CheckoutService` automatically generating cryptographic authenticity certificates and initial provenance genesis records upon luxury order completion.
  - **Backend Test Suite:** **77/77 automated unit and integration tests passing in `mvn test` (100% green)** across `AccountControllerTest`, `ProvenanceControllerTest`, `CheckoutControllerTest`, `OrderControllerTest`, `AdminOrderControllerTest`, `PaymentControllerTest`, `CouponControllerTest`, `CartControllerTest`, `WishlistControllerTest`, `ComparisonControllerTest`, `CatalogControllerTest`, `SellerListingControllerTest`, `AdminListingControllerTest`, `SellerInventoryControllerTest`, `SellerControllerTest`, `AdminSellerControllerTest`, `AuthControllerTest`, `UserControllerTest`, `JwtTokenProviderTest`, `HealthCheckControllerTest`, and `WristoApplicationTests`.
  - **Frontend Verification:** Next.js 16.3.7 Turbopack build verified (**61/61 static & dynamic routes compiled cleanly**).

- [x] **Phase 7: AI Concierge, Horological Search & Realtime WebSockets** ✅ (Implemented & 100% Test-Verified)
  - **WebSocket STOMP Message Broker (`/ws-wristo`):**
    - Configured `WebSocketConfig.java` with in-memory STOMP broker supporting `/topic` broadcast channels and `/queue` private user destinations.
    - Added SockJS and native WebSocket endpoint `/ws-wristo` with dynamic CORS origin patterns.
    - Implemented `NotificationPublisherService.java` broadcasting live market ticker events (`/topic/market-ticker`), stock level telemetry (`/topic/inventory-updates`), and targeted user order tracking updates (`/user/{userId}/queue/notifications`).
    - Hooked real-time order broadcast into `CheckoutService` state machine.
    - REST fallback endpoint (`/api/v1/notifications/ticker`) for initial UI hydration.
  - **Instant Search & Autocomplete Engine (`/api/v1/search/**`):**
    - High-performance prefix autocomplete (`/search/autocomplete`) matching brand houses, timepiece models, calibers, and category styles with aggregated match counts.
    - Curated trending search queries & popular brands (`/search/popular`).
    - Full-text multi-facet search engine (`/search/query`) over brand, model, dial, material, movement, and description with dynamic facet calculations.
  - **AI Watch Concierge & Horological Advisor (`/api/v1/concierge/**`):**
    - Multi-criteria consultative recommendation engine (`/concierge/recommendations`) scoring watches against occasions, case ergonomics, calibers, budget tiers, and natural language prompts, returning top 3 curated timepieces with compatibility scores (86%–99%) and dynamic editorial reasoning.
    - Conversational Horological Advisor (`/concierge/chat`) integrated with Google Gemini LLM API via `GeminiClient` with an authoritative Swiss horologist system prompt grounded in the 40-watch catalog, accompanied by an intelligent deterministic luxury fallback engine.
    - Prebaked luxury inquiry scenarios discovery (`/concierge/prebaked-inquiries`).
  - **Security & Access Rules:** Configured public access in `SecurityBaseConfig.java` for `/search/**`, `/concierge/**`, `/notifications/**`, and `/ws-wristo/**`.
  - **Backend Test Suite:** **86/86 automated unit and integration tests passing in `mvn test` (100% green)** across `SearchControllerTest`, `ConciergeControllerTest`, `NotificationControllerTest`, `AccountControllerTest`, `ProvenanceControllerTest`, `CheckoutControllerTest`, `OrderControllerTest`, `AdminOrderControllerTest`, `PaymentControllerTest`, `CouponControllerTest`, `CartControllerTest`, `WishlistControllerTest`, `ComparisonControllerTest`, `CatalogControllerTest`, `SellerListingControllerTest`, `AdminListingControllerTest`, `SellerInventoryControllerTest`, `SellerControllerTest`, `AdminSellerControllerTest`, `AuthControllerTest`, `UserControllerTest`, `JwtTokenProviderTest`, `HealthCheckControllerTest`, and `WristoApplicationTests`.
  - **Frontend Verification:** Next.js 16.3.7 Turbopack build verified (**61/61 static & dynamic routes compiled cleanly**).

- [x] **Phase 8: Editorial Journal & Content Management API** ✅ (Implemented & 100% Test-Verified)
  - **Database Migration:** `V11__init_editorial_journal_schema.sql` (curator/author profiles `journal_authors`, structured essays `journal_articles` with unique slug index, 3 seeded master horologists: `Adrien de Beauharnais`, `Kavita Singhania`, `Julian Thorne`, and 6 canonical seeded horology essays).
  - **Public Editorial REST APIs (`/api/v1/journal/**`):**
    - Paginated articles retrieval with category filtering (`/journal/articles`).
    - Hero lead story banner discovery (`/journal/lead`).
    - Deep article reader (`/journal/articles/{slugOrId}`) with structured JSON content sections, author bios, automatic view counter increment, and companion watch catalog resolution.
    - Category count aggregations (`/journal/categories`), popular tags extraction (`/journal/tags`), and slug discovery (`/journal/slugs`).
  - **Admin Editorial CMS (`/api/v1/admin/journal/**`):**
    - Full CRUD lifecycle management for horological articles and author profiles with RBAC protection (`ADMIN`, `SUPER_ADMIN`).
    - Lead story election (`/admin/journal/articles/{id}/lead`) promoting selected essay and demoting previous lead story.
    - Dynamic draft/published state toggling (`/admin/journal/articles/{id}/publish`).
  - **Backend Test Suite:** **103/103 automated unit and integration tests passing in `mvn test` (100% green)** across `JournalControllerTest`, `AdminJournalControllerTest`, `SearchControllerTest`, `ConciergeControllerTest`, `NotificationControllerTest`, `AccountControllerTest`, `ProvenanceControllerTest`, `CheckoutControllerTest`, `OrderControllerTest`, `AdminOrderControllerTest`, `PaymentControllerTest`, `CouponControllerTest`, `CartControllerTest`, `WishlistControllerTest`, `ComparisonControllerTest`, `CatalogControllerTest`, `SellerListingControllerTest`, `AdminListingControllerTest`, `SellerInventoryControllerTest`, `SellerControllerTest`, `AdminSellerControllerTest`, `AuthControllerTest`, `UserControllerTest`, `JwtTokenProviderTest`, `HealthCheckControllerTest`, and `WristoApplicationTests`.
  - **Frontend Verification:** Next.js 16.3.7 Turbopack build verified (**61/61 static & dynamic routes compiled cleanly**).

- [x] **Phase 9: Production Containerization, CI/CD & Cloud Deployment** ✅ (Implemented & 100% Verified)
  - **Backend Dockerfile:** Multi-stage `eclipse-temurin:21-alpine` container with non-root user `wristo` and memory-optimized container JVM options (`-XX:MaxRAMPercentage=75.0`).
  - **Frontend Dockerfile:** Multi-stage `node:20-alpine` standalone runner with minimal image size and non-root user `nextjs`.
  - **Docker Compose Orchestration:** Root `docker-compose.yml` defining automated services for PostgreSQL 16 Alpine, Spring Boot 3.3.4 Backend, and Next.js 16+ Frontend with automatic health checks and persistent storage volumes.
  - **GitHub Actions CI/CD Pipeline:** Automated `.github/workflows/ci.yml` running backend test suite (`mvn clean test`) and frontend production bundle validation (`npm run build`) on every push to `main`.
  - **Cloud Production Architecture (Render Web Service + Supabase PostgreSQL Pooler):**
    - Configured Render Web Service environment mappings to Spring Boot 3.3.4 `application.yml` and Next.js 16+ frontend.
    - Resolved Supabase multi-tenant connection pooler routing requirements (`DB_USERNAME=postgres.<project-ref>`, `DB_PORT=6543`, `DB_NAME=postgres`).
    - Aligned strict PostgreSQL foreign key constraints across Flyway migrations: `V9` (`order_items.seller_listing_id` -> `UUID`) and `V10` (`collector_profiles.user_id`, `authenticity_certificates.user_id`, `provenance_records.current_user_id` -> `UUID`, `watch_id` -> `VARCHAR(32)`).
    - Verified **103/103 automated tests passing (100% green)** in `mvn clean test` and pushed to `main` as `ce3d1d3`.

---

## 5. Master Frontend Enhancement, Alignment & GSAP 3D Animation Roadmap

- [x] **Phase 1: Visual Alignment, Admin CRM Refinement & Currency Standardization** ✅ (Implemented & 100% Build Verified)
  - **Admin Currency Standardization (USD $ ➔ INR ₹):** Standardize `formatCurrency()` to `en-IN` / `currency: 'INR'` (`₹`) across `/admin`, `/admin/orders`, `/admin/coupons`, `/admin/listings`, `OrderStatusModal`, and `ListingApprovalModal`.
  - **Strict Zero-Emoji Icon Standardization:** Replace `DollarSign` with `IndianRupee` in `admin/page.tsx` and `coupons/page.tsx`. Ensure strictly 100% vector Lucide Icons (`lucide-react`) across all components (zero unicode emojis).
  - **Table Alignments & Tabular Numerics:** Apply `.tabular-nums` (`font-variant-numeric: tabular-nums`) to all prices, dimensions, order serials (`WRT-2026-XXXXX`), and certificate IDs (`CERT-CHRONO-XXXXX`). Right-align monetary amount columns in admin tables.
  - **Admin Modal Ergonomics:** Fix GST/PAN certificate aspect ratio in `SellerReviewModal.tsx` (`max-height: 480px; object-fit: contain;`) with zoom inspection, and add 60vh scroll container for long essays in `ArticleEditorModal.tsx`.
  - **Storefront Alignment & Contrast:** Deepen bottom card scrim overlay in `OccasionSection.tsx` for 100% text legibility, refactor `TrustStrip.tsx` mobile layout to clean elevated flex cards, normalize `PopularBrands.tsx` logo dimensions (`max-height: 28px`), and stabilize `ActiveFilterBar.tsx` height to eliminate grid shifts.
  - **Gate Checkpoint:** 100% build-verified (`npm run build`), presented to Gaurav Bhau for visual inspection before moving to Phase 2.

- [ ] **Phase 2: GSAP Hero Scroll-Controlled 240-Frame Interactive Canvas Animation** (Planned)
  - **Asset Pipeline:** Copy 240 high-DPI frames (`docs/wristo_scroll_frames_30fps/frame_0001.jpg` to `frame_0240.jpg`) to `wristo-next/public/assets/hero-frames/`.
  - **Interactive Canvas Component (`ScrollCanvasHero.tsx`):** Single high-DPI HTML5 Canvas (1280x720 scaled by DPR capped at 2) scrubbed by GSAP 3.15 `ScrollTrigger` (`scrub: 0.6`, `ease: "none"`).
  - **Zero-Flash & Buffer Strategy:** Instant frame 0001 render + asynchronous background image buffer with hairline gold loading progress bar.
  - **Preserved Design:** Maintain existing serif typography, dark typographic left gradient, champagne buttons, and 4K video modal trigger intact.
  - **Gate Checkpoint:** Smooth 60fps canvas scrubbing verified by Gaurav Bhau before Phase 3.

- [ ] **Phase 3: Interactive 3D Watch Stage, Provenance Guilloché Draw & Admin Telemetry** (Planned)
  - **PDP 360° Drag-to-Rotate Stage:** Interactive mouse-drag / touch-swipe 3D watch turntable with dynamic sapphire crystal glint in `ProductGallery.tsx`.
  - **Exploded Caliber Micro-Animation:** Z-axis layer separation for skeleton calibers (`WRT-004`, `WRT-008`, `WRT-016`) via `ExplodedCaliberModal.tsx` (using Lucide `<Layers size={14} />`).
  - **Provenance Certificate SVG Guilloché Draw:** Real-time SVG `strokeDashoffset` path drawing animation (0.8s) + gold holographic seal stamp impact (`scale: 1.8 -> 1.0`, `back.out(1.7)`) in `CertificateModal.tsx`.
  - **Watch Comparison Matrix 3D Floating Showcase:** Synchronized gyro-tilt floating cards and physical dimension scaling highlights on `/compare`.
  - **Admin CRM Telemetry Counter Roll-Up:** GSAP `roundProps` number roll-up for Gross Revenue, Orders, Listings, and Certificates on dashboard load.
  - **Global ScrollTrigger Stagger Reveals:** Luxury card reveals on `/watches` and occasion collections.



