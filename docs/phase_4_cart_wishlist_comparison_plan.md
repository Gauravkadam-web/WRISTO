# WRISTO — Phase 4 Implementation Plan: Cart, Wishlist & Comparison Backend Services

**Platform:** WRISTO Ultra-Luxury Watch Marketplace  
**Tech Stack:** Java 21 LTS, Spring Boot 3.3+, Spring Data JPA, PostgreSQL 16, Spring Security 6 (JWT), Flyway, OpenAPI 3  
**Target Module:** Cart, Coupon Promotional Engine, Collector Wishlist & Horology Comparison Engine  
**Status:** Ready for Review & Execution  
**Author:** Gaurav Kadam  
**Date:** October 2026  

---

## 1. Executive Summary & Architectural Scope

Phase 4 bridges the public timepiece catalog (delivered in Phase 3) with interactive collector commerce. It delivers enterprise-grade, transactional backend services for:

1. **Promotional Coupon & Discount Engine (`/api/v1/coupons/**`):** Dynamic coupon validation, fixed/percentage discounts, minimum order qualifications, maximum discount caps, usage limits, and promotional feeds.
2. **Persistent & Stateless Shopping Cart Services (`/api/v1/cart/**`):** Full cart lifecycle for authenticated users (`User`) and guest sessions (`sessionId`), with inventory stock validation, delivery tier selection, luxury gift wrap options, and real-time order total calculations.
3. **Collector Wishlist Synchronization (`/api/v1/wishlist/**`):** Dedicated wishlist persistence with catalog metadata, stock alerts, and atomic *"Move to Cart"* capability.
4. **Horology Comparison Engine (`/api/v1/compare/**`):** Multi-watch technical comparison API providing side-by-side 9-axis specifications matching the Next.js `/compare` matrix.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       WRISTO Frontend (Next.js 16)                      │
│      Cart Drawer • /cart • /wishlist • /compare • /checkout Stepper    │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ REST APIs (JSON / JWT)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   Spring Boot 3.3.4 Security Filter                     │
│          Public: /cart/calculate, /coupons/validate, /compare          │
│          Secured (JWT): /cart/**, /wishlist/**, /admin/coupons/**       │
└──────────────────┬─────────────────┬─────────────────┬──────────────────┘
                   │                 │                 │
                   ▼                 ▼                 ▼
            ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
            │  Cart Module │  │Wishlist Module│ │Coupon Engine │
            └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
                   │                 │                 │
                   ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    PostgreSQL 16 Database (Flyway V8)                   │
│   coupons • carts • cart_items • wishlists • wishlist_items • indexes   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Database Schema & Flyway Migration (`V8__init_cart_wishlist_coupon_schema.sql`)

```sql
-- =========================================================================
-- WRISTO Database Migration: V8 - Cart, Wishlist & Coupon Promotional Schema
-- =========================================================================

-- 1. Coupons & Promotions Table
CREATE TABLE coupons (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(32) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    discount_type VARCHAR(16) NOT NULL, -- 'PERCENTAGE', 'FIXED'
    discount_value NUMERIC(10, 2) NOT NULL,
    min_subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    max_discount NUMERIC(12, 2),
    usage_limit INT,
    times_used INT NOT NULL DEFAULT 0,
    starts_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Shopping Carts Table (Supports Authenticated Users and Guest Sessions)
CREATE TABLE carts (
    id VARCHAR(36) PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(64),
    coupon_id VARCHAR(36) REFERENCES coupons(id) ON DELETE SET NULL,
    is_gift_wrapped BOOLEAN NOT NULL DEFAULT FALSE,
    gift_message VARCHAR(500),
    delivery_tier VARCHAR(32) NOT NULL DEFAULT 'insured_express', -- 'insured_express', 'white_glove'
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_cart_user UNIQUE (user_id),
    CONSTRAINT uq_cart_session UNIQUE (session_id)
);

-- 3. Cart Items Table
CREATE TABLE cart_items (
    id VARCHAR(36) PRIMARY KEY,
    cart_id VARCHAR(36) NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    watch_id VARCHAR(32) NOT NULL REFERENCES watches(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_cart_watch UNIQUE (cart_id, watch_id),
    CONSTRAINT chk_cart_item_quantity CHECK (quantity > 0)
);

-- 4. Wishlists Table
CREATE TABLE wishlists (
    id VARCHAR(36) PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_wishlist_user UNIQUE (user_id)
);

-- 5. Wishlist Items Table
CREATE TABLE wishlist_items (
    id VARCHAR(36) PRIMARY KEY,
    wishlist_id VARCHAR(36) NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
    watch_id VARCHAR(32) NOT NULL REFERENCES watches(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_wishlist_watch UNIQUE (wishlist_id, watch_id)
);

-- Indexes for high-throughput reads & queries
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_carts_user ON carts(user_id);
CREATE INDEX idx_carts_session ON carts(session_id);
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_cart_items_watch ON cart_items(watch_id);
CREATE INDEX idx_wishlists_user ON wishlists(user_id);
CREATE INDEX idx_wishlist_items_wishlist ON wishlist_items(wishlist_id);
CREATE INDEX idx_wishlist_items_watch ON wishlist_items(watch_id);

-- Seed Initial Promotional Vouchers
INSERT INTO coupons (id, code, description, discount_type, discount_value, min_subtotal, max_discount, usage_limit, times_used, starts_at, expires_at, is_active)
VALUES
('cpn-wristo10', 'WRISTO10', '10% Horological Privilege Discount', 'PERCENTAGE', 10.00, 0.00, NULL, 10000, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '365 days', TRUE),
('cpn-horologyvip', 'HOROLOGYVIP', '₹2,500 VIP Collector Privilege', 'FIXED', 2500.00, 15000.00, NULL, 5000, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '365 days', TRUE),
('cpn-first15', 'FIRST15', '15% First Timepiece Acquisition', 'PERCENTAGE', 15.00, 0.00, 5000.00, 20000, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '365 days', TRUE),
('cpn-vault20', 'VAULT20', '20% Grand Complication Privilege', 'PERCENTAGE', 20.00, 30000.00, 10000.00, 1000, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '180 days', TRUE);
```

---

## 3. Domain Entities, Enums & Repositories

### Entities & Enums Package Structure (`com.wristo.modules.cart`, `com.wristo.modules.coupon`, `com.wristo.modules.wishlist`)

1. **`Coupon`**:
   - `id`, `code`, `description`, `DiscountType discountType` (`PERCENTAGE`, `FIXED`), `discountValue`, `minSubtotal`, `maxDiscount`, `usageLimit`, `timesUsed`, `startsAt`, `expiresAt`, `isActive`.
   - Repository: `CouponRepository.findByCodeIgnoreCaseAndIsActiveTrue(String code)`.

2. **`Cart` & `CartItem`**:
   - `Cart`: `id`, `User user`, `String sessionId`, `Coupon appliedCoupon`, `Boolean isGiftWrapped`, `String giftMessage`, `String deliveryTier` (`insured_express`, `white_glove`), `List<CartItem> items`.
   - `CartItem`: `id`, `Cart cart`, `Watch watch`, `Integer quantity`, `BigDecimal unitPrice`.
   - Repositories:
     - `CartRepository.findByUserId(UUID userId)`
     - `CartRepository.findBySessionId(String sessionId)`
     - `CartItemRepository.findByCartIdAndWatchId(String cartId, String watchId)`

3. **`Wishlist` & `WishlistItem`**:
   - `Wishlist`: `id`, `User user`, `List<WishlistItem> items`.
   - `WishlistItem`: `id`, `Wishlist wishlist`, `Watch watch`, `Instant createdAt`.
   - Repositories:
     - `WishlistRepository.findByUserId(UUID userId)`
     - `WishlistItemRepository.findByWishlistIdAndWatchId(String wishlistId, String watchId)`

---

## 4. DTO Contract Specifications

### A. Coupon DTOs
- `ValidateCouponRequest`: `{ code: String, subtotal: BigDecimal }`
- `CouponResponse`: `{ id, code, description, discountType, discountValue, minSubtotal, maxDiscount, calculatedDiscount, isValid, message }`
- `CreateCouponRequest` (Admin): `{ code, description, discountType, discountValue, minSubtotal, maxDiscount, usageLimit, startsAt, expiresAt }`

### B. Cart DTOs
- `AddToCartRequest`: `{ watchId: String, quantity: Integer }`
- `UpdateCartItemRequest`: `{ quantity: Integer }`
- `CartGiftOptionRequest`: `{ isGiftWrapped: Boolean, giftMessage: String }`
- `CartDeliveryOptionRequest`: `{ deliveryTier: String }`
- `CartItemResponse`: `{ id, watchId, model, brandName, price, originalPrice, imageUrl, categoryName, movement, caseDiameter, quantity, subtotal, inStock, stockAvailable }`
- `OrderTotalsResponse`: `{ subtotal, discount, giftWrapFee, shippingFee, taxAmount, totalAmount, appliedCoupon, giftPouchUnlocked, freeShippingEligible }`
- `CartResponse`: `{ id, items: List<CartItemResponse>, totalItems: Integer, isGiftWrapped, giftMessage, deliveryTier, totals: OrderTotalsResponse }`
- `CalculateTotalsRequest`: `{ items: List<CartItemInput>, couponCode: String, deliveryTier: String, isGiftWrapped: Boolean }`

### C. Wishlist DTOs
- `WishlistItemResponse`: `{ id, watchId, model, brandName, price, originalPrice, imageUrl, movement, style, rating, stockCount, inStock, addedAt }`
- `WishlistResponse`: `{ id, items: List<WishlistItemResponse>, totalItems: Integer }`
- `ToggleWishlistResponse`: `{ watchId: String, added: Boolean, inWishlist: Boolean, message: String }`

### D. Comparison Matrix DTOs
- `ComparisonSpecItem`: `{ label: String, values: Map<String, String>, isHighlight: Boolean }`
- `ComparisonWatchSummary`: `{ id, model, brandName, price, originalPrice, imageUrl, stockStatus, rating }`
- `ComparisonMatrixResponse`: `{ watches: List<ComparisonWatchSummary>, specs: List<ComparisonSpecItem> }`

---

## 5. Business Logic & Core Invariants

### A. Coupon Engine Calculations
- **Percentage Discount:** $\text{Discount} = \text{Subtotal} \times \frac{\text{discountValue}}{100}$ (capped at `maxDiscount` if defined).
- **Fixed Discount:** $\text{Discount} = \min(\text{discountValue}, \text{Subtotal})$.
- **Subtotal Qualification:** Rejects coupon if $\text{Subtotal} < \text{minSubtotal}$.
- **Expiry & Limit Verification:** Validates `startsAt <= now <= expiresAt` and `timesUsed < usageLimit`.

### B. Luxury Order Totals & Privilege Rules
- **Gift Wrap:** `isGiftWrapped = true` incurs a luxury presentation fee of ₹250 (or complimentary above ₹15,000).
- **Gift Pouch Unlock:** Unlocks complimentary silk travel pouch when `subtotal >= 15000` (`giftPouchUnlocked = true`).
- **Delivery Tiers:**
  - `insured_express`: Complimentary (₹0 fee), 2–3 business days transit.
  - `white_glove`: Boutique hand courier service (₹999 fee), 1–2 business days transit.
- **Stock Validation:** When adding/updating items, checks against `Watch.stockCount` and active `Inventory` to prevent overselling.

### C. Wishlist to Cart Atomic Migration
- `move-to-cart`: Transactionally inserts the watch into user's cart (or increments quantity if already present) and deletes the item from `wishlist_items`.

### D. 9-Axis Horological Comparison Matrix
- Aligns up to 4 watches across:
  1. Movement & Caliber Type
  2. Case Diameter & Profile
  3. Case Material & Metallurgy
  4. Dial & Sapphire Crystal
  5. Strap & Buckle Hardware
  6. Water Resistance Depth
  7. Power Reserve Duration
  8. Complications & Functions
  9. Price & Heritage Warranty

---

## 6. REST API Endpoints Overview

| Service | Method | Route | Security | Purpose |
|---|---|---|---|---|
| **Coupon** | `POST` | `/api/v1/coupons/validate` | Public | Validate promo code and calculate discount amount |
| **Coupon** | `GET` | `/api/v1/coupons/active` | Public | List active collector vouchers & promotions |
| **Coupon** | `POST` | `/api/v1/admin/coupons` | `ADMIN` | Create new promotional code |
| **Coupon** | `PUT` | `/api/v1/admin/coupons/{id}` | `ADMIN` | Update/toggle coupon status or discount parameters |
| **Cart** | `GET` | `/api/v1/cart` | Auth / Guest | Retrieve cart with live totals and stock checks |
| **Cart** | `POST` | `/api/v1/cart/items` | Auth / Guest | Add watch to cart with stock validation |
| **Cart** | `PUT` | `/api/v1/cart/items/{itemId}` | Auth / Guest | Update item quantity |
| **Cart** | `DELETE` | `/api/v1/cart/items/{itemId}` | Auth / Guest | Remove item from cart |
| **Cart** | `DELETE` | `/api/v1/cart` | Auth / Guest | Clear entire cart |
| **Cart** | `POST` | `/api/v1/cart/apply-coupon` | Auth / Guest | Apply coupon to cart |
| **Cart** | `DELETE` | `/api/v1/cart/remove-coupon` | Auth / Guest | Remove active coupon |
| **Cart** | `PUT` | `/api/v1/cart/gift-options` | Auth / Guest | Set gift wrap & personalized card message |
| **Cart** | `PUT` | `/api/v1/cart/delivery-option` | Auth / Guest | Select delivery tier (`insured_express`, `white_glove`) |
| **Cart** | `POST` | `/api/v1/cart/calculate` | Public | Stateless calculation of order totals & gifts |
| **Wishlist**| `GET` | `/api/v1/wishlist` | Authenticated | Retrieve user's saved timepieces |
| **Wishlist**| `POST` | `/api/v1/wishlist/toggle/{watchId}` | Authenticated | Toggle watch in/out of wishlist |
| **Wishlist**| `POST` | `/api/v1/wishlist/items/{watchId}` | Authenticated | Explicit add to wishlist |
| **Wishlist**| `DELETE` | `/api/v1/wishlist/items/{watchId}` | Authenticated | Remove watch from wishlist |
| **Wishlist**| `DELETE` | `/api/v1/wishlist` | Authenticated | Clear entire wishlist |
| **Wishlist**| `POST` | `/api/v1/wishlist/move-to-cart/{watchId}`| Authenticated | Atomically move watch to shopping cart |
| **Compare** | `GET` | `/api/v1/compare` | Public | Side-by-side 9-point technical comparison matrix |

---

## 7. Execution Checklist & Testing Strategy

- [ ] **Step 1: Database Migration (`V8__init_cart_wishlist_coupon_schema.sql`)**
  - Create tables, foreign keys, cascades, indexes, and seed default coupons.
- [ ] **Step 2: Entities & Enums**
  - Implement `Coupon`, `DiscountType`, `Cart`, `CartItem`, `Wishlist`, `WishlistItem`.
- [ ] **Step 3: Repositories**
  - Implement `CouponRepository`, `CartRepository`, `CartItemRepository`, `WishlistRepository`, `WishlistItemRepository`.
- [ ] **Step 4: DTOs**
  - Create all request and response records/DTOs in `modules/cart/dto`, `modules/coupon/dto`, `modules/wishlist/dto`, `modules/catalog/dto`.
- [ ] **Step 5: Services**
  - Implement `CouponService`, `CartService`, `WishlistService`, `ComparisonService`.
- [ ] **Step 6: Controllers & Security**
  - Implement `CouponController`, `AdminCouponController`, `CartController`, `WishlistController`, `ComparisonController`.
  - Update `SecurityBaseConfig` permitAll / authorized matchers.
- [ ] **Step 7: Automated Test Suites**
  - `CouponControllerTest.java` (percentage, fixed, min subtotal, expired).
  - `CartControllerTest.java` (add, quantity update, stock limits, coupon discount, gift options, stateless calculate).
  - `WishlistControllerTest.java` (add, toggle, remove, move to cart).
  - `ComparisonControllerTest.java` (matrix generation for 2 to 4 watches).
- [ ] **Step 8: Full Verification**
  - Execute `mvn clean test` (target: 100% green test suite across all modules).
  - Execute Next.js `npm run build` (target: 61/61 static/dynamic routes green).
