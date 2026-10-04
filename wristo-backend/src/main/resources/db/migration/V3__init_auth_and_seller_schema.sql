-- ==============================================================================
-- WRISTO — Database Migration V3: Auth Tokens & Seller Schema Initialization
-- Architecture: Modular Monolith Multi-Vendor Marketplace | PostgreSQL 16/18
-- ==============================================================================

-- 1. Refresh Tokens Table
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(1024) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens(token_hash);

-- 2. Sellers (Retailers / Brand Partners) Table
CREATE TABLE sellers (
    id VARCHAR(32) PRIMARY KEY, -- e.g. 'seller-auren-in'
    business_name VARCHAR(128) NOT NULL,
    legal_entity_name VARCHAR(128) NOT NULL,
    gstin VARCHAR(32) NOT NULL UNIQUE,
    pan VARCHAR(32) NOT NULL,
    bank_account_number VARCHAR(64) NOT NULL,
    ifsc_code VARCHAR(32) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'SUSPENDED'
    rejection_reason TEXT,
    commission_rate NUMERIC(5, 2) NOT NULL DEFAULT 12.50,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sellers_status ON sellers(status);
CREATE INDEX idx_sellers_gstin ON sellers(gstin);

-- 3. Seller Staff (User to Seller mapping with granular roles)
CREATE TABLE seller_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id VARCHAR(32) NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(32) NOT NULL DEFAULT 'OWNER', -- 'OWNER', 'ADMIN', 'INVENTORY_MANAGER', 'ORDER_MANAGER', 'FINANCE_MANAGER'
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_seller_user UNIQUE (seller_id, user_id)
);

CREATE INDEX idx_seller_users_seller ON seller_users(seller_id);
CREATE INDEX idx_seller_users_user ON seller_users(user_id);

-- 4. Seller Verification Documents Table
CREATE TABLE seller_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id VARCHAR(32) NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    document_type VARCHAR(64) NOT NULL, -- 'GST_CERTIFICATE', 'PAN_CARD', 'CANCELLED_CHEQUE', 'BRAND_NOC'
    document_url VARCHAR(255) NOT NULL,
    verification_status VARCHAR(32) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED'
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_seller_docs_seller ON seller_documents(seller_id);

-- 5. Seller Brand Authorizations Table
CREATE TABLE seller_brand_authorizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id VARCHAR(32) NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    brand_id VARCHAR(32) NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
    authorization_doc_url VARCHAR(255),
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED'
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_seller_brand_auth UNIQUE (seller_id, brand_id)
);

CREATE INDEX idx_seller_brand_auth_seller ON seller_brand_authorizations(seller_id);
CREATE INDEX idx_seller_brand_auth_brand ON seller_brand_authorizations(brand_id);
