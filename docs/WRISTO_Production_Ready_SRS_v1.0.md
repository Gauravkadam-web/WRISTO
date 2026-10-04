# WRISTO --- Production-Ready Multi-Vendor Watch Marketplace

## Software Requirements Specification (SRS) v1.0

**Brand:** WRISTO\
**Tagline:** Your Time. Your Style.\
**Architecture:** Modular Monolith\
**Frontend:** Next.js + React + TypeScript + Tailwind CSS + GSAP\
**Backend:** Java 21 + Spring Boot + Spring Security + Spring Data JPA +
Hibernate + Maven\
**Database:** PostgreSQL\
**Migration:** Flyway --- FINAL\
**Local:** Local PostgreSQL, no Docker required\
**Production:** Vercel + Render + Supabase PostgreSQL + Docker\
**API:** REST/JSON `/api/v1` + OpenAPI/Swagger

------------------------------------------------------------------------

# 1. Purpose

This SRS converts the generic production-ready ecommerce reference into
a **WRISTO-specific multi-vendor watch marketplace**.

WRISTO is not a single-seller ecommerce site. It is a marketplace where
verified watch companies/retailers can sell watches through
seller-specific listings while WRISTO controls catalog governance,
checkout/payment flow, commission, settlement, marketplace operations
and customer experience.

The generic reference areas retained and adapted are: catalog, search,
cart, wishlist, checkout, pricing, payments, orders, inventory,
shipping, returns, refunds, reviews, customer management, CMS,
notifications, analytics, security, AI, testing, CI/CD, deployment and
observability.

------------------------------------------------------------------------

# 2. Locked Architecture Decisions

## 2.1 Marketplace

Only registered watch companies/retailers can sell.

Seller onboarding:

`Registration → Business Details → GST/PAN/Business Proof → Bank Verification → Brand/Distributor Authorization → WRISTO Review → Approved/Rejected`

Seller statuses:

`PENDING, UNDER_REVIEW, VERIFIED, REJECTED, SUSPENDED`

A seller business can have multiple seller staff.

Seller staff roles:

`OWNER, ADMIN, INVENTORY_MANAGER, ORDER_MANAGER, FINANCE_MANAGER`

Final authorization is permission-based.

## 2.2 Product vs Seller Listing

A canonical `Product` represents the watch/model.

A `SellerListing` represents one seller's commercial offer.

``` text
Brand
  ↓
Canonical Product
  ↓
Seller Listing
  ├── Seller
  ├── Seller SKU
  ├── Price
  ├── Inventory
  ├── Warranty
  ├── Condition
  └── Authenticity
```

The same product can have multiple seller listings.

## 2.3 Fulfillment

MVP: seller ships directly.

Architecture must support future:

`Seller Fulfillment + WRISTO Warehouse + 3PL`

## 2.4 Payment

Manual initially, provider-ready:

``` text
PaymentService
  ↓
PaymentProvider
  ├── ManualPaymentProvider
  ├── RazorpayProvider (future)
  └── StripeProvider (future)
```

Payment operations:

`createPayment, getPaymentStatus, verifyPayment, refundPayment`

Backend/provider verification is authoritative. Webhook-ready
architecture is required.

## 2.5 Shipping

Manual initially, provider-ready:

``` text
ShippingService
  ↓
ShippingProvider
  ├── ManualShippingProvider
  └── ShiprocketProvider (future)
```

Operations:

`createShipment, getShipmentStatus, generateLabel, cancelShipment, trackShipment`

## 2.6 Database

Local: local PostgreSQL.

Production: Supabase PostgreSQL.

**Flyway is the source of truth for schema migrations.**

Hibernate must not automatically create/update production schema.

Docker is production-only.

## 2.7 Auth

Email/password + email verification + forgot/reset password.

Google login-ready.

JWT access token + refresh token.

Roles:

`CUSTOMER, SELLER, SELLER_STAFF, ADMIN, SUPER_ADMIN`

RBAC + permission-based authorization.

## 2.8 Cart / Wishlist

Guest cart and wishlist use local storage.

Authenticated cart and wishlist use backend persistence.

