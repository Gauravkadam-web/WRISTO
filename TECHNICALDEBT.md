# WRISTO — Technical Debt & Architecture Roadmap Tracker

**Project:** WRISTO Ultra-Luxury Watch Marketplace  
**Current Milestone:** Phase 3 Complete (Production Next.js Catalog / PLP)  
**Target Backend:** Java 21 + Spring Boot 3.3+ + PostgreSQL  
**Last Updated:** September 30, 2026

---

## 1. Executive Summary

WRISTO's Phase 3 was built following strict clean-architecture separation: **"Presentation does not know where content comes from."** While the Next.js frontend has zero compile or lint errors and is fully functional with client-side state and mock services, several intentional trade-offs were made to enable rapid UI/UX iteration ahead of Spring Boot backend integration.

This document registers all acknowledged technical debt items, architectural trade-offs, their severity, and their resolution roadmap.

---

## 2. Technical Debt Registry

| ID | Domain | Issue / Trade-off | Severity | Planned Milestone |
|---|---|---|:---:|:---:|
| **TD-01** | Data & API | In-memory client filtering in `productService.ts` | Medium | Phase 6 / Backend Integration |
| **TD-02** | State | Cart & Wishlist stored solely in browser `localStorage` | Medium | Phase 6 & 7 (User Accounts) |
| **TD-03** | Media | High-resolution assets served locally from `/public/assets` | Low | Cloud Deployment Phase |
| **TD-04** | Architecture | Root directory contains legacy vanilla prototype alongside `wristo-next/` | Low | Post-Phase 5 Cleanup |
| **TD-05** | Testing | Visual regression performed via headless Chrome script without automated CI runner | Low | Phase 10 (Quality & CI/CD) |
| **TD-06** | Performance | Facet count computation is $O(N)$ per filter change | Low | Backend Faceting (PostgreSQL/ES) |

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

### TD-02: Client-Side Session State (Cart & Wishlist)
* **Current State:** `CartContext.tsx` and `WishlistContext.tsx` persist items to browser `localStorage` under `wristo_cart` and `wristo_wishlist`.
* **Impact:** Items do not synchronize across devices, and cart contents are lost if the user clears browser data.
* **Resolution Plan:**
  * Introduce guest session UUIDs saved in secure cookies.
  * In Phase 7 (Accounts & Auth), synchronize local storage with Spring Boot `CartService` on user login/signup.

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
  * Keep the root prototype as historical reference until Phase 5 (Search) is completed.
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
