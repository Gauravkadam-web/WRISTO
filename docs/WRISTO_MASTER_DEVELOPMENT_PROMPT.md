# WRISTO --- Master Development Prompt

## Production E-Commerce Frontend + Future-Ready Spring Boot Backend

> **Purpose:** This is the single source-of-truth development prompt for
> building the WRISTO premium multi-brand watch-commerce application. It
> consolidates the generic e-commerce, motion, architecture, UX,
> content-management, and engineering requirements into the specific
> WRISTO context.
>
> **Primary implementation now:** Next.js frontend with static/local
> content and mock data.
>
> **Backend target:** Java + Spring Boot, with PostgreSQL as the planned
> persistence layer.
>
> **Future content architecture:** CMS/API-driven content. Keep
> content/data separate from presentation so the current static
> implementation can migrate to CMS/API without redesigning components.

------------------------------------------------------------------------

# 1. ROLE

Act as a senior product engineer, frontend architect, UI engineer,
motion designer, UX engineer, accessibility specialist, SEO engineer,
and e-commerce architect working on a production-quality premium watch
marketplace.

Build WRISTO as a real, maintainable application --- **not a static
visual mockup**.

The supplied WRISTO prototype/screens and brand assets are the visual
source of truth. Match the approved prototype closely while improving
implementation quality where necessary without changing the intended
visual language.

Do not invent a different design system.

------------------------------------------------------------------------

# 2. PRODUCT CONTEXT

## Brand

**WRISTO**

Tagline:

**Your Time. Your Style.**

WRISTO is a premium multi-brand watch marketplace/discovery platform
focused on:

-   curated watches
-   trusted global and independent brands
-   premium visual presentation
-   personalized watch discovery
-   occasion/style-based discovery
-   AI-assisted watch discovery
-   clean premium commerce UX

The experience should feel:

-   premium
-   editorial
-   modern
-   sophisticated
-   trustworthy
-   minimal
-   product-first
-   image-led
-   refined rather than flashy

------------------------------------------------------------------------

# 3. VISUAL SOURCE OF TRUTH

There are two important visual references:

1.  The approved WRISTO multi-screen reference image containing the
    intended website screens.
2.  The current WRISTO prototype created in Antigravity.

The implementation task is to reproduce the approved design language and
screen hierarchy in the real Next.js application.

## Important

Do not redesign the application merely because another pattern seems
technically easier.

Preserve:

-   section order
-   visual hierarchy
-   typography hierarchy
-   spacing rhythm
-   card proportions
-   image treatment
-   navigation structure
-   CTA hierarchy
-   color palette
-   border radius language
-   shadows
-   icon positioning
-   content density
-   premium editorial feel
-   responsive intent

When the prototype and implementation differ, prioritize the approved
WRISTO reference/design specification.

------------------------------------------------------------------------

# 4. WRISTO BRAND SYSTEM

## Logo

Use the supplied WRISTO logo assets as the exact brand identity.

Do not recreate the logo with text or approximate SVG geometry when the
original asset is available.

The logo system contains:

-   WRISTO wordmark
-   stylized W/watch-hand mark
-   horizontal lockup
-   dark/black presentation
-   light/ivory presentation
-   app icon / brand mark variants

The logo should preserve the proportions, spacing, symbol geometry, and
visual relationship shown in the supplied brand reference.

Do not substitute a generic watch icon.

## Tagline

**YOUR TIME. YOUR STYLE.**

Use the tagline where specified by the design rather than repeating it
unnecessarily.

------------------------------------------------------------------------

# 5. BRAND COLORS & DESIGN TOKENS

The authoritative single source-of-truth for all design tokens, surfaces, and micro-interactions is:
**`docs/WRISTO_Design_Tokens_and_Interactions.md`**

Use the established WRISTO design token hierarchy:

### 5.1 Primary Brand Surfaces
| Token | CSS Variable | Hex | Usage |
|---|---|---|---|
| `color.brand.black` | `--color-brand-black` | `#111111` | Primary brand background & deep night surfaces |
| `color.brand.ink` | `--color-brand-ink` | `#171717` | Main dark surfaces & hero contrast |
| `color.brand.charcoal` | `--color-brand-charcoal` | `#242424` | Secondary dark surfaces & elevated dark cards |
| `color.brand.cream` | `--color-brand-cream` | `#F6F1E9` | Primary warm background |
| `color.brand.paper` | `--color-brand-paper` | `#FFFDF9` | Product cards and clean editorial surfaces |
| `color.brand.white` | `--color-brand-white` | `#FFFFFF` | Text and pure clean backgrounds |

