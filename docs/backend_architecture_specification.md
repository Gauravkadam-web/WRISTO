# WRISTO — Backend Architecture & Complete API Specification

**Platform:** WRISTO Ultra-Luxury Watch Marketplace  
**Frontend Architecture:** Next.js 16+ (App Router, Turbopack, React 19, TypeScript) — 61 SSG/Dynamic Routes  
**Target Backend Tech Stack:** Java 21 LTS + Spring Boot 3.3+ + PostgreSQL 16 + Redis 7 + Flyway + Spring Security 6 (JWT) + Spring AI / Google Gemini SDK + Docker  
**Status:** Production Ready Specification  
**Author / Lead:** Gaurav Kadam  
**Last Updated:** October 2026  

---

## 1. Executive Overview & Architecture Principles

WRISTO's frontend was architected around a strict decoupled contract principle: **"Presentation does not know where content comes from."** All data operations on the frontend pass through dedicated service contracts in `wristo-next/src/services/` (`productService.ts`, `orderService.ts`, `accountService.ts`, `journalService.ts`).

This backend architecture specification provides the complete engineering blueprint for building, testing, containerizing, and deploying the production Spring Boot backend. Once deployed, the frontend will connect seamlessly by setting `NEXT_PUBLIC_API_URL=http://localhost:8080` without requiring any changes to presentation components.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       WRISTO Frontend (Next.js 16)                      │
│                  61 Routes • SSR / SSG • Client Contexts                │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ REST API / JSON (Over HTTPS/CORS)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Spring Boot 3.3.x API Gateway                        │
│            Security Filter Chain • JWT Auth • Rate Limiter              │
└──────┬─────────────────┬──────────────────┬─────────────────┬───────────┘
       │                 │                  │                 │
       ▼                 ▼                  ▼                 ▼
┌──────────────┐  ┌──────────────┐   ┌──────────────┐  ┌──────────────┐
│ Watch Catalog│  │ Cart & Order │   │ Account &    │  │ AI Concierge │
│   Service    │  │   Service    │   │  Provenance  │  │   Service    │
└──────┬───────┘  └──────┬───────┘   └──────┬───────┘  └──────┬───────┘
       │                 │                  │                 │
       ▼                 ▼                  ▼                 ▼
┌──────────────────────────────┐     ┌────────────────────────────────┐
│   PostgreSQL 16 (Master DB)  │     │   Redis 7 (Cache & Sessions)   │
│ Flyway Migrations (V1 - V7)  │     │ Catalog Facets • Rate Limiting │
└──────────────────────────────┘     └────────────────────────────────┘
```

---

## 2. Technology Stack & Key Dependencies

| Component | Technology | Version | Purpose |
|---|---|---|---|
| **Runtime** | Java LTS | 21 | High-performance virtual threads (Project Loom), modern language features |
| **Framework** | Spring Boot | 3.3.x | Core enterprise microframework, RESTful web services, dependency injection |
| **Persistence** | Spring Data JPA / Hibernate | 6.5+ | Object-relational mapping, specification filtering, pagination |
| **Database** | PostgreSQL | 16 | ACID-compliant relational storage, JSONB support for technical specs |
| **Caching & State** | Redis | 7.x | High-speed cache for catalog facets, rate limiting, and temporary guest carts |
| **Migration** | Flyway | 10.x | Version-controlled, reproducible SQL database migrations |
| **Security** | Spring Security + Nimbus JWT | 6.3+ | Stateless JWT authentication, RBAC authorization, BCrypt hashing |
| **AI Integration** | Google Gemini API (Spring AI / SDK) | 1.5+ | Real-time horological conversational advice & semantic watch matching |
| **Documentation** | Springdoc OpenAPI (Swagger UI) | 2.5+ | Interactive OpenAPI 3.0 API docs at `/swagger-ui/index.html` |
| **Build Tool** | Gradle (Kotlin DSL) / Maven | Java 21 | Build automation, dependency management, reproducible JAR generation |
| **Containerization**| Docker & Docker Compose | Latest | Standardized local development and cloud production deployment |

---

## 3. Database Schema & Entity-Relationship Design (PostgreSQL)

```
                            ┌───────────────────┐
                            │      BRANDS       │
                            ├───────────────────┤
                            │ id (PK, VARCHAR)  │
                            │ name (UNIQUE)     │
                            │ country           │
                            │ established       │
                            │ headline          │
                            │ description       │
                            └─────────┬─────────┘
                                      │ 1
                                      │
                                      │ N
