# WRISTO — Repository Memory & Architectural Knowledge

**Brand:** WRISTO  
**Tagline:** Your Time. Your Style.  
**Platform:** Ultra-Luxury Multi-Brand Watch E-Commerce Experience  
**Core Technologies:** Next.js 16+ (App Router, Turbopack, React 19, TypeScript), Vanilla CSS Custom Tokens, Decoupled Service Architecture (Spring Boot-Ready)  
**Total Production Routes:** 69 Statically Pre-rendered SSG Routes (40 Watches + 6 Journal Articles + Standalone Wishlist, Cart, Brands & Core Pages)  
**GitHub Remote:** `https://github.com/Gauravkadam-web/WRISTO.git` (Branch: `main`, Latest Push: `ce3d1d3`)  
**Last Updated:** October 7, 2026  

---

## 1. Architectural Philosophy & Strategy

WRISTO is designed as an ultra-luxury editorial watch boutique — pairing the aesthetic caliber of Swiss horological publications (*A Collected Man*, *Hodinkee*, *Revolution Magazine*) with instantaneous client-side performance and responsive fluidity across mobile, tablet, and ultra-wide desktop.

### Core Architectural Invariants:
1. **Decoupled Service Contracts:** *"Presentation should not know where content comes from."* All catalog, filtering, search, orders, accounts, and journal operations pass through decoupled services in `src/services/` (`productService.ts`, `orderService.ts`, `accountService.ts`, `journalService.ts`). Swapping from client mock data to Java + Spring Boot REST APIs requires zero UI component edits.
2. **Photography-First Contrast:** Dark, cinematic horological surfaces contrasted against warm, tactile ivory/paper backgrounds (`#F7F3EC`, `#FFFDF9`).
3. **No Unrequested Layout Shifts:** Section ordering and component hierarchy must strictly respect established positioning.
4. **URL-First State Synchronization:** All catalog filter selections (`brand`, `movement`, `style`, `maxPrice`, `sort`, `q`) synchronize 2-way with Next.js `searchParams` (`/watches?brand=AUREN&movement=Automatic`).
5. **Desktop Web Parity Scope:** Desktop web experience (1440px and responsive desktop) is the primary target baseline following `ref_images/` boards. Mobile native app and PWA are deferred per explicit user guidance.
6. **Explicit Permission for Git Commits & Pushes:** NEVER execute `git commit` or `git push` without obtaining explicit prior confirmation from the user. Always present changes/diffs and ask for approval first.
7. **User Greeting Protocol:** Always greet the user as **"Gaurav Bhau"** at the start of every response/conversation.
8. **Strict .env Privacy Invariant:** NEVER access, view, read, print, or expose the user's private `.env` file under any circumstance. Always inspect `.env.example` instead.
9. **Zero Hardcoded Secrets:** All API keys, database credentials, JWT secrets, payment gateway keys (Razorpay, Stripe) must be 100% environment-driven via `application.yml` and `process.env`.
10. **Strict Zero-Emoji Invariant:** Strictly NEVER use Unicode emojis anywhere in the storefront or admin UI (buttons, badges, labels, modals, tables, headings). All iconography must be 100% vector-based via Lucide Icons (`lucide-react`) or clean inline SVGs with `strokeWidth={1.5}`.
11. **Sequential Verification Protocol:** All major upgrades follow a strict 3-phase execution order where each phase must be presented and verified by Gaurav Bhau before starting the next.

---

## 2. Repository Structure & Workspace Layout

