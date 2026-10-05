# WRISTO — Phase 5: Order Processing, Luxury Checkout State Machine & Payment Gateway Integration Implementation Plan

## 1. Executive Summary & Objective

Phase 5 establishes the **mission-critical transactional core** of WRISTO. It bridges the shopping cart, promotional coupon engine, multi-vendor seller inventory reservations, payment gateways (Razorpay & Stripe luxury escrow + simulated sandbox), and horological provenance certification into an enterprise-grade order lifecycle.

This plan details the complete database schema (`V9`), state machine transitions, REST API contracts, security rules, automated test suites, and frontend service synchronization.

---

## 2. Architecture & Domain Workflow

```
[ Client / Cart Drawer ]
        │
        ▼
[ POST /api/v1/checkout/initiate ] ──► Validates Cart & Coupon
        │                          ──► Atomic Stock Hold (InventoryReservationService - 15m)
        │                          ──► Generates Checkout Session & Payment Order
        ▼
[ Payment Gateway (Razorpay/Stripe/UPI/COD) ]
        │
        ▼
[ POST /api/v1/checkout/complete OR Webhook ]
        │
        ▼
[ Order Processing State Machine ]
  ├── 1. Verifies Gateway Signature / Payment Capture
  ├── 2. Converts Stock Hold ➔ Permanent SALE Movement
  ├── 3. Generates Serialized Order Number (WRT-2026-XXXXX)
  ├── 4. Generates Provenance Certificate Number (CERT-CHRONO-XXXXX)
  ├── 5. Increments Coupon Usage Count
  ├── 6. Clears User / Guest Shopping Cart
  └── 7. Logs Order Status History & Audit Trail
```

---

## 3. Database Schema & Flyway Migration (`V9__init_orders_checkout_payments_schema.sql`)

### 3.1 Tables Overview

1. **`orders`**:
   - `id` (`VARCHAR(36)` PRIMARY KEY) — internal UUID format `ord_...`.
   - `order_number` (`VARCHAR(32)` UNIQUE NOT NULL) — format `WRT-2026-XXXXX`.
   - `certificate_number` (`VARCHAR(32)` UNIQUE NOT NULL) — format `CERT-CHRONO-XXXXX`.
   - `user_id` (`UUID` NULL, FK to `users(id)` ON DELETE SET NULL) — supports guest checkout.
   - `customer_name` (`VARCHAR(255)` NOT NULL).
   - `customer_email` (`VARCHAR(255)` NOT NULL).
   - `customer_phone` (`VARCHAR(32)` NOT NULL).
   - `shipping_address_line1`, `shipping_address_line2`, `shipping_landmark`, `shipping_city`, `shipping_state`, `shipping_pincode`, `shipping_country`.
   - `delivery_tier` (`VARCHAR(32)` NOT NULL) — `'insured_express'` / `'white_glove'`.
   - `delivery_notes` (`VARCHAR(500)`).
   - `is_gift_wrapped` (`BOOLEAN` NOT NULL DEFAULT FALSE).
   - `gift_message` (`VARCHAR(500)`).
   - `coupon_id` (`VARCHAR(36)` NULL, FK to `coupons(id)` ON DELETE SET NULL).
   - `coupon_code` (`VARCHAR(32)` NULL).
   - `subtotal_amount` (`NUMERIC(12, 2)` NOT NULL).
   - `discount_amount` (`NUMERIC(12, 2)` NOT NULL DEFAULT 0.00).
   - `gift_wrap_fee` (`NUMERIC(12, 2)` NOT NULL DEFAULT 0.00).
   - `shipping_fee` (`NUMERIC(12, 2)` NOT NULL DEFAULT 0.00).
   - `tax_amount` (`NUMERIC(12, 2)` NOT NULL DEFAULT 0.00) — 18% GST calculation.
   - `total_amount` (`NUMERIC(12, 2)` NOT NULL).
   - `currency` (`VARCHAR(3)` NOT NULL DEFAULT 'INR').
   - `status` (`VARCHAR(32)` NOT NULL DEFAULT 'PENDING_PAYMENT') — enum string.
   - `payment_status` (`VARCHAR(32)` NOT NULL DEFAULT 'UNPAID') — enum string.
   - `payment_method` (`VARCHAR(32)` NOT NULL) — `'UPI'`, `'CARD'`, `'NETBANKING'`, `'COD'`, `'RAZORPAY'`, `'STRIPE'`.
   - `tracking_number` (`VARCHAR(64)` NULL).
   - `courier_partner` (`VARCHAR(100)` NULL) — e.g. `'Boutique Armored Courier'`, `'BlueDart Apex Luxury'`.
   - `estimated_delivery_at` (`TIMESTAMP WITH TIME ZONE` NULL).
   - `placed_at` (`TIMESTAMP WITH TIME ZONE` NULL).
   - `cancelled_at` (`TIMESTAMP WITH TIME ZONE` NULL).
   - `created_at`, `updated_at`.

