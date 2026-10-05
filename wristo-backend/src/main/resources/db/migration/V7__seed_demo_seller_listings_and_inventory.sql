-- ==============================================================================
-- WRISTO — Database Migration V7: Seed Demo Seller Listings & Inventory
-- Authorizes and activates initial catalog listings for 'seller-auren-in'
-- ==============================================================================

-- 1. Insert Initial Seller Listings for AUREN Collection
INSERT INTO seller_listings (
    id, seller_id, watch_id, seller_sku, price, original_price, condition,
    warranty_type, warranty_period, authenticity_guarantee, status, is_active
) VALUES
('e0000000-0000-0000-0000-000000000001', 'seller-auren-in', 'WRT-001', 'SKU-AUR-ATL-BLK', 4999.00, 6499.00, 'NEW', 'BRAND_WARRANTY', '2-Year International Warranty', 'Official AUREN Brand Boutique Certified 100% Authentic', 'ACTIVE', TRUE),
('e0000000-0000-0000-0000-000000000002', 'seller-auren-in', 'WRT-002', 'SKU-AUR-MER-SLV', 5499.00, 6999.00, 'NEW', 'BRAND_WARRANTY', '2-Year International Warranty', 'Official AUREN Brand Boutique Certified 100% Authentic', 'ACTIVE', TRUE),
('e0000000-0000-0000-0000-000000000003', 'seller-auren-in', 'WRT-003', 'SKU-AUR-HER-GLD', 6999.00, 8999.00, 'NEW', 'BRAND_WARRANTY', '2-Year International Warranty', 'Official AUREN Brand Boutique Certified 100% Authentic', 'ACTIVE', TRUE),
('e0000000-0000-0000-0000-000000000004', 'seller-auren-in', 'WRT-004', 'SKU-AUR-EDG-BLU', 4499.00, 5999.00, 'NEW', 'BRAND_WARRANTY', '2-Year International Warranty', 'Official AUREN Brand Boutique Certified 100% Authentic', 'ACTIVE', TRUE),
('e0000000-0000-0000-0000-000000000005', 'seller-auren-in', 'WRT-005', 'SKU-AUR-REG-GRN', 14999.00, 18999.00, 'NEW', 'BRAND_WARRANTY', '5-Year International Manufacturer Warranty', 'Official AUREN Brand Boutique Certified 100% Authentic', 'ACTIVE', TRUE),
('e0000000-0000-0000-0000-000000000006', 'seller-auren-in', 'WRT-006', 'SKU-AUR-CHR-STL', 8999.00, 11499.00, 'NEW', 'BRAND_WARRANTY', '2-Year International Warranty', 'Official AUREN Brand Boutique Certified 100% Authentic', 'ACTIVE', TRUE),
('e0000000-0000-0000-0000-000000000007', 'seller-auren-in', 'WRT-007', 'SKU-AUR-TER-BRN', 5999.00, 7499.00, 'NEW', 'BRAND_WARRANTY', '2-Year International Warranty', 'Official AUREN Brand Boutique Certified 100% Authentic', 'ACTIVE', TRUE),
('e0000000-0000-0000-0000-000000000008', 'seller-auren-in', 'WRT-008', 'SKU-AUR-ECL-BLK', 7499.00, 9499.00, 'NEW', 'BRAND_WARRANTY', '2-Year International Warranty', 'Official AUREN Brand Boutique Certified 100% Authentic', 'ACTIVE', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Initial Inventory for AUREN Listings
INSERT INTO inventories (
    id, seller_listing_id, total_quantity, available_quantity, reserved_quantity, sold_quantity, low_stock_threshold
) VALUES
('f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 20, 20, 0, 0, 3),
('f0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000002', 15, 15, 0, 0, 3),
('f0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000003', 12, 12, 0, 0, 2),
('f0000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000004', 18, 18, 0, 0, 3),
('f0000000-0000-0000-0000-000000000005', 'e0000000-0000-0000-0000-000000000005', 8, 8, 0, 0, 2),
('f0000000-0000-0000-0000-000000000006', 'e0000000-0000-0000-0000-000000000006', 14, 14, 0, 0, 3),
('f0000000-0000-0000-0000-000000000007', 'e0000000-0000-0000-0000-000000000007', 10, 10, 0, 0, 2),
('f0000000-0000-0000-0000-000000000008', 'e0000000-0000-0000-0000-000000000008', 10, 10, 0, 0, 2)
ON CONFLICT (seller_listing_id) DO NOTHING;

-- 3. Insert Initial Audit Movements (Initial Inbound Restock)
INSERT INTO inventory_movements (
    id, inventory_id, movement_type, quantity, reference_id, reason, created_by
) VALUES
(gen_random_uuid(), 'f0000000-0000-0000-0000-000000000001', 'RESTOCK', 20, 'INBOUND-PO-2026-001', 'Initial launch warehouse deposit', 'seller.auren@wristo.com'),
(gen_random_uuid(), 'f0000000-0000-0000-0000-000000000002', 'RESTOCK', 15, 'INBOUND-PO-2026-001', 'Initial launch warehouse deposit', 'seller.auren@wristo.com'),
(gen_random_uuid(), 'f0000000-0000-0000-0000-000000000003', 'RESTOCK', 12, 'INBOUND-PO-2026-001', 'Initial launch warehouse deposit', 'seller.auren@wristo.com'),
(gen_random_uuid(), 'f0000000-0000-0000-0000-000000000004', 'RESTOCK', 18, 'INBOUND-PO-2026-001', 'Initial launch warehouse deposit', 'seller.auren@wristo.com'),
(gen_random_uuid(), 'f0000000-0000-0000-0000-000000000005', 'RESTOCK', 8, 'INBOUND-PO-2026-001', 'Initial launch warehouse deposit', 'seller.auren@wristo.com'),
(gen_random_uuid(), 'f0000000-0000-0000-0000-000000000006', 'RESTOCK', 14, 'INBOUND-PO-2026-001', 'Initial launch warehouse deposit', 'seller.auren@wristo.com'),
(gen_random_uuid(), 'f0000000-0000-0000-0000-000000000007', 'RESTOCK', 10, 'INBOUND-PO-2026-001', 'Initial launch warehouse deposit', 'seller.auren@wristo.com'),
(gen_random_uuid(), 'f0000000-0000-0000-0000-000000000008', 'RESTOCK', 10, 'INBOUND-PO-2026-001', 'Initial launch warehouse deposit', 'seller.auren@wristo.com');
