# Prompt 03: Desktop Web Parity Roadmap (Milestones 1 to 5)

**Target Project:** WRISTO Ultra-Luxury Watch Marketplace  
**Scope:** Complete Desktop Web Parity with Reference Design Boards  
**Status:** 100% Completed & Verified  

---

## 📜 Desktop Parity Prompts (Milestones 1–5)

```markdown
### Milestone 1: Watch Comparison Engine
- Implement `ComparisonContext.tsx` with max 4 watch slots, toast feedback, and localStorage sync.
- Create `FloatingComparisonDock.tsx` floating at the bottom with thumbnail chips, watch count, clear trigger, minimize pill, and "Compare Watches (N) →" CTA.
- Build dedicated `/compare` route (`ComparisonClient.tsx`) with 9-specification side-by-side technical matrix:
  - Price & Savings, Caliber Movement, Case Metallurgy, Diameter & Thickness, Dial & Crystal, Strap & Clasp, Water Resistance, Heritage Warranty, and Instant Add-to-Cart / Buy Now buttons.
- Wire comparison triggers across `Header.tsx`, `ProductCard.tsx` (quick action icon), and `ProductActions.tsx` (PDP toggle).

### Milestone 2: Homepage Parity & 8K Ultra-HD Photography Replacements
- Replace all blurred/placeholder graphics with 8K ultra-HD luxury photography.
- `PopularBrands.tsx`: 6 brand cards + crown bezel banner: "Explore Premium Brands. Authentic. Trusted. Always. [ Browse Brands → ]".
- `OccasionSection.tsx`: 4 tall lifestyle cards (Formal 312, Casual 489, Sports 256, Luxury 198) with carousel dots (`01 < >`).
- `AppPromoSection.tsx`: 3D titanium smartphone mockup showcasing WRISTO iOS/Android app + official App Store & Google Play badges.
- `BlogPreviewSection.tsx`: 3 preview cards linking to `/journal` with category pills and reading times.
- `TrustStrip.tsx`: Copy alignment matching reference board:
  - "100% Authentic | Brand Warranty"
  - "Free Shipping | Across India"
  - "Easy Returns | Within 7 Days"
  - "Secure | Payments"

### Milestone 3: Catalog / PLP Enhancements
- `ShopByCategoryList.tsx`: Left sidebar category jump list with active state indicators and counts.
- `CircularCategoryChips.tsx`: 4 circular visual category chips below PLP header (`Analog 1240`, `Chronograph 852`, `Smart 600`, `Dress 716`).
- Product Card Status Badges: Distinct bottom pill badges (`Best Seller`, `Trending`, `Premium`, `New Arrival`, `Limited Edition`).
- Dynamic catalog header titles (`Men's Watches`, `Women's Watches`, `All Timepieces`).

### Milestone 4: Dedicated Standalone Desktop Pages
- Dedicated `/wishlist` full-page table layout (`WishlistClient.tsx` - Panel 8 parity) with thumbnail, brand, model, price, stock status pill (`In Stock` / `Low Stock`), quick Add to Cart, and remove actions.
- Dedicated `/cart` 2-column full-page layout (`CartPageClient.tsx` - Panel 9 parity) with specs, quantity steppers, promo code validation, sticky order summary card, and trust guarantees.
- Dedicated `/brands` curated brand houses showcase page (`BrandsClient.tsx`).
- Account Persona Update: Set collector profile to `Gaurav Kadam` (`gauravkadam@gmail.com`, `+91 98765 43210`, Pune, Maharashtra, Grand Complication Patron tier).

### Milestone 5: Header, Footer & Search Polish
- `Header.tsx`: Navigation links (`Home | Men | Women | Collections | Brands | Accessories | Journal | AI Concierge`) and rewired Wishlist icon to `/wishlist`.
- `Footer.tsx`: Pune, Maharashtra address, `+91 98765 43210`, `support@wristo.com`, brand tagline "Your Time. Your Style.", social media links, and payment badges (`VISA`, `Mastercard`, `Maestro`, `UPI`, `Net Banking`).
- `SearchModal.tsx`: Search keywords updated to reference board (`Titan`, `Fastrack`, `Casio`, `Chronograph`, `Smart Watch`, `Automatic`, `AUREN`, `Rose Gold`).
- Production build: All 61 static routes compiled cleanly.
```
