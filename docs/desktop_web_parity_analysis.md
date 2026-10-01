# WRISTO — Desktop Web Parity, Watch Comparison & Content Audit Documentation

**Project:** WRISTO — Premium Multi-Brand Watch E-Commerce Platform  
**Target Codebase:** `wristo-next/src/` (Next.js 16 App Router + TypeScript + Vanilla CSS)  
**Baseline References:**  
1. `ref_images/ChatGPT Image Sep 28, 2026, 10_28_21 PM.png` (Desktop 13-Panel Collage Board)  
2. `ref_images/ChatGPT Image Sep 28, 2026, 10_32_53 PM.png` (Brand Identity & Typography Guidelines)  
3. `ref_images/40_images_watches.png` & `40_images_2.png` (40-Watch Inventory Specification)  
4. `docs/WRISTO_Design_Tokens_and_Interactions.md` (Master Design System)  
5. `index.html` & `js/app.js` (Original Reference Prototype with Full Comparison Engine)  
**Document Version:** 2.0 (Complete In-Depth Parity, Feature & Content Audit)  
**Date:** October 2026  

---

## 1. Executive Summary & Scope

Following the successful completion and deployment of **Phases 1 through 10** (Authentication, Cart/Checkout, Concierge AI, Editorial Journal, Rich SEO, and Launch Hardening), a comprehensive pixel-level and semantic audit was conducted comparing the **current desktop web implementation** against the **original design boards**, the **original prototype (`js/app.js`)**, and the **master design token specification**.

Per explicit user direction:
> *"Bhai abhi ke liye mobile client ya PWA ke liye ham kaam nhi kar rahe ha tu firse in depth web screen ko analyze kar current and the original ones... also bahot sare screen par jo content likha ha wo bhi original images ke content se match nhi karta ha aur preview mai ek feature tha jaha 2 or more watches ko compare kar sake wo bhi nhi dikh raha wo bhi in depth anlysis karke bata de"*

### Key Critical Findings:
1. **The Missing Watch Comparison System:**  
   The interactive **"Side-by-Side Horology Matrix"** (allowing users to compare 2 to 4 watches across calibers, case diameters, water resistance, materials, and pricing) that existed in the original preview (`js/app.js` lines 1145–1230 & 1654–1670) is **completely missing in the Next.js codebase**. In `wristo-next`, only a dead button with a local `useState(false)` exists in `ProductActions.tsx` that resets on navigation and provides zero functionality.
2. **Extensive Copywriting & Content Mismatches:**  
   Multiple screens contain newly invented or generic placeholder copy rather than the exact marketing text, labels, trust guarantees, and persona details present in the reference images (e.g., Account profile persona `Gaurav Kadam` / `gauravkadam@gmail.com` replaced by `Aditya Vikram Singhania`; Footer address in `Pune, Maharashtra` and phone `+91 98765 43210` omitted; Trust Strip guarantees altered; Popular Search keywords altered).
3. **Missing Desktop Homepage Sections:**  
   Four critical desktop sections from `10_28_21 PM.png` are absent from `src/app/page.tsx`:
   - **Popular Brands** (Panel 5): 6-brand logo strip + full-width bezel banner with *"Explore Premium Brands. Authentic. Trusted. Always."*
   - **Curated Occasions Collection** (Panel 6): 4 tall photographic lifestyle cards (**Formal** 312 Items, **Casual** 489 Items, **Sports** 256 Items, **Luxury** 198 Items) with `01 < >` controls.
   - **Mobile App Promo** (Panel 7): 3D smartphone mockup + App Store & Google Play badges.
   - **From Our Blog** (Panel 11): 3 editorial preview cards with photography linking to `/journal`.
4. **Missing Desktop Catalog Controls:**  
   - Left sidebar vertical **"Shop by Category"** navigation jump list with right arrows (`Men ->`, `Women ->`, `Unisex ->`, etc.).
   - Under-header row of **4 Circular Category Photo Chips** (`Analog 1240 items`, `Chronograph 852 items`, `Smart 600 items`, `Dress 716 items`).
   - Distinct bottom status pill badges on product cards (`Best Seller`, `Trending`, `Premium`, `New Arrival`).
5. **Missing Standalone Desktop Routes:**  
   - Dedicated desktop `/wishlist` full-page table (Panel 8).
   - Dedicated desktop `/cart` full-page view (Panel 9).
   - Dedicated desktop `/compare` matrix page.
   - Dedicated desktop `/brands` showcase page.

---

## 2. In-Depth Feature Audit: The Watch Comparison System

### 2.1 What the Reference Prototype Built (`js/app.js` & `index.html`)