```
WRISTO/
├── wristo-backend/                              # Production Java 21 LTS + Spring Boot 3.3+ Backend
│   ├── src/main/java/com/wristo/                # Modular Monolith Architecture (common, config, exception, modules)
│   ├── src/main/resources/                      # application.yml, application-dev.yml, db/migration (Flyway V1, V2)
│   ├── src/test/                                # JUnit 5 + MockMvc + H2 Integration Test Suite (100% Passing)
│   ├── pom.xml                                  # Maven dependencies (Web, Data JPA, Security, Actuator, Flyway, OpenAPI 3)
│   └── .env.example                             # Environment variables template for database, JWT & CORS
├── wristo-next/                                 # Production Next.js 16+ Application
│   ├── src/
│   │   ├── app/                                 # App Router (61 SSG & Dynamic routes)
│   │   │   ├── layout.tsx                       # Root Layout (Fonts, Cart/Wishlist/Comparison/Search Providers)
│   │   │   ├── globals.css                      # Master Design Tokens, 11-step typography scale, responsive rules
│   │   │   ├── page.tsx                         # Home / Discover Page
│   │   │   ├── wishlist/                        # Dedicated Standalone Wishlist Page (/wishlist)
│   │   │   ├── cart/                            # Dedicated Standalone Shopping Cart Page (/cart)
│   │   │   ├── brands/                          # Curated Brand Houses Showcase Page (/brands)
│   │   │   ├── watches/                         # Catalog PLP Route (/watches)
│   │   │   │   ├── page.tsx                     # Server Component with Suspense & Metadata
│   │   │   │   └── WatchesClient.tsx            # Client State Shell (URL Sync, Filters, Grid)
│   │   │   ├── product/[id]/                    # Dynamic SSG Product Detail Pages (/product/WRT-001)
│   │   │   │   ├── page.tsx                     # SSG generateStaticParams() for all 40 watches
│   │   │   │   └── ProductDetailClient.tsx      # PDP Client Shell
│   │   │   ├── watches/[id]/                    # Server-side 308 permanent redirect to /product/[id]
│   │   │   ├── compare/                         # Watch Comparison Matrix Route (/compare)
│   │   │   │   ├── page.tsx                     # Comparison Metadata & Server Shell
│   │   │   │   └── ComparisonClient.tsx         # 9-Spec Side-by-Side Comparison Table
│   │   │   ├── checkout/                        # Distraction-Free Multi-Step Checkout (/checkout)
│   │   │   │   ├── page.tsx                     # Checkout Page Shell
│   │   │   │   ├── CheckoutClient.tsx           # 4-Step Stepper & Summary Coordinator
│   │   │   │   └── success/                     # Order Confirmation & Provenance Certificate (/checkout/success)
│   │   │   ├── account/                         # Client Account & Provenance Ledger (/account)
│   │   │   │   ├── page.tsx                     # Account Metadata Shell
│   │   │   │   └── AccountClient.tsx            # 5-Tab Collector Dashboard & Certificate Modal
│   │   │   ├── concierge/                       # AI Watch Concierge (/concierge)
│   │   │   │   ├── page.tsx                     # Concierge Metadata Shell
│   │   │   │   └── ConciergeClient.tsx          # Multi-turn Horological Advisor & Recommender
│   │   │   ├── journal/                         # Editorial Journal (/journal)
│   │   │   │   ├── page.tsx                     # Journal Index Shell
│   │   │   │   ├── JournalClient.tsx            # 6 Curated Horological Articles Grid
│   │   │   │   └── [slug]/                      # Dynamic SSG Article Reader (/journal/[slug])
│   │   │   ├── not-found.tsx                    # Luxury 404 Recovery Screen
│   │   │   ├── error.tsx                        # Global Fault Boundary
│   │   │   ├── robots.ts                        # SEO robots.txt Generator
│   │   │   └── sitemap.ts                       # Dynamic XML Sitemap (58 indexed routes)
│   │   ├── components/
│   │   │   ├── layout/                          # Header (Scale icon, ⌘K, Cart, Wishlist), Footer, CartDrawer
│   │   │   ├── home/                            # Hero, TrustStrip, EditorialBanner, PopularBrands, CuratedOccasions, AppPromo, BlogPreview
│   │   │   ├── catalog/                         # CategoryNav, FilterSidebar, FilterDrawer, ProductCard,
│   │   │   │                                    # ProductGrid, ActiveFilterBar, SortSelect, Pagination, ShopByCategoryList, CircularCategoryChips
│   │   │   ├── product/                         # Gallery (3D Tilt), Header, Pricing, Variants, Actions,
│   │   │   │                                    # SpecsGrid, AIInsight, TrustAccordions, StickyBar, CoordinatedWatches
│   │   │   ├── comparison/                      # FloatingComparisonDock (Tray & Minimize Pill)
│   │   │   ├── search/                          # SearchModal, SearchInput, SearchRecentAndPopular,
│   │   │   │                                    # SearchSuggestionsList, SearchEmptyState
│   │   │   ├── checkout/                        # CheckoutHeader, CheckoutStepper, AddressStep,
│   │   │   │                                    # DeliveryStep, PaymentStep, ReviewStep, OrderSummarySidebar
│   │   │   └── account/                         # ProvenanceCertificateModal (Guilloché borders & holographic seal)
│   │   ├── context/                             # CartContext, WishlistContext, SearchContext, ComparisonContext
│   │   ├── data/                                # 40-Watch Master Dataset, Brands, Categories, Collections
│   │   ├── services/                            # productService.ts, orderService.ts, accountService.ts, journalService.ts
│   │   └── types/                               # product.ts, filter.ts, order.ts, account.ts, journal.ts
│   ├── public/assets/                           # 40 Watch Images, Brand Logos, Editorial Banners, SVG Seals
│   ├── package.json                             # Next.js 16+, React 19, TypeScript
│   └── tsconfig.json                            # Strict TypeScript Configuration
├── prompts/                                     # Master Prompts Archive (All major engineering & design prompts)
│   ├── README.md                                # Prompts Directory Index & Catalog
│   ├── 01_master_architecture_and_brand_system.md
│   ├── 02_core_commerce_phases_1_to_10.md
│   ├── 03_desktop_parity_roadmap_milestones_1_to_5.md
│   ├── 04_backend_architecture_and_spring_boot_spec.md
│   └── 05_gsap_scroll_scrubbed_watch_animation.md
├── assets/                                      # Original Raw Image & Brand Assets
├── css/                                         # Original Vanilla CSS Reference Stylesheet
├── js/                                          # Original Vanilla JS Prototype Scripts (app.js, products.js)
├── docs/                                        # Master Specifications, Architecture Docs & Summaries
│   ├── WRISTO_MASTER_DEVELOPMENT_PROMPT.md      # Foundational Design Prompt
│   ├── WRISTO_Design_Tokens_and_Interactions.md # Master 41-Section Design System
│   ├── WRISTO_Production_Ready_SRS_v1.0.md      # Full Software Requirements Specification (SRS)
│   ├── backend_architecture_specification.md    # Java 21 + Spring Boot 3.3+ Architecture & API Spec
│   ├── desktop_web_parity_analysis.md           # 13-Panel Reference Audit & Copywriting Mismatches
│   └── session_summary.md                       # Comprehensive Session Changelog (Sessions 1–8)
├── screenshots/                                 # Centralized Multi-Viewport QA Regression Captures (.gitignored)
├── MEMORY.md                                    # Repository Architectural Memory (This File)
├── PROGRESS.md                                  # Milestones & Roadmap Tracker
├── TECHNICALDEBT.md                             # Known Technical Debt & Future Refactoring Plan
├── README.md                                    # Project Overview & Local Setup
└── .gitignore                                   # Production Clean Ignore Rules
```

