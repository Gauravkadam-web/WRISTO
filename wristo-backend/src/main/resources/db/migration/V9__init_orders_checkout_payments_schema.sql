-- ==============================================================================
-- WRISTO — Database Migration V9: Orders, Checkout Sessions & Payment Gateway Schema
-- ==============================================================================

-- 1. Orders Table
CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY,
    order_number VARCHAR(32) NOT NULL,
    certificate_number VARCHAR(32) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(32) NOT NULL,
    shipping_address_line1 VARCHAR(255) NOT NULL,
    shipping_address_line2 VARCHAR(255),
    shipping_landmark VARCHAR(255),
    shipping_city VARCHAR(100) NOT NULL,
    shipping_state VARCHAR(100) NOT NULL,
    shipping_pincode VARCHAR(20) NOT NULL,
    shipping_country VARCHAR(100) NOT NULL DEFAULT 'India',
    delivery_tier VARCHAR(32) NOT NULL DEFAULT 'insured_express', -- 'insured_express', 'white_glove'
    delivery_notes VARCHAR(500),
    is_gift_wrapped BOOLEAN NOT NULL DEFAULT FALSE,
    gift_message VARCHAR(500),
    coupon_id VARCHAR(36) REFERENCES coupons(id) ON DELETE SET NULL,
    coupon_code VARCHAR(32),
    subtotal_amount NUMERIC(12, 2) NOT NULL,
    discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    gift_wrap_fee NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    shipping_fee NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING_PAYMENT', -- 'PENDING_PAYMENT', 'CONFIRMED', 'PROCESSING_VAULT', 'DISPATCHED', 'DELIVERED', 'CANCELLED', 'REFUNDED'
    payment_status VARCHAR(32) NOT NULL DEFAULT 'UNPAID', -- 'UNPAID', 'AUTHORIZED', 'PAID', 'FAILED', 'REFUNDED'
    payment_method VARCHAR(32) NOT NULL, -- 'UPI', 'CARD', 'NETBANKING', 'COD', 'RAZORPAY', 'STRIPE'
    tracking_number VARCHAR(64),
    courier_partner VARCHAR(100),
    estimated_delivery_at TIMESTAMP WITH TIME ZONE,
    placed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_orders_order_number UNIQUE (order_number),
    CONSTRAINT uq_orders_certificate_number UNIQUE (certificate_number),
    CONSTRAINT chk_orders_subtotal CHECK (subtotal_amount >= 0),
    CONSTRAINT chk_orders_total CHECK (total_amount >= 0)
);

-- 2. Order Items Table
CREATE TABLE order_items (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    watch_id VARCHAR(32) NOT NULL REFERENCES watches(id),
    seller_id VARCHAR(32) REFERENCES sellers(id) ON DELETE SET NULL,
    seller_listing_id UUID REFERENCES seller_listings(id) ON DELETE SET NULL,
    watch_model VARCHAR(255) NOT NULL,
    watch_brand VARCHAR(100) NOT NULL,
    watch_image_url VARCHAR(500),
    movement_type VARCHAR(50),
    case_size VARCHAR(50),
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(12, 2) NOT NULL,
    total_price NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_order_item_qty CHECK (quantity > 0),
    CONSTRAINT chk_order_item_price CHECK (unit_price >= 0)
);

-- 3. Order Status History Table
CREATE TABLE order_status_history (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    from_status VARCHAR(32),
    to_status VARCHAR(32) NOT NULL,
    changed_by VARCHAR(255) NOT NULL,
    comment VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Payments Table
CREATE TABLE payments (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    payment_gateway VARCHAR(32) NOT NULL, -- 'RAZORPAY', 'STRIPE', 'MANUAL_MOCK', 'COD'
    transaction_id VARCHAR(255) UNIQUE,
    gateway_order_id VARCHAR(255),
    gateway_payment_id VARCHAR(255),
    gateway_signature VARCHAR(500),
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    status VARCHAR(32) NOT NULL DEFAULT 'INITIATED', -- 'INITIATED', 'PROCESSING', 'SUCCESS', 'FAILED', 'REFUNDED'
    payment_method VARCHAR(32) NOT NULL,
    error_code VARCHAR(100),
    error_message VARCHAR(500),
    raw_payload TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Checkout Sessions Table (15-Minute Temporary Stock Hold Session)
CREATE TABLE checkout_sessions (
    id VARCHAR(36) PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(128),
    reservation_ids TEXT, -- Comma-separated inventory_reservations IDs
    coupon_code VARCHAR(32),
    delivery_tier VARCHAR(32) NOT NULL DEFAULT 'insured_express',
    is_gift_wrapped BOOLEAN NOT NULL DEFAULT FALSE,
    gift_message VARCHAR(500),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_placed_at ON orders(placed_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_watch_id ON order_items(watch_id);
CREATE INDEX idx_order_items_seller_id ON order_items(seller_id);
CREATE INDEX idx_order_status_history_order ON order_status_history(order_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX idx_payments_gateway_order ON payments(gateway_order_id);
CREATE INDEX idx_checkout_sessions_user_id ON checkout_sessions(user_id);
CREATE INDEX idx_checkout_sessions_session_id ON checkout_sessions(session_id);
CREATE INDEX idx_checkout_sessions_expires_at ON checkout_sessions(expires_at);