2. **`order_items`**:
   - `id` (`VARCHAR(36)` PRIMARY KEY).
   - `order_id` (`VARCHAR(36)` NOT NULL, FK to `orders(id)` ON DELETE CASCADE).
   - `watch_id` (`VARCHAR(32)` NOT NULL, FK to `watches(id)`).
   - `seller_id` (`VARCHAR(32)` NULL, FK to `sellers(id)` ON DELETE SET NULL).
   - `seller_listing_id` (`VARCHAR(36)` NULL, FK to `seller_listings(id)` ON DELETE SET NULL).
   - `watch_model` (`VARCHAR(255)` NOT NULL).
   - `watch_brand` (`VARCHAR(100)` NOT NULL).
   - `watch_image_url` (`VARCHAR(500)`).
   - `movement_type` (`VARCHAR(50)`).
   - `case_size` (`VARCHAR(50)`).
   - `quantity` (`INT` NOT NULL DEFAULT 1, CHECK `quantity > 0`).
   - `unit_price` (`NUMERIC(12, 2)` NOT NULL).
   - `total_price` (`NUMERIC(12, 2)` NOT NULL).
   - `created_at`, `updated_at`.

3. **`order_status_history`**:
   - `id` (`VARCHAR(36)` PRIMARY KEY).
   - `order_id` (`VARCHAR(36)` NOT NULL, FK to `orders(id)` ON DELETE CASCADE).
   - `from_status` (`VARCHAR(32)` NULL).
   - `to_status` (`VARCHAR(32)` NOT NULL).
   - `changed_by` (`VARCHAR(255)` NOT NULL) — user email, system agent, or webhook.
   - `comment` (`VARCHAR(500)` NULL).
   - `created_at` (`TIMESTAMP WITH TIME ZONE` NOT NULL DEFAULT CURRENT_TIMESTAMP).

4. **`payments`**:
   - `id` (`VARCHAR(36)` PRIMARY KEY).
   - `order_id` (`VARCHAR(36)` NOT NULL, FK to `orders(id)` ON DELETE CASCADE).
   - `payment_gateway` (`VARCHAR(32)` NOT NULL) — `'RAZORPAY'`, `'STRIPE'`, `'MANUAL_MOCK'`, `'COD'`.
   - `transaction_id` (`VARCHAR(255)` UNIQUE NULL).
   - `gateway_order_id` (`VARCHAR(255)` NULL).
   - `gateway_payment_id` (`VARCHAR(255)` NULL).
   - `gateway_signature` (`VARCHAR(500)` NULL).
   - `amount` (`NUMERIC(12, 2)` NOT NULL).
   - `currency` (`VARCHAR(3)` NOT NULL DEFAULT 'INR').
   - `status` (`VARCHAR(32)` NOT NULL) — `'INITIATED'`, `'PROCESSING'`, `'SUCCESS'`, `'FAILED'`, `'REFUNDED'`.
   - `payment_method` (`VARCHAR(32)` NOT NULL).
   - `error_code` (`VARCHAR(100)` NULL).
   - `error_message` (`VARCHAR(500)` NULL).
   - `raw_payload` (`TEXT` NULL).
   - `created_at`, `updated_at`.

5. **`checkout_sessions`**:
   - `id` (`VARCHAR(36)` PRIMARY KEY) — session token for frontend checkout lock.
   - `user_id` (`UUID` NULL).
   - `session_id` (`VARCHAR(128)` NULL).
   - `reservation_ids` (`TEXT` NULL) — comma-separated `inventory_reservations` IDs.
   - `coupon_code` (`VARCHAR(32)` NULL).
   - `delivery_tier` (`VARCHAR(32)` NOT NULL DEFAULT 'insured_express').
   - `is_gift_wrapped` (`BOOLEAN` NOT NULL DEFAULT FALSE).
   - `gift_message` (`VARCHAR(500)` NULL).
   - `expires_at` (`TIMESTAMP WITH TIME ZONE` NOT NULL).
   - `is_completed` (`BOOLEAN` NOT NULL DEFAULT FALSE).
   - `created_at`, `updated_at`.

---

## 4. Order State Machine Transitions