In the original working preview:
- **Header Action Button:** An icon button in the top navigation (`#header-compare-btn`) with `navigateTo('comparison')` and a dynamic counter badge.
- **Card & PDP Triggers:** Every watch card and the PDP had a `Compare Specs` toggle button (`toggleComparison(id)`).
- **Persistent State:** Up to 4 watches could be added to `AppState.comparison` stored in `localStorage` (`wristo_comparison`).
- **Toast Notifications:** Alerted users when a timepiece was added (`"Added to comparison matrix"`), removed (`"Removed from comparison"`), or when the limit was exceeded (`"Maximum 4 watches can be compared at once."`).
- **Dedicated Comparison Matrix View (`renderComparison()`):**
  - Section Label: `Spec Comparison`
  - Section Title: `Side-by-Side Horology Matrix`
  - Subtitle: `Compare case diameters, mechanical calibers, and water resistance specifications.`
  - Helper Notice: `You can compare up to 4 watches side-by-side to evaluate specifications and pricing.`
  - Action Controls: `Clear All` button, `Add to Cart` per watch column, `Remove` per column.
  - Comprehensive Spec Comparison Table:
    1. **Model & Header:** Photo (110x110), Brand, Model Title, Price, Add to Cart, Remove.
    2. **Caliber Movement:** Automatic, Quartz, Solar, Mechanical.
    3. **Case Diameter:** e.g., 40mm, 42mm, 44mm.
    4. **Case Material:** 316L Stainless Steel, Titanium, Rose Gold PVD, Carbon.
    5. **Strap Type:** Italian Leather, Stainless Steel Mesh, Oyster Bracelet, FKM Rubber.
    6. **Dial Finish:** Sunburst Blue, Matte Velvet Black, Exhibition Skeleton.
    7. **Water Resistance:** 50M (5 ATM), 100M (10 ATM), 200M (20 ATM).
    8. **Style Aesthetic:** Minimalist, Horology Classic, Sports Chrono.
    9. **Recommended For:** Formal, Everyday, Black Tie, Weekend, Diving.

### 2.2 Current Codebase Reality (`wristo-next`)

- **`src/components/product/ProductActions.tsx` (Lines 22, 43–45, 114–128):**
  ```tsx
  const [compareActive, setCompareActive] = useState(false);
  const handleCompare = () => {
    setCompareActive(prev => !prev);
  };
  ...
  <button
    type="button"
    className={`pdp-secondary-btn ${compareActive ? 'active' : ''}`}
    onClick={handleCompare}
    aria-label="Compare Specifications"
  >
    <span>{compareActive ? 'In Comparison' : 'Compare Specs'}</span>
  </button>
  ```
  - **The Defect:** This is a purely cosmetic, isolated state. It does not update any global store, does not persist to localStorage, does not show in the header, does not trigger a comparison tray, and does not link to any comparison page.
- **Product Cards (`ProductCard.tsx`):** Have no comparison trigger at all.
- **Header (`Header.tsx`):** Has no comparison icon or link.
- **Routing:** No `/compare` page exists in `src/app/`.
- **Dock/Drawer:** No floating comparison drawer or sticky dock exists.

### 2.3 Required Comparison Architecture for Next.js 14/16

To restore 100% parity with the approved preview and elevate it to luxury desktop standards:

```mermaid
graph TD
    A[Catalog Grid / PDP] -->|Click 'Compare Specs'| B[ComparisonContext]
    B -->|Persist to localStorage 'wristo_comparison'| C[(Comparison Store: Max 4)]
    C -->|Update Badge| D[Header Compare Icon]
    C -->|Trigger Slide-Up| E[Floating Desktop Comparison Dock]
    E -->|Click 'Compare Now'| F[/compare Page: Side-by-Side Horology Matrix]
    D -->|Click Header Icon| F
    F -->|Clear / Remove / Add to Cart| B
```

#### Key Architecture Components:
1. **`src/context/ComparisonContext.tsx`:**
   - Methods: `addToComparison(id)`, `removeFromComparison(id)`, `toggleComparison(id)`, `clearComparison()`, `isInComparison(id)`.
   - Max 4 watches constraint with luxury toast feedback.
   - Synchronized with `localStorage.getItem('wristo_comparison')`.
2. **`src/components/comparison/FloatingComparisonDock.tsx`:**
   - Fixed bottom dock (visible on desktop when `comparisonCount > 0`).
   - Shows up to 4 watch thumbnail slots with title and price.
   - Empty slots show dashed gold placeholder with `+ Add Timepiece`.
   - Actions: `Clear All` and gold button `Compare Now (N/4) &rarr;` linking to `/compare`.
3. **`src/app/compare/page.tsx` & `ComparisonClient.tsx`:**
   - Full-width desktop horological matrix table.
   - Sticky left attribute column + responsive scrollable watch comparison columns.
   - Quick Add to Cart, Remove column, and Empty State with "Browse Timepieces" CTA.
4. **Header Integration (`Header.tsx`):**
   - Add comparison scale icon (`⚖️` or dual arrows) with active badge count in the header utilities bar.
5. **Catalog Grid Integration (`ProductCard.tsx`):**
   - Add quick "Compare" checkbox or quick-action button in the card hover actions.

---

## 3. Screen-by-Screen Copywriting & Content Audit

