# WRISTO — Repository Memory & Architectural Knowledge

**Brand:** WRISTO  
**Tagline:** Your Time. Your Style.  
**Platform:** Ultra-Luxury Multi-Brand Watch E-Commerce Experience  
**Core Technologies:** Vanilla HTML5, Vanilla CSS3 (Custom Design Tokens), ES6+ JavaScript (State & Router Engine)  
**Last Updated:** September 2026

---

## 1. Architectural Philosophy

WRISTO is designed as an ultra-luxury editorial watch boutique — pairing the aesthetic caliber of Swiss horological publications (*A Collected Man*, *Hodinkee*, *Revolution Magazine*) with instantaneous client-side performance, zero framework overhead, and responsive fluidity across mobile, tablet, and ultra-wide desktop.

### Foundational Invariants:
1. **Zero Framework Bloat:** Pure semantic HTML5, Vanilla CSS3, and ES6+ modules without React/Next.js/Tailwind abstractions.
2. **Photography-First Contrast:** Dark, cinematic horological surfaces contrasted against warm, tactile ivory/paper backgrounds (`#F7F3EC`, `#FFFDF9`).
3. **No Unrequested Layout Shifts:** Section ordering and component hierarchy must strictly respect established positioning.

---

## 2. Global Homepage Section Order & Component Flow

The homepage architecture follows a deliberate rhythm of dark cinematic heroics, tactile light product curation, and contained editorial moments:

```
┌────────────────────────────────────────────────────────┐
│ 1. Header (Sticky, Glassmorphic / Dark Adaptive)       │
│    - Official WRISTO Horizontal Logo (Transparent PNG) │
│    - Navigation Links, Search, Wishlist, Cart Counters │
├────────────────────────────────────────────────────────┤
│ 2. Hero Section (Cinematic Dark Horology)              │
│    - Focal Watch on Rock Backdrop (Right)              │
│    - Dark Gradient Left for Typographic Legibility     │
│    - Serif "Your Time. Your Style." + Champagne CTA    │
│    - Interactive Video Modal Trigger                   │
├────────────────────────────────────────────────────────┤
│ 3. Luxury Trust Strip (Minimalist, Non-Carded)         │
│    - 100% Authentic | Free Shipping | Returns | Secure │
├────────────────────────────────────────────────────────┤
│ 4. AI Watch Concierge (Interactive Teaser Card)        │
│    - Natural language prompt box + Smart query chips   │
├────────────────────────────────────────────────────────┤
│ 5. Trending Timepieces (Curated 8-Watch Catalog Grid)  │
│    - Best Sellers, Editorial Picks, Automatic calibers │
├────────────────────────────────────────────────────────┤
│ 6. Editorial Campaign Banner ("Modern Looks")          │
│    - Original Contained Card Structure (.container)    │
│    - 2-Column: Left Editorial Text / Right Photo Visual│
│    - "NEW ARRIVALS" + "Modern Looks. Timeless Feel."   │
│    - "Explore Now →" Champagne CTA                     │
│    - 01 —— 02 —— 03 Carousel Indicator                │
│    - "STYLE IN EVERY DETAIL" Glassmorphic Badge        │
├────────────────────────────────────────────────────────┤
│ 7. Curated Editorial Collections (Lifestyle Narratives)│
├────────────────────────────────────────────────────────┤
│ 8. Mechanical & Skeleton Souls (Automatic Showcase)    │
├────────────────────────────────────────────────────────┤
│ 9. Curated Brands Showcase & Journal Stories           │
├────────────────────────────────────────────────────────┤
│ 10. Global Footer (Brand Identity, Directory, Legal)   │
└────────────────────────────────────────────────────────┘
```

> [!IMPORTANT]
> **Position Invariant for "Modern Looks. Timeless Feel."**:  
> This section is strictly positioned **after Trending Timepieces** and **before Curated Collections**. It must **never** be placed as the second section of the whole page (directly under the hero). It is designed as a contained card inside `.container`, not a full-bleed window.

---

## 3. Brand Identity & Asset Architecture

### Official Brand Logo Treatment
- **Dark Theme (`logo-theme-dark`)**: `assets/brand/logo-horizontal-dark.png`
  - High-resolution, anti-aliased transparent PNG.
  - Ivory wordmark (`#F7F3EC`) + bronze stylized W monogram (`#B08D6B`) + bronze tagline *"YOUR TIME. YOUR STYLE."*.
  - Used on dark headers, hero section, and dark banners. Zero white bounding box.