| From Status | Allowed Next Status | Trigger / Actor | Actions Performed |
| :--- | :--- | :--- | :--- |
| **`PENDING_PAYMENT`** | `CONFIRMED` | Payment captured / COD selected | Confirms inventory hold (`SALE`), clears cart, increments coupon count, issues certificate. |
| **`PENDING_PAYMENT`** | `CANCELLED` | Customer cancellation / 15m timeout | Releases inventory hold (`RESERVATION_RELEASE`). |
| **`CONFIRMED`** | `PROCESSING_VAULT` | Admin / Horologist inspection | Horologist seals packaging and assigns physical serial certificate. |
| **`PROCESSING_VAULT`** | `DISPATCHED` | Logistics dispatch | Sets `tracking_number` and `courier_partner`. |
| **`DISPATCHED`** | `DELIVERED` | Courier delivery confirmation | Marks payment as `PAID` (if COD), marks order complete. |
| **`CONFIRMED` / `DISPATCHED`** | `CANCELLED` | Admin cancellation | Re-stocks items in warehouse inventory (`RETURN`). |
| **`CONFIRMED` / `DELIVERED`** | `REFUNDED` | Admin / Escrow return | Triggers gateway refund, updates payment status. |

---

## 5. Module Structure & Java Components

```
wristo-backend/src/main/java/com/wristo/modules/
├── checkout/
│   ├── controller/
│   │   └── CheckoutController.java          # /api/v1/checkout/**
│   ├── dto/
│   │   ├── InitiateCheckoutRequest.java
│   │   ├── InitiateCheckoutResponse.java
│   │   ├── CompleteCheckoutRequest.java
│   │   └── CheckoutSummaryResponse.java
│   ├── entity/
│   │   └── CheckoutSession.java
│   ├── repository/
│   │   └── CheckoutSessionRepository.java
│   └── service/
│       └── CheckoutService.java
│
├── order/
│   ├── controller/
│   │   ├── OrderController.java             # /api/v1/orders/** (Customer / Public tracking)
│   │   └── AdminOrderController.java        # /api/v1/admin/orders/** (Boutique management)
│   ├── dto/
│   │   ├── OrderResponse.java
│   │   ├── OrderItemResponse.java
│   │   ├── OrderStatusHistoryResponse.java
│   │   ├── UpdateOrderStatusRequest.java
│   │   ├── CancelOrderRequest.java
│   │   └── OrderFilterRequest.java
│   ├── entity/
│   │   ├── Order.java
│   │   ├── OrderItem.java
│   │   ├── OrderStatus.java                 # Enum
│   │   ├── PaymentStatus.java               # Enum
│   │   ├── PaymentMethod.java               # Enum
│   │   └── OrderStatusHistory.java
│   ├── repository/
│   │   ├── OrderRepository.java
│   │   ├── OrderItemRepository.java
│   │   └── OrderStatusHistoryRepository.java
│   └── service/
│       ├── OrderService.java
│       └── AdminOrderService.java
│
└── payment/
    ├── controller/
    │   └── PaymentController.java           # /api/v1/payments/**
    ├── dto/
    │   ├── CreatePaymentOrderRequest.java
    │   ├── PaymentOrderResponse.java
    │   ├── VerifyPaymentRequest.java
    │   ├── PaymentResponse.java
    │   └── WebhookPayload.java
    ├── entity/
    │   ├── Payment.java
    │   └── PaymentGatewayType.java          # Enum
    ├── repository/
    │   └── PaymentRepository.java
    └── service/
        ├── PaymentService.java
        ├── RazorpayGatewayProvider.java
        └── StripeGatewayProvider.java
```

---

## 6. REST API Endpoints Specification

### 6.1 Checkout Endpoints (`/api/v1/checkout`)
- `POST /api/v1/checkout/initiate` (Public/Auth)
  - Validates cart / line items, applies coupon, calculates order totals with taxes, reserves stock for 15 minutes, returns session ID & payment configuration.
- `POST /api/v1/checkout/complete` (Public/Auth)
  - Verifies payment (or sets COD), executes order state machine transition to `CONFIRMED`, assigns `WRT-2026-XXXXX` and `CERT-CHRONO-XXXXX`, clears shopping cart, and returns order summary.

### 6.2 Customer Order Endpoints (`/api/v1/orders`)
- `GET /api/v1/orders/my-orders` (Authenticated `ROLE_CUSTOMER`, `ROLE_ADMIN`)
  - Retrieves paginated order history of the authenticated user.
- `GET /api/v1/orders/{orderNumber}` (Public with email/phone verification OR Authenticated owner/admin)
  - Returns complete order details, item specs, shipping address, and tracking status.
- `POST /api/v1/orders/{orderNumber}/cancel` (Authenticated owner/admin)
  - Cancels order if still in `PENDING_PAYMENT` or `CONFIRMED` status, releasing warehouse stock.