Guest data merges into user data after login.

## 2.9 Checkout / Orders

Guest checkout is supported.

Customers can maintain multiple addresses.

Orders store address snapshots.

Order architecture:

``` text
Parent Order
  ↓
Seller Order / Fulfillment Group
  ↓
Order Items
  ↓
Shipment
```

Order lifecycle:

`PENDING_PAYMENT → PAID → PROCESSING → SHIPPED → DELIVERED → COMPLETED`

Side states:

`CANCELLED, RETURN_REQUESTED, RETURNED, REFUNDED, PAYMENT_FAILED`

## 2.10 Returns

WRISTO base policy + category-specific + seller-specific rules.

Seller rules cannot violate mandatory WRISTO protections.

## 2.11 Reviews

Separate:

-   Product Review
-   Seller Review

Seller rating can use reviews, delivery, cancellation, returns,
complaints and fulfillment performance.

------------------------------------------------------------------------

# 3. Technology and Engineering Rules

## Backend

Use modular monolith architecture:

``` text
Controller
  ↓
Service / Application Layer
  ↓
Domain / Business Rules
  ↓
Repository
  ↓
PostgreSQL
```

Controllers must remain thin.

Use DTOs rather than exposing entities directly.

Use Bean Validation and centralized exception handling.

## Frontend

Existing WRISTO frontend should be reused and progressively connected to
APIs.

Existing service abstractions such as
product/order/account/concierge/editorial services should become
API-backed rather than scattering requests across components.

Existing contexts for Cart, Wishlist, Search and Comparison should be
retained where useful.

## Configuration

No hardcoded:

-   database credentials
-   JWT secrets
-   provider API keys
-   AI keys
-   email credentials
-   storage credentials
-   payment credentials
-   shipping credentials
-   environment-specific URLs

All secrets/configuration must be environment-driven.

Business data must come from backend/API/database.

Static UI/design tokens may remain in frontend source.

------------------------------------------------------------------------

# 4. Core Modules

``` text
auth
user
customer
seller
catalog
inventory
cart
wishlist
pricing
coupon
checkout
order
payment
shipping
returnorder
refund
review
commission
settlement
payout
notification
cms
crm
search
ai
analytics
audit
storage
common
```

Suggested CRM structure:

``` text
crm/customer
crm/seller
crm/segment
crm/interaction
crm/ticket
crm/conversation
crm/activity
```

------------------------------------------------------------------------

# 5. Database Domain Model

Core identity:

`users, roles, permissions, user_roles, role_permissions, refresh_tokens, verification_tokens, reset_tokens`

Seller:

`sellers, seller_users, seller_documents, seller_verifications, seller_brand_authorizations`

Catalog:

`brands, categories, products, product_images, product_attributes, seller_listings`

Inventory:

`inventories, inventory_movements, inventory_reservations`

Customer:

`customer_profiles, addresses`

Shopping:

`carts, cart_items, wishlists, wishlist_items`

Pricing:

`coupons, coupon_rules, discounts, tax_rules`

Orders:

`orders, seller_orders, order_items, order_addresses, order_status_history`

Payments:

`payments, payment_transactions, payment_events`

Shipping:

`shipments, shipment_events`

Returns/refunds:

`return_requests, return_items, return_events, refunds, refund_transactions`

Marketplace finance:

`commission_rules, commissions, seller_earnings, settlements, seller_payouts, payout_transactions`

Reviews:

`product_reviews, seller_reviews, review_media, review_moderation`

CRM:

`customer_segments, customer_interactions, support_tickets, ticket_messages, crm_conversations, crm_activities`

Content:

`cms_contents, cms_media, seo_metadata, journal_articles`

Notifications:

`notifications, notification_templates, notification_deliveries`

Audit/analytics:

`business_events, analytics_events, audit_logs`

All schema changes must use Flyway migrations.

------------------------------------------------------------------------

# 6. Inventory Rules

Inventory belongs to seller listings.

Track:

`totalQuantity, availableQuantity, reservedQuantity, soldQuantity`

States:

`AVAILABLE, RESERVED, SOLD`

