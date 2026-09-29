# WRISTO — Design Tokens & Interaction Specification

**Brand:** WRISTO  
**Tagline:** Your Time. Your Style.  
**Product:** Premium multi-brand watch e-commerce platform  
**Document:** UI Design Tokens, Component Rules, 3D Effects & Micro-interactions  
**Version:** 1.0

---

## 1. Design Direction

WRISTO should feel like a premium watch boutique rather than a generic e-commerce marketplace.

### Core visual principles

- Premium but approachable
- Modern, editorial, and minimal
- Product-first photography
- Strong contrast between luxury dark sections and warm light sections
- Generous whitespace
- Refined typography
- Subtle depth instead of excessive gradients
- Motion should feel expensive and controlled
- Every interaction should communicate a clear state change
- Product imagery should remain the visual hero

### Avoid

- Excessive glassmorphism
- Neon colors
- Heavy gradients
- Over-rounded "generic SaaS" cards
- Excessive animations
- Bouncy/cartoon-like motion
- Large shadows that make the UI look cheap
- Crowded product grids
- Random decorative 3D objects that compete with watches

---

# 2. Brand Design Tokens

## 2.1 Color System

### Primary

| Token | Value | Usage |
|---|---|---|
| `color.brand.black` | `#111111` | Primary brand/background |
| `color.brand.ink` | `#171717` | Main dark surfaces |
| `color.brand.charcoal` | `#242424` | Secondary dark surfaces |
| `color.brand.cream` | `#F6F1E9` | Primary warm background |
| `color.brand.paper` | `#FFFDF9` | Cards and clean surfaces |
| `color.brand.white` | `#FFFFFF` | Text and clean backgrounds |

### Warm Accent

| Token | Value | Usage |
|---|---|---|
| `color.accent.champagne` | `#E8C89A` | Premium CTA / highlights |
| `color.accent.gold` | `#C89B5B` | Luxury details |
| `color.accent.tan` | `#D8B58A` | Secondary accents |
| `color.accent.blush` | `#F0DDD0` | Soft promotional surfaces |

### Text

| Token | Value | Usage |
|---|---|---|
| `color.text.primary` | `#171717` | Main text |
| `color.text.secondary` | `#5F5F5F` | Supporting text |
| `color.text.muted` | `#8A8A8A` | Metadata |
| `color.text.inverse` | `#FFFFFF` | Text on dark surfaces |
| `color.text.accent` | `#A8793D` | Premium accent text |

### Borders

| Token | Value | Usage |
|---|---|---|
| `color.border.light` | `#E8E3DC` | Light UI borders |
| `color.border.medium` | `#D7D1C8` | Inputs / selected states |
| `color.border.dark` | `#3A3A3A` | Dark surfaces |
| `color.border.accent` | `#D6B27E` | Premium selected states |

### Semantic

| Token | Value |
|---|---|
| `color.success` | `#3F8A62` |
| `color.warning` | `#C58A38` |
| `color.error` | `#B94A48` |
| `color.info` | `#527A9E` |

Use semantic colors sparingly. WRISTO should remain visually neutral and premium.

---

# 3. Typography

## 3.1 Font Strategy

Use two font families:

### Display / Editorial

Recommended:

- `Cormorant Garamond`
- `Playfair Display`
- `DM Serif Display`

Use for:

- Hero headlines
- Editorial statements
- Luxury campaign headings
- Large promotional sections

### UI / Commerce

Recommended:

- `Inter`
- `Manrope`
- `Plus Jakarta Sans`

Use for:

- Navigation
- Product names
- Prices
- Buttons
- Filters
- Forms
- Account screens
- Metadata

### Typography Tokens

| Token | Size | Weight | Line Height |
|---|---:|---:|---:|
| `type.display.xl` | 64px | 500 | 0.98 |
| `type.display.lg` | 52px | 500 | 1.0 |
| `type.heading.xl` | 40px | 600 | 1.05 |
| `type.heading.lg` | 32px | 600 | 1.1 |
| `type.heading.md` | 26px | 600 | 1.15 |
| `type.heading.sm` | 22px | 600 | 1.2 |
| `type.body.lg` | 18px | 400 | 1.55 |
| `type.body.md` | 16px | 400 | 1.5 |
| `type.body.sm` | 14px | 400 | 1.45 |
| `type.caption` | 12px | 500 | 1.35 |
| `type.label` | 11px | 600 | 1.2 |