- **Light Theme (`logo-theme-light`)**: `assets/brand/logo-horizontal-light.png`
  - Charcoal wordmark (`#1A1A1A`) + bronze stylized W monogram (`#B08D6B`).
  - Used on scrolled/sticky white headers or light modal surfaces.

### Editorial Banner Asset
- **Source**: `assets/banners/banner-modern-looks.png` (470×218 clean crop, navbar artifacts removed).
- **Desktop/Tablet Implementation**: Right column of `.banner-editorial-card` with `background-position: right center; background-size: cover;`.
- **Seam Blending**: Handled via `.banner-editorial-visual-overlay` with a dark `#0E0E0E` gradient (`linear-gradient(to right, #0E0E0E 0%, #0E0E0E 16%, rgba(14, 14, 14, 0.9) 28%, transparent 48%)`) to guarantee no ghost raster text is visible.
- **Mobile Implementation**: `order: -1; min-height: 230px; background-position: 96% center; background-size: 190% auto;` to isolate the watch on wrist and jacket cuff.

---

## 4. Design Tokens & Color Palettes

### Primary Brand Palette
- `--brand-charcoal`: `#1A1A1A` (Primary typography & dark accents)
- `--brand-ivory`: `#F7F3EC` (Warm luxury text & surfaces)
- `--brand-sand`: `#D9C9B8` (Subtle borders & warm tints)
- `--brand-bronze`: `#B08D6B` (Official brand accent, category eyebrows, badges)
- `--brand-soft-black`: `#0F0F0F` / `#0E0E0E` (Editorial card backgrounds)
- `--color-brand-black`: `#111111` (Deep night sections)
- `--color-accent-champagne`: `#DEC095` / `#E8C89A` (Primary interactive CTA buttons)

### Typography Hierarchy
- **Serif Display (`var(--font-serif)`)**: Playfair Display, Cormorant Garamond, Georgia, serif.
  - Hero Headline: 56px, line-height 1.08, letter-spacing -0.02em.
  - Editorial Banner Headline: 42px, line-height 1.12, letter-spacing -0.015em.
- **Sans Body (`var(--font-body)`)**: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif.
  - Eyebrows: 11px, weight 600, letter-spacing 0.22em, uppercase.
  - Body: 14.5px – 15px, weight 400, line-height 1.6, color `#B3B3B3` or `#5F5F5F`.

---

## 5. Key Code Signatures

### Editorial Banner Markup (`js/app.js`):
```html
<section class="section" style="padding-top: 0; padding-bottom: var(--space-16);">
  <div class="container">
    <div class="banner-editorial-card">
      <div class="banner-editorial-content">
        <div class="banner-eyebrow">NEW ARRIVALS</div>
        <h2 class="banner-title">
          <span class="banner-title-line">Modern Looks.</span>
          <span class="banner-title-line">Timeless Feel.</span>
        </h2>
        <p class="banner-desc">
          Discover the latest watches from top brands, designed for every mood.
        </p>
        <div class="banner-actions">
          <button class="btn btn-banner-primary" onclick="navigateTo('discovery')">
            Explore Now <span class="btn-arrow">&rarr;</span>
          </button>
        </div>
        <div class="banner-carousel-indicator" aria-hidden="true">
          <span class="carousel-num active">01</span>
          <span class="carousel-divider"></span>
          <span class="carousel-num">02</span>
          <span class="carousel-divider"></span>
          <span class="carousel-num">03</span>
        </div>
      </div>
      <div class="banner-editorial-visual">
        <div class="banner-editorial-visual-overlay"></div>
        <span class="banner-editorial-badge">
          STYLE IN EVERY DETAIL
        </span>
      </div>
    </div>
  </div>
</section>
```

---

## 6. Development & Verification Commands
- **Local Dev Server**: `python -m http.server 3333` (accessible at `http://localhost:3333/`)
- **Visual Regression Verification**:
  ```powershell
  Start-Process -FilePath "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "--headless --disable-gpu --screenshot=e:\WRISTO\preview.png --window-size=1440,3200 http://localhost:3333/" -Wait
  ```
