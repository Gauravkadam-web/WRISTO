-- ============================================================================
-- WRISTO Luxury Marketplace - Flyway Migration V11
-- Phase 8: Editorial Journal & Content Management Database Schema & Seed Data
-- ============================================================================

-- 1. Authors Table
CREATE TABLE IF NOT EXISTS journal_authors (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    avatar VARCHAR(512) NOT NULL,
    bio TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Journal Articles Table
CREATE TABLE IF NOT EXISTS journal_articles (
    id VARCHAR(36) PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(512) NOT NULL,
    subtitle VARCHAR(1024) NOT NULL,
    excerpt TEXT NOT NULL,
    category VARCHAR(64) NOT NULL,
    author_id VARCHAR(36) NOT NULL,
    published_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read_time VARCHAR(32) NOT NULL DEFAULT '5 min read',
    reading_time_minutes INT NOT NULL DEFAULT 5,
    cover_image VARCHAR(512) NOT NULL,
    tags TEXT NOT NULL,
    featured_watch_ids TEXT NOT NULL,
    content_json TEXT NOT NULL,
    is_lead_story BOOLEAN NOT NULL DEFAULT FALSE,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    view_count BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_journal_articles_author FOREIGN KEY (author_id) REFERENCES journal_authors(id) ON DELETE CASCADE
);

-- 3. Indexes for Search, Category Filtering, Lead Stories & Sorting
CREATE INDEX IF NOT EXISTS idx_journal_articles_slug ON journal_articles(slug);
CREATE INDEX IF NOT EXISTS idx_journal_articles_category ON journal_articles(category);
CREATE INDEX IF NOT EXISTS idx_journal_articles_published_at ON journal_articles(published_at);
CREATE INDEX IF NOT EXISTS idx_journal_articles_is_lead_story ON journal_articles(is_lead_story);
CREATE INDEX IF NOT EXISTS idx_journal_articles_is_published ON journal_articles(is_published);
CREATE INDEX IF NOT EXISTS idx_journal_articles_author_id ON journal_articles(author_id);

-- ============================================================================
-- 4. Seed Canonical Authors
-- ============================================================================
INSERT INTO journal_authors (id, name, role, avatar, bio, created_at, updated_at)
VALUES
(
    'auth-adrien',
    'Adrien de Beauharnais',
    'Master Horologist & Restoration Specialist',
    '/assets/brand/curator-avatar.png',
    'Trained in the Vallée de Joux, Adrien has restored 18th-century minute repeaters and oversees WRISTO’s technical authenticity archives.',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'auth-kavita',
    'Kavita Singhania',
    'Director of Materials & Horological Curation',
    '/assets/brand/curator-avatar.png',
    'With a degree in metallurgical engineering from Imperial College London, Kavita analyzes casing alloys, ceramic sintering, and physical vapor deposition coatings for WRISTO.',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'auth-julian',
    'Julian Thorne',
    'Horological Journalist & Style Critic',
    '/assets/brand/curator-avatar.png',
    'Former editor at Geneva Horology Quarterly, Julian writes extensively on luxury silhouettes, bespoke tailoring, and vintage watch trends.',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 5. Seed 6 Canonical Master Horological Essays
-- ============================================================================

-- Article 1: The Architecture of Automatic Calibers (Lead Story)
INSERT INTO journal_articles (
    id, slug, title, subtitle, excerpt, category, author_id,
    published_at, read_time, reading_time_minutes, cover_image,
    tags, featured_watch_ids, content_json, is_lead_story, is_published, view_count,
    created_at, updated_at
) VALUES (
    'art-01',
    'architecture-of-automatic-calibers',
    'The Architecture of Automatic Calibers: How Mechanical Hearts Beat',
    'From oscillating tungsten rotors to jewel escapements—the living mechanics behind kinetic self-winding movements.',
    'An automatic watch is fundamentally a kinetic organism. Every movement of your wrist winds the mainspring through an engineered oscillating weight, converting human motion into continuous horological poetry.',
    'Technical Calibers',
    'auth-adrien',
    TIMESTAMP '2026-10-01 09:00:00',
    '6 min read',
    6,
    '/assets/products/watch-31.png',
    '["Automatic Movement", "Watchmaking Calibers", "Tungsten Rotors", "Escapements"]',
    '["WRT-031", "WRT-005", "WRT-015"]',
    '[{"heading":"The Kinetic Organism on the Wrist","paragraphs":["In an era dominated by microprocessors and digital silicon, mechanical watchmaking endures because it accomplishes an improbable feat: it records the passage of the universe using only spring tension, interlocking gears, and inertial physics.","Unlike battery-powered quartz movements that rely on the resonant oscillation of a synthetic tuning fork, an automatic watch is fundamentally a kinetic organism. It draws its lifeblood directly from the wearer. When you lift a coffee cup, sign an acquisition contract, or walk down a city boulevard, an off-center weighted rotor pivots on a jeweled ball bearing, winding the mainspring coiled within the barrel."],"quote":{"text":"A mechanical watch does not tell you what the time is; it reminds you of what time means when crafted by human hands.","attribution":"Adrien de Beauharnais, Master Horologist"}},{"heading":"The Escapement: Slicing Time into 21,600 Slices","paragraphs":["If the mainspring is the engine, the escapement is the throttle. Left unchecked, the coiled spring would unwind in a violent, fraction-of-a-second blur. The Swiss anchor escapement prevents this catastrophe by meting out energy in microscopic increments.","Operating typically at 21,600 or 28,800 vibrations per hour (vph), the balance wheel oscillates back and forth. With each swing, synthetic ruby pallet jewels lock and release the escape wheel teeth. That mechanical heartbeat is what produces the beloved, near-continuous sweep of a luxury automatic second hand."],"callout":"Did you know? Synthetic corundum (ruby) bearings are chosen not for ostentation, but because their friction coefficient against polished steel pivots is virtually zero, ensuring decades of accurate operation with microscopic lubricant decay."},{"heading":"Rotor Metallurgy and Inertial Efficiency","paragraphs":["To generate sufficient winding torque from minimal wrist movement, modern automatic rotors must balance mass against thickness. High-density metals such as heavy tungsten alloy or 21-karat gold are frequently employed along the outer perimeter of the rotor.","This perimeter weighting maximizes the moment of inertia, ensuring that even sedentary desk work provides adequate power reserve—typically between 40 to 72 hours of autonomy when laid on your nightstand."]}]',
    TRUE,
    TRUE,
    1420,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO NOTHING;

-- Article 2: Surgical 316L vs. Titanium
INSERT INTO journal_articles (
    id, slug, title, subtitle, excerpt, category, author_id,
    published_at, read_time, reading_time_minutes, cover_image,
    tags, featured_watch_ids, content_json, is_lead_story, is_published, view_count,
    created_at, updated_at
) VALUES (
    'art-02',
    'surgical-316l-vs-titanium-case-metallurgy',
    'Surgical 316L vs. Titanium: Choosing Your Case Metallurgy',
    'A metallurgical breakdown of tensile strength, surface patination, hypoallergenic properties, and wrist presence.',
    'Selecting the metal of your watch case defines not merely how the timepiece looks, but how it feels over decades of daily wear. We analyze the tactile distinction between 316L surgical stainless steel and Grade 5 aerospace titanium.',
    'Design & Metallurgy',
    'auth-kavita',
    TIMESTAMP '2026-09-24 11:30:00',
    '5 min read',
    5,
    '/assets/products/watch-22.png',
    '["316L Stainless Steel", "Titanium Grade 5", "Case Metallurgy", "Ergonomics"]',
    '["WRT-022", "WRT-001", "WRT-010"]',
    '[{"heading":"The Foundation of Case Architecture","paragraphs":["When an artisan designs a luxury watch, the case serves as both an armored bastion protecting a delicate micromechanical movement and a sculpted sculpture resting against human skin.","For over a century, stainless steel has reigned as the quintessential horological metal. However, the rise of aerospace-grade titanium has introduced an intriguing debate for modern collectors: should you seek the reassuring substantial heft of cold-worked 316L, or the featherweight warmth of titanium?"]},{"heading":"Surgical 316L: The Luster of Classical Durability","paragraphs":["Surgical-grade 316L stainless steel contains high concentrations of chromium, nickel, and molybdenum. This chemical composition forms an invisible, self-healing chromium oxide passivation layer that makes it nearly impervious to seawater corrosion and human perspiration.","Crucially, 316L steel possesses superior machineability and surface hardness. It accepts dramatic mirror-polishing (anglage) alongside satin-brushed chamfers, creating the high-contrast light play that distinguishes fine luxury watches across a candlelit dining room."],"quote":{"text":"The weight of 316L steel on the wrist provides a subconscious psychological grounding. You never forget you are wearing an instrument of consequence.","attribution":"Kavita Singhania"}},{"heading":"Grade 5 Titanium: Aerospace Performance and Thermal Neutrality","paragraphs":["Grade 5 titanium (Ti-6Al-4V) is alloyed with 6% aluminum and 4% vanadium. It delivers an astonishing strength-to-weight ratio: approximately 45% lighter than steel while boasting higher tensile resilience.","Equally notable is its thermal conductivity. While steel initially feels icy against the skin on a winter morning, titanium rapidly acclimates to body temperature. Furthermore, it is 100% hypoallergenic, making it the definitive choice for sensitive skin."],"callout":"Collector Verdict: Choose 316L stainless steel for formal boardroom and gala elegance where razor-sharp light reflections matter. Opt for titanium for expeditions, aviator chronographs, and daily sport horology."}]',
    FALSE,
    TRUE,
    980,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO NOTHING;

-- Article 3: A Collector's Guide to Chronographs
INSERT INTO journal_articles (
    id, slug, title, subtitle, excerpt, category, author_id,
    published_at, read_time, reading_time_minutes, cover_image,
    tags, featured_watch_ids, content_json, is_lead_story, is_published, view_count,
    created_at, updated_at
) VALUES (
    'art-03',
    'collectors-guide-to-chronographs',
    'A Collector’s Guide to Chronograph Sub-Dials and Tachymeter Scales',
    'Deciphering the dials of horology’s most celebrated complication—from split-seconds to motorsport velocity calculations.',
    'The chronograph is the quintessential functional complication. Born on racetracks and flight decks, its twin pushers and sub-registers transform a passive clock into an active instrument of athletic precision.',
    'Collector Guide',
    'auth-adrien',
    TIMESTAMP '2026-09-15 14:15:00',
    '7 min read',
    7,
    '/assets/products/watch-11.png',
    '["Chronographs", "Tachymeter Scale", "Sub-Dials", "Motorsport Timing"]',
    '["WRT-011", "WRT-012", "WRT-014"]',
    '[{"heading":"The Instrument of Measured Seconds","paragraphs":["No horological complication is as deeply intertwined with adrenaline, speed, and aviation as the chronograph. While a standard three-hand watch is passive—simply displaying the unrelenting flow of time—a chronograph invites human intervention.","With a crisp click of the 2 o’clock pusher, you command time to start. With another click, you freeze the second hand in place. Through this tactile interface, the watch transforms from an ornament into an active scientific stopwatch."]},{"heading":"Deconstructing the Tri-Compax Sub-Dial Dial Layout","paragraphs":["Collectors frequently encounter the term \"Compax\"—originating from vintage mid-century designs. A classic three-register chronograph typically delegates responsibilities across its dial landscape:","1. The Running Seconds Register (usually at 9 o’clock): Unlike a standard watch, the central seconds hand stays parked at 12 o’clock until activated. Running time is monitored via this miniature sub-dial.","2. The 30-Minute Totalizer (typically at 3 o’clock): Accumulates elapsed chronograph minutes in crisp single-minute jumps.","3. The 12-Hour Counter (positioned at 6 o’clock): Tracks extended timing intervals for endurance races and intercontinental flight legs."],"quote":{"text":"The symmetry of a tri-compax dial is an exercise in graphic balance. It must convey high-density telemetry without sacrificing instantaneous legibility.","attribution":"Adrien de Beauharnais"}},{"heading":"How to Actually Use the Tachymeter Bezel","paragraphs":["Most chronograph owners admire the numeric markings engraved around the outer bezel without ever calculating a single velocity. Yet using a tachymeter is disarmingly simple:","Start the chronograph when passing a highway kilometer milestone. When you pass the next kilometer milestone exactly one kilometer later, stop the chronograph. The central chronograph seconds hand points directly to your average speed in kilometers per hour on the bezel scale."]}]',
    FALSE,
    TRUE,
    1150,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO NOTHING;

-- Article 4: The Resurgence of the Dress Watch
INSERT INTO journal_articles (
    id, slug, title, subtitle, excerpt, category, author_id,
    published_at, read_time, reading_time_minutes, cover_image,
    tags, featured_watch_ids, content_json, is_lead_story, is_published, view_count,
    created_at, updated_at
) VALUES (
    'art-04',
    'resurgence-of-the-dress-watch',
    'The Resurgence of the Dress Watch: Why 38mm is the New Standard',
    'After two decades of oversized steel tool watches, horological connoisseurship is celebrating mid-century restraint.',
    'The pendulum of luxury horology is swinging back toward quiet discretion. We explore why collectors worldwide are setting aside 45mm divers in favor of svelte 38mm dress watches with unblemished enamel dials and calfskin straps.',
    'Horological Heritage',
    'auth-julian',
    TIMESTAMP '2026-09-08 16:00:00',
    '5 min read',
    5,
    '/assets/products/watch-02.png',
    '["Dress Watches", "38mm Case Size", "Quiet Luxury", "Mid-Century Style"]',
    '["WRT-002", "WRT-003", "WRT-001"]',
    '[{"heading":"The Fatigue of the Wrist Behemoth","paragraphs":["For the past twenty years, horological marketing was dominated by an arms race of sheer mass. Oversized 44mm to 48mm dive watches with helium escape valves and multi-pound steel bracelets were worn with business suits, forcing tailored shirtmakers to widen cuffs.","Today, that era of ostentation has hit saturation. A sophisticated counter-revolution has taken root—one driven by the philosophy of \"Quiet Luxury\" and an appreciation for harmonic human anatomy."],"quote":{"text":"Elegance is not about being noticed; it is about being remembered with reverence.","attribution":"Julian Thorne"}},{"heading":"The 38mm Sweet Spot: Universal Proportionality","paragraphs":["Why has 38mm emerged as the undisputed sweet spot? It satisfies both vintage sensibility and contemporary taste. While vintage dress pieces of the 1950s measured 33mm to 35mm—which can appear diminutive on modern wrists—38mm provides sufficient dial real estate while remaining virtually flush against the wrist bone.","At 38mm, an unadorned silver or sunburst dial commands the gaze not through aggressive diameter, but through the perfection of its typography, the depth of its rhodium-plated faceted hands, and the supple drape of an unpadded leather strap."]}]',
    FALSE,
    TRUE,
    890,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO NOTHING;

-- Article 5: Sapphire Crystal vs. Mineral Glass
INSERT INTO journal_articles (
    id, slug, title, subtitle, excerpt, category, author_id,
    published_at, read_time, reading_time_minutes, cover_image,
    tags, featured_watch_ids, content_json, is_lead_story, is_published, view_count,
    created_at, updated_at
) VALUES (
    'art-05',
    'sapphire-crystal-vs-mineral-glass',
    'Sapphire Crystal vs. Mineral Glass: What Protects Your Timepiece',
    'From synthetic Verneuil flame fusion to Mohs 9 scratch resistance—why sapphire crystal is non-negotiable for luxury timekeeping.',
    'The transparent window through which you observe the mechanical ballet is often taken for granted. We examine the atomic crystallography of synthetic sapphire versus mineral glass and acrylic crystals.',
    'Technical Calibers',
    'auth-kavita',
    TIMESTAMP '2026-08-28 10:45:00',
    '4 min read',
    4,
    '/assets/products/watch-25.png',
    '["Sapphire Crystal", "Mohs Hardness", "Anti-Reflective Coating", "Mineral Glass"]',
    '["WRT-025", "WRT-028", "WRT-030"]',
    '[{"heading":"The Vulnerable Horizon of Horology","paragraphs":["A watch dial is a delicate micromechanical stage. The hands, indices, and applied numerals must be protected from dust, humidity, and physical impact without distorting optical clarity.","Throughout horological history, three materials have dominated watch crystals: polymethyl methacrylate (acrylic/Hesalite), hardened mineral glass, and synthetic monocrystalline sapphire."]},{"heading":"The Science of Synthetic Corundum","paragraphs":["Synthetic sapphire is not glass at all. It is pure aluminum oxide (Al2O3) crystallized at over 2,000°C via the Verneuil flame fusion process. In terms of physical hardness on the Mohs scale, synthetic sapphire registers at 9—surpassed only by diamond (Mohs 10).","In everyday life, car keys, door handles, brick walls, and concrete corners will instantly scratch mineral glass or acrylic. But against synthetic sapphire, these common hazards glance off harmlessly without leaving a single blemish."],"quote":{"text":"A scratched crystal ruins the soul of a luxury watch dial. With double-domed anti-reflective sapphire, the crystal effectively vanishes.","attribution":"Kavita Singhania"}},{"heading":"Anti-Reflective Vapor Coatings","paragraphs":["Because sapphire possesses a high refractive index (1.77), untreated crystals produce glaring reflections that obscure the dial in direct sunlight. Luxury watchmakers solve this by applying microscopic layers of metal oxides in a vacuum chamber.","Double-sided anti-reflective (AR) coatings eliminate up to 99% of surface glare, giving the astonishing impression that you could reach out and touch the hands directly with your fingers."]}]',
    FALSE,
    TRUE,
    760,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO NOTHING;

-- Article 6: The Art of the Open Heart
INSERT INTO journal_articles (
    id, slug, title, subtitle, excerpt, category, author_id,
    published_at, read_time, reading_time_minutes, cover_image,
    tags, featured_watch_ids, content_json, is_lead_story, is_published, view_count,
    created_at, updated_at
) VALUES (
    'art-06',
    'art-of-the-open-heart-skeleton-horology',
    'The Art of the Open Heart: Skeleton Horology Demystified',
    'Peering into the pulsating escapement—how master artisans carve away baseplates to celebrate mechanical kinetic sculpture.',
    'Skeletonization is the ultimate celebration of transparency in mechanical horology. By removing all superfluous metal from bridges and mainplates, watchmakers expose the intricate dance of balance wheels, hairsprings, and winding gears.',
    'Horological Heritage',
    'auth-adrien',
    TIMESTAMP '2026-08-14 15:20:00',
    '6 min read',
    6,
    '/assets/products/watch-35.png',
    '["Skeleton Watches", "Open Heart", "Geneva Stripes", "Kinetic Sculpture"]',
    '["WRT-035", "WRT-036", "WRT-037"]',
    '[{"heading":"The Elimination of Superfluous Matter","paragraphs":["Traditional watchmaking conceals its mechanical heart beneath an opaque dial. Skeletonization reverses this convention entirely: it turns the caliber itself into the dial.","Originating in 18th-century France under master watchmaker André-Charles Caron, skeletonization requires an artisan to carefully saw, mill, and file away the non-structural metal of the mainplate and bridges while preserving absolute structural rigidity."]},{"heading":"The Open-Heart vs. Full Skeleton Distinction","paragraphs":["Connoisseurs draw an important distinction between an \"Open Heart\" timepiece and a \"Full Skeleton\":","An Open-Heart watch features a solid, beautifully textured dial with a circular aperture precisely positioned over the balance wheel—allowing the wearer to observe the frantic 21,600 vph flutter of the escapement without losing the clean legibility of an hour track.","A Full Skeleton, by contrast, eliminates the dial entirely. Every gear train tooth, sliding pinion, and mainspring coil is exposed from both the dial side and through an exhibition sapphire exhibition caseback."],"quote":{"text":"A skeleton watch is poetry in motion. You do not just check the hour; you witness the continuous, miraculous expenditure of kinetic life.","attribution":"Adrien de Beauharnais"}}]',
    FALSE,
    TRUE,
    1310,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO NOTHING;
