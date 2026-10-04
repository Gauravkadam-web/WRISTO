# Prompt 01: Master Architecture, Brand Identity & Design System

**Target Project:** WRISTO Ultra-Luxury Watch Marketplace  
**Domain:** Luxury E-Commerce, Horology Boutique, Editorial Design  
**Date Executed:** October 2026  

---

## 📜 Master Prompt Specification

```markdown
You are an expert full-stack engineer and luxury UI/UX designer. Build the official web application for WRISTO — an ultra-luxury multi-brand watch marketplace bringing the world's most prestigious timepieces (AUREN, VELA, ORBITA, VANTA, NORDEN, PULSE) to discerning collectors.

### 1. Brand Philosophy & Identity
- Brand Name: WRISTO
- Tagline: "Your Time. Your Style."
- Aesthetic Caliber: Swiss horological publication caliber (A Collected Man, Hodinkee, Revolution Magazine) paired with instantaneous modern client-side performance.
- Color Palette (Single Source of Truth):
  - Deep Brand Black / Soft Black: #111111 / #0F0F0F
  - Ivory Wordmark & Backgrounds: #F7F3EC / #FFFDF9
  - Sand / Neutral Borders: #D9C9B8 / #E8E3DC
  - Bronze Stylized W Monogram & Accents: #B08D6B
  - Champagne Gold Accents & CTA: #E8C89A / #DEC095

### 2. Typography Scale System
- Display Serif Font: Playfair Display / Cormorant Garamond
- Body Sans Font: Inter / System Sans
- 11-step typography scale:
  - display-xl: 64px / line-height 0.98 (Hero Titles)
  - display-lg: 52px / line-height 1.00
  - heading-xl: 40px / line-height 1.05 (Section Titles)
  - heading-lg: 32px / line-height 1.10
  - heading-md: 26px / line-height 1.15
  - heading-sm: 22px / line-height 1.20
  - body-lg: 18px / line-height 1.55
  - body-md: 16px / line-height 1.50
  - body-sm: 14px / line-height 1.45
  - caption: 12px / line-height 1.35
  - label: 11px / line-height 1.20 (Tracked Uppercase Eyebrows)

### 3. Architectural Invariants
1. Decoupled Service Contracts: "Presentation does not know where content comes from." All catalog, filtering, search, orders, accounts, and journal operations must pass through decoupled TypeScript service layers (productService.ts, orderService.ts, accountService.ts, journalService.ts) so swapping to Java + Spring Boot requires zero component edits.
2. 40-Watch Master Dataset: 40 fully-typed luxury timepieces spanning 6 curated brand houses across Automatic, Quartz, Smart Digital, and Mechanical Skeleton movements with Indian Rupee (INR) pricing.
3. Next.js 16+ App Router with Turbopack, React 19, TypeScript, Vanilla CSS design tokens.
```
