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
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
