-- ==============================================================================
-- WRISTO — Database Migration V6: Seller Listings & Inventory Schema
-- Architecture: Multi-Vendor Marketplace | PostgreSQL 16/18
-- ==============================================================================

-- 1. Seller Listings Table (Commercial offer separate from canonical watch)
CREATE TABLE seller_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id VARCHAR(32) NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    watch_id VARCHAR(32) NOT NULL REFERENCES watches(id) ON DELETE RESTRICT,
    seller_sku VARCHAR(64) NOT NULL,
    price NUMERIC(12, 2) NOT NULL CHECK (price > 0),
    original_price NUMERIC(12, 2) NOT NULL CHECK (original_price >= price),
    condition VARCHAR(32) NOT NULL DEFAULT 'NEW', -- 'NEW', 'MINT_PREOWNED', 'VINTAGE_CERTIFIED'
    warranty_type VARCHAR(64) NOT NULL DEFAULT 'BRAND_WARRANTY', -- 'BRAND_WARRANTY', 'SELLER_WARRANTY', 'INTERNATIONAL'
    warranty_period VARCHAR(64) NOT NULL DEFAULT '2-Year International Warranty',
    authenticity_guarantee VARCHAR(255) NOT NULL DEFAULT '100% Verified Swiss & Global Authenticity Guaranteed by WRISTO',
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING_APPROVAL', -- 'PENDING_APPROVAL', 'ACTIVE', 'INACTIVE', 'REJECTED'
    rejection_reason TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_seller_watch_sku UNIQUE (seller_id, seller_sku)
);

CREATE INDEX idx_seller_listings_seller ON seller_listings(seller_id);
CREATE INDEX idx_seller_listings_watch ON seller_listings(watch_id);
CREATE INDEX idx_seller_listings_status ON seller_listings(status);
CREATE INDEX idx_seller_listings_active ON seller_listings(is_active);

-- 2. Inventories Table (Seller-specific stock tracking)
CREATE TABLE inventories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_listing_id UUID NOT NULL UNIQUE REFERENCES seller_listings(id) ON DELETE CASCADE,
    total_quantity INT NOT NULL DEFAULT 0 CHECK (total_quantity >= 0),
    available_quantity INT NOT NULL DEFAULT 0 CHECK (available_quantity >= 0),
    reserved_quantity INT NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
    sold_quantity INT NOT NULL DEFAULT 0 CHECK (sold_quantity >= 0),
    low_stock_threshold INT NOT NULL DEFAULT 2 CHECK (low_stock_threshold >= 0),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inventories_listing ON inventories(seller_listing_id);

-- 3. Inventory Movements Table (Complete audit trail for stock adjustments)
CREATE TABLE inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_id UUID NOT NULL REFERENCES inventories(id) ON DELETE CASCADE,
    movement_type VARCHAR(32) NOT NULL, -- 'RESTOCK', 'RESERVATION', 'SALE', 'RELEASE', 'ADJUSTMENT', 'RETURN'
    quantity INT NOT NULL,
    reference_id VARCHAR(64), -- Order ID, Reservation ID, or Admin Audit ID
    reason TEXT NOT NULL,
    created_by VARCHAR(128) NOT NULL DEFAULT 'SYSTEM',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inventory_movements_inv ON inventory_movements(inventory_id);
CREATE INDEX idx_inventory_movements_type ON inventory_movements(movement_type);

-- 4. Inventory Reservations Table (Transactional checkout hold)
CREATE TABLE inventory_reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_id UUID NOT NULL REFERENCES inventories(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'COMPLETED', 'EXPIRED', 'CANCELLED'
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inventory_reservations_inv ON inventory_reservations(inventory_id);
CREATE INDEX idx_inventory_reservations_status ON inventory_reservations(status);
CREATE INDEX idx_inventory_reservations_expires ON inventory_reservations(expires_at);