---

## 3. Global Homepage Section Order & Invariants

```
┌────────────────────────────────────────────────────────┐
│ 1. Header (Sticky, Glassmorphic / Dark Adaptive)       │
│    - Official WRISTO Horizontal Logo (Transparent PNG) │
│    - Navigation Links, Search (⌘K), Wishlist,          │
│      Comparison Counter, Cart Counter                  │
├────────────────────────────────────────────────────────┤
│ 2. Hero Section (Cinematic Dark Horology)              │
│    - Focal Watch on Rock Backdrop (Right)              │
│    - Dark Gradient Left for Typographic Legibility     │
│    - Serif "Your Time. Your Style." + Champagne CTA    │
│    - Interactive Video Modal Trigger                   │
├────────────────────────────────────────────────────────┤
│ 3. Luxury Trust Strip (Minimalist, Non-Carded)         │
│    - 100% Authentic | Free Shipping | Returns | Secure │
├────────────────────────────────────────────────────────┤
│ 4. Popular Brands Strip (Milestone 2 Target)           │
│    - 6 Brand Cards + Crown Bezel Banner                │
├────────────────────────────────────────────────────────┤
│ 5. Trending Timepieces (Curated 8-Watch Catalog Grid)  │
│    - Best Sellers, Editorial Picks, Automatic calibers │
├────────────────────────────────────────────────────────┤
│ 6. Curated Occasions (Milestone 2 Target)              │
│    - 4 Tall Cards: Formal, Casual, Sports, Luxury      │
├────────────────────────────────────────────────────────┤
│ 7. Editorial Campaign Banner ("Modern Looks")          │
│    - Contained Card Structure (.container)             │
│    - 2-Column: Left Editorial Text / Right Photo Visual│
│    - "NEW ARRIVALS" + "Modern Looks. Timeless Feel."   │
│    - "Explore Now →" Champagne CTA                     │
│    - 01 —— 02 —— 03 Carousel Indicator                │
│    - "STYLE IN EVERY DETAIL" Glassmorphic Badge        │
├────────────────────────────────────────────────────────┤
│ 8. Mobile App Promotion (Milestone 2 Target)           │
│    - 3D Smartphone Frame + App Store / Play Badges     │
├────────────────────────────────────────────────────────┤
│ 9. From Our Blog / Journal (Milestone 2 Target)        │
│    - 3 Editorial Story Cards linking to /journal       │
├────────────────────────────────────────────────────────┤
│ 10. Global Footer (Brand Identity, Directory, Legal)   │
│    - Pune Address, Contact Info, Socials, Payments     │
└────────────────────────────────────────────────────────┘
```

> [!IMPORTANT]
> **Position Invariant for "Modern Looks. Timeless Feel."**:  
> Strictly positioned inside `.container` following Trending Timepieces and Curated Occasions. Designed as a contained card, never a full-bleed window.

---

## 4. Phase 3: Catalog (PLP) Architecture & Responsive Behavior

### Responsive Layout Strategy:
* **Desktop (≥1024px):**
  * `.filter-sidebar`: Left sticky facet rail (width: 270px) displaying live facet counts for Brands, Calibers, Styles, Diameters, and Straps.
  * `.product-grid`: 4-column responsive grid with interactive 3D mouse tilt cards, instant wishlist toggles, and hover comparison quick-actions.
  * `.mobile-filter-trigger`: Hidden (`display: none !important`).
* **Tablet (768px - 1023px):**
  * `.filter-sidebar`: Hidden (`display: none !important`).
  * `.mobile-filter-trigger`: Displayed (`display: inline-flex !important`).
  * `.product-grid`: 2-column luxury card layout.
* **Mobile (<768px):**
  * `.filter-sidebar`: Hidden.
  * `.mobile-filter-trigger`: Prominent luxury button next to total piece count.
  * Tapping trigger opens `.mobile-filter-drawer-overlay` with backdrop blur, sliding in the 380px drawer sheet with body scroll lock.
  * `.mobile-bottom-nav`: 5-destination bottom navigation bar for quick thumb reach.

---

## 5. Phase 4: Product Detail Experience (PDP) Architecture

### Route & Pre-rendering Strategy:
* **Route:** `/product/[id]` with `generateStaticParams()` pre-rendering all 40 watches statically for instantaneous TTFB.
* **SEO Redirect:** `/watches/[id]` server-side redirecting to `/product/[id]`.
* **Dynamic OpenGraph Metadata:** Title, description, and high-res imagery generated dynamically via `generateMetadata()`.

### Layout & Component Architecture:
* **Interactive 3D Stage (`ProductGallery.tsx`):** Level 3 depth tracking cursor (`perspective: 1200px`, `rotateX: 1-3deg`, `rotateY: 2-4deg`, `scale: 1.01`, spring reset on leave). Vertical thumbnail rail with official authenticity seal.
* **Macro Lightbox Modal:** Click-to-enlarge modal with zoom-in, zoom-out, and reset controls with keyboard `Escape` dismissal.
* **Content Hierarchy (`ProductHeader.tsx` & `ProductPricing.tsx`):** Serif title (`Playfair Display`), tracked brand eyebrow, rating verification, INR currency formatting with savings badge (`SAVE ₹X (Y% OFF)`), and tax notes.
* **AI Style Concierge Insight (`AIConciergeInsight.tsx`):** Distinctive ivory card with gold accent bar grounded in `product.aiReason`, compatibility score (`98% Style Match`), and occasion chips.
* **Technical Horology Matrix (`ProductSpecsGrid.tsx`):** 6-cell tactile grid (Caliber Movement, Case Diameter, Case Material, Dial & Finish, Strap & Clasp, Water Resistance).
* **Luxury Trust Disclosures (`ProductTrustAccordions.tsx`):** 4 expandable accordions for Authenticity, Insured Shipping, 30-Day Returns, and 2-Year International Warranty.
* **Purchase Actions (`ProductActions.tsx`):** Quantity stepper, `[ Add to Cart ]` with cart drawer slide-over, `[ Buy Now → ]` champagne CTA, wishlist toggle, and `"Compare Specs"` matrix action.
* **Coordinated Timepieces (`CoordinatedWatches.tsx`):** 4-card companion timepieces grid powered by `getSimilarProducts()`.
* **Mobile Sticky Purchase Bar (`StickyMobilePurchaseBar.tsx`):** Fixed bottom bar on viewports `< 768px` revealing on scroll with watch thumbnail, price, and instant Add/Buy buttons.