┌──────────────────┐        ┌─────────▼─────────┐        ┌──────────────────┐
│    CATEGORIES    │ N    M │      WATCHES      │ 1    N │    WATCH_SPECS   │
├──────────────────┼────────┤ (PRODUCTS TABLE)  ├────────┼──────────────────┤
│ id (PK, VARCHAR) │        ├───────────────────┤        │ watch_id (FK)    │
│ slug (UNIQUE)    │        │ id (PK, VARCHAR)  │        │ case_diameter_mm │
│ title            │        │ brand_id (FK)     │        │ case_material    │
│ short_title      │        │ model             │        │ dial_color       │
│ description      │        │ price (NUMERIC)   │        │ strap_material   │
└──────────────────┘        │ original_price    │        │ water_resistance │
                            │ movement_type     │        │ power_reserve_hrs│
                            │ style_type        │        └──────────────────┘
                            │ gender            │
                            │ stock_count       │
                            │ badge             │
                            │ image_url         │
                            └─────────┬─────────┘
                                      │ 1
                                      │
                                      │ N
┌──────────────────┐        ┌─────────▼─────────┐        ┌──────────────────┐
│      USERS       │ 1    N │    ORDER_ITEMS    │ N    1 │      ORDERS      │
├──────────────────┼────────┼───────────────────┼────────┼──────────────────┤
│ id (PK, UUID)    │        │ id (PK, UUID)     │        │ id (PK, VARCHAR) │
│ email (UNIQUE)   │        │ order_id (FK)     │        │ user_id (FK)     │
│ password_hash    │        │ watch_id (FK)     │        │ total_amount     │
│ full_name        │        │ unit_price        │        │ discount_amount  │
│ phone            │        │ quantity          │        │ delivery_tier    │
│ vip_tier         │        │ subtotal          │        │ payment_status   │
│ wrist_size_mm    │        └───────────────────┘        │ order_status     │
└────────┬─────────┘                                     │ certificate_svg  │
         │ 1                                             └──────────────────┘
         │ N