### 5.2 Brand Identity & Accents
| Token | CSS Variable | Hex | Usage |
|---|---|---|---|
| `brand.bronze` | `--brand-bronze` | `#B08D6B` | Official brand monogram, category eyebrows, badges |
| `color.accent.champagne` | `--color-accent-champagne` | `#E8C89A` | Primary interactive CTA buttons & highlights |
| `color.accent.gold` | `--color-accent-gold` | `#C89B5B` | Luxury horology details & rating stars |
| `color.accent.tan` | `--color-accent-tan` | `#D8B58A` | Secondary warm accents |
| `color.accent.blush` | `--color-accent-blush` | `#F0DDD0` | Soft promotional card surfaces |
| `brand.charcoal` | `--brand-charcoal` | `#1A1A1A` | Primary typography & dark logo wordmark |
| `brand.ivory` | `--brand-ivory` | `#F7F3EC` | Warm luxury text & dark-mode logo wordmark |
| `brand.sand` | `--brand-sand` | `#D9C9B8` | Subtle warm borders & divider lines |
| `brand.soft-black` | `--brand-soft-black` | `#0F0F0F` | Editorial card backgrounds ("Modern Looks" card) |

### 5.3 Typography Colors
| Token | CSS Variable | Hex | Usage |
|---|---|---|---|
| `color.text.primary` | `--color-text-primary` | `#171717` | Main interface & heading text |
| `color.text.secondary` | `--color-text-secondary` | `#5F5F5F` | Supporting copy & descriptions |
| `color.text.muted` | `--color-text-muted` | `#8A8A8A` | Metadata, breadcrumbs, horology specs |
| `color.text.inverse` | `--color-text-inverse` | `#FFFFFF` | Text on dark surfaces & hero banners |
| `color.text.accent` | `--color-text-accent` | `#A8793D` | Premium accent text & category tags |

### 5.4 Borders & Dividers
| Token | CSS Variable | Hex | Usage |
|---|---|---|---|
| `color.border.light` | `--color-border-light` | `#E8E3DC` | Light UI borders & subtle dividers |
| `color.border.medium` | `--color-border-medium` | `#D7D1C8` | Form inputs & active facet borders |
| `color.border.dark` | `--color-border-dark` | `#3A3A3A` | Dark surface borders |
| `color.border.accent` | `--color-border-accent` | `#D6B27E` | Premium selected states & gold borders |

### 5.5 Semantic Status Colors
| Token | CSS Variable | Hex | Usage |
|---|---|---|---|
| `color.success` | `--color-success` | `#3F8A62` | In-stock indicators & order confirmations |
| `color.warning` | `--color-warning` | `#C58A38` | Low-stock alerts & pending states |
| `color.error` | `--color-error` | `#B94A48` | Form errors & out-of-stock badges |
| `color.info` | `--color-info` | `#527A9E` | Informational callouts & tooltips |

------------------------------------------------------------------------

# 6. TYPOGRAPHY

The typography hierarchy is grounded in Swiss horological editorial standards as specified in `docs/WRISTO_Design_Tokens_and_Interactions.md`:

### 6.1 Font Families (2-Family System: Section 3.1)
- **Display / Editorial (`--font-serif`):**
  `Playfair Display`, `Cormorant Garamond`, `DM Serif Display`, Georgia, serif.
  *Usage:* Hero headlines (*"Your Time. Your Style."*), luxury statements, PDP watch model names, editorial campaign headings, curated collections, and guidance empty states.
- **UI / Commerce / Body (`--font-body`):**
  `Inter`, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif.
  *Usage:* Product card titles, prices, caliber specifications, navigation links, buttons, filter facets, drawer titles, and metadata.
- *Note:* `--font-heading` is maintained in CSS as a legacy alias pointing directly to `var(--font-serif)`.

### 6.2 Typography Token Scale
| Token | Size | Weight | Line Height | Usage |
|---|---:|---:|---:|---|
| `type.display.xl` | 64px | 500 | 0.98 | Main desktop hero headline |
| `type.display.lg` | 52px | 500 | 1.00 | Major section & editorial display |
| `type.heading.xl` | 40px | 600 | 1.05 | PDP watch model title, campaign titles |
| `type.heading.lg` | 32px | 600 | 1.10 | Section titles (Trending, Catalog) |
| `type.heading.md` | 26px | 600 | 1.15 | Drawer titles, modal headers |
| `type.heading.sm` | 22px | 600 | 1.20 | Product card titles, facet group headers |
| `type.body.lg` | 18px | 400 | 1.55 | Editorial lead paragraphs, hero descriptions |
| `type.body.md` | 16px | 400 | 1.50 | Standard body copy, descriptions |
| `type.body.sm` | 14px | 400 | 1.45 | Spec matrix values, filter option labels |
| `type.caption` | 12px | 500 | 1.35 | Brand eyebrows, badges, tax notes |
| `type.label` | 11px | 600 | 1.20 | Micro-labels, SKU tags, shortcut pills |

Avoid arbitrary font sizes per component; strictly use the token scale above.

------------------------------------------------------------------------

# 7. DESIGN SYSTEM & INTERACTION SPECIFICATIONS

The authoritative implementation specification for all UI components, micro-interactions, and 3D effects is documented in **`docs/WRISTO_Design_Tokens_and_Interactions.md`**.

### 7.1 Spacing Grid (8px Base)
- Scale: `space.1` (4px), `space.2` (8px), `space.3` (12px), `space.4` (16px), `space.5` (20px), `space.6` (24px), `space.8` (32px), `space.10` (40px), `space.12` (48px), `space.16` (64px), `space.20` (80px), `space.24` (96px), `space.32` (128px).
- Desktop Section Spacing: `80px` standard, `96px` hero-to-next, `120px` major editorial.
- Mobile Section Spacing: `48px` standard, `64px` major.