---

## 6. Phase 5: Instant Search & Autocomplete Overlay Architecture

### State & Context Management:
* **`SearchContext.tsx` (`useSearch()`):** Coordinates global search overlay state. Handles keyboard shortcuts (`Cmd+K`/`Ctrl+K`, `/`, and `Escape`), outside backdrop dismissal, and automatic body scroll locking when active.
* **Header Integration:** Header search icon transformed into interactive button displaying a discrete `⌘K` badge on desktop.

### Modal & Component Suite (`wristo-next/src/components/search/`):
* **`SearchModal.tsx`:** Primary overlay container. Manages query debounce (150ms), keyboard navigation index, and persistence of recent searches in `localStorage` (`wristo_recent_searches`).
* **`SearchInput.tsx`:** Auto-focus search input with gold magnifying glass, quick clear `✕`, and `ESC` key pill badge.
* **`SearchRecentAndPopular.tsx`:** Idle state displaying recently searched queries with per-item remove and clear all history, trending horology queries, and curated trending timepiece cards.
* **`SearchSuggestionsList.tsx`:** Matching brand pills with piece counts, suggested timepieces with query highlighting in gold, horology specs, INR pricing, discount indicators, arrow key (`↑`/`↓`) navigation, and "View all in catalog" footer link.
* **`SearchEmptyState.tsx`:** Graceful empty state with horological recovery guidance and clickable fallback chips.

---

## 7. Phase 6: Checkout & Order Architecture

- **Design Reference:** `docs/WRISTO_Design_Tokens_and_Interactions.md` (Section 40).
- **Distraction-Free Quiet Isolation:**
  - Route `/checkout` and `/checkout/success` suppress global marketing navigation (`Header.tsx`) and footers (`Footer.tsx`).
  - Minimalist `CheckoutHeader.tsx` displays only WRISTO emblem, 256-bit SSL Security badge, and Concierge helpline.
- **Progressive 4-Step Stepper (`CheckoutStepper.tsx`):**
  - `01 Address & Contact` → `02 Horological Delivery` → `03 Secure Payment` → `04 Review & Confirm`.
  - Direct URL deep linking supported via `?step=1..4`.
- **Decoupled Order Service (`orderService.ts`):**
  - Pure decoupled business logic ready for Spring Boot `POST /api/v1/orders`.
  - Coupon validation engine: `WRISTO10` (10% off), `HOROLOGYVIP` (₹2,500 off orders > ₹15,000), `FIRST15` (15% off).
  - Indian PIN code auto-lookup for city and state.
  - Delivery tiers: Complimentary Insured Air Express (₹0) and White-Glove Hand Courier (+₹999).
  - Order persistence via `wristo_orders` and `wristo_latest_order` in `localStorage`.
- **Order Confirmation & Provenance (`/checkout/success`):**
  - Serialized order reference number (`WRT-2026-XXXXX`).
  - Serialized Certificate of Provenance ID (`CERT-CHRONO-XXXXX`).
  - Itemized receipt with print action (`window.print()`).

---

## 8. Phase 7: Client Account & Provenance Ledger (`/account`)

- **Route:** `/account` (`AccountClient.tsx`).
- **Decoupled Service:** `accountService.ts` providing customer profile, address book, collection history, and security preferences.
- **5-Tab Collector Dashboard:**
  1. **Overview:** Tier status (*Connoisseur Circle*), total collection value, active timepiece custody, and quick actions.
  2. **My Orders & Custody:** Timeline of past acquisitions with live tracking badges, PDF invoice triggers, and certificate inspection.
  3. **Address Book:** Primary delivery address and secondary vault/residence destinations with inline edit/add modal.
  4. **Vault Wishlist:** Quick overview of saved timepieces with direct Add-to-Cart actions.
  5. **Security & Preferences:** Two-factor authentication status, currency preferences, and horological newsletter toggles.
- **Interactive Provenance Certificate Modal (`ProvenanceCertificateModal.tsx`):**
  - Intricate vector SVG guilloché security borders.
  - Embossed gold holographic seal with WRISTO emblem.
  - Inscribed collector provenance name, movement caliber serial, warranty verification number, and print layout.

---

## 9. Phase 8: AI Watch Concierge (`/concierge`)

- **Route:** `/concierge` (`ConciergeClient.tsx`).
- **Horological Reasoning Engine:**
  - Multi-turn conversation interface simulating a private Mayfair horological advisor.
  - Contextual awareness across 40 timepieces with weighted semantic matching on budget, occasion, movement caliber, strap preference, and aesthetic taste.
  - Structured recommendation cards embedded directly into chat stream with direct PDP links and 3D preview cards.
  - Quick prompt starters: *"Find me an automatic dress watch under ₹40,000"*, *"I need a rugged diver for weekend watersports"*, *"Suggest a minimalist skeleton watch"*.

