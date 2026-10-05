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
| **TD-01** | Data & API | In-memory client filtering in `productService.ts` | Medium | Phase 3: Catalog & Inventory | ✅ **RESOLVED** (Backend APIs Active) |
| **TD-02** | State | Cart, Wishlist, Comparison & Account stored in browser `localStorage` | Medium | Phase 4/5/6: Services | ✅ **RESOLVED** (Backend Sync Ready) |
| **TD-03** | Media | High-resolution assets served locally from `/public/assets` (~10.7 MB) | Low | Cloud Deployment Phase | Open (Target: S3 / CDN) |
| **TD-04** | Architecture | Root directory contains legacy vanilla prototype alongside `wristo-next/` | Low | Post-Parity Cleanup | Open (Target: Archive to `legacy/`) |
| **TD-05** | Testing | Visual regression performed via headless Chrome script without automated CI runner | Low | CI/CD Phase | ✅ **RESOLVED** (`.github/workflows/ci.yml`) |
| **TD-06** | Performance | Facet count computation is $O(N)$ per filter change | Low | Phase 3: Catalog & Inventory | ✅ **RESOLVED** (SQL Aggregations in CatalogService) |
| **TD-07** | Feature | Watch Comparison Engine omitted from Next.js port | High | Desktop Parity M1 | ✅ **RESOLVED** (`8935832`) |
| **TD-08** | Desktop Parity | Homepage sections, PLP controls, Standalone Pages & Copy | Medium | Desktop Parity M2–M5 | ✅ **RESOLVED** (`8853fbb`) |
| **TD-09** | Backend Auth | JWT Auth, RBAC, User Profiles & Seller Onboarding | High | Backend Phase 2 | ✅ **RESOLVED** (`be27ddc`) |
| **TD-10** | Backend Catalog & Stock | Master 40 Horology Seed, Multi-Vendor Listings & Atomic Stock Locking | High | Backend Phase 3 | ✅ **RESOLVED** (35/35 Tests Green) |
| **TD-11** | Backend Cart & Wishlist | Persistent Cart, Coupon Engine, Wishlist & 9-Axis Comparison Matrix | High | Backend Phase 4 | ✅ **RESOLVED** (56/56 Tests Green) |
| **TD-12** | Backend Checkout & Orders | Multi-Step Checkout, 15m Stock Hold, Order Tracking & Payment Gateway Integration | High | Backend Phase 5 | ✅ **RESOLVED** (66/66 Tests Green) |
| **TD-13** | Backend Provenance | Digital Authenticity Certificates, Guilloché Rosette, QR Verification & Vault Ledger | High | Backend Phase 6 | ✅ **RESOLVED** (77/77 Tests Green) |
| **TD-14** | Backend AI & Realtime | AI Watch Concierge Tool Calling, Search Tokenizer & STOMP WebSockets | High | Backend Phase 7 | ✅ **RESOLVED** (86/86 Tests Green) |
| **TD-15** | Backend Editorial CMS | Curators, 6 Canonical Essays, Slug Index, Admin CMS & Lead Story Election | High | Backend Phase 8 | ✅ **RESOLVED** (103/103 Tests Green) |
| **TD-16** | DevOps & Packaging | Multi-Stage Dockerfiles, `docker-compose.yml` & Standalone Next.js Bundle | High | Phase 9 (DevOps) | ✅ **RESOLVED** (`8b7c4b3`) |

---

## 3. Detailed Debt Analysis & Resolution Plan

### TD-01: In-Memory Client Filtering vs. Server-Side SQL Filtering (RESOLVED)
* **Initial Problem:** `src/services/productService.ts` originally implemented `getCatalogProducts()` filtering in-memory.
* **Resolution Applied (Backend Phase 3):**
  * Built Spring Data JPA multi-facet catalog queries in `WatchRepository` and `CatalogService`.
  * Exposed `/api/v1/watches`, `/api/v1/brands`, and `/api/v1/categories` with pagination (`PageResponse`), dynamic facet counts, and sorting.
* **Status:** ✅ **RESOLVED** with Spring Boot Phase 3 Catalog APIs.

---

### TD-02: Client-Side Session State (Cart, Wishlist, Comparison, Account)
* **Current State:** `CartContext.tsx`, `WishlistContext.tsx`, `ComparisonContext.tsx`, and `accountService.ts` persist state to browser `localStorage` under `wristo_cart`, `wristo_wishlist`, `wristo_comparison`, and `wristo_orders`.
* **Impact:** Items do not synchronize across devices, and user state is lost if browser cache is cleared.
* **Resolution Plan:** In Phase 4/5, synchronize client-side cart/wishlist with Spring Boot Redis-backed Cart & Orders APIs.
* **Status:** Open (Scheduled for Phase 4/5).

---

### TD-03: Media Delivery & Remote Image Optimization
* **Current State:** All 40 watch product cutouts, hero banners, and brand logos are bundled locally inside `wristo-next/public/assets/` (~10.7 MB).
* **Impact:** Git repository holds binary image files.
* **Resolution Plan:** Migrate image assets to an external CDN / S3 bucket during Cloud Deployment Phase.
* **Status:** Open.

---

### TD-04: Dual Codebase Structure (Vanilla Prototype + Next.js App)
* **Current State:** Workspace holds both vanilla prototype in root and production Next.js app in `wristo-next/`.
* **Resolution Plan:** Move root prototype files into `legacy/` once all backend endpoints are connected.
* **Status:** Open.

---

### TD-05: Automated End-to-End Test Suite (CI/CD)
* **Current State:** Visual regression testing is executed via PowerShell headless Chrome scripts.
* **Resolution Plan:** Implement GitHub Actions workflow (`.github/workflows/ci.yml`) for automated builds & tests.
* **Status:** Open.