### 7.2 Corner Radii
- `radius.xs` (4px): Tags, micro-badges.
- `radius.sm` (8px): Inputs, buttons, quantity steppers.
- `radius.md` (12px): Standard product cards, facet boxes.
- `radius.lg` (16px): Promotional cards, modal overlays.
- `radius.xl` (24px): Large contained editorial cards ("Modern Looks" banner).
- `radius.pill` (999px): Filter chips, search shortcut pills, category pills.

### 7.3 Shadows & Depth
- Subtle, expensive horological depth: `--shadow-xs` to `--shadow-product` (`0 18px 40px rgba(0,0,0,0.14)`), avoiding cheap dark halos.

### 7.4 3D Tilt & Micro-interactions
- Product Cards & PDP Stage: Cursor-tracking 3D depth tilt (`perspective: 1200px`, `rotateX: 1-3deg`, `rotateY: 2-4deg`, `scale: 1.01-1.02`), spring reset on mouse leave.
- Motion Timing: Restrained, non-bouncy luxury curves (`250ms`, `cubic-bezier(0.2, 0.8, 0.2, 1)`).

## Components should include

### Layout

-   Header
-   Footer
-   Container
-   Section
-   Grid
-   Stack
-   Split layout
-   Breadcrumbs

### Navigation

-   Desktop navigation
-   Mobile navigation
-   Search trigger
-   Search overlay
-   Wishlist
-   Cart
-   Account
-   Mega/category navigation where required

### Commerce

-   Product card
-   Product grid
-   Product image gallery
-   Product badges
-   Price block
-   Rating
-   Stock indicator
-   Quantity selector
-   Add to cart
-   Buy now
-   Wishlist button
-   Compare functionality if required by approved design
-   Filter
-   Sort
-   Pagination/load more

### Content

-   Hero
-   Editorial banner
-   Brand strip
-   Category cards
-   Collection cards
-   Occasion cards
-   Blog/article cards
-   Promotional cards
-   Trust/service features

### Forms

-   Input
-   Search input
-   Select
-   Checkbox
-   Radio
-   Quantity control
-   Address form
-   Checkout fields

### Feedback

-   Toast
-   Modal
-   Drawer
-   Skeleton
-   Empty state
-   Error state
-   Success state

All components must be reusable and data-driven.

------------------------------------------------------------------------

# 8. PAGE / SCREEN ARCHITECTURE

The current WRISTO experience includes the following major surfaces.

## Home / Discover

The home page should include the approved visual sequence and content
structure.

Expected areas include:

-   premium hero
-   AI Watch Finder CTA
-   product discovery
-   category discovery
-   popular/trusted brands
-   curated collections
-   occasion-based discovery
-   editorial content
-   trust/service highlights
-   app promotion where present
-   footer
-   search experience

The approved reference includes concepts such as:

### Hero messaging

**Your Time.\
Your Style.**

Supporting positioning around curated premium timepieces and intelligent
matching.

### Primary CTA

**Find My Watch with AI**

### Secondary CTA

**Explore All Watches**

Do not unnecessarily alter approved copy.

------------------------------------------------------------------------

# 9. PRODUCT DISCOVERY

Build the catalog architecture for:

-   Men
-   Women
-   Unisex
-   Analog
-   Chronograph
-   Smart Watches
-   Dress
-   Sports
-   Luxury
-   Accessories

The exact visible categories must remain driven by data/configuration
rather than hardcoded into presentation components.

------------------------------------------------------------------------

# 10. PRODUCT LISTING PAGE --- PLP

The product listing experience should support:

-   page title
-   descriptive subtitle
-   category navigation
-   category cards where present
-   filters
-   sorting
-   product count
-   product grid
-   product badges
-   price
-   discount
-   ratings
-   wishlist
-   stock state
-   responsive behavior

Example product/card data can include:

-   Titan Neo Analog Watch
-   Fastrack Stellar Quartz
-   Casio Edifice Chronograph
-   Tommy Hilfiger Classic

These are example content records, not presentation logic.

## Product data must be separated from UI.

------------------------------------------------------------------------

# 11. PRODUCT DETAIL PAGE --- PDP

PDP must support:

-   breadcrumb
-   image gallery
-   primary product image
-   product name
-   brand
-   rating/reviews
-   current price
-   original price
-   discount
-   product description
-   specifications
-   availability
-   color/variant
-   quantity
-   Add to Cart
-   Buy Now
-   Wishlist
-   delivery information
-   return information
-   warranty/trust information
-   related/recommended watches

The PDP must remain extensible for future API data.

------------------------------------------------------------------------

# 12. SEARCH

Search should be designed as a first-class commerce capability.

Support:

-   search trigger
-   search overlay/page
-   query input
-   recent searches
-   popular searches
-   product suggestions
-   brand suggestions
-   category suggestions
-   result state
-   no-result state

