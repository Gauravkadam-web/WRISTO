# Prompt 02: Core Commerce Lifecycle (Phases 1 to 10)

**Target Project:** WRISTO Ultra-Luxury Watch Marketplace  
**Scope:** Complete 10-Phase End-to-End Commerce Architecture  
**Status:** 100% Completed & Verified  

---

## 📜 Phase 1 to 10 Implementation Prompts

```markdown
Implement the complete 10-phase production architecture for WRISTO in Next.js 16+ App Router:

### Phase 1: Luxury Hero Section Refinement
- Dark luxury cinematic watch on rock backdrop (`hero-luxury-watch-bg.jpg`).
- Left-side dark gradient overlay (`rgba(10,10,10,0.95)` to `transparent`) ensuring maximum contrast.
- Headline: "Your Time. Your Style." with Playfair Display serif typography.
- Primary CTA: "Explore Collection →" + Secondary "Watch Video" modal trigger with 4K horology cinema trailer.
- Editorial pagination indicator (01 / 03) and 3 active carousel dots.

### Phase 2: Official Brand Identity & Vector Lockup
- Clean, transparent, anti-aliased logo assets:
  - `logo-horizontal-dark.png`: Ivory wordmark + Bronze W monogram + Tagline for dark backgrounds.
  - `logo-horizontal-light.png`: Charcoal wordmark + Bronze monogram for light headers.

### Phase 3: "Modern Looks. Timeless Feel." Editorial Banner
- Contained card structure `.banner-editorial-card` (`border-radius: 20px`, `border: 1px solid rgba(255,255,255,0.08)`).
- Two-column grid layout:
  - Left: Bronze eyebrow `NEW ARRIVALS`, luxury headline, description, `Explore Now →` button, `01 —— 02 —— 03` indicator.
  - Right: Photographic watch visual with jacket cuff and `STYLE IN EVERY DETAIL` glassmorphic badge.

### Phase 4: Production Next.js Catalog (PLP) Architecture (`/watches`)
- Decoupled `productService.ts` for filtering, sorting, price range, and facet calculations.
- 40-watch master data with 3D cursor tilt card interactions (`perspective: 900px`).
- 2-way URL searchParams synchronization (`/watches?brand=AUREN&movement=Automatic`).
- Responsive multi-viewport: Sticky left facet rail on desktop (1440px), slide-over `FilterDrawer` on tablet/mobile with backdrop blur.

### Phase 5: Product Detail Experience (PDP) (`/product/[id]`)
- Dynamic SSG pre-rendering all 40 watches via `generateStaticParams()`.
- Level 3 3D Tilt Gallery with vertical thumbnail rail and WRISTO Authenticity Seal.
- Lightbox Macro Inspection modal with zoom controls and Escape key support.
- Horological Technical Matrix (Caliber Movement, Case Size, Metallurgy, Dial, Strap, Water Resistance).
- AI Style Concierge Insight card grounded in `product.aiReason`.
- Mobile sticky thumb-zone purchase bar revealing on scroll.

### Phase 6: Instant Search & Autocomplete Overlay (`⌘K`)
- Global hotkey listener (`⌘K`, `Ctrl+K`, `/`, `Escape`).
- Recent searches chip history stored in `localStorage`.
- Popular search badges (`Titan`, `Fastrack`, `Casio`, `Chronograph`, `Smart Watch`, `Automatic`, `AUREN`).
- Real-time autocomplete suggestions with thumbnail previews and direct PDP links.

### Phase 7: Full Cart Drawer, Promo Engine & Multi-Step Luxury Checkout Sequence
- `CartContext.tsx` with coupon validation (`WRISTO10` 10% off, `HOROLOGY20` 20% off), gift wrapping toggle, and auto-recalculated order totals.
- Multi-step checkout (`/checkout`): 4-step stepper (Address &rarr; Delivery Tier &rarr; Payment Method &rarr; Review).
- Order confirmation page (`/checkout/success`) with dynamic delivery ETA and provenance certificate generator.

### Phase 8: Client Account & Provenance Ledger (`/account`)
- 5-Tab Collector Dashboard: Overview, Order History, Saved Addresses, Wishlist, Concierge Settings.
- `ProvenanceCertificateModal.tsx` rendering high-resolution SVG guilloché security borders, cryptographic hash, and official seal.

### Phase 9: AI Watch Concierge (`/concierge`)
- Interactive multi-turn horological advisor with quick prompt chips.
- Neural matching algorithm filtering catalog based on natural language queries.

### Phase 10: Editorial Journal (`/journal` & `/journal/[slug]`)
- Editorial magazine index and dynamic SSG article reader for 6 horological guides with reading time estimates and author bylines.
- Dynamic XML sitemap (`/sitemap.xml`) and `robots.txt` for all 58+ routes.
```