### Desktop Hero

```text
Your Time.
Your Style.
```

- Display font
- 56–72px desktop
- 38–44px tablet
- 32–38px mobile
- Letter spacing: `-0.03em`
- Maximum width: `520px`

---

# 4. Spacing System

Use an 8px base grid.

| Token | Value |
|---|---:|
| `space.1` | 4px |
| `space.2` | 8px |
| `space.3` | 12px |
| `space.4` | 16px |
| `space.5` | 20px |
| `space.6` | 24px |
| `space.8` | 32px |
| `space.10` | 40px |
| `space.12` | 48px |
| `space.16` | 64px |
| `space.20` | 80px |
| `space.24` | 96px |
| `space.32` | 128px |

### Section spacing

Desktop:

- Small section: `64px`
- Standard section: `80px`
- Hero-to-next-section: `96px`
- Major editorial section: `120px`

Mobile:

- Small section: `40px`
- Standard section: `48px`
- Major section: `64px`

---

# 5. Layout Tokens

## Desktop

- Maximum content width: `1440px`
- Standard content width: `1280px`
- Horizontal page padding: `40px`
- Large desktop padding: `64px`
- Grid gap: `20–24px`

## Tablet

- Horizontal padding: `24px`
- Grid gap: `16–20px`

## Mobile

- Horizontal padding: `16px`
- Grid gap: `12px`
- Minimum touch target: `44px`

---

# 6. Border Radius

WRISTO should use restrained rounding.

| Token | Value | Usage |
|---|---:|---|
| `radius.xs` | 4px | Tags |
| `radius.sm` | 8px | Inputs |
| `radius.md` | 12px | Product cards |
| `radius.lg` | 16px | Promotional cards |
| `radius.xl` | 24px | Large editorial blocks |
| `radius.pill` | 999px | Chips / filters |

Avoid making every component excessively rounded.

---

# 7. Shadows & Depth

Use shadows to create subtle product depth.

```css
--shadow-xs:
0 1px 2px rgba(0,0,0,.04);

--shadow-sm:
0 4px 12px rgba(0,0,0,.06);

--shadow-md:
0 10px 30px rgba(0,0,0,.08);

--shadow-lg:
0 20px 50px rgba(0,0,0,.12);

--shadow-product:
0 18px 40px rgba(0,0,0,.14);
```

### Rule

Product images may use stronger depth than normal UI cards.

Do not use heavy shadows on every element.

---

# 8. Navigation

## Desktop Header

Structure:

```text
WRISTO | Home | Men | Women | Collections | Brands | Accessories | Search | Wishlist | Account | Cart
```

### Header

- Height: `72–80px`
- Background: transparent over hero OR `paper`
- Logo: uppercase
- Navigation font: 12–13px
- Letter spacing: `0.02em`
- Icons: 18–20px

### Sticky Header

When scrolling:

1. Header transitions to solid background.
2. Background becomes `#FFFDF9` or `#111111` depending on section.
3. Add subtle bottom border.
4. Reduce height from `80px` to `64px`.

Transition:

```text
300ms
ease-out
```

---

# 9. Hero Section

The hero is the most important visual area.

### Composition

- Large watch photography
- Editorial headline
- Short supporting copy
- Primary CTA
- Secondary CTA
- Small pagination / carousel indicators
- Optional floating product detail

### Example

```text
Your Time.
Your Style.

Discover a curated collection of premium watches
from the world's most trusted brands.

[ Explore Collection ]   [ Watch Story ]
```

### Hero image treatment

- High-resolution product photography
- Watch should occupy approximately `40–55%` of visual area
- Background should remain simple
- Add soft radial lighting behind watch
- Use subtle shadow beneath the product

---