The approved visual reference contains a search panel with product
suggestions and popular search chips.

Search content should be data-driven.

Future backend should support:

-   full-text search
-   filters
-   sorting
-   relevance
-   autocomplete

------------------------------------------------------------------------

# 13. AI WATCH FINDER

AI Watch Finder is a major WRISTO differentiator.

The frontend should establish the experience now, even when the
intelligence/backend is mocked.

The architecture should allow a future AI service/API to replace the
current static/mock recommendation logic.

Potential inputs include:

-   gender/style preference
-   budget
-   occasion
-   watch type
-   brand preference
-   color
-   strap/material
-   wrist preference/size
-   lifestyle
-   desired features

The result experience should present:

-   recommended watches
-   reason/matching explanation
-   relevant product attributes
-   CTA to product detail
-   ability to refine/restart discovery

Do not hardwire AI logic into visual components.

Create an interface/service layer so the future implementation can
connect to a backend/AI service.

------------------------------------------------------------------------

# 14. COLLECTIONS

Support curated collections such as:

-   Formal
-   Casual
-   Sports
-   Luxury
-   New Arrivals
-   Trending
-   Best Sellers
-   Premium

Collections must be content-driven.

A collection should be representable by data similar to:

-   id
-   slug
-   title
-   subtitle
-   description
-   image
-   badge
-   product IDs/query
-   ordering
-   active state

------------------------------------------------------------------------

# 15. BRANDS

Brand architecture should support multi-brand commerce.

Example brands:

-   Titan
-   Fastrack
-   Casio
-   Tommy Hilfiger
-   Seiko
-   Fossil

Brand records should be independent from UI.

Possible brand fields:

-   id
-   slug
-   name
-   logo
-   description
-   hero image
-   country/origin
-   featured state
-   product count
-   sort order
-   active state

------------------------------------------------------------------------

# 16. WISHLIST

Wishlist must support:

-   add/remove
-   product list
-   stock status
-   price
-   product navigation
-   empty state
-   cart interaction

Example approved screen includes:

**My Wishlist**

with watch cards and stock indicators.

Do not tie wishlist rendering directly to a hardcoded array.

------------------------------------------------------------------------

# 17. CART

Cart should support:

-   products
-   variants
-   quantity
-   remove
-   subtotal
-   shipping
-   total
-   checkout CTA
-   continue shopping
-   empty state

Example approved screen:

**Your Cart (2)**

with product rows, quantity controls, subtotal, shipping, total and
checkout CTA.

Use a cart state abstraction that can later be connected to Spring Boot
APIs.

------------------------------------------------------------------------

# 18. ACCOUNT

Account architecture should support:

-   profile
-   orders
-   addresses
-   wishlist
-   settings
-   logout

Example approved account navigation includes:

-   Profile
-   My Orders
-   Addresses
-   Wishlist
-   Settings
-   Logout

Account data must remain separate from presentation.

------------------------------------------------------------------------

# 19. CHECKOUT / ORDERS

Design the application so checkout can later support:

-   customer information
-   address
-   delivery
-   payment
-   order summary
-   order creation
-   order confirmation
-   order history
-   order tracking

For the current static frontend phase, payment gateways and real order
processing are not required unless explicitly requested.

Do not fake production payment behavior.

------------------------------------------------------------------------

# 20. BLOG / EDITORIAL

The approved reference contains a blog/editorial section.

Support:

-   articles
-   category
-   title
-   excerpt
-   cover image
-   date
-   reading time
-   slug
-   content

Example themes include:

-   How to Choose the Right Watch for Your Wrist
-   Understanding Watch Movements
-   Top Watch Brands in India

The editorial system must be ready for future CMS integration.

------------------------------------------------------------------------

# 21. FOOTER

Footer should follow the approved WRISTO reference.

Include appropriate groups such as:

-   brand statement
-   quick links
-   customer care
-   contact
-   social links
-   payment indicators
-   copyright

Do not hardcode the entire footer markup if its links/content can be
represented as navigation data.

------------------------------------------------------------------------

# 22. CONTENT / PRESENTATION SEPARATION

This is a hard architectural requirement.

**Content and presentation must remain separate.**

Do not put large blocks of business content directly inside JSX/TSX
components.

Bad:

``` tsx
<h1>Some hardcoded marketing content...</h1>
```

Preferred:

``` tsx
<Hero {...homeContent.hero} />
```

with content stored in structured data.

Example:

``` ts
type HeroContent = {
  eyebrow: string
  title: string
  description: string
  primaryCta: CTA
  secondaryCta?: CTA
  image: ImageAsset
}
```

This allows:

**Current** Static/local data → components

**Future** CMS/API → same component contracts

The UI should not need to be rewritten when CMS content replaces static
content.

------------------------------------------------------------------------

# 23. CMS-READY CONTENT ARCHITECTURE

Prepare the application for future CMS management.

Potential CMS-managed content:

-   homepage sections
-   hero
-   promotional banners
-   collections
-   brands
-   categories
-   editorial/blog
-   navigation
-   footer
-   product merchandising
-   badges
-   SEO metadata
-   campaign content