This audit rigorously cross-references the visible text, labels, and copywriting from the **Reference Image Board (`10_28_21 PM.png`)**, the **Brand Guidelines (`10_32_53 PM.png`)**, and the **Original Prototype (`js/app.js`)** against the active code in `wristo-next`.

### Panel 1: Homepage Hero & Trust Bar

| Element | Reference Image (`10_28_21 PM.png`) | Current Codebase (`wristo-next`) | Parity Status & Action Required |
|---|---|---|---|
| **Eyebrow Tag** | `PREMIUM WATCH STORE` | `SPRING / SUMMER 2026 • NEW HOROLOGY` | ❌ **Mismatch.** Update eyebrow to `PREMIUM WATCH STORE` or include as official sub-label. |
| **Headline** | `Your Time.`<br>`Your Style.` | `Your Time.`<br>`Your Style.` | ✅ **100% Match.** Handled via Playfair Display serif. |
| **Subtitle Description** | `Discover a curated collection of premium watches from the world's most trusted brands.` | `Curated luxury, automatic, and minimalist timepieces from trusted global watchmakers. Intelligent AI-powered watch styling for every wrist and occasion.` | ⚠️ **Mismatch.** Revert primary hero description to the punchy, authentic reference text: *"Discover a curated collection of premium watches from the world's most trusted brands."* |
| **Primary CTA** | `Explore Collection &rarr;` | `Explore Collection &rarr;` | ✅ **100% Match.** |
| **Secondary CTA** | `[>] Watch Video` | `[>] Watch Video` | ✅ **100% Match.** Opens luxury video modal. |
| **Pagination Meta** | `01 / 03` with horizontal bar | `01 / 03` with dots and slide indicator | ✅ **100% Match.** |
| **Trust Item 1** | `100% Authentic`<br>`Brand Warranty` (Shield icon) | `100% Authentic Timepieces`<br>`Direct from certified brand houses` | ⚠️ **Wordy.** Align to reference copy: `100% Authentic` / `Brand Warranty`. |
| **Trust Item 2** | `Free Shipping`<br>`Across India` (Truck icon) | `Complimentary Insured Delivery`<br>`Dispatched in security cases` | ⚠️ **Mismatch.** Align to reference copy: `Free Shipping` / `Across India`. |
| **Trust Item 3** | `Easy Returns`<br>`Within 7 Days` (Return box icon) | `30-Day Horological Returns`<br>`No questions asked inspection` | ⚠️ **Mismatch.** Reference specifies: `Easy Returns` / `Within 7 Days`. |
| **Trust Item 4** | `Secure`<br>`Payments` (Lock/Card icon) | `Official Brand Warranty`<br>`2-Year minimum manufacturer cover` | ⚠️ **Mismatch.** Reference specifies: `Secure` / `Payments`. |

---

### Panel 2: Product Listing Page / Catalog (`Men's Watches`)

| Element | Reference Image (`10_28_21 PM.png`) | Current Codebase (`wristo-next`) | Parity Status & Action Required |
|---|---|---|---|
| **Page Title** | `Men's Watches` | `CURATED CATALOGUE • 40 PIECES` / `Curated Collection` | ⚠️ **Diverged.** Title should dynamically reflect the selected category (e.g. `Men's Watches`). |
| **Page Subtitle** | `Explore our premium collection for men.` | Long generic description from Category object. | ⚠️ Align subtitle to punchy editorial copy: *"Explore our premium collection for men."* |
| **Sort Dropdown** | `Sort by: Popularity v` | `Sort by: Popularity` / Select dropdown | ✅ **Match.** |
| **Shop by Category Nav** | **Left sidebar vertical jump list with arrows:**<br>• `👔 Men &rarr;`<br>• `👗 Women &rarr;`<br>• `👥 Unisex &rarr;`<br>• `⏱️ Analog &rarr;`<br>• `⏱️ Chronograph &rarr;`<br>• `⌚ Smart Watches &rarr;`<br>• `👓 Accessories &rarr;` | Horizontal pill chips bar at top (`CategoryNav.tsx`). Sidebar only has checkbox facets. | ❌ **MISSING FEATURE.** Build `ShopByCategoryList.tsx` at top of `FilterSidebar.tsx` with category links and right arrows. |
| **Sub-Category Circular Chips** | **4 Circular Photo Chips below header:**<br>1. ⚪ **Analog** (1240 Items)<br>2. ⚪ **Chronograph** (852 Items)<br>3. ⚪ **Smart** (600 Items)<br>4. ⚪ **Dress** (716 Items) | None. No circular thumbnail chips exist on the PLP. | ❌ **MISSING FEATURE.** Build `CircularCategoryChips.tsx` with circular thumbnail avatars and item counts. |
| **Product Card Badges** | **Distinct bottom pill badges:**<br>• Titan Neo: `Best Seller` (green pill)<br>• Fastrack: `Trending` (tan pill)<br>• Casio: `Premium` (blue pill)<br>• Tommy: `New Arrival` (blush pill) | Small text badge in top-left of image media (`.card-badge-tag`). | ⚠️ **Visual Difference.** Add bottom card status pill badge container to replicate Panel 2 aesthetic. |
| **Card Wishlist Trigger** | Top-right heart icon on watch image. | Top-right heart icon with SVG toggle. | ✅ **100% Match.** |