---

## 10. Phase 9: Editorial Journal (`/journal` & `/journal/[slug]`)

- **Routes:**
  - `/journal`: 6 deep-dive horological essays with category filters (Collector Guides, Technical Horology, Industry Insights).
  - `/journal/[slug]`: Dynamic SSG article reader pre-rendering all 6 essays via `generateStaticParams()`.
- **Decoupled Service:** `journalService.ts` with complete editorial schema (title, slug, excerpt, content, author, readTime, publishedDate, coverImage, tags).
- **Typography & Reading Experience:** Optimized serif typography (`Playfair Display` + `Inter`), pull quotes, horological spec callouts, related article recommendations, and inline timepiece buy links.

---

## 11. Phase 10: Launch Hardening, Rich SEO & Dynamic Sitemap

- **Dynamic XML Sitemap (`sitemap.ts`):** 58 statically pre-rendered URLs:
  - Core marketing & transactional pages (Home, Watches, Compare, Concierge, Journal, Account, Checkout).
  - 40 dynamic watch detail pages (`/product/WRT-001` to `/product/WRT-040`).
  - 6 dynamic journal articles (`/journal/[slug]`).
- **Robots Configuration (`robots.ts`):** Full search engine accessibility with `/checkout` and `/account` isolation.
- **Structured Schema Markup (JSON-LD):**
  - `Organization` & `WebSite` schema on root layout.
  - Rich `Product`, `Offer`, `AggregateRating`, and `Brand` schema on all PDP pages.
  - `BreadcrumbList` schema on PLP and PDP routes.
- **Resilience Infrastructure:**
  - Luxury horological `not-found.tsx` (404 recovery screen).
  - Global client `error.tsx` fault boundary.
  - Screen-reader accessible skip-to-content links.

---

## 12. Watch Comparison Engine (Milestone 1 / Desktop Parity)

- **Design Reference:** `ref_images/ChatGPT Image Sep 28, 2026, 10_28_21 PM.png` & `index.html` / `js/app.js` (lines 1145–1230 & 1654–1670).
- **Core Architecture:**
  1. **Global Context (`ComparisonContext.tsx`):**
     - Manages `comparison: string[]` (max 4 watches).
     - Synchronizes 2-way with `localStorage.getItem('wristo_comparison')`.
     - Toast notifications: `"Added to comparison matrix"`, `"Removed from comparison"`, and capacity limit warnings (`"Maximum 4 watches can be compared side-by-side."`).
  2. **Floating Comparison Dock (`FloatingComparisonDock.tsx`):**
     - Fixed bottom tray appearing on desktop when `comparisonCount > 0`.
     - 4 slots: filled slots render watch thumbnail, brand, model, price, and delete `×` action; empty slots indicate `+ Add Timepiece`.
     - Minimizable to a floating pill badge at bottom right. Suppressed automatically on `/compare` and `/checkout`.
  3. **Dedicated Route (`/compare` & `ComparisonClient.tsx`):**
     - Section Header: *"Spec Comparison • Side-by-Side Horology Matrix"*.
     - 9-spec technical matrix comparing: Brand House, Caliber Movement, Case Diameter, Case Material, Strap Type, Dial Finish, Water Resistance, Style Aesthetic, Target Gender, Recommended Occasions, and Direct Checkout.
     - Direct `Add to Cart` and `Buy Now →` buttons for each compared watch.
     - Luxury empty state with `"Select Timepieces →"` CTA.
  4. **Universal Triggers:**
     - Header: Scale icon between Wishlist and Account with dynamic active counter badge.
     - Catalog Cards (`ProductCard.tsx`): Hover quick action button `"Compare"` / `"Compared"`.
     - PDP (`ProductActions.tsx`): `"Compare Specs"` secondary action wired directly to the comparison matrix.

---

## 13. Desktop Web Screen Parity Baseline (`docs/desktop_web_parity_analysis.md`)

- **Reference Board:** `ref_images/ChatGPT Image Sep 28, 2026, 10_28_21 PM.png` (13 panels).
- **Scope:** Strict desktop web experience. Mobile app and PWA are deferred.
- **5-Milestone Desktop Parity Roadmap:**
  - [x] **Milestone 1:** Watch Comparison Engine (Completed & Pushed in `8935832`).
  - [x] **Milestone 2:** Homepage Parity & Section Restoration (Popular Brands strip, Curated Occasions 4 tall cards, App promo, Blog preview, Trust strip copy, `2ba36df`).
  - [x] **Milestone 3:** Catalog / PLP Enhancements (Shop by Category left jump list, Circular category chips, Card bottom pill badges, `d9ef911`).
  - [x] **Milestone 4:** Dedicated Standalone Desktop Pages (`/wishlist`, `/cart`, `/brands`, Account persona correction to `Gaurav Kadam` / `GK`, `8853fbb`).
  - [x] **Milestone 5:** Header, Footer & Search Copy Polish (Pune location, phone, socials, payment badges, search keywords, `8853fbb`).

---

## 14. Design Tokens & Color Palettes

### Primary Brand Palette
- `--brand-charcoal`: `#1A1A1A` (Primary typography & dark accents)
- `--brand-ivory`: `#F7F3EC` (Warm luxury text & surfaces)
- `--brand-sand`: `#D9C9B8` (Subtle borders & warm tints)
- `--brand-bronze`: `#B08D6B` (Official brand accent, category eyebrows, badges)
- `--brand-soft-black`: `#0F0F0F` / `#0E0E0E` (Editorial card backgrounds)
- `--color-brand-black`: `#111111` (Deep night sections)
- `--color-accent-champagne`: `#DEC095` / `#E8C89A` (Primary interactive CTA buttons)