Use stable content schemas.

Avoid making CMS assumptions that force a particular vendor.

The architecture should allow a future adapter such as:

``` text
CMS
 ↓
Content API / adapter
 ↓
Normalized domain/content models
 ↓
UI components
```

------------------------------------------------------------------------

# 24. STATIC DATA NOW, API LATER

Current phase:

``` text
Next.js
  ↓
local typed data / mock services
  ↓
reusable UI
```

Future:

``` text
Next.js
  ↓
API client
  ↓
Spring Boot
  ↓
PostgreSQL
```

The component API should remain stable between these phases.

Create service abstractions such as:

-   productService
-   categoryService
-   brandService
-   collectionService
-   searchService
-   wishlistService
-   cartService
-   accountService
-   orderService
-   contentService
-   aiWatchFinderService

Current implementations may use static/mock repositories.

Future implementations can call Spring Boot APIs.

------------------------------------------------------------------------

# 25. NEXT.JS FRONTEND

Use Next.js as the frontend framework.

Prefer:

-   App Router
-   TypeScript
-   reusable components
-   server components where appropriate
-   client components only where interaction requires them
-   route-level metadata
-   optimized images
-   proper loading/error states
-   clean route structure
-   typed models
-   service/repository abstraction

Do not create one giant page component.

------------------------------------------------------------------------

# 26. RECOMMENDED FRONTEND STRUCTURE

Use a maintainable structure similar to:

``` text
src/
  app/
    (store)/
      page.tsx
      watches/
      collections/
      brands/
      search/
      product/
      cart/
      wishlist/
      account/
      checkout/
    api/
    globals.css

  components/
    layout/
    navigation/
    commerce/
    product/
    discovery/
    ai/
    content/
    forms/
    feedback/
    ui/

  content/
    home/
    navigation/
    collections/
    brands/
    categories/
    editorial/

  data/
    products/
    brands/
    categories/

  services/
    products/
    brands/
    search/
    cart/
    wishlist/
    content/
    ai/

  types/
  lib/
  hooks/
  config/
  styles/
```

Adapt naming to the actual codebase when necessary, but preserve the
separation of responsibilities.

------------------------------------------------------------------------

# 27. SPRING BOOT BACKEND TARGET

The backend will eventually be Java + Spring Boot.

Plan domain boundaries around:

-   Product
-   Brand
-   Category
-   Collection
-   Inventory
-   User
-   Address
-   Wishlist
-   Cart
-   Order
-   Payment
-   Review
-   Search
-   Content
-   AI recommendation

Do not prematurely implement unnecessary backend complexity during the
static frontend phase.

------------------------------------------------------------------------

# 28. API-READY CONTRACTS

Design frontend models around stable API contracts.

Example:

``` ts
type Product = {
  id: string
  slug: string
  name: string
  brand: BrandReference
  category: CategoryReference
  price: Money
  compareAtPrice?: Money
  rating?: number
  reviewCount?: number
  images: ProductImage[]
  variants?: ProductVariant[]
  badges?: ProductBadge[]
  stockStatus: StockStatus
  description?: string
  specifications?: Specification[]
}
```

Use IDs/slugs rather than coupling components to array indexes.

------------------------------------------------------------------------

# 29. MOTION DESIGN

Motion is part of the WRISTO experience, but it must remain purposeful.

Use motion to communicate:

-   hierarchy
-   navigation
-   discovery
-   interaction
-   continuity
-   premium feel

Do not animate everything.

Preferred motion principles:

-   subtle
-   smooth
-   controlled
-   premium
-   responsive
-   intentional

------------------------------------------------------------------------

# 30. GSAP / SCROLLTRIGGER / LENIS

Where appropriate, use:

-   GSAP
-   ScrollTrigger
-   Lenis

for premium page transitions and scroll-based storytelling.

Potential uses:

-   hero reveal
-   image entrance
-   text reveal
-   section transitions
-   horizontal editorial movement
-   product showcase
-   subtle parallax
-   staggered cards
-   navigation transitions

Do not use animation simply to demonstrate animation capability.

Avoid:

-   excessive parallax
-   large layout shifts
-   long blocking animations
-   scroll hijacking
-   animations that interfere with shopping tasks

------------------------------------------------------------------------

# 31. REDUCED MOTION

Respect:

``` css
prefers-reduced-motion
```

Users who request reduced motion must receive an accessible, usable
experience.

Motion must never be required to understand content or operate commerce
functions.

------------------------------------------------------------------------

# 32. PERFORMANCE

Treat performance as a product requirement.

Optimize:

-   images
-   fonts
-   JS bundles
-   component hydration
-   animations
-   third-party scripts
-   layout shifts
-   route loading

Use:

-   Next.js image optimization
-   appropriate image dimensions
-   lazy loading
-   code splitting
-   dynamic imports where justified
-   minimal client-side JS
-   server rendering where appropriate

Do not sacrifice performance for visual effects.

------------------------------------------------------------------------

# 33. RESPONSIVE DESIGN

The application must work across:

-   desktop
-   laptop
-   tablet
-   mobile