Checkout:

``` text
Validate stock
  ↓
Reserve stock
  ↓
Payment
  ↓
Success → Sold
Failure → Release reservation
```

Use transactional operations and row locking/atomic updates to prevent
overselling.

Inventory movement history must be auditable.

------------------------------------------------------------------------

# 7. Pricing / Coupons / Tax

Backend is authoritative.

Recommended calculation:

``` text
Seller Price
  ↓
Discount
  ↓
Coupon
  ↓
Tax/GST
  ↓
Shipping
  ↓
Final Amount
```

Support:

-   seller discount
-   platform coupon
-   seller coupon
-   category/brand coupon
-   first-order coupon
-   minimum cart value
-   percentage/fixed discount
-   maximum cap
-   validity
-   usage limits
-   per-customer limits

Coupon funding:

`WRISTO, SELLER, SHARED`

Pricing must be recalculated at checkout.

------------------------------------------------------------------------

# 8. Marketplace Settlement

Customer pays WRISTO-controlled payment flow.

``` text
Customer Payment
  ↓
Gross Order
  ↓
Seller Earnings
  ↓
WRISTO Commission
  ↓
Payment/Adjustments
  ↓
Seller Payable
  ↓
Delivered + Return Window Complete
  ↓
Seller Payout
```

Commission: category-based + seller-specific override.

Payout states:

`PENDING, ELIGIBLE, PROCESSING, PAID, FAILED, ON_HOLD`

------------------------------------------------------------------------

# 9. Search

MVP:

-   PostgreSQL full-text search
-   `pg_trgm` where appropriate
-   database indexes

Search:

-   brand
-   model
-   category
-   style
-   movement
-   gender
-   material
-   tags

Filters:

-   price
-   brand
-   category
-   movement
-   case size
-   strap
-   dial
-   gender
-   style
-   rating
-   availability

Architecture must be future-ready for OpenSearch/Elasticsearch.

------------------------------------------------------------------------

# 10. AI Concierge

AI is a business capability, not a generic chatbot.

``` text
Customer
  ↓
AI Concierge
  ↓
Intent / Structured Query
  ↓
Catalog + Search APIs
  ↓
Actual Product / Seller Listing Data
  ↓
AI Response
```

Example:

> Find me a black automatic watch for office use under ₹50,000.

AI may extract filters, but the catalog/search service decides which
products actually exist.

AI must never invent:

-   products
-   prices
-   inventory
-   sellers
-   order status
-   payment status
-   return eligibility
-   policies

Future capabilities:

-   natural-language watch search
-   style matching
-   product comparison
-   recommendations
-   review summarization
-   customer support
-   admin insights

Use provider abstraction, structured outputs, tool calling, validation,
rate limits, cost controls, timeout/fallback and prompt-injection
protections.

------------------------------------------------------------------------

# 11. CRM

## Customer 360

Track:

-   profile
-   orders
-   wishlist
-   cart
-   reviews
-   returns
-   tickets
-   conversations
-   preferences
-   relevant activity
-   order count
-   total spend
-   AOV
-   last order

Segments:

`NEW_CUSTOMER, ACTIVE_CUSTOMER, REPEAT_CUSTOMER, HIGH_VALUE_CUSTOMER, INACTIVE_CUSTOMER, AT_RISK`

## Seller CRM

Track:

-   verification
-   orders
-   revenue
-   commission
-   payouts
-   complaints
-   SLA
-   returns
-   support
-   performance

## Support

Ticket categories:

`ORDER, PAYMENT, SHIPPING, RETURN, REFUND, PRODUCT, SELLER_COMPLAINT, AUTHENTICITY, GENERAL`

------------------------------------------------------------------------

# 12. Notifications

Architecture:

``` text
Business Event
  ↓
NotificationService
  ↓
NotificationProvider
  ├── Email
  ├── In-App
  ├── SMS (future)
  ├── WhatsApp (future)
  └── Push (future)
```

MVP: email + in-app.

Events include account verification, password reset, order, payment,
shipping, delivery, return, refund, seller approval and payout.

