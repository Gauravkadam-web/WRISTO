# WRISTO — Repository Memory & Architectural Knowledge

**Brand:** WRISTO  
**Tagline:** Your Time. Your Style.  
**Platform:** Ultra-Luxury Multi-Brand Watch E-Commerce Experience  
**Core Technologies:** Next.js 16+ (App Router, Turbopack, React 19, TypeScript), Vanilla CSS Custom Tokens, Decoupled Service Architecture (Spring Boot-Ready)  
**GitHub Remote:** `https://github.com/Gauravkadam-web/WRISTO.git` (Branch: `main`)  
**Last Updated:** September 2026

---

## 1. Architectural Philosophy & Strategy

WRISTO is designed as an ultra-luxury editorial watch boutique — pairing the aesthetic caliber of Swiss horological publications (*A Collected Man*, *Hodinkee*, *Revolution Magazine*) with instantaneous client-side performance and responsive fluidity across mobile, tablet, and ultra-wide desktop.

### Core Architectural Invariants:
1. **Decoupled Service Contracts:** *"Presentation should not know where content comes from."* All catalog, filtering, and search operations pass through `src/services/productService.ts`. Swapping from local mock data to Java + Spring Boot REST APIs requires zero UI component edits.
2. **Photography-First Contrast:** Dark, cinematic horological surfaces contrasted against warm, tactile ivory/paper backgrounds (`#F7F3EC`, `#FFFDF9`).
3. **No Unrequested Layout Shifts:** Section ordering and component hierarchy must strictly respect established positioning.
4. **URL-First State Synchronization:** All catalog filter selections (`brand`, `movement`, `style`, `maxPrice`, `sort`, `q`) synchronize 2-way with Next.js `searchParams` (`/watches?brand=AUREN&movement=Automatic`).
5. **Explicit Permission for Git Commits & Pushes:** NEVER execute `git commit` or `git push` without obtaining explicit prior confirmation from the user. Always present changes/diffs and ask for approval first.

---

## 2. Repository Structure & Workspace Layout

```
WRISTO/
├── wristo-next/                       # Production Next.js Application
│   ├── src/
│   │   ├── app/                       # Next.js 16 App Router
│   │   │   ├── layout.tsx             # Root Layout (Fonts, Cart/Wishlist Providers)
│   │   │   ├── globals.css            # Master Design Tokens, Reset & Responsive Rules
│   │   │   ├── page.tsx               # Home / Discover Page
│   │   │   └── watches/               # Catalog PLP Route (/watches)
│   │   │       ├── page.tsx           # Server Component with Suspense & Metadata
│   │   │       └── WatchesClient.tsx  # Client State Shell (URL Sync, Filters, Grid)
│   │   ├── components/
│   │   │   ├── layout/                # Header (Dual-Theme Lockup), Footer, CartDrawer
│   │   │   ├── home/                  # Hero, TrustStrip, EditorialBanner
│   │   │   └── catalog/               # CategoryNav, FilterSidebar, FilterDrawer, ProductCard,
│   │   │                              # ProductGrid, ActiveFilterBar, SortSelect, Pagination
│   │   ├── data/                      # 40-Watch Master Typed Dataset, Brands, Categories
│   │   ├── services/                  # productService.ts (Spring Boot Data Contract)
│   │   ├── context/                   # CartContext, WishlistContext (LocalStorage sync)
│   │   └── types/                     # product.ts, filter.ts
│   ├── public/assets/                 # 40 Watch Images, Brand Logos, Editorial Banners
│   ├── package.json                   # Dependencies
│   └── tsconfig.json                  # Strict TypeScript Configuration
├── assets/                            # Original Image & Brand Identity Assets
├── css/                               # Original Vanilla CSS Stylesheet
├── js/                                # Original Vanilla JS Prototype Scripts
├── docs/                              # Master Specifications & Session Summaries
│   ├── WRISTO_MASTER_DEVELOPMENT_PROMPT.md
│   ├── WRISTO_Design_Tokens_and_Interactions.md
│   └── session_summary.md
├── screenshots/                       # Centralized Multi-Viewport QA Regression Captures (.gitignored)
├── MEMORY.md                          # Repository Architectural Memory (This File)
├── PROGRESS.md                        # Milestones & Roadmap Tracker
├── TECHNICALDEBT.md                   # Known Technical Debt & Future Refactoring Plan
└── .gitignore                         # Production Clean Ignore Rules
```

---

## 3. Global Homepage Section Order & Invariants

```
┌────────────────────────────────────────────────────────┐
│ 1. Header (Sticky, Glassmorphic / Dark Adaptive)       │
│    - Official WRISTO Horizontal Logo (Transparent PNG) │
│    - Navigation Links, Search, Wishlist, Cart Counters │
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
│ 4. AI Watch Concierge (Interactive Teaser Card)        │
│    - Natural language prompt box + Smart query chips   │
├────────────────────────────────────────────────────────┤
│ 5. Trending Timepieces (Curated 8-Watch Catalog Grid)  │
│    - Best Sellers, Editorial Picks, Automatic calibers │
├────────────────────────────────────────────────────────┤
│ 6. Editorial Campaign Banner ("Modern Looks")          │
│    - Contained Card Structure (.container)             │
│    - 2-Column: Left Editorial Text / Right Photo Visual│
│    - "NEW ARRIVALS" + "Modern Looks. Timeless Feel."   │
│    - "Explore Now →" Champagne CTA                     │
│    - 01 —— 02 —— 03 Carousel Indicator                │
│    - "STYLE IN EVERY DETAIL" Glassmorphic Badge        │
├────────────────────────────────────────────────────────┤
│ 7. Curated Editorial Collections (Lifestyle Narratives)│
├────────────────────────────────────────────────────────┤
│ 8. Mechanical & Skeleton Souls (Automatic Showcase)    │
├────────────────────────────────────────────────────────┤
│ 9. Curated Brands Showcase & Journal Stories           │
├────────────────────────────────────────────────────────┤
│ 10. Global Footer (Brand Identity, Directory, Legal)   │
└────────────────────────────────────────────────────────┘
```

> [!IMPORTANT]
> **Position Invariant for "Modern Looks. Timeless Feel."**:  
> Strictly positioned **after Trending Timepieces** and **before Curated Collections**. Designed as a contained card inside `.container`, not a full-bleed window.

---

## 4. Phase 3: Catalog (PLP) Architecture & Responsive Behavior

### Responsive Layout Strategy:
* **Desktop (≥1024px):**
  * `.filter-sidebar`: Left sticky facet rail (width: 270px) displaying live facet counts for Brands, Calibers, Styles, Diameters, and Straps.
  * `.product-grid`: 4-column responsive grid with interactive 3D mouse tilt cards and instant wishlist toggles.
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
* **Purchase Actions (`ProductActions.tsx`):** Quantity stepper, `[ Add to Cart ]` with cart drawer slide-over, `[ Buy Now → ]` champagne CTA, and wishlist toggle.
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

## 7. Design Tokens & Color Palettes

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

## 8. Development, Server & Verification Commands

- **Next.js Dev Server**:
  ```powershell
  cd e:\WRISTO\wristo-next
  npm run dev
  # Accessible at http://localhost:3000/ and http://localhost:3000/watches
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