┌────────▼─────────┐
│ SAVED_ADDRESSES  │
├──────────────────┤
│ id (PK, VARCHAR) │
│ user_id (FK)     │
│ label            │
│ address_line1    │
│ city, state, pin │
│ is_default (BOOL)│
└──────────────────┘
```

### Key DDL Specifications:

#### 1. `watches` Table:
```sql
CREATE TABLE watches (
    id VARCHAR(32) PRIMARY KEY, -- e.g. 'WRT-001'
    num VARCHAR(8) NOT NULL, -- e.g. '01'
    brand_name VARCHAR(64) NOT NULL REFERENCES brands(name),
    model VARCHAR(128) NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    original_price NUMERIC(12, 2) NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    reviews_count INT DEFAULT 0,
    image_url VARCHAR(255) NOT NULL,
    category VARCHAR(32) NOT NULL,
    gender VARCHAR(16) NOT NULL, -- 'Men', 'Women', 'Unisex'
    movement VARCHAR(64) NOT NULL, -- 'Quartz', 'Automatic', 'Smart Digital', 'Mechanical Skeleton'
    style VARCHAR(64) NOT NULL, -- 'Minimal', 'Classic', 'Chronograph', 'Dress', 'Sport', 'Skeleton'
    case_size VARCHAR(32) NOT NULL, -- e.g. '40mm'
    strap VARCHAR(64) NOT NULL,
    dial VARCHAR(64) NOT NULL,
    material VARCHAR(64) NOT NULL,
    water_resistance VARCHAR(32) NOT NULL,
    badge VARCHAR(32), -- 'Best Seller', 'Trending', 'Premium', 'New Arrival', 'Limited Edition'
    tagline VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    ai_match_score INT,
    ai_reason TEXT,
    stock_count INT NOT NULL DEFAULT 10,
    occasions TEXT[] NOT NULL DEFAULT '{}',
    colors TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_watches_brand ON watches(brand_name);
CREATE INDEX idx_watches_movement ON watches(movement);
CREATE INDEX idx_watches_gender ON watches(gender);
CREATE INDEX idx_watches_price ON watches(price);
CREATE INDEX idx_watches_style ON watches(style);
```

#### 2. `orders` & `provenance_ledger` Table:
```sql
CREATE TABLE orders (
    id VARCHAR(32) PRIMARY KEY, -- e.g. 'ORD-2026-8941'
    user_id UUID REFERENCES users(id),
    customer_name VARCHAR(128) NOT NULL,
    customer_email VARCHAR(128) NOT NULL,
    customer_phone VARCHAR(32) NOT NULL,
    shipping_address JSONB NOT NULL,
    delivery_tier VARCHAR(32) NOT NULL, -- 'insured_express', 'white_glove'
    payment_method VARCHAR(32) NOT NULL, -- 'upi', 'card', 'netbanking', 'cod'
    payment_status VARCHAR(32) NOT NULL DEFAULT 'PAID',
    subtotal NUMERIC(12, 2) NOT NULL,
    discount_amount NUMERIC(12, 2) DEFAULT 0.00,
    shipping_fee NUMERIC(12, 2) DEFAULT 0.00,
    total_amount NUMERIC(12, 2) NOT NULL,
    applied_coupon_code VARCHAR(32),
    is_gift_wrapped BOOLEAN DEFAULT FALSE,
    gift_message TEXT,
    order_status VARCHAR(32) NOT NULL DEFAULT 'Confirmed', -- 'Processing', 'Inspecting', 'Dispatched', 'Delivered'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE provenance_certificates (
    id VARCHAR(32) PRIMARY KEY, -- e.g. 'CERT-WRT-8941'
    order_id VARCHAR(32) NOT NULL REFERENCES orders(id),
    watch_id VARCHAR(32) NOT NULL REFERENCES watches(id),
    serial_number VARCHAR(64) UNIQUE NOT NULL, -- e.g. 'WRT-AUREN-8941-928'
    collector_name VARCHAR(128) NOT NULL,
    acquisition_date DATE NOT NULL,
    movement_caliber VARCHAR(64) NOT NULL,
    case_metallurgy VARCHAR(64) NOT NULL,
    water_resistance VARCHAR(32) NOT NULL,
    warranty_period VARCHAR(32) DEFAULT '2-Year International Warranty',
    holographic_hash VARCHAR(128) NOT NULL,
    verification_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. REST API Endpoint Specifications & DTO Contracts

### Base URL: `http://localhost:8080/api/v1`

---

### 4.1. Watch Catalog Service (`/api/v1/watches`)

#### 1. Filtered Watch Catalog (`GET /api/v1/watches`)
* **Description:** Retrieves paginated, sorted, and filtered timepieces. Directly powers `/watches` and catalog grids.
* **Query Parameters:**
  * `brand` (string, optional, e.g. `AUREN`)
  * `movement` (string, optional, e.g. `Automatic`)
  * `style` (string, optional, e.g. `Chronograph`)
  * `gender` (string, optional, e.g. `Men`, `Women`, `Unisex`)
  * `occasion` (string, optional, e.g. `Formal`, `Casual`)
  * `minPrice` (numeric, optional)
  * `maxPrice` (numeric, optional)
  * `sort` (string: `featured`, `price-low`, `price-high`, `rating`, `newest`)
  * `q` (string, optional full-text search)
  * `page` (int, default `1`)
  * `limit` (int, default `12`)
* **Response:**
```json
{
  "products": [
    {
      "id": "WRT-001",
      "num": "01",
      "brand": "AUREN",
      "model": "Atlas Chronograph Black",
      "price": 8499,
      "originalPrice": 10999,
      "rating": 4.9,
      "reviewsCount": 128,
      "image": "/assets/watches/watch-atlas-black.png",
      "category": "Men",
      "gender": "Men",
      "movement": "Quartz",
      "style": "Chronograph",
      "caseSize": "42mm",
      "strap": "Surgical Stainless Steel",
      "dial": "Matte Obsidian",
      "material": "316L Stainless Steel",
      "waterResistance": "50m",
      "badge": "Best Seller",
      "tagline": "Precision multi-dial chronograph with obsidian sunray dial.",
      "description": "Crafted for discerning collectors...",
      "occasion": ["Formal", "Luxury"],
      "colors": ["Silver", "Obsidian Black"]
    }
  ],
  "total": 40,
  "page": 1,
  "totalPages": 4,
  "hasMore": true,
  "facets": {
    "brands": [
      { "name": "AUREN", "count": 8 },
      { "name": "VELA", "count": 8 },
      { "name": "ORBITA", "count": 8 },
      { "name": "VANTA", "count": 6 },
      { "name": "NORDEN", "count": 6 },
      { "name": "PULSE", "count": 4 }
    ],
    "movements": [
      { "name": "Automatic", "count": 14 },
      { "name": "Quartz", "count": 16 },
      { "name": "Smart Digital", "count": 4 },
      { "name": "Mechanical Skeleton", "count": 6 }
    ],
    "styles": [
      { "name": "Chronograph", "count": 10 },
      { "name": "Minimal", "count": 12 },
      { "name": "Classic", "count": 8 },
      { "name": "Dress", "count": 6 },
      { "name": "Sport", "count": 4 }
    ],
    "priceRange": { "min": 3499, "max": 19999 }
  }
}
```

#### 2. Single Watch Detail (`GET /api/v1/watches/{id}`)
* **Description:** Retrieves complete technical horology payload for PDP (`/product/[id]`).
* **Response:** Single `Product` object. Returns `404 Not Found` if watch ID is invalid.

#### 3. Similar / Coordinated Watches (`GET /api/v1/watches/{id}/similar`)
* **Description:** Returns 4 companion watches matching brand, movement, or style tier.

---

### 4.2. Brands & Collections Service (`/api/v1/brands`, `/api/v1/collections`)

#### 1. All Curated Brand Houses (`GET /api/v1/brands`)
* **Response:** Array of `Brand` objects matching `BRANDS` dataset (`AUREN`, `VELA`, `ORBITA`, `VANTA`, `NORDEN`, `PULSE`).

#### 2. Editorial Collections (`GET /api/v1/collections`)
* **Response:** Curated collection groupings (e.g. `Mechanical Mastery`, `Architectural Minimalism`, `Haute Chronography`).

---

### 4.3. Cart & Coupon Engine Service (`/api/v1/cart`, `/api/v1/coupons`)

#### 1. Calculate Order Totals (`POST /api/v1/cart/calculate`)
* **Request Body:**
```json
{
  "items": [
    { "productId": "WRT-001", "quantity": 1 },
    { "productId": "WRT-005", "quantity": 1 }
  ],
  "couponCode": "WRISTO10",
  "deliveryTier": "insured_express",
  "isGiftWrapped": true
}
```
* **Response:**
```json
{
  "subtotal": 23498,
  "discount": 2350,
  "shippingFee": 0,
  "giftWrapFee": 0,
  "total": 21148,
  "appliedCoupon": {
    "code": "WRISTO10",
    "description": "10% off for collector inaugural order",
    "discountType": "percentage",
    "discountValue": 10,
    "calculatedDiscount": 2350
  },
  "giftPouchUnlocked": true
}
```

#### 2. Validate Promo Code (`POST /api/v1/coupons/validate`)
* **Request Body:** `{ "code": "HOROLOGY20", "subtotal": 15000 }`
* **Response:** `{ "valid": true, "coupon": { "code": "HOROLOGY20", "discountValue": 20, "discountType": "percentage" }, "message": "20% discount applied." }`

---

### 4.4. Multi-Step Checkout & Order Placement (`/api/v1/orders`)

#### 1. Create Luxury Order (`POST /api/v1/orders/checkout`)
* **Request Body:**
```json
{
  "customer": {
    "fullName": "Gaurav Kadam",
    "email": "gauravkadam@gmail.com",
    "phone": "+91 98765 43210"
  },
  "shippingAddress": {
    "fullName": "Gaurav Kadam",
    "phone": "+91 98765 43210",
    "addressLine1": "Row House 04, Clover Highlands, NIBM Road",
    "city": "Pune",
    "state": "Maharashtra",
    "pincode": "411048"
  },
  "items": [
    { "productId": "WRT-005", "quantity": 1 }
  ],
  "deliveryTier": "insured_express",
  "paymentMethod": "upi",
  "couponCode": "WRISTO10",
  "isGiftWrapped": false,
  "giftMessage": ""
}
```
* **Response (HTTP 201 Created):**
```json
{
  "orderId": "ORD-2026-9281",
  "status": "Confirmed",
  "totalAmount": 13499,
  "currency": "INR",
  "estimatedDelivery": "October 6, 2026",
  "trackingNumber": "WRT-EXP-829104",
  "provenanceCertificateUrl": "/api/v1/orders/ORD-2026-9281/certificate",
  "message": "Order successfully placed and verified in WRISTO Ledger."
}
```

#### 2. Get Provenance Certificate (`GET /api/v1/orders/{orderId}/certificate`)
* **Response:** Serialized SVG certificate payload with cryptographic hash, serial numbers, and guilloché border data for rendering in `ProvenanceCertificateModal.tsx`.

---

### 4.5. Collector Account & Profile Service (`/api/v1/account`)

#### 1. Get Collector Profile (`GET /api/v1/account/profile`)
* **Headers:** `Authorization: Bearer <JWT>`
* **Response:**
```json
{
  "id": "USR-WRISTO-08492",
  "fullName": "Gaurav Kadam",
  "email": "gauravkadam@gmail.com",
  "phone": "+91 98765 43210",
  "salutation": "Collector",
  "vipTier": "Grand Complication Patron",
  "joinedDate": "October 2024",
  "wristSizeMm": 175,
  "currency": "INR",
  "notifications": {
    "orderTelemetry": true,
    "rareAllocations": true,
    "conciergeBriefings": false
  }
}
```

#### 2. Saved Addresses (`GET /api/v1/account/addresses`, `POST /api/v1/account/addresses`, `DELETE /api/v1/account/addresses/{id}`)
* **Description:** Manages collector shipping & residential addresses.

---

### 4.6. AI Watch Concierge Service (`/api/v1/concierge`)

#### 1. Chat with Horological Advisor (`POST /api/v1/concierge/chat`)
* **Request Body:**
```json
{
  "message": "I need a watch for a black-tie evening with a green or obsidian dial.",
  "conversationHistory": [
    { "role": "assistant", "content": "Welcome to the WRISTO Vault. How may I assist your collection?" }
  ]
}
```
* **Response (Integrated with Google Gemini SDK):**
```json
{
  "reply": "For a distinguished black-tie gala, I strongly recommend the Auren Regent Green Automatic (WRT-005) or the Atlas Chronograph Obsidian (WRT-001). Both feature surgical 316L cases that slip effortlessly beneath double cuffs.",
  "recommendations": [
    {
      "productId": "WRT-005",
      "model": "Regent Green Automatic",
      "brand": "AUREN",
      "price": 14999,
      "image": "/assets/watches/watch-regent-green.png",
      "reason": "Exhibition caseback, emerald sunray dial, ideal for formal tuxedos."
    }
  ]
}
```

---

## 5. Recommended Spring Boot Project Structure

```
wristo-backend/
├── src/
│   ├── main/
│   │   ├── java/com/wristo/
│   │   │   ├── WristoApplication.java
│   │   │   ├── config/                          # Security, CORS, Redis, OpenAPI, Gemini AI Config
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   ├── CorsConfig.java
│   │   │   │   ├── RedisCacheConfig.java
│   │   │   │   └── OpenApiConfig.java
│   │   │   ├── controller/                      # REST API Endpoints
│   │   │   │   ├── WatchCatalogController.java
│   │   │   │   ├── BrandController.java
│   │   │   │   ├── CartController.java
│   │   │   │   ├── OrderCheckoutController.java
│   │   │   │   ├── AccountController.java
│   │   │   │   ├── ConciergeAiController.java
│   │   │   │   └── JournalController.java
│   │   │   ├── dto/                             # Request/Response Data Transfer Objects
│   │   │   │   ├── request/
│   │   │   │   └── response/
│   │   │   ├── entity/                          # JPA PostgreSQL Entities
│   │   │   │   ├── WatchEntity.java
│   │   │   │   ├── BrandEntity.java
│   │   │   │   ├── UserEntity.java
│   │   │   │   ├── OrderEntity.java
│   │   │   │   ├── OrderItemEntity.java
│   │   │   │   └── ProvenanceCertificateEntity.java
│   │   │   ├── repository/                      # Spring Data JPA Repositories
│   │   │   │   ├── WatchRepository.java
│   │   │   │   ├── BrandRepository.java
│   │   │   │   ├── OrderRepository.java
│   │   │   │   └── UserRepository.java
│   │   │   ├── service/                         # Business Logic & Service Contracts
│   │   │   │   ├── WatchCatalogService.java
│   │   │   │   ├── OrderProcessingService.java
│   │   │   │   ├── AccountProfileService.java
│   │   │   │   └── ConciergeAiService.java
│   │   │   ├── security/                        # JWT Filter, Token Provider, UserDetails
│   │   │   │   ├── JwtTokenProvider.java
│   │   │   │   └── JwtAuthenticationFilter.java
│   │   │   └── exception/                       # Global Exception Handler (@ControllerAdvice)
│   │   │       ├── GlobalExceptionHandler.java
│   │   │       └── ResourceNotFoundException.java
│   │   └── resources/
│   │       ├── application.yml                  # Database credentials, Redis, JWT Secrets
│   │       └── db/migration/                    # Flyway Versioned Migrations (V1 to V5)
│   │           ├── V1__init_schema.sql
│   │           ├── V2__seed_brands.sql
│   │           ├── V3__seed_40_watches.sql
│   │           ├── V4__seed_coupons_and_journal.sql
│   │           └── V5__seed_collector_profile.sql
│   └── test/                                    # Unit & Integration Tests (JUnit 5 + Mockito)
├── Dockerfile                                   # Multi-stage Docker build (Eclipse Temurin JDK 21)
├── docker-compose.yml                           # Spring Boot + PostgreSQL 16 + Redis 7
├── build.gradle.kts / pom.xml
└── README.md
```

---

## 6. Docker & Local Orchestration (`docker-compose.yml`)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: wristo-postgres
    environment:
      POSTGRES_DB: wristo_db
      POSTGRES_USER: wristo_admin
      POSTGRES_PASSWORD: wristo_secure_pass_2026
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U wristo_admin -d wristo_db"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: wristo-redis
    ports:
      - "6379:6379"
    volumes:
      - redisdata:/data

  wristo-api:
    build: .
    container_name: wristo-backend-api
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/wristo_db
      SPRING_DATASOURCE_USERNAME: wristo_admin
      SPRING_DATASOURCE_PASSWORD: wristo_secure_pass_2026
      SPRING_DATA_REDIS_HOST: redis
      SPRING_DATA_REDIS_PORT: 6379
      GEMINI_API_KEY: ${GEMINI_API_KEY}
    ports:
      - "8080:8080"

volumes:
  pgdata:
  redisdata:
```

---

## 7. Frontend-to-Backend Integration Checklist

1. **Set Environment Variable in `wristo-next/.env.local`:**
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
   ```
2. **Switch Service Handlers in `wristo-next/src/services/`:**
   - In `productService.ts`: Replace in-memory filter with `fetch(`${API_URL}/watches?${params}`)`.
   - In `orderService.ts`: Send checkout payload to `POST ${API_URL}/orders/checkout`.
   - In `accountService.ts`: Fetch profile from `GET ${API_URL}/account/profile`.
3. **CORS Allow-List in `CorsConfig.java`:**
   - Allow `http://localhost:3000` (Next.js Dev) and production Vercel/Custom domains.
   - Allow headers: `Authorization`, `Content-Type`, `X-Requested-With`.
   - Allow methods: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`.