---

### Panel 3: Product Detail Page (PDP)

| Element | Reference Image (`10_28_21 PM.png`) | Current Codebase (`wristo-next`) | Parity Status & Action Required |
|---|---|---|---|
| **Breadcrumbs** | `Home > Men > Titan Neo Analog` | `Home / Timepieces / Brand / Model` | ✅ **Match.** Formatted with Rich JSON-LD schema. |
| **Thumbnail Gallery** | 4-thumbnail vertical strip on left + main hero display. | 4-thumbnail vertical strip on left + main hero display. | ✅ **100% Match.** |
| **Hero Image Badge** | `New` badge on top-left of watch card. | `product.badge` pill badge. | ✅ **Match.** |
| **Brand & Title** | `TITAN`<br>`Titan Neo Analog Watch` | `product.brand`<br>`product.model` | ✅ **Match.** |
| **Rating** | `★ 4.8 (124 reviews)` | `★ 4.8 (124 reviews)` | ✅ **Match.** |
| **Pricing Block** | `₹ 12,995` `₹ 16,995` `22% OFF` (green badge) | `₹ 12,995` `₹ 16,995` `22% off` | ✅ **100% Match.** |
| **Product Description** | `A perfect blend of elegance and precision, this Titan watch features a sleek design with a stainless steel strap and minimal dial.` | `product.description` from data file. | ✅ **Match.** |
| **Feature Badges Strip** | **3 distinct horizontal spec badges:**<br>• 🛡️ `Stainless Steel`<br>• 💧 `Water Resistant`<br>• ⚙️ `Quartz Movement` | Grid table below fold (`ProductSpecsGrid.tsx`). | ⚠️ **Visual Gap.** Add the 3-icon quick highlight strip directly below description as seen in Panel 3. |
| **Color Selector** | `Color: Silver` with circular swatches. | `Color: [Name]` with clickable color swatches. | ✅ **Match.** |
| **Stepper & CTAs** | Stepper `[ - ] 1 [ + ]`<br>Black button: `Add to Cart 🛒`<br>Gold button: `Buy Now &rarr;` | Stepper + `Add to Cart` + `Buy Now &rarr;`. | ✅ **100% Match.** |
| **Comparison Button** | `Compare Specs` action. | Dummy local state button in `ProductActions.tsx`. | ❌ **BROKEN/DUMMY.** Needs integration into the global Comparison Context. |

---

### Panel 4: Editorial New Arrivals Banner

| Element | Reference Image (`10_28_21 PM.png`) | Current Codebase (`wristo-next`) | Parity Status & Action Required |
|---|---|---|---|
| **Eyebrow** | `NEW ARRIVALS` | `NEW ARRIVALS` | ✅ **100% Match.** |
| **Headline** | `Modern Looks.`<br>`Timeless Feel.` | `Modern Looks.`<br>`Timeless Feel.` | ✅ **100% Match.** |
| **Description** | `Discover the latest watches from top brands, designed for every mood.` | `Discover the latest watches from top brands, designed for every mood.` | ✅ **100% Match.** |
| **Button** | `Explore Now &rarr;` | `Explore Now &rarr;` | ✅ **100% Match.** |
| **Indicator** | `01 02 03` | `01 02 03` with active divider | ✅ **100% Match.** |
| **Lifestyle Visual** | Wrist shot with cursive badge: *"Style in every detail"* | Lifestyle visual with badge *"STYLE IN EVERY DETAIL"* | ✅ **100% Match.** |

---

### Panel 5: Popular Brands Section & Bezel Banner

| Element | Reference Image (`10_28_21 PM.png`) | Current Codebase (`wristo-next`) | Parity Status & Action Required |
|---|---|---|---|
| **Section Header** | `Popular Brands`<br>`Shop from the most trusted watch brands.` | **DOES NOT EXIST ON HOMEPAGE** | ❌ **100% MISSING.** Must create `PopularBrands.tsx`. |
| **Top-Right CTA** | `View All &rarr;` | None | ❌ **MISSING.** Link to `/watches` or `/brands`. |
| **6 Brand Cards** | 6 logo cards with clean borders:<br>`TITAN`, `FASTRACK`, `CASIO`, `TOMMY HILFIGER`, `SEIKO`, `FOSSIL`<br>*(or internal houses `AUREN`, `VELA`, `ORBITA`, `VANTA`, `NORDEN`, `PULSE`)* | None on landing page. | ❌ **MISSING.** Build 6 brand cards with hover lift and count metadata. |
| **Dark Bezel Banner** | Full-width horizontal dark banner with watch crown/bezel macro photo:<br>• Headline: `Explore Premium Brands`<br>• Subtitle: `Authentic. Trusted. Always.`<br>• Button: `Browse Brands &rarr;` | None. | ❌ **MISSING.** Build full-width dark horological bezel banner. |

---

