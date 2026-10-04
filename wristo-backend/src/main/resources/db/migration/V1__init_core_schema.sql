-- ==============================================================================
-- WRISTO — Database Migration V1: Core Schema Initialization
-- Architecture: Modular Monolith | PostgreSQL 16/18
-- ==============================================================================

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Brands Table
CREATE TABLE brands (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(64) NOT NULL UNIQUE,
    country VARCHAR(64) NOT NULL,
    established INT NOT NULL,
    headline VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    logo_url VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories Table
CREATE TABLE categories (
    id VARCHAR(32) PRIMARY KEY,
    slug VARCHAR(64) NOT NULL UNIQUE,
    title VARCHAR(64) NOT NULL,
    short_title VARCHAR(32) NOT NULL,
    description TEXT NOT NULL,
    icon_name VARCHAR(32),
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Canonical Watches (Products) Table
CREATE TABLE watches (
    id VARCHAR(32) PRIMARY KEY, -- e.g. 'WRT-001'
    num VARCHAR(8) NOT NULL, -- e.g. '01'
    brand_id VARCHAR(32) NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
    brand_name VARCHAR(64) NOT NULL,
    model VARCHAR(128) NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    original_price NUMERIC(12, 2) NOT NULL,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    reviews_count INT NOT NULL DEFAULT 0,
    image_url VARCHAR(255) NOT NULL,
    category_id VARCHAR(32) NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    category_name VARCHAR(32) NOT NULL,
    gender VARCHAR(16) NOT NULL, -- 'Men', 'Women', 'Unisex'
    movement VARCHAR(64) NOT NULL, -- 'Quartz', 'Automatic', 'Smart Digital', 'Mechanical Skeleton'
    style VARCHAR(64) NOT NULL, -- 'Minimal', 'Classic', 'Chronograph', 'Dress', 'Sport', 'Skeleton'
    case_size VARCHAR(32) NOT NULL, -- e.g. '40mm', '42mm'
    strap VARCHAR(64) NOT NULL,
    dial VARCHAR(64) NOT NULL,
    material VARCHAR(64) NOT NULL,
    water_resistance VARCHAR(32) NOT NULL,
    badge VARCHAR(32), -- 'Best Seller', 'Trending', 'Premium', 'New Arrival', 'Limited Edition'
    tagline VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    ai_match_score INT DEFAULT 95,
    ai_reason TEXT,
    stock_count INT NOT NULL DEFAULT 10,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Watch Technical Specifications Table
CREATE TABLE watch_specs (
    id BIGSERIAL PRIMARY KEY,
    watch_id VARCHAR(32) NOT NULL UNIQUE REFERENCES watches(id) ON DELETE CASCADE,
    case_diameter_mm VARCHAR(32) NOT NULL,
    case_material VARCHAR(64) NOT NULL,
    dial_finish VARCHAR(64) NOT NULL,
    strap_material VARCHAR(64) NOT NULL,
    water_resistance_atm VARCHAR(32) NOT NULL,
    power_reserve_hours VARCHAR(32),
    glass_crystal VARCHAR(64) NOT NULL DEFAULT 'Sapphire Crystal (Anti-Reflective)',
    clasp_type VARCHAR(64) NOT NULL DEFAULT 'Deployant Safety Clasp',
    warranty_period VARCHAR(64) NOT NULL DEFAULT '2-Year International Warranty',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Users & Identity Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(128) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(128) NOT NULL,
    phone VARCHAR(32),
    avatar_url VARCHAR(255),
    role VARCHAR(32) NOT NULL DEFAULT 'CUSTOMER', -- 'CUSTOMER', 'SELLER', 'ADMIN', 'SUPER_ADMIN'
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. User Saved Addresses Table
CREATE TABLE user_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(32) NOT NULL DEFAULT 'Home',
    recipient_name VARCHAR(128) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    landmark VARCHAR(128),
    city VARCHAR(64) NOT NULL,
    state VARCHAR(64) NOT NULL,
    pincode VARCHAR(16) NOT NULL,
    country VARCHAR(64) NOT NULL DEFAULT 'India',
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance & catalog facets
CREATE INDEX idx_watches_brand ON watches(brand_id);
CREATE INDEX idx_watches_category ON watches(category_id);
CREATE INDEX idx_watches_movement ON watches(movement);
CREATE INDEX idx_watches_gender ON watches(gender);
CREATE INDEX idx_watches_style ON watches(style);
CREATE INDEX idx_watches_price ON watches(price);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_addresses_user ON user_addresses(user_id);