Notification processing should be separated from core business
transactions.

------------------------------------------------------------------------

# 13. CMS

Use a lightweight editorial CMS.

Manage:

-   homepage campaign content
-   banners
-   journal articles
-   buying guides
-   brand stories
-   FAQs
-   policies
-   SEO metadata

CMS must not control the React component system, design tokens,
typography, GSAP animations or core checkout UX.

------------------------------------------------------------------------

# 14. Analytics

MVP analytics can use PostgreSQL/business events.

Track:

-   orders
-   GMV
-   revenue
-   commission
-   payouts
-   returns
-   refunds
-   inventory
-   seller performance
-   product views
-   searches
-   wishlist
-   add-to-cart
-   checkout started
-   purchases
-   cart abandonment
-   popular brands/styles/price ranges

Future data warehouse/event infrastructure is optional.

------------------------------------------------------------------------

# 15. API Standards

Base:

`/api/v1`

Use consistent REST naming, DTOs, validation, pagination, filtering,
sorting and error handling.

Success:

``` json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

Error:

``` json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product not found"
  }
}
```

Include request/correlation IDs.

Idempotency is required for sensitive operations such as payment, order
creation, refund and cancellation.

OpenAPI/Swagger is required.

------------------------------------------------------------------------

# 16. Admin Panel

``` text
Dashboard
Catalog
  ├── Products
  ├── Brands
  ├── Categories
  └── Product Approvals
Sellers
  ├── Applications
  ├── Verification
  ├── Sellers
  └── Seller Staff
Inventory
Orders
Payments
Shipping
Returns
Refunds
Commission
Payouts
CRM
  ├── Customers
  ├── Segments
  ├── Tickets
  ├── Conversations
  └── Activity
