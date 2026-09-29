const fs = require('fs');
const path = require('path');

// Load original data
const originalCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'products.js'), 'utf8');

// Evaluate in sandbox
const sandbox = {};
const fn = new Function('module', 'exports', originalCode + '\nreturn { PRODUCTS, COLLECTIONS, BRANDS };');
const { PRODUCTS, COLLECTIONS, BRANDS } = fn({}, {});

// Fix image paths: replace ./assets/ with /assets/
const fixedProducts = PRODUCTS.map(p => ({
  ...p,
  image: p.image.replace(/^\.\/assets\//, '/assets/')
}));

// Create src/data directory if not exists
const dataDir = path.join(__dirname, '..', 'wristo-next', 'src', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 1. products.ts
const productsContent = `import { Product } from '@/types/product';\n\nexport const PRODUCTS: Product[] = ${JSON.stringify(fixedProducts, null, 2)};\n`;
fs.writeFileSync(path.join(dataDir, 'products.ts'), productsContent);

// 2. brands.ts
const brandsContent = `import { Brand } from '@/types/product';\n\nexport const BRANDS: Brand[] = ${JSON.stringify(BRANDS, null, 2)};\n`;
fs.writeFileSync(path.join(dataDir, 'brands.ts'), brandsContent);

// 3. collections.ts
const collectionsContent = `import { Collection } from '@/types/product';\n\nexport const COLLECTIONS: Collection[] = ${JSON.stringify(COLLECTIONS, null, 2)};\n`;
fs.writeFileSync(path.join(dataDir, 'collections.ts'), collectionsContent);

// 4. categories.ts
const CATEGORIES = [
  {
    id: "all",
    slug: "all",
    title: "All Curated Timepieces",
    shortTitle: "All Watches",
    description: "Explore our full catalog of 40 luxury, classic, automatic, chronograph, and connected timepieces.",
    count: 40
  },
  {
    id: "men",
    slug: "men",
    title: "Men's Horological Collection",
    shortTitle: "Men",
    description: "Engineered timepieces balancing mechanical precision, understated architectural restraint, and surgical steel finishing.",
    count: fixedProducts.filter(p => p.gender === 'Men').length
  },
  {
    id: "women",
    slug: "women",
    title: "Women's Luxury & Fluid Mesh Editions",
    shortTitle: "Women",
    description: "Refined proportions, sunray dials, Milanese mesh bracelets, and tactile rose gold accents designed for graceful presence.",
    count: fixedProducts.filter(p => p.gender === 'Women').length
  },
  {
    id: "automatic",
    slug: "automatic",
    title: "Mechanical & Skeleton Automatic Souls",
    shortTitle: "Automatics",
    description: "Authentic automatic movements with 21,600+ vph, sapphire exhibition casebacks, and pure horological self-winding power.",
    count: fixedProducts.filter(p => p.movement === 'Automatic').length
  },
  {
    id: "chronograph",
    slug: "chronograph",
    title: "Precision Motorsport Chronographs",
    shortTitle: "Chronographs",
    description: "Sub-second dial registers, tachymeter bezels, and tactile pushers calibrated for active timing and precision performance.",
    count: fixedProducts.filter(p => p.style === 'Chronograph').length
  },
  {
    id: "dress",
    slug: "dress",
    title: "Minimalist Dress & Evening Timepieces",
    shortTitle: "Dress & Minimal",
    description: "Ultra-slim profiles under 9mm, hairline markers, and genuine vegetable-tanned leather straps tailored for black-tie and boardroom elegance.",
    count: fixedProducts.filter(p => p.style === 'Minimal' || p.style === 'Dress').length
  },
  {
    id: "smart",
    slug: "smart",
    title: "Connected Luxury & AMOLED Digital",
    shortTitle: "Connected",
    description: "Seamlessly fusing biometric telemetry, high-luminance AMOLED screens, and grade-5 titanium architecture.",
    count: fixedProducts.filter(p => p.movement === 'Smart Digital').length
  }
];

const categoriesContent = `import { CategoryItem } from '@/types/product';\n\nexport const CATEGORIES: CategoryItem[] = ${JSON.stringify(CATEGORIES, null, 2)};\n`;
fs.writeFileSync(path.join(dataDir, 'categories.ts'), categoriesContent);

console.log('Successfully generated products.ts, brands.ts, collections.ts, categories.ts');