### Panel 6: Curated Occasions Collection ("For Every Occasion")

| Element | Reference Image (`10_28_21 PM.png`) | Current Codebase (`wristo-next`) | Parity Status & Action Required |
|---|---|---|---|
| **Supertitle** | `CURATED COLLECTION` | `CURATED NARRATIVES` | ⚠️ Change to `CURATED COLLECTION`. |
| **Headline** | `For Every Occasion` | `Lifestyle Collections` | ❌ **Mismatch.** Change to `For Every Occasion`. |
| **Subtitle** | `From boardrooms to weekend getaways, find a watch that matches your vibe.` | `Timepieces grouped by lifestyle occasion, architectural finish, and horological identity.` | ❌ **Mismatch.** Replace with exact reference text: *"From boardrooms to weekend getaways, find a watch that matches your vibe."* |
| **CTA Button** | `Explore Collection &rarr;` | Embedded inside individual cards. | ⚠️ Move primary CTA to section header or keep unified. |
| **4 Tall Cards** | **4 Tall Vertical Image Cards with photography:**<br>1. **Formal** (Suit wrist, `312 Items`)<br>2. **Casual** (Denim wrist, `489 Items`)<br>3. **Sports** (Athletic wrist, `256 Items`)<br>4. **Luxury** (Gold dress watch, `198 Items`) | 3 generic CSS gradient boxes (`Quiet Luxury`, `Everyday Icons`, `Mechanical Souls`). | ❌ **COMPLETE DIVERGENCE.** Replace 3 CSS boxes with the 4 tall photographic lifestyle cards with real counts and photography. |
| **Pagination** | `01 < >` controls at bottom right. | None. | ❌ **MISSING.** Add carousel controls. |

---

### Panel 7: Mobile App Promotion Section

| Element | Reference Image (`10_28_21 PM.png`) | Current Codebase (`wristo-next`) | Parity Status & Action Required |
|---|---|---|---|
| **Visual Mockup** | 3D angled smartphone displaying WRISTO app interface on dark textured backdrop. | **DOES NOT EXIST ON HOMEPAGE** | ❌ **100% MISSING.** Build `AppPromoSection.tsx` with high-fidelity phone frame. |
| **Headline** | `Take WRISTO Wherever You Go` | None | ❌ **MISSING.** Exact copy: *"Take WRISTO Wherever You Go"*. |
| **Subtitle** | `Discover, explore and shop premium watches on the go with our mobile app.` | None | ❌ **MISSING.** Exact copy: *"Discover, explore and shop premium watches on the go with our mobile app."*. |
| **Store Badges** | • `Download on the App Store`<br>• `GET IT ON Google Play` | None | ❌ **MISSING.** Add official Apple App Store and Google Play SVG badge buttons. |

---

### Panel 8: Standalone Wishlist Desktop Page (`/wishlist`)

| Element | Reference Image (`10_28_21 PM.png`) | Current Codebase (`wristo-next`) | Parity Status & Action Required |
|---|---|---|---|
| **Route Architecture** | Standalone dedicated URL: `/wishlist` | Embedded only as an inner tab: `/account?tab=wishlist` | ❌ **MISSING STANDALONE ROUTE.** Create `src/app/wishlist/page.tsx` & `WishlistClient.tsx`. |
| **Header Title** | `My Wishlist` | `Collector Wishlist & Vault Reserves` | ⚠️ Align title to `My Wishlist`. |
| **Item Counter** | `4 Items` | Count displayed in badge. | ✅ **Match.** |
| **Top-Right Action** | `Clear All &rarr;` | Clear all button in tab. | ✅ **Match.** |
| **Item Layout** | Desktop Table/Row format:<br>• Heart icon (left)<br>• Watch thumbnail<br>• Model name & Brand<br>• Price (`₹ 12,995`)<br>• **Stock Status Pill:** `In Stock` (green) / `Low Stock` (orange)<br>• Trash delete button (right) | Grid of product cards (`ProductCard`). | ⚠️ **Table Format Missing.** Build dedicated desktop table row layout with stock availability badges. |

---

### Panel 9: Standalone Cart Desktop Page (`/cart`)

| Element | Reference Image (`10_28_21 PM.png`) | Current Codebase (`wristo-next`) | Parity Status & Action Required |
|---|---|---|---|
| **Route Architecture** | Standalone dedicated URL: `/cart` | Only implemented as slide-over `CartDrawer.tsx`. | ❌ **MISSING STANDALONE ROUTE.** Create `src/app/cart/page.tsx` & `CartPageClient.tsx`. |
| **Header Title** | `Your Cart (2)` | `Cart Drawer (N)` | ⚠️ Align title to `Your Cart (N)`. |
| **Top-Right Link** | `Continue Shopping &rarr;` | Close drawer button `&times;` | ⚠️ Add `Continue Shopping &rarr;` linking to `/watches`. |
| **Item Row Specs** | `Color: Silver | Size: 42mm` | `Qty: N` | ⚠️ Include selected color and size specs under item title. |
| **Summary Sidebar** | • `Subtotal: ₹ 20,490`<br>• `Shipping: Free`<br>• `Total: ₹ 20,490`<br>• Button: `Proceed to Checkout &rarr;` (Black button) | Embedded in bottom drawer sheet. | ⚠️ Build full desktop 2-column layout (cart list on left, sticky order summary box on right). |