### Typography Hierarchy (Section 3.1 & 3.2 Single Source of Truth)
- **Serif Display (`var(--font-serif)`)**: Playfair Display, Cormorant Garamond, Georgia, serif. (Used for Hero headlines, luxury editorial statements, PDP watch model titles, campaign banners, and empty state guidance).
- **Sans Body (`var(--font-body)`)**: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif. (Used for Navigation, product card titles, prices, buttons, filters, facets, and technical horology specs).
- **11-Step Scale Tokens**:
  - `type.display.xl`: 64px, weight 500, line-height 0.98, tracking -0.03em (`--type-display-xl`)
  - `type.display.lg`: 52px, weight 500, line-height 1.00 (`--type-display-lg`)
  - `type.heading.xl`: 40px, weight 600, line-height 1.05 (`--type-heading-xl`)
  - `type.heading.lg`: 32px, weight 600, line-height 1.10 (`--type-heading-lg`)
  - `type.heading.md`: 26px, weight 600, line-height 1.15 (`--type-heading-md`)
  - `type.heading.sm`: 22px, weight 600, line-height 1.20 (`--type-heading-sm`)
  - `type.body.lg`: 18px, weight 400, line-height 1.55 (`--type-body-lg`)
  - `type.body.md`: 16px, weight 400, line-height 1.50 (`--type-body-md`)
  - `type.body.sm`: 14px, weight 400, line-height 1.45 (`--type-body-sm`)
  - `type.caption`: 12px, weight 500, line-height 1.35 (`--type-caption`)
  - `type.label`: 11px, weight 600, line-height 1.20 (`--type-label`)

---

## 15. Development, Server & Verification Commands

- **Next.js Dev Server**:
  ```powershell
  cd e:\WRISTO\wristo-next
  npm run dev
  # Accessible at http://localhost:3000/
  ```
- **Next.js Production Build Test**:
  ```powershell
  cd e:\WRISTO\wristo-next
  npm run build
  ```
- **Multi-Viewport Headless Chrome QA (saved to `screenshots/`)**:
  ```powershell
  # Desktop (1440px)
  Start-Process -FilePath "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "--headless --disable-gpu --screenshot=E:\WRISTO\screenshots\watches_desktop_1440.png --window-size=1440,2400 http://localhost:3000/watches" -Wait
  
  # Tablet (768px)
  Start-Process -FilePath "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "--headless --disable-gpu --screenshot=E:\WRISTO\screenshots\watches_tablet_768.png --window-size=768,2000 http://localhost:3000/watches" -Wait
  
  # Mobile (375px)
  Start-Process -FilePath "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "--headless --disable-gpu --screenshot=E:\WRISTO\screenshots\watches_mobile_375.png --window-size=375,2000 http://localhost:3000/watches" -Wait
  ```

---

## 16. Backend Architecture & Spring Boot 3.3+ Status (`wristo-backend/`)