Do not simply shrink desktop layouts.

Define intentional responsive behavior for:

-   header
-   navigation
-   hero
-   grids
-   product cards
-   filters
-   PDP gallery
-   cart
-   checkout
-   account
-   footer
-   AI Watch Finder

The mobile experience is a first-class design target.

------------------------------------------------------------------------

# 34. ACCESSIBILITY

Target WCAG-compatible accessibility.

Requirements:

-   semantic HTML
-   keyboard navigation
-   visible focus
-   accessible labels
-   alt text
-   appropriate heading hierarchy
-   sufficient contrast
-   accessible dialogs/drawers
-   accessible form errors
-   screen-reader-friendly interactive controls
-   no keyboard traps

Do not rely solely on color or animation to communicate state.

------------------------------------------------------------------------

# 35. SEO

Implement technical SEO architecture from the beginning.

Support:

-   metadata
-   title templates
-   descriptions
-   canonical URLs
-   Open Graph
-   Twitter/social metadata where applicable
-   sitemap
-   robots
-   structured data/schema where appropriate
-   product metadata
-   breadcrumb schema
-   article schema
-   organization/brand data

Use clean URLs:

``` text
/watches
/watches/men
/watches/women
/brands/titan
/collections/formal
/product/titan-neo-analog
/search?q=titan
```

Avoid unnecessarily dynamic/unreadable URLs.

------------------------------------------------------------------------

# 36. AEO / GEO

Structure important content so it can be understood by search engines
and answer/discovery systems.

Use:

-   clear semantic content
-   descriptive headings
-   concise factual product information
-   structured data
-   FAQ-ready content where appropriate
-   meaningful metadata
-   crawlable content

Do not create keyword-stuffed content.

------------------------------------------------------------------------

# 37. SECURITY

Frontend should be designed with security boundaries in mind.

Never expose:

-   secret API keys
-   database credentials
-   private service credentials
-   payment secrets

Assume future authentication and authorization will be
server-controlled.

Do not treat client-side state as a security boundary.

Validate data at API boundaries.

------------------------------------------------------------------------

# 38. ERROR / LOADING / EMPTY STATES

Every major async-capable area should have:

-   loading state
-   skeleton state where appropriate
-   empty state
-   error state
-   retry path where applicable

Examples:

-   no products
-   no search results
-   empty wishlist
-   empty cart
-   failed API
-   unavailable product
-   unavailable variant

Do not leave blank screens.

------------------------------------------------------------------------

# 39. DATA VALIDATION

Use typed schemas/models where useful.

Validate:

-   API responses
-   form inputs
-   query parameters
-   product IDs
-   cart quantities
-   user input

Keep domain validation separate from presentation.

------------------------------------------------------------------------

# 40. TESTING

The implementation should be testable.

Target:

### Unit

-   utilities
-   formatters
-   service functions
-   domain logic

### Component

-   product card
-   search
-   cart
-   wishlist
-   forms
-   AI finder

### Integration

-   catalog flows
-   product flow
-   cart flow
-   wishlist flow
-   search flow

### E2E

Critical user journeys:

1.  Discover home page
2.  Browse category
3.  Search
4.  Open product
5.  Add to cart
6.  Update cart
7.  Wishlist product
8.  Start AI Watch Finder
9.  Complete account flow when implemented
10. Checkout flow when implemented

------------------------------------------------------------------------

# 41. VISUAL QA

After implementing each major screen, compare it against the approved
reference.

Check:

-   spacing
-   alignment
-   typography
-   image crop
-   card size
-   section height
-   button size
-   border radius
-   shadows
-   colors
-   icon size
-   navigation placement
-   responsive behavior

Do not declare a screen complete merely because it technically renders.

------------------------------------------------------------------------

# 42. ICONOGRAPHY

Use a consistent icon library/system.

Icons must:

-   have consistent stroke/weight
-   align correctly
-   have accessible labels where interactive
-   not visually compete with product imagery

Do not mix arbitrary icon styles.

------------------------------------------------------------------------

# 43. IMAGES

Product/editorial imagery is central to WRISTO.

Use appropriate aspect ratios and consistent image treatment.

Do not distort watch images.

Define image roles:

-   product thumbnail
-   product gallery
-   hero
-   collection
-   brand
-   editorial
-   promotional

Use object-fit/object-position intentionally.

------------------------------------------------------------------------

# 44. CONTENT MODEL EXAMPLE

Homepage content should resemble:

``` ts
const homeContent = {
  hero: {
    eyebrow: "...",
    title: "...",
    description: "...",
    primaryCta: {...},
    secondaryCta: {...},
    image: {...}
  },

  featuredCategories: [...],

  featuredProducts: [...],

  featuredBrands: [...],

  collections: [...],

  occasions: [...],

  editorial: [...],

  trustFeatures: [...]
}
```

This is illustrative only; use the actual approved content from the
prototype/reference.

------------------------------------------------------------------------

# 45. ROUTING

Use stable, SEO-friendly routes.

Recommended foundation:

