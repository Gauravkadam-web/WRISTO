/**
 * WRISTO — Admin & CMS Management Types
 */

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'SUPER_ADMIN' | 'SELLER' | 'CUSTOMER';
  token?: string;
  refreshToken?: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  activeListings: number;
  publishedArticles: number;
  draftArticles: number;
  totalCoupons: number;
  pendingSellersCount: number;
}

export type AdminDashboardStats = AdminStats;

export interface AdminArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  authorName: string;
  authorRole: string;
  readTime: string;
  coverImage: string;
  featured: boolean;
  published: boolean;
  content: string;
  createdAt: string;
  tags?: string[];
  featuredProductIds?: string[];
}

export type AdminArticleItem = AdminArticle;

export interface CreateArticlePayload {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  authorName: string;
  authorRole?: string;
  readTime?: string;
  coverImage?: string;
  featured?: boolean;
  published?: boolean;
  content?: string;
}

export interface AdminCoupon {
  id: string;
  code: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minOrderAmount?: number;
  minSubtotal?: number;
  maxDiscountAmount?: number;
  maxDiscount?: number;
  validFrom?: string;
  validUntil?: string;
  startsAt?: string;
  expiresAt?: string;
  usageLimit?: number;
  usedCount?: number;
  timesUsed?: number;
  active?: boolean;
  isActive?: boolean;
  createdAt?: string;
}

export type AdminCouponItem = AdminCoupon;

export interface CreateCouponPayload {
  code: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minOrderAmount?: number;
  minSubtotal?: number;
  maxDiscountAmount?: number;
  maxDiscount?: number;
  validFrom?: string;
  validUntil?: string;
  startsAt?: string;
  expiresAt?: string;
  usageLimit?: number;
  active?: boolean;
  isActive?: boolean;
}

export interface AdminOrderItemDetail {
  id: string;
  brand: string;
  model: string;
  price: number;
  quantity: number;
  image: string;
  unitPrice: number;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  totalAmount: number;
  orderStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED' | 'FAILED';
  paymentMethod: string;
  trackingNumber?: string;
  courierName?: string;
  items: AdminOrderItemDetail[];
  createdAt: string;
  updatedAt?: string;
}

export type AdminOrderItem = AdminOrder;

export interface AdminSeller {
  id: string;
  boutiqueName: string;
  sellerName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  businessRegistrationNumber: string;
  authorizedBrands: string[];
  rating: number;
  commissionRate: number;
  isVerified: boolean;
  verificationNotes?: string;
  createdAt: string;
}

export type AdminSellerItem = AdminSeller;

export interface AdminListing {
  id: string;
  brand: string;
  model: string;
  title: string;
  referenceNumber: string;
  serialNumber?: string;
  year?: number;
  condition: 'UNWORN' | 'MINT' | 'VERY_GOOD' | 'GOOD';
  price: number;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  rejectionReason?: string;
  images: string[];
  createdAt: string;
}

export type AdminListingItem = AdminListing;

export interface AdminServiceRecord {
  id: string;
  watchSerialNumber: string;
  serviceCenter: string;
  watchmakerName: string;
  serviceType: string;
  notes: string;
  serviceDate: string;
  nextServiceDue: string;
  createdAt: string;
}

export type AdminServiceRecordPayload = AdminServiceRecord;

export interface AdminWatchSpecifications {
  caseDiameter?: string;
  caseMaterial?: string;
  dialFinish?: string;
  strapMaterial?: string;
  waterResistance?: string;
  powerReserve?: string;
  glassCrystal?: string;
  claspType?: string;
  warrantyPeriod?: string;
}

export interface AdminWatchDimensions {
  lugToLug?: string;
  caseThickness?: string;
  lugWidth?: string;
}

export interface AdminWatch3DAssets {
  modelUrl?: string;
  posterUrl?: string;
  has3dModel?: boolean;
}

export interface AdminWatch {
  id: string;
  num: string;
  brand: string;
  model: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  category: string;
  gender: string;
  movement: string;
  style: string;
  caseSize: string;
  strap: string;
  dial: string;
  material: string;
  waterResistance: string;
  badge?: string;
  tagline: string;
  description: string;
  aiMatchScore: number;
  aiReason: string;
  stockCount: number;
  isActive: boolean;
  specifications?: AdminWatchSpecifications;
  dimensions?: AdminWatchDimensions;
  assets3d?: AdminWatch3DAssets;
  createdAt?: string;
  updatedAt?: string;
}

export interface SaveWatchPayload {
  id?: string;
  num?: string;
  brandName: string;
  brandId?: string;
  model: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  categoryName?: string;
  categoryId?: string;
  gender?: string;
  movement?: string;
  style?: string;
  caseSize?: string;
  strap?: string;
  dial?: string;
  material?: string;
  waterResistance?: string;
  badge?: string;
  tagline?: string;
  description?: string;
  aiMatchScore?: number;
  aiReason?: string;
  stockCount?: number;
  isActive?: boolean;
  caseDiameterMm?: string;
  caseMaterial?: string;
  dialFinish?: string;
  strapMaterial?: string;
  waterResistanceAtm?: string;
  powerReserveHours?: string;
  glassCrystal?: string;
  claspType?: string;
  warrantyPeriod?: string;
  model3dUrl?: string;
  posterImageUrl?: string;
  caseLugToLug?: string;
  caseThickness?: string;
  lugWidth?: string;
}