- **Tech Stack:** Java 21 LTS, Spring Boot 3.3.4, Spring Security 6 (Stateless JJWT 0.12.6, HMAC-SHA512), Spring Data JPA, PostgreSQL (Local `wristodb` / Production), Flyway Migrations, OpenAPI 3 / Swagger UI (`/swagger-ui/index.html`), Virtual Threads enabled.
- **Environment Driven:** 100% environment-driven configuration via `.env.example` templates.
- **Backend Port & Base Path:** `http://localhost:8080/api/v1`
- **Completed Phases:**
  - **Phase 1: Foundation, Architecture & Core Schema** ✅ (Flyway V1, V2, BaseAuditEntity, GlobalExceptionHandler, ApiResponse, PageResponse, Swagger UI, Catalog & Health endpoints).
  - **Phase 2: Authentication, Authorization (JWT) & Seller Onboarding** ✅:
    - Flyway V3 (`refresh_tokens`, `sellers`, `seller_users`, `seller_documents`, `seller_brand_authorizations`) & V4 (Admin, Collector, Seller seed data).
    - `JwtTokenProvider`, `JwtAuthenticationFilter`, `JwtAuthenticationEntryPoint`, `UserPrincipal`, `CustomUserDetailsService`.
    - Auth & User endpoints: `/auth/register`, `/auth/login`, `/auth/refresh-token`, `/auth/logout`, `/auth/me`, `/user/profile`, `/user/addresses/**`.
    - Seller & Admin endpoints: `/seller/onboard`, `/seller/me`, `/seller/staff/**`, `/seller/documents`, `/seller/brand-authorizations`, `/admin/sellers/**`.
  - **Phase 3: Catalog, Seller Listings & Inventory** ✅:
    - Flyway V5 (`40 master timepieces` + `40 technical horology specs`), V6 (`seller_listings`, `inventories`, `inventory_movements`, `inventory_reservations`), V7 (Live demo seller listings and stock for verified boutique `seller-auren-in`).
    - Multi-facet catalog search & aggregation (`/watches`, `/watches/{id}`, `/watches/{id}/similar`, `/watches/{id}/listings`, `/brands`, `/categories`).
    - Seller listing management & unique SKU isolation (`/seller/listings/**`).
    - Admin listing governance & approval state machine (`/admin/listings/**`).
    - Seller inventory management with row-locking (`PESSIMISTIC_WRITE`), movement audit history, and transactional stock reservations (`/seller/inventory/**`).
  - **Phase 4: Cart, Wishlist & Comparison Backend Services** ✅:
    - Flyway V8 (`coupons`, `carts`, `cart_items`, `wishlists`, `wishlist_items`, foreign keys, indices, seed promotional codes).
    - Promotional Coupon Engine (`/coupons/validate`, `/coupons/active`, `/admin/coupons/**`).
    - Shopping Cart & Stateless Calculations (`/cart`, `/cart/items/**`, `/cart/coupon`, `/cart/gift-options`, `/cart/delivery-options`, `/cart/calculate-totals`).
    - Collector Vault Wishlist Management (`/wishlist`, `/wishlist/items/**`, `/wishlist/toggle/**`, `/wishlist/check/**`, `/wishlist/items/**/move-to-cart`).
    - 9-Axis Horological Comparison Engine (`/compare?ids=...`).
  - **Phase 5: Order Processing, Luxury Checkout & Payment Integration** ✅:
    - Flyway V9 (`orders`, `order_items`, `order_status_history`, `payments`, `checkout_sessions`, foreign keys, indices).
    - Multi-step checkout state machine (`/checkout/initiate`, `/checkout/{sessionId}/**`, `/checkout/{sessionId}/complete`).
    - 15-minute transactional inventory stock hold preventing concurrent over-allocation.
    - Automated sequential order identifier generation (`WRT-2026-XXXXX`) and cryptographic authenticity certificate ID (`CERT-CHRONO-XXXXX`).
    - Customer order history tracking (`/orders/my-orders`, `/orders/{orderNumber}`) and safe cancellation with auto-restock.
    - Multi-gateway payment adapter supporting Razorpay, Stripe, and Mock Sandbox with HMAC-SHA256 signature verification.
  - **Phase 6: Provenance Ledger, Digital Authenticity Certificates & Collector VIP Profile** ✅:
    - Flyway V10 (`authenticity_certificates`, `provenance_records`, `watch_service_records`, `collector_profiles`, `user_preferences`, unique certificate index).
    - Cryptographic Authenticity Certificate Generation with unique SHA-256 signatures, guilloché rosette pattern IDs, and tamper-evident QR verification hashes.
    - Public Authenticity Verification (`/provenance/verify/{certificateNumber}`).
    - Authenticated Collector Vault & Ownership Ledger (`/provenance/my-vault`, `/provenance/watch/{watchId}/service-record`).
    - VIP Tier Evaluation & Client Account (`/account/profile`, `/account/vault`, `/account/preferences`, `/account/tier`).
  - **Phase 7: AI Horology Concierge & Instant Search Autocomplete** ✅:
    - Multi-field search tokenizer and PostgreSQL FTS (`/search/autocomplete`, `/search/instant`, `/search/full`).
    - AI Watch Concierge with live catalog tool-calling, intent extraction, and zero-hallucination recommendation fallback (`/concierge/chat`, `/concierge/recommendations`, `/concierge/suggested-prompts`).
    - Real-time STOMP WebSockets over SockJS (`/ws-wristo`) and in-app broadcast notifications (`/notifications/**`).
  - **Phase 8: Editorial Journal & Content Management API** ✅:
    - Flyway V11 (`journal_authors`, `journal_articles`, unique slug index, 3 seeded master horologists/curators, 6 seeded canonical essays).
    - Public Editorial REST APIs (`/journal/articles`, `/journal/lead`, `/journal/articles/{slugOrId}`, `/journal/categories`, `/journal/tags`, `/journal/slugs`).
    - Admin Editorial CMS (`/admin/journal/articles/**`, `/admin/journal/authors/**`) with RBAC enforcement (`ADMIN`, `SUPER_ADMIN`), draft/published state toggling, and lead story election.
  - **Phase 9: DevOps, Containerization & Cloud Deployment (Render + Supabase)** ✅:
    - Multi-stage Dockerfile for `wristo-backend` (Eclipse Temurin 21 + Maven multi-stage build with non-root runner).
    - Multi-stage Dockerfile for `wristo-next` (Node 20 Alpine standalone output).
    - `docker-compose.yml` for unified single-command local container orchestration (`PostgreSQL 16` + `Backend` + `Frontend`).
    - GitHub Actions CI/CD Pipeline (`.github/workflows/ci.yml`) validating both `mvn clean test` and `npm run build` on every push.
    - Cloud Production Configuration: Render Web Service environment mappings, Supabase connection pooler multi-tenant routing (`DB_USERNAME=postgres.<project-ref>`), and PostgreSQL strict type alignment across Flyway `V9` & `V10` migrations (`ce3d1d3`).
    - Test Suite: **103/103 unit & integration tests passing (100% green)** in `mvn test`.