``` text
/
 /watches
 /watches/[category]
 /product/[slug]
 /brands
 /brands/[slug]
 /collections
 /collections/[slug]
 /search
 /wishlist
 /cart
 /account
 /account/orders
 /account/addresses
 /checkout
 /ai-watch-finder
```

Adjust routes when the existing project has an established convention.

------------------------------------------------------------------------

# 46. STATE MANAGEMENT

Use the simplest state architecture that meets requirements.

Local state for:

-   UI toggles
-   drawers
-   filters
-   temporary form state

Shared state for:

-   cart
-   wishlist
-   authentication/session
-   user preferences

Server/API state should be separated from local UI state.

Do not introduce a large state library without a real requirement.

------------------------------------------------------------------------

# 47. CONTENT AND CODE OWNERSHIP

A developer should be able to update product/content information without
editing visual components.

Examples:

Changing:

-   hero title
-   product name
-   price
-   brand
-   collection title
-   article title
-   CTA label

should happen in content/data/CMS layers, not inside UI component code.

------------------------------------------------------------------------

# 48. FUTURE CMS MIGRATION

The application must support this migration:

### Phase 1

``` text
Local JSON/TS content
        ↓
Content adapter
        ↓
Components
```

### Phase 2

``` text
CMS
 ↓
CMS adapter
 ↓
Normalized content
 ↓
Components
```

The component layer should remain largely unchanged.

Do not directly couple every component to a CMS vendor SDK.

------------------------------------------------------------------------

# 49. DEVELOPMENT PHASES

## Phase 0 --- Project Foundation

-   inspect existing prototype/code
-   identify current routes
-   identify assets
-   identify dependencies
-   establish TypeScript types
-   establish design tokens
-   establish fonts
-   establish global styles
-   establish layout/container system
-   establish content/data separation

## Phase 1 --- Brand + Core Shell

-   WRISTO logo
-   typography
-   colors
-   header
-   navigation
-   responsive shell
-   footer
-   global interaction patterns

## Phase 2 --- Home / Discover

-   hero
-   AI Watch Finder CTA
-   category discovery
-   product sections
-   brand section
-   collections
-   occasion section
-   editorial
-   trust/service section

Match the approved reference closely.

## Phase 3 --- Catalog

-   product listing
-   categories
-   filters
-   sorting
-   product cards
-   pagination/load more
-   responsive catalog

## Phase 4 --- PDP

-   gallery
-   product information
-   price
-   variants
-   availability
-   CTAs
-   trust information
-   related products

## Phase 5 --- Search

-   search UI
-   autocomplete
-   suggestions
-   results
-   popular searches
-   empty state

## Phase 6 --- Commerce State

-   cart
-   wishlist
-   quantity
-   local persistence where appropriate
-   empty states

## Phase 7 --- Account

-   profile
-   orders
-   addresses
-   wishlist
-   settings

## Phase 8 --- AI Watch Finder

-   questionnaire
-   recommendation UI
-   result cards
-   mock service
-   future API boundary

## Phase 9 --- Editorial / CMS Readiness

-   editorial model
-   content adapters
-   SEO fields
-   CMS-ready schemas

## Phase 10 --- Quality

-   responsive QA
-   accessibility
-   performance
-   SEO
-   testing
-   visual comparison
-   cleanup
-   production build validation

------------------------------------------------------------------------

# 50. CURRENT SCOPE VS FUTURE SCOPE

## Current frontend phase

Implement:

-   Next.js
-   TypeScript
-   responsive UI
-   approved WRISTO visual system
-   static/local content
-   mock product data
-   reusable components
-   content/presentation separation
-   mock services
-   AI Watch Finder UI
-   commerce UI
-   accessibility
-   SEO foundation
-   performance foundation
-   motion system

## Future backend phase

Spring Boot + PostgreSQL:

-   authentication
-   users
-   products
-   inventory
-   brands
-   categories
-   collections
-   cart persistence
-   wishlist persistence
-   orders
-   payments
-   reviews
-   search
-   CMS/content integration
-   AI recommendation APIs

Do not overbuild the backend now.

------------------------------------------------------------------------

# 51. THINGS NOT TO DO

Do not:

-   turn the website into a generic template
-   replace the WRISTO visual identity
-   invent unrelated sections
-   hardcode content inside every component
-   create duplicated components for every product
-   mix API/data logic into purely visual components
-   put secrets in frontend code
-   overuse client components
-   overuse animation
-   sacrifice accessibility
-   sacrifice performance
-   distort product images
-   use random placeholder icons when approved assets exist
-   introduce unnecessary dependencies
-   build a giant monolithic page
-   couple components directly to future CMS infrastructure
-   implement fake payment processing as if it were real
-   claim backend functionality exists when only mock/static
    functionality is implemented

------------------------------------------------------------------------

# 52. COMPONENT DESIGN RULE

A component should answer one clear responsibility.

Bad:

``` text
HomePage
 ├─ all content
 ├─ all product data
 ├─ all animations
 ├─ all API calls
 ├─ all state
 └─ all markup
```

Preferred:

