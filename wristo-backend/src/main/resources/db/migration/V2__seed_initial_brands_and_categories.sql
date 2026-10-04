-- ==============================================================================
-- WRISTO — Database Migration V2: Master Brands & Categories Seed Data
-- ==============================================================================

-- Seed Master Brands
INSERT INTO brands (id, name, country, established, headline, description, logo_url) VALUES
('brand-auren', 'AUREN', 'Switzerland', 1928, 'Precision Horology & Chronographs', 'Master swiss calibers with surgical steel craftsmanship.', '/assets/brands/brand-auren.png'),
('brand-vela', 'VELA', 'Germany', 1964, 'Minimalist Bauhaus Aesthetics', 'Pure horological geometry and minimalist dials.', '/assets/brands/brand-vela.png'),
('brand-orbita', 'ORBITA', 'Japan', 1982, 'Automated Movement Engineering', 'High-frequency automatic calibers with exhibition backs.', '/assets/brands/brand-orbita.png'),
('brand-vanta', 'VANTA', 'United Kingdom', 2011, 'Matte Obsidian & Stealth Luxury', 'Light-absorbing matte surfaces and dark horology.', '/assets/brands/brand-vanta.png'),
('brand-norden', 'NORDEN', 'Sweden', 2005, 'Scandinavian Heritage & Raw Steel', 'Rugged outdoor resilience with refined dress elegance.', '/assets/brands/brand-norden.png'),
('brand-pulse', 'PULSE', 'United States', 2018, 'Connected Smart Chronographs', 'Smart hybrid telemetry with luxury titanium bezels.', '/assets/brands/brand-pulse.png'),
('brand-titan', 'TITAN', 'India', 1984, 'Timeless Indian Craftsmanship', 'Iconic craftsmanship blending modern horology with tradition.', '/assets/brands/brand-titan.png'),
('brand-casio', 'CASIO', 'Japan', 1946, 'Rugged Engineering & Digital Icons', 'Indestructible precision and legendary digital innovation.', '/assets/brands/brand-casio.png'),
('brand-seiko', 'SEIKO', 'Japan', 1881, 'Always One Step Ahead of the Rest', 'Pioneers in automatic movements and Spring Drive precision.', '/assets/brands/brand-seiko.png')
ON CONFLICT (id) DO NOTHING;

-- Seed Master Categories
INSERT INTO categories (id, slug, title, short_title, description, icon_name, sort_order) VALUES
('cat-men', 'men', 'Men''s Timepieces', 'Men', 'Sophisticated masculine horology, chronographs, and automatic calibers.', 'male', 1),
('cat-women', 'women', 'Women''s Timepieces', 'Women', 'Elegant diamond-accented bezels and slender luxury cases.', 'female', 2),
('cat-unisex', 'unisex', 'Unisex Timepieces', 'Unisex', 'Versatile 38mm-40mm timepieces tailored for every wrist.', 'sparkles', 3),
('cat-analog', 'analog', 'Classic Analog', 'Analog', 'Traditional three-hand dials with timeless mechanical charm.', 'clock', 4),
('cat-chronograph', 'chronograph', 'Chronograph', 'Chrono', 'Multi-subdial stopwatches built for precision timing.', 'timer', 5),
('cat-smart', 'smart', 'Connected Hybrid', 'Smart', 'Discreet digital telemetry paired with traditional luxury hands.', 'cpu', 6),
('cat-dress', 'dress', 'Black Tie & Dress', 'Dress', 'Ultra-thin gold and obsidian cases for formal galas.', 'gem', 7)
ON CONFLICT (id) DO NOTHING;
