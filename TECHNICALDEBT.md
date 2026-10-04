# WRISTO — Technical Debt & Architecture Roadmap Tracker

**Project:** WRISTO Ultra-Luxury Watch Marketplace  
**Current Status:** All Core Commerce Phases 1–10 + Desktop Parity Milestones 1–5 100% Complete & Build-Verified (61 Routes)  
**Active Milestone:** Java 21 + Spring Boot 3.3+ + PostgreSQL Backend Integration  
**Architecture Spec:** `docs/backend_architecture_specification.md`  
**Last Updated:** October 2026  

---

## 1. Executive Summary

WRISTO's frontend was built following strict clean-architecture separation: **"Presentation does not know where content comes from."** The Next.js production application compiles with zero errors (61 static & dynamic SSG routes) and delivers an end-to-end luxury commerce experience matching the reference design boards.

With Desktop Parity Milestones 1–5 fully completed and verified, all frontend UI sections, controls, standalone pages (`/wishlist`, `/cart`, `/brands`), and comparison capabilities are operational. This document registers all active architectural trade-offs and technical debt items ahead of Spring Boot 3.3+ backend deployment.

---

## 2. Technical Debt Registry

| ID | Domain | Issue / Trade-off | Severity | Planned Milestone | Status |
|---|---|---|:---:|:---:|:---:|
| **TD-01** | Data & API | In-memory client filtering in `productService.ts` | Medium | Spring Boot Backend Integration | Open (Target: JPA Specs) |
| **TD-02** | State | Cart, Wishlist, Comparison & Account stored in browser `localStorage` | Medium | Spring Boot Backend Integration | Open (Target: Redis + JWT) |
| **TD-03** | Media | High-resolution assets served locally from `/public/assets` (~10.7 MB) | Low | Cloud Deployment Phase | Open (Target: S3 / Cloudinary) |
| **TD-04** | Architecture | Root directory contains legacy vanilla prototype alongside `wristo-next/` | Low | Post-Parity Cleanup | Open (Target: Archive to `legacy/`) |
| **TD-05** | Testing | Visual regression performed via headless Chrome script without automated CI runner | Low | CI/CD Phase | Open (Target: GitHub Actions) |
| **TD-06** | Performance | Facet count computation is $O(N)$ per filter change | Low | Spring Boot Backend Integration | Open (Target: SQL Aggregations) |
| **TD-07** | Feature | Watch Comparison Engine omitted from Next.js port | High | Desktop Parity M1 | ✅ **RESOLVED** (`8935832`) |
| **TD-08** | Desktop Parity | Homepage sections, PLP controls, Standalone Pages & Copy | Medium | Desktop Parity M2–M5 | ✅ **RESOLVED** (`8853fbb`) |

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
  * Backend will implement Spring Data JPA Specifications (`JpaSpecificationExecutor`) with indexes on `brand`, `movement`, `gender`, and `price` (see `docs/backend_architecture_specification.md`).
  * **Zero React UI components will need modification** thanks to the decoupled service contract.

---

### TD-02: Client-Side Session State (Cart, Wishlist, Comparison, Account)
* **Current State:** `CartContext.tsx`, `WishlistContext.tsx`, `ComparisonContext.tsx`, and `accountService.ts` persist state to browser `localStorage` under `wristo_cart`, `wristo_wishlist`, `wristo_comparison`, and `wristo_orders`.
* **Impact:** Items do not synchronize across devices, and user state is lost if browser cache is cleared.
* **Resolution Plan:**
  * Introduce guest session UUIDs saved in secure cookies.
  * In Spring Boot backend, synchronize local storage with `CartService` (Redis-backed) and `AccountService` on user login/signup via JWT.

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
  * Keep the root prototype as historical reference until backend is deployed.
  * Move root prototype files into an archived folder (`prototype/` or `legacy/`) once all backend endpoints are connected.

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
* **Resolution Applied (`8935832`):**
  * Created `ComparisonContext.tsx` with max 4 watches, localStorage persistence, and toast notifications.
  * Built `FloatingComparisonDock.tsx` (bottom luxury tray with watch chips and minimize pill).
  * Built dedicated `/compare` route & `ComparisonClient.tsx` with 9-spec technical horology matrix.
  * Connected `Header.tsx` (scale icon with badge), `ProductCard.tsx` (card hover "Compare" button), and `ProductActions.tsx` (PDP toggle).
  * 58/58 static routes compiled cleanly.
* **Status:** ✅ **RESOLVED** in commit `8935832`.

---

### TD-08: Desktop Web Screen Parity & Copywriting Divergence (RESOLVED)
* **Initial Problem:** Audit against reference board `ref_images/ChatGPT Image Sep 28, 2026, 10_28_21 PM.png` identified missing homepage sections, PLP controls, missing standalone desktop pages (`/wishlist`, `/cart`, `/brands`), and copywriting divergence.
* **Resolution Applied (`2ba36df`, `d9ef911`, `8853fbb`):**
  * **Milestone 1:** Comparison Engine — Built `FloatingComparisonDock.tsx` and `/compare` matrix (`8935832`).
  * **Milestone 2:** Homepage Parity & Section Restoration — Restored Popular Brands strip, Curated Occasions 4 tall cards, App promo, Blog preview, and updated Trust strip copy (`2ba36df`).
  * **Milestone 3:** Catalog / PLP Enhancements — Built Shop by Category jump list, 4 circular category chips, and card bottom pill badges (`d9ef911`).
  * **Milestone 4:** Dedicated Standalone Desktop Pages — Implemented dedicated `/wishlist`, `/cart`, and `/brands` full-page layouts, and updated account persona to `Gaurav Kadam` (`8853fbb`).
  * **Milestone 5:** Header, Footer & Search Copy Polish — Updated header nav, Pune contact details, social links, payment gateway badges, and search keywords (`8853fbb`).
  * **Verification:** `npm run build` compiled **61/61 static and dynamic routes** cleanly with zero TypeScript errors.
* **Status:** ✅ **RESOLVED** across Milestones 1 to 5.