---

### Panel 10: My Account Page (`/account`)

| Element | Reference Image (`10_28_21 PM.png`) | Current Codebase (`wristo-next`) | Parity Status & Action Required |
|---|---|---|---|
| **Header Title** | `My Account` | `Collector Ledger & Provenance Vault` | ⚠️ Subtitle can mention Provenance, but primary heading should be `My Account`. |
| **Sidebar Tabs** | • `👤 Profile` (active highlight)<br>• `📦 My Orders`<br>• `📍 Addresses`<br>• `♡ Wishlist`<br>• `⚙️ Settings`<br>• `🚪 Logout` | • `Overview`<br>• `Orders`<br>• `Addresses`<br>• `Wishlist`<br>• `Settings` | ⚠️ Align tab naming: `Profile` instead of `Overview`, add direct `Logout` action. |
| **Avatar Initials** | `GK` (Large circular avatar) | `AS` (`Aditya Vikram Singhania`) | ❌ **CONTENT MISMATCH.** Set default persona to `GK` / `Gaurav Kadam`. |
| **Profile Name** | `Gaurav Kadam` | `Aditya Vikram Singhania` | ❌ **CONTENT MISMATCH.** Set to `Gaurav Kadam`. |
| **Profile Email** | `gauravkadam@gmail.com` | `aditya.singhania@horology.com` | ❌ **CONTENT MISMATCH.** Set to `gauravkadam@gmail.com`. |
| **Action Button** | `Edit Profile` | `Edit Profile` button | ✅ **Match.** |

---

### Panel 11: "From Our Blog" Homepage Section

| Element | Reference Image (`10_28_21 PM.png`) | Current Codebase (`wristo-next`) | Parity Status & Action Required |
|---|---|---|---|
| **Section Header** | `From Our Blog`<br>`Insights, guides and tips to help you choose the perfect watch.` | **DOES NOT EXIST ON HOMEPAGE** | ❌ **100% MISSING.** Must create `BlogPreviewSection.tsx` on homepage. |
| **Top-Right CTA** | `View All &rarr;` | None | ❌ **MISSING.** Link to `/journal`. |
| **Card 1** | Photo: Watch on wrist<br>Tag: `Guide`<br>Title: `How to Choose the Right Watch for Your Wrist`<br>Date: `Sep 10, 2026` | Article exists in `journal.ts`, but not displayed on homepage. | ❌ **MISSING ON HOMEPAGE.** Embed as Card 1. |
| **Card 2** | Photo: Skeleton/mechanical movement<br>Tag: `Guides`<br>Title: `Understanding Watch Movements`<br>Date: `Sep 08, 2026` | Article exists in `journal.ts`, but not displayed on homepage. | ❌ **MISSING ON HOMEPAGE.** Embed as Card 2. |
| **Card 3** | Photo: Vintage leather watch<br>Tag: `Brands`<br>Title: `Top 5 Watch Brands in India`<br>Date: `Sep 05, 2026` | Article exists in `journal.ts`, but not displayed on homepage. | ❌ **MISSING ON HOMEPAGE.** Embed as Card 3. |

---

### Panel 12: Desktop Footer

| Element | Reference Image (`10_28_21 PM.png`) | Current Codebase (`wristo-next`) | Parity Status & Action Required |
|---|---|---|---|
| **Logo & Tagline** | `WRISTO`<br>`Your Time. Your Style.` | `WRISTO`<br>`CERTIFIED HOROLOGY DIRECT` | ⚠️ Update tagline to official: `Your Time. Your Style.` |
| **Brand Description** | `A premium multi-brand watch store bringing the best watches from around the world.` | `WRISTO is an ultra-luxury multi-brand watch marketplace bringing curated discovery...` | ⚠️ Align to reference description: *"A premium multi-brand watch store bringing the best watches from around the world."* |
| **Social Links** | Instagram, YouTube, Facebook, X (Twitter), Pinterest icons | None | ❌ **MISSING.** Add social media icons row. |
| **Column 1: Quick Links** | `Home`, `Men`, `Women`, `Collections`, `Brands`, `Accessories` | Curated Collections links | ⚠️ Update column to `Quick Links` with exact reference URLs. |
| **Column 2: Customer Care** | `FAQs`, `Shipping`, `Returns`, `Warranty`, `Track Order` | Partner Houses links | ⚠️ Update column to `Customer Care` with FAQs, Shipping, Returns, Warranty, Track Order. |
| **Column 3: Get in Touch** | • `support@wristo.com`<br>• `+91 98765 43210`<br>• `Pune, Maharashtra` | Concierge & Care links | ❌ **MISSING CONTACT DATA.** Add email `support@wristo.com`, phone `+91 98765 43210`, and location `Pune, Maharashtra`. |
| **Payment Gateways** | `VISA`, `Mastercard`, `Maestro`, `UPI` badges | None | ❌ **MISSING.** Add payment provider badges row. |
| **Copyright Line** | `© 2026 WRISTO. All rights reserved.` | `© 2026 WRISTO Horological Marketplace. All rights reserved. Your Time. Your Style.` | ✅ **Match.** |

