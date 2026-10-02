# WRISTO — Technical Debt & Architecture Roadmap Tracker

**Project:** WRISTO Ultra-Luxury Watch Marketplace  
**Current Milestone:** Desktop Parity Milestone 1 Complete (Watch Comparison Engine)  
**Active Milestone:** Desktop Parity Milestone 2 (Homepage Parity & Section Restoration)  
**Target Backend:** Java 21 + Spring Boot 3.3+ + PostgreSQL  
**Last Updated:** October 2026  

---

## 1. Executive Summary

WRISTO's frontend was built following strict clean-architecture separation: **"Presentation does not know where content comes from."** While the Next.js production application compiles with zero errors (58 static SSG routes) and provides an end-to-end luxury commerce experience, several intentional trade-offs and parity gaps are tracked here ahead of Spring Boot backend integration and complete visual parity with the design reference boards.

This document registers all acknowledged technical debt items, architectural trade-offs, their severity, and their resolution roadmap.

---

## 2. Technical Debt Registry

| ID | Domain | Issue / Trade-off | Severity | Planned Milestone | Status |
|---|---|---|:---:|:---:|:---:|
| **TD-01** | Data & API | In-memory client filtering in `productService.ts` | Medium | Backend Integration | Open |
| **TD-02** | State | Cart, Wishlist, Comparison & Account stored in browser `localStorage` | Medium | Phase 7 (User Accounts API) | Open |
| **TD-03** | Media | High-resolution assets served locally from `/public/assets` (~10.7 MB) | Low | Cloud Deployment Phase | Open |
| **TD-04** | Architecture | Root directory contains legacy vanilla prototype alongside `wristo-next/` | Low | Post-Parity Cleanup | Open |
| **TD-05** | Testing | Visual regression performed via headless Chrome script without automated CI runner | Low | CI/CD Phase | Open |
| **TD-06** | Performance | Facet count computation is $O(N)$ per filter change | Low | Backend Faceting | Open |
| **TD-07** | Feature | Watch Comparison Engine omitted from Next.js port | High | Desktop Parity M1 | ✅ **RESOLVED** (`8935832`) |
| **TD-08** | Desktop Parity | Homepage sections, PLP controls, Standalone Pages & Copy | Medium | Desktop Parity M2–M5 | ✅ **RESOLVED** (M2-M5 Complete) |

---

## 3. Detailed Debt Analysis & Resolution Plan

### TD-01: In-Memory Client Filtering vs. Server-Side SQL Filtering
* **Current State:** `src/services/productService.ts` implements `getCatalogProducts()`, which filters the 40-product array in-memory using JavaScript `.filter()`, `.sort()`, and `.slice()`.
* **Impact:** For 40 watches, response latency is instantaneous (<2ms). However, this approach does not scale when the catalog grows to 5,000+ SKUs.
* **Resolution Plan:**
  * When Spring Boot is deployed, update `productService.ts` to call:
    ```typescript
    const res = await fetch(`${API_BASE}/api/v1/watches?${queryParams}`);
    return await res.json();
    ```
  * Backend will implement Spring Data JPA Specifications (`JpaSpecificationExecutor`) with indexes on `brand`, `movement`, `gender`, and `price`.
  * **Zero React UI components will need modification** thanks to the decoupled service contract.

---

### TD-02: Client-Side Session State (Cart, Wishlist, Comparison, Account)
* **Current State:** `CartContext.tsx`, `WishlistContext.tsx`, `ComparisonContext.tsx`, and `accountService.ts` persist state to browser `localStorage` under `wristo_cart`, `wristo_wishlist`, `wristo_comparison`, and `wristo_orders`.
* **Impact:** Items do not synchronize across devices, and user state is lost if browser cache is cleared.
* **Resolution Plan:**
  * Introduce guest session UUIDs saved in secure cookies.
  * In Phase 7 (Accounts & Auth), synchronize local storage with Spring Boot `CartService` and `AccountService` on user login/signup.

---

### TD-03: Media Delivery & Remote Image Optimization
* **Current State:** All 40 watch product cutouts, hero banners, and brand logos are bundled locally inside `wristo-next/public/assets/` (~10.7 MB).
* **Impact:** Git repository holds binary image files, and scaling to thousands of watches will inflate repository size.
* **Resolution Plan:**
  * Migrate image assets to an external CDN (Cloudinary / Supabase Storage / AWS S3).
  * Update `next.config.ts` to allow remote domains via `images.remotePatterns`.

