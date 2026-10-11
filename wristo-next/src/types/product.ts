export type MovementType = 'Quartz' | 'Automatic' | 'Smart Digital' | 'Mechanical Skeleton';
export type StyleType = 'Minimal' | 'Classic' | 'Chronograph' | 'Dress' | 'Sport' | 'Skeleton';
export type GenderType = 'Men' | 'Women' | 'Unisex';

export interface ProductHotspot {
  label: string;
  position: [number, number, number];
  normal?: [number, number, number];
  description?: string;
}

export interface Product {
  id: string;
  num: string;
  brand: string;
  model: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  image: string;
  category: GenderType | string;
  gender: GenderType;
  movement: MovementType | string;
  style: StyleType | string;
  caseSize: string;
  strap: string;
  dial: string;
  material: string;
  waterResistance: string;
  badge?: string;
  tagline: string;
  description: string;
  aiMatchScore?: number;
  aiReason?: string;
  occasion: string[];
  colors: string[];
  model3dUrl?: string;
  posterImageUrl?: string;
  hotspots?: ProductHotspot[];
  caseLugToLug?: string;
  caseThickness?: string;
  lugWidth?: string;
}

export interface Brand {
  name: string;
  country: string;
  established: string;
  headline: string;
  description: string;
  priceRange: string;
  featuredWatchId: string;
  styles: string[];
  watchCount: number;
}

export interface Collection {
  id: string;
  title: string;
  subtitle: string;
  bannerTag: string;
  description: string;
  bgGradient?: string;
  heroWatchId?: string;
  itemIds: string[];
}

export interface CategoryItem {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  count: number;
  featuredWatchId?: string;
}