---

### Panel 13: Interactive Search Modal

| Element | Reference Image (`10_28_21 PM.png`) | Current Codebase (`wristo-next`) | Parity Status & Action Required |
|---|---|---|---|
| **Search Input** | `🔍 titan [ x ]` | Search input with clear button `[ x ]` | ✅ **100% Match.** |
| **Popular Searches** | `Titan`, `Fastrack`, `Casio`, `Chronograph`, `Smart Watch` | `Automatic`, `Chronograph`, `Emerald Green`, `Skeleton`, `Minimal Leather`, `AUREN`, `Titanium`, `Rose Gold` | ⚠️ **CONTENT MISMATCH.** Align default popular searches to: `Titan`, `Fastrack`, `Casio`, `Chronograph`, `Smart Watch`, `AUREN`. |
| **Instant Results** | List with thumbnails, titles, prices:<br>• Titan Neo Analog Watch — `₹ 12,995`<br>• Titan Edge Series — `₹ 15,995`<br>• Titan Ceramic — `₹ 18,495` | Real-time search query matching across 40 watches. | ✅ **100% Functional Match.** |

---

## 4. Brand Houses & 40-Watch Inventory Harmonization

### Conceptual References vs. 40 Real Watch SKUs
In `10_28_21 PM.png`, the mockups displayed real commercial brand names (`TITAN`, `Fastrack`, `Casio`, `Tommy Hilfiger`, `Seiko`, `Fossil`) as conceptual examples. Concurrently, in `40_images_watches.png` and `40_images_2.png`, 40 specific luxury watch assets were generated under 6 exclusive boutique houses:
- **`AUREN`** (SKUs WRT-001 to WRT-008): Heritage, Minimal Dress & Classic Horology.
- **`VELA`** (SKUs WRT-009 to WRT-016): Slim Profiles, Mesh Bands & Pastel Dials.
- **`ORBITA`** (SKUs WRT-017 to WRT-024): Modern Architectural, Olive Field & Minimalist.
- **`VANTA`** (SKUs WRT-025 to WRT-030): High-Performance Chronographs & Racing Aesthetics.
- **`NORDEN`** (SKUs WRT-031 to WRT-036): Open Heart, Mechanical Automatic & Exhibition Skeletons.
- **`PULSE`** (SKUs WRT-037 to WRT-040): Premium Smart Connected Wearables.

### Harmonization Strategy:
To maintain 100% parity with both references:
1. **Search & Brand Filtering:** The search modal and catalog filters will seamlessly index both the 6 house brands (`AUREN`, `VELA`, `ORBITA`, `VANTA`, `NORDEN`, `PULSE`) and commercial reference aliases (`Titan`, `Fastrack`, `Casio`, `Tommy Hilfiger`, `Seiko`, `Fossil`), mapping aliases to their stylistic counterparts in the 40-watch catalog.
2. **Popular Brands Strip:** Show the 6 brand houses (`AUREN`, `VELA`, `ORBITA`, `VANTA`, `NORDEN`, `PULSE`) with refined typography matching Panel 5.

---

## 5. Master Implementation Roadmap & Milestones

### Milestone 1: The Watch Comparison Engine (Full Technical Implementation)
- [ ] Create `src/context/ComparisonContext.tsx`:
  - Global React context storing `comparisonItems` (string IDs, max 4).
  - Persistence to `localStorage` (`wristo_comparison`).
  - Toast alerts for addition, removal, and max capacity warning.
- [ ] Create `src/components/comparison/FloatingComparisonDock.tsx`:
  - Fixed-position bottom floating dock appearing when `comparisonCount > 0`.
  - Shows watch thumbnail chips, model name, price, and remove `&times;`.
  - Empty slots indicate `+ Add Watch (N/4)`.
  - Actions: "Clear All" and "Compare Now &rarr;" linking to `/compare`.
- [ ] Create `src/app/compare/page.tsx` & `ComparisonClient.tsx`:
  - Side-by-Side Horology Matrix table comparing all 9 attributes.
  - Quick Add to Cart, Remove column, and Empty State with "Browse Timepieces" CTA.
- [ ] Integrate Comparison Triggers:
  - Add Comparison icon button with badge to `Header.tsx`.
  - Connect `ProductActions.tsx` "Compare Specs" button to `useComparison()`.
  - Add quick compare toggle to `ProductCard.tsx` hover actions.

### Milestone 2: Homepage Section Restoration & Narrative Flow
- [ ] Update `TrustStrip.tsx` copywriting to exact reference copy:
  - `100% Authentic | Brand Warranty` (Shield)
  - `Free Shipping | Across India` (Truck)
  - `Easy Returns | Within 7 Days` (Return Box)
  - `Secure | Payments` (Lock/Card)