# 10. Product Card

## Structure

```text
Image
Wishlist
Brand
Product Name
Rating
Price
Original Price
Discount
Tag
```

### Product card

- Background: `#FFFDF9`
- Radius: `12px`
- Border: `1px solid #E8E3DC`
- Image area: `1:1` or `4:5`
- Padding: `12–16px`

### Hover

Desktop:

- Image scale: `1.02–1.04`
- Card translateY: `-3px`
- Shadow increases slightly
- Wishlist icon becomes more visible
- Quick-add action fades in

Duration:

```text
250ms
```

---

# 11. Product Image 3D Treatment

The watch itself should appear dimensional without becoming a literal 3D model.

### Layering

```text
Background
    ↓
Soft radial glow
    ↓
Watch shadow
    ↓
Watch product image
    ↓
Optional highlight reflection
```

### CSS-style effect

```css
.product-image {
  transform:
    perspective(900px)
    rotateX(var(--rotate-x))
    rotateY(var(--rotate-y))
    translateZ(0);
  transition: transform 450ms cubic-bezier(.2,.8,.2,1);
}
```

### Mouse movement

Maximum:

```text
rotateX: ±2deg
rotateY: ±3deg
```

Do not exceed this for normal product cards.

### Product detail page

The main watch image can use:

```text
perspective: 1200px
rotateX: 1–3deg
rotateY: 2–4deg
scale: 1.01
```

The effect must remain subtle.

---

# 12. 3D Product Tilt

On desktop:

- Cursor enters product image
- Calculate pointer position relative to center
- Apply small X/Y rotation
- Add slight highlight movement
- Reset smoothly on pointer leave

Interaction:

```text
Enter: 150ms
Tracking: immediate / spring-like
Leave: 400ms
```

### Important

Do not use continuous floating animation on product images.

The watch should feel premium, not like a gaming UI.

---

# 13. Product Gallery

Product detail page:

```text
Thumbnail rail
        +
Large product image
        +
Zoom
```

### Thumbnail interaction

- Selected border: champagne/gold
- Other thumbnails: light border
- Selected thumbnail slightly scales to `1.03`

Transition:

```text
180ms ease-out
```

### Image switching

Use:

```text
opacity + subtle scale
```

instead of hard replacement.

---

# 14. Buttons

## Primary Button

```text
Background: #111111
Text: #FFFFFF
Height: 48px
Radius: 8px
Padding: 0 22px
```

Hover:

- Background becomes `#252525`
- Arrow moves `3px` right

## Premium CTA

```text
Background: #E8C89A
Text: #171717
```

Use for:

- Hero CTA
- Campaign CTA
- Checkout CTA

### Button micro-interaction

On hover:

```text
transform: translateY(-1px)
```

On press:

```text
transform: scale(.98)
```

Duration:

```text
120–180ms
```

---

# 15. Wishlist Interaction

Default:

```text
♡
```

Selected:

```text
♥
```

### Animation

1. Icon scales `1 → 1.2`
2. Returns to `1`
3. Small opacity/ripple effect
4. Product remains in wishlist

Duration:

```text
250–350ms
```

Avoid excessive heart explosions.

---

# 16. Add-to-Cart Interaction

When user clicks Add to Cart:

### Desktop

- Button changes to `Added`
- Cart icon receives subtle pulse
- Small confirmation toast appears

Example:

```text
✓ Titan Neo Analog added to cart
```

### Mobile

Use a bottom confirmation sheet/toast.

Animation:

```text
translateY(12px → 0)
opacity: 0 → 1
```

Duration:

```text
250ms
```

Auto-hide:

```text
2.5–3 seconds
```

---

# 17. Search Interaction

Desktop:

Search icon → expands into search field.

Animation:

```text
width: 40px → 280px
opacity: 0 → 1
```

Show:

- Recent searches
- Popular brands
- Product suggestions
- Category suggestions

### Search result card

Show:

```text
Thumbnail
Brand
Product name
Price
```

Keep the search UI clean and compact.

---

# 18. Filters

Product listing filters:

- Brand
- Price
- Gender
- Watch Type
- Movement
- Strap Material
- Case Material
- Water Resistance
- Features

### Desktop

Use a left filter rail or expandable filter panel.

### Mobile

Use:

```text
[ Filter ] [ Sort ]
```

as sticky bottom/top controls.

### Filter chips

Selected chip:

- Dark background
- White text

or

- Champagne background
- Dark text

---

# 19. Category Navigation

Primary categories:

```text
Men
Women
Unisex
Analog
Chronograph
Smart Watches
Accessories
```

Category cards should use product/lifestyle photography rather than generic icons whenever possible.

### Hover

- Image zoom: `1.04`
- Overlay opacity: slightly increase
- Arrow moves right by `3px`

---

# 20. Brand Showcase

Supported example brands in the prototype:

- Titan
- Fastrack
- Casio
- Tommy Hilfiger
- Seiko
- Fossil

### Brand cards

- Neutral background
- Logo centered
- Minimal border
- Small hover lift

Do not make brand logos visually larger than WRISTO's own brand identity.

---

# 21. Curated Collections

Examples:

### Everyday Essentials
Minimal watches for everyday use.

### Luxury Picks
Premium watches and refined designs.

### Sporty Vibes
Sport and chronograph-oriented watches.

### Modern Classics
Classic designs with contemporary styling.

### Collection interaction

Card hover:

```text
translateY(-4px)
image scale(1.03)
CTA opacity 0 → 1
```

---

# 22. Editorial / Lifestyle Sections

WRISTO should not look like a pure product catalog.

Use editorial sections such as:

```text
More Than Just Watches.
```

or

```text
Style Speaks Louder Than Time.
```

Use lifestyle photography showing:

- Wrist
- Outfit
- Watch close-up
- Travel
- Office
- Formal events
- Casual lifestyle

### Goal

Connect the watch with personal style rather than only specifications.

---

# 23. Mobile Design Tokens

## Mobile screen

Recommended content width:

```text
100% - 32px
```

Horizontal padding:

```text
16px
```

### Bottom navigation

Recommended:

```text
Home
Categories
Wishlist
Profile
```

Height:

```text
64–72px
```

### Mobile cards

Use two-column product grids where appropriate.

Card spacing:

```text
8–12px
```

Do not shrink product images too aggressively.

---

# 24. Mobile Product Detail

Recommended hierarchy:

```text
Image
Brand
Product Name
Rating
Price
Discount
Color
Key Features
Delivery
Add to Cart
Buy Now
```

### Sticky CTA

On mobile, keep:

```text
[ Add to Cart ] [ Buy Now ]
```

visible near the bottom after product information becomes scrollable.

---

# 25. Mobile Gestures

Support:

### Product gallery

- Swipe left/right
- Pinch to zoom
- Double tap to zoom

### Product cards

- Tap to open
- Tap heart to wishlist

### Bottom sheet

Filters and sorting should open as bottom sheets.

Animation:

```text
300–350ms
ease-out
```

---

# 26. Micro-interaction Library

## Navigation

- Active underline slides into position.
- Hover text changes subtly.
- Icons scale from `1 → 1.05`.

## Product cards

- Image zoom
- Card lift
- Wishlist animation
- Quick-add fade

## Buttons

- Arrow movement
- Slight lift
- Press compression

## Wishlist

- Heart scale pulse
- Selected state transition

## Cart

- Cart badge number updates with a short scale pulse.

## Search

- Search field expands
- Suggestions fade/slide in.

## Filters

- Selected chip changes background
- Result count updates smoothly.

## Loading

Use elegant skeleton loaders.

Avoid spinners when possible.

---

# 27. Page Transition

Use subtle page transitions.

Recommended:

```text
opacity: 0 → 1
translateY: 8px → 0
duration: 250ms
```

Do not use dramatic page animations.

---

# 28. Scroll Animations

Sections can reveal when entering viewport.

Recommended:

```text
opacity: 0 → 1
translateY: 20px → 0
duration: 600ms
```

Stagger:

```text
80–120ms
```

for cards.