Reviews
Coupons
CMS
Notifications
Analytics
AI Insights
Users
Roles
Permissions
Audit Logs
Settings
```

------------------------------------------------------------------------

# 17. Security

Mandatory:

-   HTTPS in production
-   password hashing
-   JWT/refresh-token security
-   RBAC and permission checks
-   input validation
-   CORS
-   secure headers
-   rate limiting
-   secrets externalization
-   authorization on protected operations
-   safe file upload validation
-   audit logging
-   no sensitive secrets in logs
-   no business-rule trust in frontend

Backend must recalculate price, discount, tax, coupon, stock,
permissions, payment and order state.

------------------------------------------------------------------------

# 18. Audit Logs

Sensitive actions must be traceable.

Examples:

-   seller approval/rejection/suspension
-   product approval/rejection
-   price change
-   commission change
-   payout
-   refund
-   order cancellation
-   inventory adjustment
-   role/permission change

Audit record:

`actor, actorRole, action, entityType, entityId, oldValue, newValue, timestamp, requestId`

Do not log passwords, API keys or unnecessary sensitive information.

------------------------------------------------------------------------

# 19. Testing Strategy

Backend:

-   JUnit 5
-   Mockito
-   Spring Boot Test
-   Testcontainers

Frontend:

-   Vitest
-   React Testing Library

E2E:

-   Playwright

Test:

-   authentication
-   seller isolation
-   catalog
-   search
-   cart
-   wishlist
-   checkout
-   pricing
-   inventory reservation
-   payment
-   order splitting
-   shipping
-   cancellation
-   returns
-   refunds
-   reviews
-   admin permissions
-   seller onboarding

Critical concurrency test:

`Two customers + last available watch → only one successful reservation/purchase.`

------------------------------------------------------------------------

# 20. Observability / Reliability

Initial:

-   Spring Boot Actuator
-   SLF4J
-   Logback
-   correlation/request IDs

Monitor:

-   API errors
-   response time
-   DB errors
-   authentication failures
-   payment failures
-   shipping failures
-   inventory inconsistencies
-   job failures
-   AI failures
-   external provider failures

Future:

-   Sentry
-   Prometheus
-   Grafana
-   centralized logging

External failures must support appropriate timeout, retry, fallback and
idempotency behavior.

------------------------------------------------------------------------

# 21. PHASE-WISE IMPLEMENTATION

## PHASE 1 --- Foundation, Architecture & Database

### Goal

Create the technical foundation.

### Work

Backend: - Spring Boot - Java 21 - Maven - modular package structure -
environment configuration - DTO foundation - validation - global
exception handling - API response/error model - OpenAPI - Actuator -
CORS - logging

Database: - local PostgreSQL - Flyway - ID strategy - naming
conventions - timestamps - indexes strategy - audit strategy -
soft-delete rules where justified

Frontend: - API client foundation - environment configuration - preserve
existing service/context architecture

### Deliverables

-   backend starts
-   frontend starts
-   DB connects
-   Flyway works
-   Swagger works
-   health endpoint works
-   clean database can be initialized

### Acceptance

-   no hardcoded credentials
-   migrations execute successfully
-   application restart is safe
-   schema is controlled by Flyway

------------------------------------------------------------------------

## PHASE 2 --- Authentication, Authorization & Seller Onboarding

### Goal

Secure identity and marketplace access.

### Work

Customer: - registration - login - logout - email verification -
forgot/reset password - profile - addresses

Security: - JWT - refresh token - password hashing - roles - permissions

Seller: - registration - business details - documents - verification -
brand authorization - admin review - approval/rejection - suspension

Seller staff: - invite/manage staff - roles/permissions - seller
isolation

### Acceptance

-   protected endpoints require authentication
-   role restrictions work
-   seller cannot access another seller's data
-   admin can approve/reject seller
-   passwords are never plaintext

------------------------------------------------------------------------

## PHASE 3 --- Catalog, Seller Listings & Inventory

### Goal

Build the core WRISTO marketplace catalog.

### Work

Catalog: - brands - categories - products - images - specifications -
attributes - SEO data

Seller: - list existing product - submit new product - seller SKU -
price - warranty - condition - authenticity - listing status - admin
approval

Inventory: - available/reserved/sold - stock adjustment - reservations -
movements - low stock

### Acceptance

-   same watch can have multiple sellers
-   seller listing is separate from product
-   new products require approval
-   inventory is seller-specific
-   stock cannot go negative
-   reservation is transactional
-   inventory changes are auditable

------------------------------------------------------------------------

## PHASE 4 --- Search, Cart, Wishlist & Checkout

### Goal

Implement shopping experience.

### Work

Search: - keyword - autocomplete - filters - sorting - pagination -
PostgreSQL search

Cart: - guest cart - authenticated cart - merge - seller-aware items -
server-side validation

Wishlist: - guest - authenticated - merge - move to cart

Checkout: - address - shipping - coupon - tax - pricing - seller
grouping - final amount

### Acceptance

-   final price is backend-calculated
-   stock is validated
-   cart merge works
-   coupon is server-validated
-   seller grouping works
-   unavailable items cannot be purchased

------------------------------------------------------------------------

## PHASE 5 --- Payment, Orders, Shipping & Settlement

### Goal

Create reliable marketplace transactions.

### Work

Payment: - PaymentService - ManualPaymentProvider - transactions -
verification - refund abstraction - webhook-ready design - idempotency

Orders: - parent order - seller orders - order items - address
snapshot - state history - cancellation rules

Shipping: - ShippingService - ManualShippingProvider - shipment -
tracking - shipment events - seller fulfillment

Settlement: - commission - seller earnings - settlement - payout
eligibility - payout state

### Acceptance

-   duplicate payment/order request is safe
-   payment is server-authoritative
-   multi-seller checkout creates correct seller orders
-   seller sees only own orders
-   shipments are seller-specific
-   commission is correct
-   payout waits for delivered + return-window completion

------------------------------------------------------------------------

## PHASE 6 --- Returns, Refunds, Reviews, Notifications & CRM

### Goal

Complete post-purchase and relationship operations.

### Work

Returns: - request - policy validation - approval/rejection - return
events - inspection

Refunds: - initiation - transaction - status - payment linkage

Reviews: - product - seller - verified purchase - moderation

Notifications: - email - in-app - templates - delivery history

CRM: - Customer 360 - segments - customer activity - seller CRM -
support tickets - conversations

### Acceptance

-   eligible return can be requested
-   refund links to payment
-   reviews can require verified purchase
-   events trigger notifications
-   CRM shows relevant customer/seller history

------------------------------------------------------------------------

## PHASE 7 --- CMS, Analytics, AI Concierge & Full Admin

### Goal

Add intelligence and business operations.

### Work

CMS: - journal - buying guides - brand stories - campaigns - FAQs -
policies - SEO content

Analytics: - GMV - revenue - commission - seller performance -
inventory - customer/product metrics - search/cart/checkout events

AI: - AI Concierge - natural-language search - structured intent -
catalog tool calls - seller listing lookup - product comparison -
recommendations - safe response validation

Admin: - complete Admin modules - AI insights - audit views - reports

### Acceptance

-   CMS data comes from backend
-   analytics are data-derived
-   AI only recommends real catalog/listing data
-   AI cannot invent business facts
-   admin permissions are enforced
-   sensitive admin actions are audited

------------------------------------------------------------------------

## PHASE 8 --- Production Hardening, Testing, CI/CD & Deployment

### Goal

Make WRISTO production-oriented.

### Work

Testing: - unit - integration - API - security - frontend - E2E -
concurrency

Security: - secrets audit - auth review - permission review - CORS -
rate limits - secure headers - file validation

Performance: - DB indexes - N+1 review - query optimization -
pagination - image optimization - caching review

CI/CD:

``` text
GitHub
  ↓
