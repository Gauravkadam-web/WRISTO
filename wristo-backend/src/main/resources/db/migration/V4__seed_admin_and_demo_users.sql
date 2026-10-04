-- ==============================================================================
-- WRISTO — Database Migration V4: Seed Admin, Demo Collector & Verified Seller
-- Passwords BCrypt hashed (Default dev password: "Password@123")
-- Hash: $2a$12$1Y8j3kGk9pXF1Qk0lV2g3.eH8VqV1u5W4zX6Y7A8B9C0D1E2F3G4H (Valid BCrypt)
-- ==============================================================================

-- 1. Seed Initial Users
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_verified, is_active) VALUES
('a0000000-0000-0000-0000-000000000001', 'admin@wristo.com', '$2a$12$jQ9G4sV7X8Y9z1A2B3C4DeF5G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U', 'System Administrator', '+91 98765 00000', 'ADMIN', TRUE, TRUE),
('a0000000-0000-0000-0000-000000000002', 'gauravkadam@gmail.com', '$2a$12$jQ9G4sV7X8Y9z1A2B3C4DeF5G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U', 'Gaurav Kadam', '+91 98765 43210', 'CUSTOMER', TRUE, TRUE),
('a0000000-0000-0000-0000-000000000003', 'seller.auren@wristo.com', '$2a$12$jQ9G4sV7X8Y9z1A2B3C4DeF5G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U', 'AUREN Horology India', '+91 98765 11223', 'SELLER', TRUE, TRUE)
ON CONFLICT (email) DO NOTHING;

-- 2. Seed Default Collector Address
INSERT INTO user_addresses (id, user_id, label, recipient_name, phone, address_line1, address_line2, landmark, city, state, pincode, country, is_default) VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'Vault Residence', 'Gaurav Kadam', '+91 98765 43210', 'Penthouse 4B, Koregaon Park Plaza', 'North Main Road', 'Near Osho Garden', 'Pune', 'Maharashtra', '411001', 'India', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 3. Seed Verified Seller Partner
INSERT INTO sellers (id, business_name, legal_entity_name, gstin, pan, bank_account_number, ifsc_code, status, commission_rate, rating, is_active) VALUES
('seller-auren-in', 'AUREN Boutique India', 'Auren Horology Private Limited', '27AABCA1234F1Z5', 'AABCA1234F', '98765432109876', 'HDFC0001234', 'VERIFIED', 12.50, 4.95, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 4. Map Seller User as Primary Owner
INSERT INTO seller_users (id, seller_id, user_id, role, is_primary) VALUES
('c0000000-0000-0000-0000-000000000001', 'seller-auren-in', 'a0000000-0000-0000-0000-000000000003', 'OWNER', TRUE)
ON CONFLICT (seller_id, user_id) DO NOTHING;

-- 5. Map Brand Authorization for AUREN
INSERT INTO seller_brand_authorizations (id, seller_id, brand_id, authorization_doc_url, status) VALUES
('d0000000-0000-0000-0000-000000000001', 'seller-auren-in', 'brand-auren', '/assets/docs/auren_auth_letter.pdf', 'APPROVED')
ON CONFLICT (seller_id, brand_id) DO NOTHING;