### Important

Animations should trigger once per section, not continuously every time the user scrolls a few pixels.

---

# 29. Hero Motion

The hero can have a very slow image movement:

```text
scale: 1.00 → 1.03
duration: 8–12 seconds
```

Use only for large hero imagery.

For dark premium hero sections:

- Subtle parallax
- Very low movement
- No looping rotation

---

# 30. 3D / Depth System

WRISTO uses three levels of depth.

## Level 1 — Flat

Used for:

- Navigation
- Text
- Filters
- Simple cards

## Level 2 — Soft Depth

Used for:

- Product cards
- Buttons
- Category cards
- Brand cards

Effects:

```text
small shadow
1–3px lift
1–2% image scale
```

## Level 3 — Hero Depth

Used for:

- Main product hero
- Product detail image
- Premium campaign sections

Effects:

```text
perspective
subtle tilt
soft shadow
radial light
parallax
```

Never apply Level 3 effects to every component.

---

# 31. Motion Tokens

| Token | Value | Usage |
|---|---:|---|
| `motion.fast` | 120ms | Press states |
| `motion.quick` | 180ms | Icons / chips |
| `motion.standard` | 250ms | Hover / buttons |
| `motion.medium` | 350ms | Cards / sheets |
| `motion.slow` | 600ms | Section reveal |
| `motion.editorial` | 900ms | Large visual transitions |

### Easing

Standard:

```text
cubic-bezier(.2,.8,.2,1)
```

Exit:

```text
cubic-bezier(.4,0,1,1)
```

Entrance:

```text
cubic-bezier(0,0,.2,1)
```

---

# 32. Accessibility

## Contrast

Maintain WCAG-compliant contrast for normal UI text.

## Touch targets

Minimum:

```text
44 × 44px
```

## Focus

Keyboard focus should use a visible:

```text
2px accent outline
```

## Reduced motion

Respect:

```text
prefers-reduced-motion
```

When enabled:

- Disable tilt
- Disable parallax
- Reduce reveal animation
- Keep functional state changes

---

# 33. Image Guidelines

Product photography is critical to WRISTO.

### Product images

Prefer:

- High resolution
- Clean backgrounds
- Consistent crop
- Consistent lighting
- Front/angle/detail views
- Transparent PNG/WebP when useful

### Recommended formats

```text
WebP
AVIF
PNG for transparent assets
```

### Product image consistency

All product cards should use a consistent visual frame.

Do not mix:

```text
one product on white
one product on black
one product with lifestyle background
```

inside the same grid unless intentionally creating an editorial section.

---

# 34. Responsive Breakpoints

```text
Mobile:       < 640px
Tablet:       640–1023px
Desktop:      1024–1439px
Large Desktop: 1440px+
```

### Mobile

- Single-column hero
- Two-column product grid
- Bottom navigation
- Bottom-sheet filters
- Sticky purchase CTA

### Tablet

- Two/three-column grids
- Condensed navigation
- Reduced hero typography

### Desktop

- Full navigation
- Four-column product grids
- Editorial layouts
- Hover interactions
- 3D tilt enabled

---

# 35. Component Naming

Recommended implementation naming:

```text
WristoHeader
WristoHero
WristoButton
WristoProductCard
WristoProductGrid
WristoCategoryCard
WristoBrandCard
WristoCollectionCard
WristoFilterPanel
WristoSearch
WristoWishlistButton
WristoCartDrawer
WristoProductGallery
WristoPrice
WristoRating
WristoBadge
WristoToast
WristoBottomNav
WristoCheckout
```

---

# 36. Product Badge System

Use only meaningful badges.

```text
BEST SELLER
NEW ARRIVAL
TRENDING
PREMIUM
LIMITED
SALE
LOW STOCK
```

### Badge style

- Small uppercase text
- 10–11px
- Medium/semibold
- Compact padding
- 6–8px radius

Avoid placing multiple badges on every product.

---

# 37. Ecommerce States

Every interactive component should have these states:

```text
Default
Hover
Focus
Active
Pressed
Disabled
Loading
Success
Error
```