GitHub Actions
  ↓
Build
  ↓
Test
  ↓
Security/Quality Checks
  ↓
Docker Build
  ↓
Deployment
```

Production:

``` text
Next.js → Vercel
Spring Boot → Render + Docker
PostgreSQL → Supabase
Migration → Flyway
```

### Acceptance

-   production build succeeds
-   Docker build succeeds
-   Flyway works against production DB
-   no secrets in Git
-   critical tests pass
-   E2E flows pass
-   health/monitoring works
-   deployment is repeatable

------------------------------------------------------------------------

# 22. Phase Dependency Graph

``` text
PHASE 1
Foundation + DB
    ↓
PHASE 2
Auth + Seller
    ↓
PHASE 3
Catalog + Listings + Inventory
    ↓
PHASE 4
Search + Cart + Wishlist + Checkout
    ↓
PHASE 5
Payment + Orders + Shipping + Settlement
    ↓
PHASE 6
Returns + Refunds + Reviews + Notifications + CRM
    ↓
PHASE 7
CMS + Analytics + AI + Admin
    ↓
PHASE 8
Testing + Security + CI/CD + Production
```

Do not implement later phases by inventing missing dependencies.

Examples:

-   AI Concierge requires reliable catalog/search APIs.
-   Seller payout requires reliable order/payment/return states.
-   Production deployment requires tested migrations and critical
    workflows.

------------------------------------------------------------------------

# 23. Antigravity Execution Protocol

For every phase:

``` text
1. Read the SRS and current phase only.
2. Inspect the existing repository.
3. Reuse existing working code.
4. Identify dependencies.
5. Implement database changes through Flyway.
6. Implement backend/domain logic.
7. Implement/update REST APIs.
8. Integrate frontend.
9. Add tests.
10. Run backend build.
11. Run frontend build.
12. Run relevant tests.
13. Fix failures.
14. Verify acceptance criteria.
15. Document completed work.
16. Create a meaningful Git commit.
17. STOP at the phase boundary.
```

Antigravity must not implement all phases in one prompt.

------------------------------------------------------------------------

# 24. Phase Completion Checklist

Every phase must finish with:

``` text
[ ] Feature implementation complete
[ ] Flyway migrations complete
[ ] Backend build passes
[ ] Frontend build passes
[ ] Tests pass
[ ] API documented
[ ] Security checked
[ ] No hardcoded secrets
[ ] No hardcoded business data
[ ] Existing features verified
[ ] Acceptance criteria verified
[ ] Git commit created
```

Suggested commits:

``` text
feat(phase-01): establish project foundation
feat(phase-02): implement authentication and seller onboarding
feat(phase-03): implement catalog listings and inventory
feat(phase-04): implement search cart wishlist and checkout
feat(phase-05): implement payment orders shipping and settlement
feat(phase-06): implement returns reviews notifications and crm
feat(phase-07): implement cms analytics ai and admin
feat(phase-08): production hardening ci cd and deployment
```

------------------------------------------------------------------------

# 25. Definition of Done

A phase is complete only when:

1.  Required functionality works.
2.  Backend business rules are enforced.
3.  Database changes use Flyway.
4.  APIs are documented.
5.  Frontend is integrated.
6.  Tests pass.
7.  Existing functionality is not broken.
8.  Security requirements are satisfied.
9.  Business data is not hardcoded in frontend.
10. Secrets are not committed.
11. Acceptance criteria are verified.
12. The next phase can start safely.

------------------------------------------------------------------------

# 26. Final WRISTO Architecture

``` text
CUSTOMER
   ↓