``` text
HomePage
 ├─ Hero
 ├─ CategorySection
 ├─ ProductSection
 │    └─ ProductCard
 ├─ BrandSection
 │    └─ BrandCard
 ├─ CollectionSection
 │    └─ CollectionCard
 ├─ OccasionSection
 ├─ EditorialSection
 └─ TrustSection
```

------------------------------------------------------------------------

# 53. DATA-FIRST COMPONENTS

Prefer:

``` tsx
<ProductGrid products={products} />
```

over:

``` tsx
<ProductGrid />
```

with products hidden inside the component.

This makes:

-   testing easier
-   CMS migration easier
-   API integration easier
-   reuse easier
-   personalization easier

------------------------------------------------------------------------

# 54. MOTION IMPLEMENTATION RULE

Motion must not change layout unexpectedly.

Prefer transforms/opacity for animation.

Avoid expensive continuous effects.

Use ScrollTrigger only where the visual result genuinely benefits from
scroll choreography.

Every major animation should answer:

> What does this animation communicate?

If there is no clear answer, remove it.

------------------------------------------------------------------------

# 55. PERFORMANCE BUDGET MINDSET

Every dependency should justify its cost.

Before adding a package ask:

-   Is it necessary?
-   Is there already a native/Next.js solution?
-   Does it affect bundle size?
-   Does it introduce client-side JS?
-   Does it complicate deployment?

Keep the application lean.

------------------------------------------------------------------------

# 56. PRODUCTION QUALITY

Code must be:

-   readable
-   typed
-   modular
-   maintainable
-   testable
-   accessible
-   responsive
-   documented where necessary
-   consistent with the established design system

Avoid clever code when simple code is clearer.

------------------------------------------------------------------------

# 57. IMPLEMENTATION WORKFLOW

Before coding a screen:

1.  Inspect the approved reference.
2.  Identify layout regions.
3.  Identify reusable components.
4.  Identify content/data.
5.  Identify responsive behavior.
6.  Identify interaction states.
7.  Identify motion opportunities.
8.  Implement.
9.  Compare visually.
10. Fix discrepancies.
11. Validate accessibility.
12. Validate responsive behavior.
13. Validate production build.

------------------------------------------------------------------------

# 58. DEFINITION OF DONE

A feature is not complete until:

-   it matches the approved visual intent
-   it works responsively
-   content is separated from presentation
-   TypeScript types are clean
-   loading/error/empty states are considered
-   keyboard accessibility works
-   images are optimized
-   unnecessary client-side code is avoided
-   motion respects reduced-motion preferences
-   SEO requirements are considered where relevant
-   no console/runtime errors remain
-   production build succeeds
-   code is reusable for future API/CMS integration

------------------------------------------------------------------------

# 59. FINAL ENGINEERING PRINCIPLE

Build WRISTO in a way that makes this transition easy:

``` text
APPROVED PROTOTYPE
       ↓
NEXT.JS UI
       ↓
STATIC/TYPED CONTENT
       ↓
SERVICE ABSTRACTIONS
       ↓
SPRING BOOT API
       ↓
POSTGRESQL
       ↓
CMS + AI + SEARCH + COMMERCE
```

The visual implementation should be stable while the data source
evolves.

The most important architectural principle is:

> **Presentation should not know where content comes from.**

The most important product principle is:

> **WRISTO should feel like a premium watch discovery experience, not a
> generic e-commerce template.**

The most important implementation principle is:

> **Match the approved WRISTO prototype/reference first; abstract and
> optimize the implementation without changing the intended design.**

------------------------------------------------------------------------

# 60. ANTIGRAVITY EXECUTION INSTRUCTION

When this prompt is supplied to an AI coding agent:

1.  Inspect the existing project before modifying it.
2.  Inspect all available WRISTO assets and prototype screens.
3.  Do not delete working functionality without understanding it.
4.  Identify reusable existing components before creating duplicates.
5.  Create/maintain a clear content/data layer.
6.  Create/maintain a clear service layer.
7.  Implement the approved design screen by screen.
8.  Keep frontend/backend boundaries explicit.
9.  Use mock/static services for the current phase.
10. Do not invent backend endpoints that are not implemented.
11. Keep future Spring Boot integration in mind.
12. Keep future CMS migration in mind.
13. Run lint/type checks/build after significant changes.
14. Fix errors rather than hiding them.
15. Perform visual QA against the approved reference after each major
    screen.
16. Preserve the WRISTO logo and brand system exactly from supplied
    assets.
17. Preserve the approved typography, colors, spacing, hierarchy and
    imagery.
18. Treat responsive behavior and accessibility as part of
    implementation, not post-processing.
19. Keep motion premium and purposeful.
20. Do not declare completion until the Definition of Done is satisfied.

------------------------------------------------------------------------

# MASTER SUCCESS CRITERIA

The final WRISTO application should be:

**Visually faithful + premium + responsive + accessible + performant +
SEO-ready + data-driven + CMS-ready + API-ready + maintainable.**

The current implementation may use static data, but its architecture
must make the future transition to:

**Next.js → Spring Boot → PostgreSQL → CMS → AI-powered discovery**

straightforward without rewriting the presentation layer.