- [ ] Build `src/components/home/PopularBrands.tsx`:
  - 6 brand house cards with logo typography and hover effects.
  - Full-width dark horizontal banner with watch crown photo: *"Explore Premium Brands. Authentic. Trusted. Always. [ Browse Brands &rarr; ]"*.
- [ ] Build `src/components/home/OccasionSection.tsx`:
  - Header: *"CURATED COLLECTION: For Every Occasion — From boardrooms to weekend getaways, find a watch that matches your vibe."*
  - 4 tall vertical image cards (**Formal** 312 Items, **Casual** 489 Items, **Sports** 256 Items, **Luxury** 198 Items) with lifestyle photography.
  - Carousel navigation controls `01 < >`.
- [ ] Build `src/components/home/AppPromoSection.tsx`:
  - 3D smartphone frame showcasing WRISTO app interface on dark textured backdrop.
  - Headline: *"Take WRISTO Wherever You Go"* + Subtitle.
  - Apple App Store & Google Play SVG badge buttons.
- [ ] Build `src/components/home/BlogPreviewSection.tsx`:
  - Header: *"From Our Blog — Insights, guides and tips to help you choose the perfect watch. View All &rarr;"*
  - 3 editorial cards with photography and category tags, linking directly to `/journal/[slug]`.
- [ ] Re-sequence `src/app/page.tsx` narrative flow:
  `Hero &rarr; TrustStrip &rarr; PopularBrands &rarr; TrendingTimepieces &rarr; OccasionSection &rarr; EditorialBanner &rarr; AppPromoSection &rarr; BlogPreviewSection &rarr; Footer`.

### Milestone 3: Catalog / PLP Enhancements
- [ ] Build `src/components/catalog/ShopByCategoryList.tsx`:
  - Vertical category jump list placed at the top of the left sidebar with right arrows (`Men &rarr;`, `Women &rarr;`, `Unisex &rarr;`, `Analog &rarr;`, `Chronograph &rarr;`, `Smart Watches &rarr;`, `Accessories &rarr;`).
- [ ] Build `src/components/catalog/CircularCategoryChips.tsx`:
  - Under-header row of 4 circular category chips with thumbnail avatars:
    - ⚪ **Analog** (1240 Items)
    - ⚪ **Chronograph** (852 Items)
    - ⚪ **Smart** (600 Items)
    - ⚪ **Dress** (716 Items)
  - Interactive click filtering that synchronizes with URL search parameters.
- [ ] Enhance `ProductCard.tsx`:
  - Add distinct bottom status pill badges (`Best Seller`, `Trending`, `Premium`, `New Arrival`) matching Panel 2.

### Milestone 4: Dedicated Standalone Desktop Pages
- [ ] Build `src/app/wishlist/page.tsx` & `WishlistClient.tsx`:
  - Full-page desktop Wishlist table matching Panel 8.
  - Item rows with photo, title, price, Stock Status pills (`In Stock` green / `Low Stock` orange), and 1-click remove.
- [ ] Build `src/app/cart/page.tsx` & `CartPageClient.tsx`:
  - Full-page desktop Cart view matching Panel 9.
  - 2-column layout: Cart item list with specs (`Color: Silver | Size: 42mm`) and quantity steppers on left, sticky Order Summary on right.
- [ ] Build `src/app/brands/page.tsx`:
  - Brand houses directory page matching the "Browse Brands" destination.
- [ ] Correct Account Profile Persona (`src/services/accountService.ts`):
  - Change default collector persona to **Gaurav Kadam** (`GK`, `gauravkadam@gmail.com`).

### Milestone 5: Header, Footer & Search Copy Polish
- [ ] Update `Header.tsx`:
  - Align desktop navigation links: `Home | Men | Women | Collections | Brands | Accessories`.
  - Align header utilities: `Search | Wishlist | Compare | Account | Cart`.
- [ ] Update `Footer.tsx`:
  - Update tagline: `Your Time. Your Style.`
  - Update description: *"A premium multi-brand watch store bringing the best watches from around the world."*
  - Add Quick Links, Customer Care, and Get In Touch (`support@wristo.com`, `+91 98765 43210`, `Pune, Maharashtra`).
  - Add Social Media icons and Payment badges (`VISA`, `Mastercard`, `Maestro`, `UPI`).
- [ ] Update `SearchModal.tsx`:
  - Add default popular search queries matching Panel 13: `Titan`, `Fastrack`, `Casio`, `Chronograph`, `Smart Watch`.

---

## 6. Strict Development Guardrails
1. **Desktop Web Focus:** Work is strictly scoped to Desktop Web (`1440px` and responsive desktop). Mobile native app and PWA remain deferred per user instructions.
2. **Catalog Integrity:** The 40 watches in `src/data/products.ts` and existing functional cart/checkout/concierge flows must remain intact.
3. **Git Confirmation:** Never commit or push without explicit prior confirmation from the user.