---

### TD-04: Dual Codebase Structure (Vanilla Prototype + Next.js App)
* **Current State:** The workspace contains both the original single-page vanilla prototype (`index.html`, `js/app.js`, `css/styles.css`) in the root and the production Next.js application in `wristo-next/`.
* **Impact:** Risk of editing root prototype files instead of `wristo-next/src/` components.
* **Resolution Plan:**
  * Keep the root prototype as historical reference until desktop parity milestones are completed.
  * Move root prototype files into an archived folder (`prototype/` or `legacy/`) once all screens achieve 100% Next.js parity.

---

### TD-05: Automated End-to-End Test Suite (CI/CD)
* **Current State:** Visual regression testing is executed via PowerShell headless Chrome scripts with output screenshots stored in `screenshots/`.
* **Impact:** Verification is semi-automated and requires local execution.
* **Resolution Plan:**
  * Implement Playwright or Cypress test suites in `wristo-next/tests/e2e/`.
  * Add GitHub Actions workflow (`.github/workflows/ci.yml`) to test `npm run build` and run linting on every push and pull request.

---

### TD-06: Dynamic Facet Count Computation
* **Current State:** `productService.ts` computes facet counts for each filter category by iterating over the filtered dataset for each selection.
* **Impact:** In-memory loop is fast for 40 items, but computation complexity scales with product variations.
* **Resolution Plan:** Delegate facet counting to PostgreSQL aggregation queries (`SELECT brand, COUNT(*) FROM products GROUP BY brand`) or Elasticsearch aggregations.

---

### TD-07: Watch Comparison Engine (RESOLVED)
* **Initial Problem:** In `js/app.js`, side-by-side comparison was a primary feature (`renderComparison`, `toggleComparison`). During initial Next.js porting, this was left as an empty state (`useState(false)` in `ProductActions.tsx`).
* **Resolution Applied (`8ccebb4`):**
  * Created `ComparisonContext.tsx` with max 4 watches, localStorage persistence, and toast notifications.
  * Built `FloatingComparisonDock.tsx` (bottom luxury tray with watch chips and minimize pill).
  * Built dedicated `/compare` route & `ComparisonClient.tsx` with 9-spec technical horology matrix.
  * Connected `Header.tsx` (scale icon with badge), `ProductCard.tsx` (card hover "Compare" button), and `ProductActions.tsx` (PDP toggle).
  * 58/58 static routes compiled cleanly.
* **Status:** ✅ **RESOLVED** in commit `8ccebb4`.

---

### TD-08: Desktop Web Screen Parity & Copywriting Divergence (IN PROGRESS)
* **Current State:** Audit against reference board `ref_images/ChatGPT Image Sep 28, 2026, 10_28_21 PM.png` identified several sections and copywriting items requiring restoration:
  1. **Homepage Sections:** Missing Popular Brands strip (6 cards + crown bezel banner), Curated Occasions (4 tall cards), Mobile App promo, and From Our Blog (3 cards).
  2. **PLP Controls:** Missing Shop by Category left jump list, 4 circular category chips (`Analog 1240`, `Chronograph 852`, `Smart 600`, `Dress 716`), and bottom card status pill badges (`Best Seller`, `Trending`, etc.).
  3. **Standalone Desktop Pages:** Wishlist and Cart currently exist as slide-over drawers; reference board displays dedicated full-page views (`/wishlist`, `/cart`).
  4. **Copywriting & Contact:** Trust strip copy, footer address (`Pune, Maharashtra`, phone, email, socials, payment badges), search keywords, and Account persona (`Gaurav Kadam` / `GK`).
* **Resolution Plan:**
  * **Milestone 1:** Comparison Engine — ✅ Completed (`8ccebb4`).
  * **Milestone 2:** Homepage Parity & Section Restoration — Queued.
  * **Milestone 3:** Catalog / PLP Enhancements — Queued.
  * **Milestone 4:** Dedicated Standalone Desktop Pages — Queued.
  * **Milestone 5:** Header, Footer & Search Copy Polish — Queued.
* **Status:** 🟡 **IN PROGRESS** (1/5 milestones complete).