- **Master Specification Document:** [`docs/backend_architecture_specification.md`](file:///e:/WRISTO/docs/backend_architecture_specification.md) & [`docs/WRISTO_Production_Ready_SRS_v1.0.md`](file:///e:/WRISTO/docs/WRISTO_Production_Ready_SRS_v1.0.md).

---

## 17. Master Prompts Archive (`prompts/`)

- All major project engineering prompts, architectural briefs, and design specifications are cataloged inside `prompts/`:
  - `prompts/01_master_architecture_and_brand_system.md`: Foundational prompt and architecture system.
  - `prompts/02_core_commerce_phases_1_to_10.md`: Core commerce phases 1 through 10 implementation brief.
  - `prompts/03_desktop_parity_roadmap_milestones_1_to_5.md`: 5-milestone desktop parity execution prompt.
  - `prompts/04_backend_architecture_and_spring_boot_spec.md`: Spring Boot 3.3+ & PostgreSQL architecture spec prompt.
  - `prompts/05_gsap_scroll_scrubbed_watch_animation.md`: GSAP scroll canvas exploration brief & restoration notes.
  - `prompts/README.md`: Index and navigation guide.

---

## 18. Frontend Visual Polish, GSAP Animations & 3D Interactive Horology Roadmap

- **Master Plan Document:** Registered in conversation artifacts as `frontend_enhancement_and_animation_plan.md` containing all 17 audit items and strict zero-emoji policy.
- **Phase Breakdown & Sequence:**
  1. **Phase 1: Visual Alignment, Admin CRM Refinement & Currency Standardization**
     - Standardize currency formatting to `en-IN` / `INR` (`₹`) across `/admin`, `/admin/orders`, `/admin/coupons`, `/admin/listings`, `OrderStatusModal`, and `ListingApprovalModal`.
     - Standardize icons to Lucide vector icons (`<IndianRupee />`, `<ZoomIn />`, etc.), completely eliminating emojis.
     - Add `.tabular-nums` CSS utility across all prices, case diameters, water resistance specs, and serial numbers.
     - Fix KYC document aspect ratio in `SellerReviewModal.tsx` and add 60vh scroll container in `ArticleEditorModal.tsx`.
     - Deepen Occasion card scrim gradient and refactor mobile TrustStrip flex layout.
  2. **Phase 2: GSAP Hero Scroll-Controlled 240-Frame Interactive Canvas Animation**
     - Deploy 240 pre-rendered frames (`docs/wristo_scroll_frames_30fps/`) to `wristo-next/public/assets/hero-frames/`.
     - Build `ScrollCanvasHero.tsx` using GSAP 3.15 `ScrollTrigger` (`scrub: 0.6`).
     - Zero-flash initial render on frame 0001 with background image buffer.
  3. **Phase 3: Interactive 3D Watch Stage, Provenance Guilloché Draw & Admin Telemetry**
     - PDP 360° interactive turntable and exploded caliber view for skeleton timepieces (`WRT-004`, `WRT-008`, `WRT-016`).
     - SVG guilloché rosette security line drawing animation (0.8s) + gold wax stamp impact on `CertificateModal.tsx`.
     - 3D dual-perspective floating watch stage on `/compare`.
     - Admin dashboard KPI numeric counter roll-up animation via GSAP `roundProps`.
- **Status:** Formulation complete, approved by Gaurav Bhau, ready for Phase 1 execution.

---

## 19. Cloud Asset Storage & Dynamic Image Infrastructure (Session 7)

### Supabase Storage Bucket
- **Provider:** Supabase Storage (project ref: `wfdiidyruqflbdkaysjo`)
- **Bucket Name:** `wristo-products`
- **Access Policy:** Public read (images served as CDN via Supabase public storage URL)
- **Upload Script:** `wristo-next/scripts/upload_to_supabase.js`
  - Zero external dependencies (Node.js native `fs`, `path`, `https`, `readline`)
  - Parses `.env` in-process; falls back to masked terminal prompt if env vars not found
  - Uses `x-upsert: true` for idempotent re-uploads (safe to run multiple times)
  - Auth: Bearer `SUPABASE_SERVICE_ROLE_KEY` in `Authorization` header

### Environment Variables
- `SUPABASE_URL` — Supabase project URL (server-side only, used for uploads)
- `SUPABASE_SERVICE_ROLE_KEY` — Service role secret key (NEVER expose client-side)
- `NEXT_PUBLIC_STORAGE_BASE_URL` — CDN base URL for product images (client-safe). Format: `https://<project-ref>.supabase.co/storage/v1/object/public/wristo-products`. Set in Vercel/Render for production CDN routing.

### Dynamic URL Resolver (`src/lib/storage.ts`)
```ts
export function getProductImageUrl(filename: string): string {
  const base = process.env.NEXT_PUBLIC_STORAGE_BASE_URL;
  return base ? `${base}/${filename}` : `/assets/products/${filename}`;
}
```
- CDN URL if `NEXT_PUBLIC_STORAGE_BASE_URL` is set; local `/public/assets/products/` fallback if not
- Used in `ProductCard.tsx` for all catalog image rendering

### next.config.ts Remote Patterns Added
```ts
remotePatterns: [
  { protocol: 'https', hostname: '**.supabase.co' },
  { protocol: 'https', hostname: 'images.unsplash.com' },
]
```

### Image Status (as of Oct 7, 2026)
| Range | Status | Location |
|-------|--------|---------|
| watch-01 to watch-25 | Unique AI-generated images | Local + Supabase |
| watch-26 to watch-40 | Placeholder duplicates (copied from 12/13) | Local + Supabase (pending replacement) |

- **Completion Trigger:** Image quota resets ~3:00 PM IST Oct 7, 2026
- **Prompts for 26-40:** Pre-written in `wristo-next/scripts/watch_prompts.json` (entries 26-40)
- **After generation:** Copy to `wristo-next/public/assets/products/` then re-run upload script

### Git Commit Strategy for Session 7
Pending commit to `main` (awaiting explicit Gaurav Bhau confirmation):
- `wristo-next/next.config.ts` — remotePatterns addition
- `wristo-next/src/lib/storage.ts` — NEW dynamic URL resolver
- `wristo-next/src/components/catalog/ProductCard.tsx` — dynamic URL usage
- `wristo-next/scripts/upload_to_supabase.js` — NEW Supabase batch upload script
- `wristo-next/scripts/watch_prompts.json` — NEW per-watch AI prompt registry
- `.env.example` (root + `wristo-next/`) — storage env var templates updated
- `wristo-next/public/assets/products/watch-03.png` through `watch-25.png` — sanitized AI images
- Deleted: `assets/test/`, `wristo-next/public/assets/test/` — calibration test image cleanup
- Deleted: `ref_images/40_images_*.png` — planning reference image cleanup