Product cards should additionally support:

```text
Out of Stock
Low Stock
Sale
New
Wishlist Selected
```

---

# 38. Loading States

Use skeleton loading for:

- Product grids
- Product detail
- Search suggestions
- Wishlist
- Cart

Skeleton should use subtle neutral tones:

```text
#ECE8E1
```

Avoid bright animated loaders.

---

# 39. Toast Notifications

Examples:

```text
Added to wishlist
Added to cart
Removed from wishlist
Item removed from cart
Order placed successfully
```

Position:

Desktop:

```text
bottom-right
```

Mobile:

```text
bottom-center
```

Duration:

```text
2.5–3 seconds
```

---

# 40. Checkout UX

Keep checkout visually quieter than shopping pages.

Steps:

```text
Address → Payment → Review → Confirmation
```

Use:

- Clear totals
- Delivery estimate
- Secure payment indicator
- Minimal distractions
- Strong primary CTA

---

# 41. Footer

Footer should reinforce the brand.

### Primary

```text
WRISTO
Your Time. Your Style.
```

### Sections

```text
Shop
Men
Women
Collections
Brands
Accessories

Customer Care
FAQs
Shipping
Returns
Warranty
Track Order

Company
About
Contact
Careers
```

### Social

Use compact icons.

---

# 42. Overall Visual Hierarchy

Every page should follow:

```text
Brand
↓
Editorial statement
↓
Product / collection
↓
Supporting information
↓
Social proof
↓
Conversion CTA
```

Avoid making every section equally loud.

---

# 43. Design Personality

WRISTO should communicate:

**Premium**
- Typography
- Photography
- Whitespace
- Controlled motion

**Trustworthy**
- Brand information
- Ratings
- Warranty
- Delivery
- Returns

**Fashion-forward**
- Editorial sections
- Lifestyle photography
- Curated collections

**Modern**
- Responsive UI
- Smooth interactions
- Clean navigation

**Accessible**
- Clear hierarchy
- Simple controls
- Good contrast
- Predictable interactions

---

# 44. Final Implementation Rule

The website should never feel like a template.

The UI should consistently communicate:

> **WRISTO — Your Time. Your Style.**

Every visual decision should support one of these four ideas:

1. **Time**
2. **Personal style**
3. **Premium watches**
4. **Curated discovery**

If a visual effect does not improve one of these areas, do not add it.

---

# 45. Recommended Tech Implementation

For a modern implementation:

### Frontend

```text
React
TypeScript
Tailwind CSS
Framer Motion
Lucide Icons
```

### Image handling

```text
WebP / AVIF
Lazy loading
Responsive image sizes
Blur placeholder
```

### Motion

Use Framer Motion for:

- Page transitions
- Card hover
- Bottom sheets
- Wishlist
- Cart interactions
- Section reveals

Use CSS for:

- Simple hover
- Focus
- Press states
- Small transitions

### 3D

Use lightweight CSS 3D transforms for most interactions.

Use Three.js / React Three Fiber only when a genuine interactive 3D watch model is required. Do not introduce WebGL only for decorative effects.

---

# 46. Design QA Checklist

Before considering a screen complete:

- [ ] WRISTO branding is consistent
- [ ] "Your Time. Your Style." is used appropriately
- [ ] Typography hierarchy is clear
- [ ] Product images have consistent framing
- [ ] CTAs are visually obvious
- [ ] Hover states exist on desktop
- [ ] Touch states exist on mobile
- [ ] Wishlist interaction works
- [ ] Cart interaction works
- [ ] Loading state exists
- [ ] Empty state exists
- [ ] Error state exists
- [ ] Responsive layout works
- [ ] 44px minimum touch targets are respected
- [ ] Reduced-motion behavior is supported
- [ ] 3D effects remain subtle
- [ ] No excessive shadows or gradients
- [ ] Page does not feel like a generic ecommerce template

---

## WRISTO Design Principle

> **Premium should be felt through restraint, not decoration.**

The final experience should feel like a modern watch boutique with the convenience of a large e-commerce platform.