---

### TD-06: Dynamic Facet Count Computation (RESOLVED)
* **Initial Problem:** In-memory loop in client was fast for 40 items, but required SQL aggregation for enterprise scaling.
* **Resolution Applied (Backend Phase 3):**
  * Implemented `CatalogService.computeFacets()` with grouped count queries across brands, movements, styles, case sizes, and price boundaries.
* **Status:** ✅ **RESOLVED** in Backend Phase 3.

---

### TD-07: Watch Comparison Engine (RESOLVED)
* **Initial Problem:** In `js/app.js`, side-by-side comparison was a primary feature (`renderComparison`, `toggleComparison`). During initial Next.js porting, this was left as an empty state.
* **Resolution Applied (`8935832`):**
  * Created `ComparisonContext.tsx` with max 4 watches, localStorage persistence, and toast notifications.
  * Built `FloatingComparisonDock.tsx` (bottom luxury tray with watch chips and minimize pill).
  * Built dedicated `/compare` route & `ComparisonClient.tsx` with 9-spec technical horology matrix.
  * Connected `Header.tsx`, `ProductCard.tsx`, and `ProductActions.tsx`.
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
* **Status:** ✅ **RESOLVED** across Milestones 1 to 5.

---

### TD-09: Backend Authentication & Seller Onboarding (RESOLVED)
* **Initial Problem:** Backend lacked authentication, user profile management, seller KYC onboarding, and RBAC authorization.
* **Resolution Applied (`be27ddc`):**
  * Flyway V3 & V4 schemas for auth, refresh tokens, sellers, seller users, documents, and brand authorizations.
  * Stateless JJWT 0.12.6 with HMAC-SHA256, UserPrincipal, and Spring Security 6 RBAC filter chains.
  * Full controller suites for auth, user profiles, addresses, seller onboarding, staff roles, and admin KYC verification.
* **Status:** ✅ **RESOLVED** in Backend Phase 2.

---

### TD-10: Backend Catalog, Seller Listings & Inventory Management (RESOLVED)
* **Initial Problem:** Backend lacked master 40 timepiece horology specs, multi-vendor seller listings, and transactional inventory controls.
* **Resolution Applied (Backend Phase 3):**
  * Flyway V5 (40 master watches + 40 horology specs), V6 (`seller_listings`, `inventories`, `inventory_movements`, `inventory_reservations`), and V7 (seed demo listings).
  * Multi-facet catalog search, dynamic facet aggregations, companion recommendations, and active offers.
  * Multi-vendor listing creation with SKU isolation and admin approval workflow.
  * Pessimistic row locking (`PESSIMISTIC_WRITE`), movement audit logging, and transactional stock reservations.
  * 35/35 automated unit and integration tests passing in `mvn test` (100% green).
* **Status:** ✅ **RESOLVED** in Backend Phase 3.

---

### TD-11: Backend Cart, Wishlist, Coupon Engine & Comparison Matrix (RESOLVED)
* **Initial Problem:** Shopping cart calculations, promotional vouchers, collector wishlists, and 9-spec watch comparison were handled entirely client-side without persistence, promo limits, or inventory cross-validation.
* **Resolution Applied (Backend Phase 4):**
  * Flyway V8 schema with `coupons`, `carts`, `cart_items`, `wishlists`, `wishlist_items`, foreign keys, indices, and seed promotional codes.
  * Promotional Coupon Engine with percentage/fixed calculation, min order validation, and admin CRUD.
  * Dual-session shopping cart (`X-Session-ID` guest / JWT collector user) with atomic session merging, real-time stock checks, gift wrapping notes, and stateless totals calculation.
  * Collector wishlist management with instant toggle, check, and atomic move-to-cart operations.
  * 9-axis horological comparison matrix validating 2–4 watches across movement, case, crystal, water resistance, and warranty.
  * 56/56 automated unit and integration tests passing in `mvn test` (100% green).
* **Status:** ✅ **RESOLVED** in Backend Phase 4.

---

### TD-12: Backend Checkout State Machine, Order Lifecycle & Payment Integration (RESOLVED)
* **Initial Problem:** Checkout progression, 15-minute stock hold guarantees, serialized luxury certificate generation, order state transitions (`CONFIRMED` -> `PROCESSING_VAULT` -> `DISPATCHED`), and cryptographic payment signature verification were simulated on the client side without backend transactionality or webhook verification.
* **Resolution Applied (Backend Phase 5):**
  * Flyway V9 schema with `orders`, `order_items`, `order_status_history`, `payments`, `checkout_sessions`, cascading foreign keys, indices, and seed records.
  * Multi-step checkout state machine (`/checkout/**`) coordinating 15-minute stock holds via `InventoryService`, sequential order identifiers (`WRT-2026-XXXXX`), authenticity certificate IDs (`CERT-CHRONO-XXXXX`), cart clearing, and payment association.
  * Customer order tracking (`/orders/my-orders`, `/orders/{orderNumber}`) and safe order cancellation (`/orders/{orderNumber}/cancel`) with automatic inventory restock and return movement logging.
  * Admin boutique order moderation (`/admin/orders`, `/admin/orders/{orderNumber}/status`) enforcing state transitions and armored courier tracking assignment.
  * Multi-gateway payment adapter & HMAC-SHA256 signature verification (`/payments/create-intent`, `/payments/verify`, `/payments/webhook`).
  * 66/66 automated unit and integration tests passing in `mvn test` (100% green).
* **Status:** ✅ **RESOLVED** in Backend Phase 5.