NEXT.JS / REACT
   ↓
REST API /api/v1
   ↓
SECURITY + BUSINESS MODULES + AI
   ↓
SERVICE LAYER
   ↓
REPOSITORIES
   ↓
POSTGRESQL
   ↓
FLYWAY MIGRATIONS

Business Modules:
Catalog
Search
Seller
Inventory
Cart
Wishlist
Checkout
Order
Payment
Shipping
Returns
Refunds
Reviews
Commission
Settlement
Payout
CRM
CMS
Notifications
Analytics
Audit
AI

Provider Abstractions:
PaymentProvider
ShippingProvider
StorageProvider
NotificationProvider
AI Provider

Production:
Vercel + Render/Docker + Supabase PostgreSQL
```

------------------------------------------------------------------------

# 27. Final WRISTO Customer Flow

``` text
Home
 ↓
Search / Category / AI Concierge
 ↓
Product Details
 ↓
Compare Seller Listings
 ↓
Select Seller Offer
 ↓
Cart
 ↓
Checkout
 ↓
Inventory Reservation
 ↓
Payment
 ↓
WRISTO Parent Order
 ↓
Seller Order(s)
 ↓
Seller Fulfillment
 ↓
Shipment
 ↓
Delivery
 ↓
Return Window
 ↓
Seller Payout Eligibility
 ↓
Settlement
 ↓
Review
 ↓
CRM / Analytics
```

------------------------------------------------------------------------

# 28. Final Scope Priorities

## P0 --- Core Marketplace

-   foundation
-   authentication
-   seller onboarding
-   catalog
-   seller listings
-   inventory
-   search
-   cart
-   wishlist
-   checkout
-   payment architecture
-   orders
-   shipping
-   returns
-   refunds
-   reviews
-   commission
-   settlement
-   admin
-   security

## P1 --- Business Intelligence and Operations

-   CRM
-   notifications
-   CMS
-   analytics
-   coupons
-   seller analytics
-   AI Concierge
-   audit logs
-   E2E testing
-   CI/CD
-   monitoring

## P2 --- Scale / Future Providers

-   Razorpay
-   Stripe
-   Shiprocket
-   Redis
-   OpenSearch
-   advanced recommendations
-   vector/RAG infrastructure
-   WhatsApp
-   SMS
-   push
-   WRISTO warehouse
-   3PL
-   analytics warehouse
-   advanced AI automation

P2 capabilities must be architecturally possible without unnecessarily
delaying MVP.

------------------------------------------------------------------------

# 29. Final Implementation Principle

**Build one phase at a time.**

``` text
SRS
 ↓
Phase 1
 ↓
Verify
 ↓
Phase 2
 ↓
Verify
 ↓
Phase 3
 ↓
Verify
 ↓
Phase 4
 ↓
Verify
 ↓
Phase 5
 ↓
Verify
 ↓
Phase 6
 ↓
Verify
 ↓
Phase 7
 ↓
Verify
 ↓
Phase 8
 ↓
Production
```

WRISTO must remain a **premium, verified multi-vendor watch
marketplace**, not a generic CRUD ecommerce project.

**End of WRISTO SRS v1.0**
