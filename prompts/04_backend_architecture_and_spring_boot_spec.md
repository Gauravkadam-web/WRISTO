# Prompt 04: Backend Architecture & Spring Boot Specification

**Target Project:** WRISTO Ultra-Luxury Watch Marketplace  
**Domain:** Java 21 + Spring Boot 3.3+ + PostgreSQL 16 + Redis 7 + JWT + Gemini AI  
**Status:** 100% Documented & Production Specification Ready  

---

## 📜 Backend Specification Prompt

```markdown
Create a comprehensive, production-grade Backend Architecture & API Specification Document for WRISTO (`Java 21 + Spring Boot 3.3+ + PostgreSQL 16 + Redis 7 + JWT Auth + Flyway + Swagger/OpenAPI`).

### Requirements:
1. Executive Architecture Overview:
   - Microframework: Java 21 LTS + Spring Boot 3.3.x + Spring Data JPA + Hibernate.
   - PostgreSQL 16 relational database with JSONB support for technical specs and cryptographic certificates.
   - Redis 7 for high-speed catalog facet caching, rate limiting, and temporary guest carts.
   - Spring Security 6 with stateless Nimbus JWT authentication and RBAC authorization.
   - Google Gemini API integration for real-time horological conversational advice on `/concierge`.
   - OpenAPI 3.0 / Swagger UI for interactive documentation.

2. Entity-Relationship Data Models & DDL:
   - DDL specifications for `watches`, `brands`, `categories`, `orders`, `order_items`, `provenance_certificates`, `users`, `saved_addresses`, `coupons`.
   - Indexing strategies on `brand`, `movement`, `gender`, `price`.

3. REST API Contracts:
   - Watch Catalog: `GET /api/v1/watches`, `GET /api/v1/watches/{id}`, `GET /api/v1/watches/{id}/similar`.
   - Brands & Collections: `GET /api/v1/brands`, `GET /api/v1/collections`.
   - Cart & Coupons: `POST /api/v1/cart/calculate`, `POST /api/v1/coupons/validate`.
   - Multi-Step Checkout: `POST /api/v1/orders/checkout`, `GET /api/v1/orders/{id}/certificate`.
   - Collector Profile: `GET /api/v1/account/profile`, `POST /api/v1/account/addresses`.
   - AI Concierge: `POST /api/v1/concierge/chat`.

4. Project Layout & Docker Orchestration:
   - Layered architecture (`config`, `controller`, `dto`, `entity`, `repository`, `service`, `security`, `exception`).
   - `docker-compose.yml` for PostgreSQL 16, Redis 7, and Spring Boot API.
   - Zero UI changes needed on frontend: just set `NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1`.
```
