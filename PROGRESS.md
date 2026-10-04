# WRISTO — Project Progress & Milestone Tracker

**Brand:** WRISTO  
**Project:** Luxury Watch E-Commerce Web Application  
**Status:** All Core Phases 1–10 Complete + All Desktop Parity Milestones 1–5 100% Complete & Verified.  
**Active Target:** Java 21 + Spring Boot 3.3+ Backend Integration (`docs/backend_architecture_specification.md`).  
**Total Production Routes:** 61 Statically Pre-rendered SSG & Dynamic Routes.  
**GitHub Remote:** `https://github.com/Gauravkadam-web/WRISTO.git` (Branch: `main`)  
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
  - Frontend Verification: Next.js 16.3.7 Turbopack build verified (**61/61 static & dynamic routes compiled cleanly**).