### 6.3 Admin Order Endpoints (`/api/v1/admin/orders`)
- `GET /api/v1/admin/orders` (Authenticated `ROLE_ADMIN`)
  - Filter orders by status, date range, customer email, or payment method.
- `PATCH /api/v1/admin/orders/{orderNumber}/status` (Authenticated `ROLE_ADMIN`)
  - Transitions order state (`PROCESSING_VAULT`, `DISPATCHED`, `DELIVERED`, `CANCELLED`, `REFUNDED`) with tracking numbers and audit comments.

### 6.4 Payment Endpoints (`/api/v1/payments`)
- `POST /api/v1/payments/create-intent` (Public/Auth)
  - Creates gateway order intent (Razorpay Order ID or Stripe Client Secret).
- `POST /api/v1/payments/verify` (Public/Auth)
  - Verifies cryptographic signature (`razorpay_signature` / Stripe payment intent status).
- `POST /api/v1/payments/webhook` (Public Gateway Callback)
  - Idempotent webhook processing for asynchronous payment events (`payment.captured`, `payment.failed`).

---

## 7. Security & Error Handling

- **Error Codes (`ErrorCode.java`):**
  - `CHECKOUT_SESSION_EXPIRED` (400) — Checkout hold expired after 15m.
  - `CHECKOUT_INSUFFICIENT_STOCK` (409) — Requested watch stock no longer available.
  - `ORDER_NOT_FOUND` (404) — Order reference does not exist.
  - `ORDER_INVALID_STATE_TRANSITION` (400) — State transition violation (e.g. delivered to confirmed).
  - `ORDER_CANCEL_NOT_ALLOWED` (400) — Order already dispatched or delivered.
  - `PAYMENT_SIGNATURE_INVALID` (400) — Gateway signature mismatch.
  - `PAYMENT_GATEWAY_ERROR` (502) — Upstream gateway failure.
- **Security Base Config:**
  - `/checkout/**` ➔ `permitAll()` (with optional `@AuthenticationPrincipal`).
  - `/orders/my-orders` ➔ `authenticated()`.
  - `/orders/{orderNumber}` ➔ `permitAll()`.
  - `/admin/orders/**` ➔ `hasRole('ADMIN')`.
  - `/payments/webhook` ➔ `permitAll()`.

---

## 8. Quality Assurance & Test Strategy

1. **`CheckoutControllerTest.java`**:
   - Test checkout initiation with stock reservation.
   - Test checkout completion with valid coupon and totals.
   - Test checkout failure on out-of-stock item.
2. **`OrderControllerTest.java`**:
   - Test authenticated customer my-orders fetch.
   - Test public order lookup by order number.
   - Test order cancellation and stock release.
3. **`AdminOrderControllerTest.java`**:
   - Test admin order listing with status filtering.
   - Test status progression (`CONFIRMED` ➔ `PROCESSING_VAULT` ➔ `DISPATCHED` ➔ `DELIVERED`).
   - Test invalid state transition rejection.
4. **`PaymentControllerTest.java`**:
   - Test payment order creation and signature verification.
   - Test webhook idempotent callback processing.
5. **Full Regression Validation:**
   - 100% green `mvn test` in `wristo-backend/` (all 56 existing tests + new Phase 5 tests).
   - Clean Next.js build (`npm run build` in `wristo-next/`).

---

## 9. Implementation Roadmap & Execution Order

1. **Step 1:** Create Flyway migration `V9__init_orders_checkout_payments_schema.sql`.
2. **Step 2:** Add error codes in `ErrorCode.java` and configure endpoint permissions in `SecurityBaseConfig.java`.
3. **Step 3:** Implement Order & Payment Entities and Enums (`Order`, `OrderItem`, `OrderStatusHistory`, `Payment`, `CheckoutSession`).
4. **Step 4:** Implement Repositories with optimized queries and entity graphs.
5. **Step 5:** Implement `CheckoutService` with `InventoryReservationService` and `CouponService` integration.
6. **Step 6:** Implement `OrderService`, `AdminOrderService`, `PaymentService`, and gateway adapters.
7. **Step 7:** Implement `CheckoutController`, `OrderController`, `AdminOrderController`, and `PaymentController`.
8. **Step 8:** Write comprehensive unit and integration test suites.
9. **Step 9:** Execute `mvn test` and `npm run build`, and run the autonomous crawler.
10. **Step 10:** Update documentation (`PROGRESS.md`, `MEMORY.md`, `TECHNICALDEBT.md`) and await user confirmation before git commit/push.
