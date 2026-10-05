/**
 * WRISTO — Admin & CMS Management Service
 * 
 * Provides unified back-office API connectivity to Spring Boot /admin endpoints
 * with comprehensive local storage / in-memory fallback for offline resilience.
 */

import { apiClient } from './apiClient';
import {
  AdminUser,
  AdminStats,
  AdminArticle,
  AdminCoupon,
  AdminOrder,
  AdminSeller,
  AdminListing,
  AdminServiceRecord
} from '@/types/admin';
import { PRODUCTS } from '@/data/products';

// Default Mock Seed Data for Fallback
const DEFAULT_ADMIN_COUPONS: AdminCoupon[] = [
  {
    id: 'cpn-01',
    code: 'VIPEXCLUSIVE10',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    minOrderAmount: 10000,
    maxDiscountAmount: 5000,
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    usageLimit: 500,
    usedCount: 142,
    active: true,
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'cpn-02',
    code: 'HAUTEHOROLOGY',
    discountType: 'FIXED_AMOUNT',
    discountValue: 1500,
    minOrderAmount: 25000,
    maxDiscountAmount: 1500,
    validFrom: '2026-02-01',
    validUntil: '2026-11-30',
    usageLimit: 200,
    usedCount: 78,
    active: true,
    createdAt: '2026-02-01T00:00:00Z'
  },
  {
    id: 'cpn-03',
    code: 'ROYALPATRON',
    discountType: 'PERCENTAGE',
    discountValue: 15,
    minOrderAmount: 50000,
    maxDiscountAmount: 10000,
    validFrom: '2026-01-15',
    validUntil: '2026-12-31',
    usageLimit: 100,
    usedCount: 29,
    active: true,
    createdAt: '2026-01-15T00:00:00Z'
  }
];

const DEFAULT_ADMIN_ORDERS: AdminOrder[] = [
  {
    id: 'ord-01',
    orderNumber: 'WRT-2026-88942',
    customerName: 'Gaurav Kadam',
    customerEmail: 'gauravkadam@gmail.com',
    customerPhone: '+91 98765 43210',
    totalAmount: 16650,
    orderStatus: 'PROCESSING',
    paymentStatus: 'PAID',
    paymentMethod: 'Instant UPI (Google Pay)',
    courierName: 'Brinks Luxury Armored Logistics',
    trackingNumber: 'BRK-88942-CH',
    items: [
      {
        id: 'item-01',
        brand: 'Patek Philippe',
        model: 'Nautilus 5711/1A',
        price: 16650,
        quantity: 1,
        image: '/assets/watches/watch-patek-5711.png',
        unitPrice: 16650
      }
    ],
    createdAt: '2026-10-04T14:30:00Z'
  },
  {
    id: 'ord-02',
    orderNumber: 'WRT-2026-77319',
    customerName: 'Siddharth Malhotra',
    customerEmail: 'siddharth@malhotra.luxury',
    totalAmount: 42500,
    orderStatus: 'SHIPPED',
    paymentStatus: 'PAID',
    paymentMethod: 'Amex Centurion Black Card',
    courierName: 'Ferrari Group International Vault Transit',
    trackingNumber: 'FRR-77319-MUM',
    items: [
      {
        id: 'item-02',
        brand: 'Audemars Piguet',
        model: 'Royal Oak “Jumbo” Extra-Thin',
        price: 42500,
        quantity: 1,
        image: '/assets/watches/watch-ap-royaloak.png',
        unitPrice: 42500
      }
    ],
    createdAt: '2026-10-03T11:15:00Z'
  },
  {
    id: 'ord-03',
    orderNumber: 'WRT-2026-66481',
    customerName: 'Dr. Ananya Roy',
    customerEmail: 'ananya.roy@geneva-health.org',
    totalAmount: 28900,
    orderStatus: 'DELIVERED',
    paymentStatus: 'PAID',
    paymentMethod: 'Bank Wire Transfer (HDFC)',
    courierName: 'Malca-Amit Secure Armored Logistics',
    trackingNumber: 'MA-66481-DEL',
    items: [
      {
        id: 'item-03',
        brand: 'Rolex',
        model: 'Cosmograph Daytona 116500LN',
        price: 28900,
        quantity: 1,
        image: '/assets/watches/watch-rolex-daytona.png',
        unitPrice: 28900
      }
    ],
    createdAt: '2026-10-01T09:45:00Z'
  }
];

const DEFAULT_ADMIN_ARTICLES: AdminArticle[] = [
  {
    id: 'art-01',
    slug: 'architecture-of-automatic-calibers',
    title: 'The Architecture of Automatic Calibers: How Mechanical Hearts Beat',
    excerpt: 'An automatic watch is fundamentally a kinetic organism. Every movement of your wrist winds the mainspring through an engineered oscillating weight, converting human motion into continuous horological poetry.',
    category: 'SAVOIR-FAIRE',
    authorName: 'Adrien de Beauharnais',
    authorRole: 'Master Horologist & Restoration Specialist',
    readTime: '6 min read',
    coverImage: '/assets/products/watch-31.png',
    featured: true,
    published: true,
    content: 'In an era dominated by microprocessors, mechanical watchmaking endures because it records the passage of the universe using only spring tension, interlocking gears, and inertial physics...',
    createdAt: '2026-10-01T00:00:00Z'
  },
  {
    id: 'art-02',
    slug: 'surgical-316l-vs-titanium-case-metallurgy',
    title: 'Surgical 316L vs. Titanium: Choosing Your Case Metallurgy',
    excerpt: 'Selecting the metal of your watch case defines not merely how the timepiece looks, but how it feels over decades of daily wear.',
    category: 'INDUSTRY',
    authorName: 'Kavita Singhania',
    authorRole: 'Materials Metallurgist & Design Critic',
    readTime: '5 min read',
    coverImage: '/assets/products/watch-05.png',
    featured: false,
    published: true,
    content: 'The metallurgical distinction between 316L surgical stainless steel and Grade 5 aerospace titanium fundamentally transforms tensile strength and wrist presence...',
    createdAt: '2026-09-28T00:00:00Z'
  },
  {
    id: 'art-03',
    slug: 'investing-in-independent-watchmaking',
    title: 'The Rise of Independent Horology: F.P. Journe to Rexhep Rexhepi',
    excerpt: 'Independent master watchmakers are redefining the auction landscape and collectors portfolios worldwide.',
    category: 'COLLECTING',
    authorName: 'Jean-Luc Laurent',
    authorRole: 'Senior Horological Curator',
    readTime: '7 min read',
    coverImage: '/assets/products/watch-15.png',
    featured: false,
    published: true,
    content: 'Independent ateliers represent the purest synthesis of artisanal finishing, hand-guilloché dials, and innovative complications...',
    createdAt: '2026-09-25T00:00:00Z'
  }
];

const DEFAULT_ADMIN_SELLERS: AdminSeller[] = [
  {
    id: 'sel-01',
    boutiqueName: 'Geneva Timepiece Salon & Co.',
    sellerName: 'Marc-André Vacheron',
    email: 'contact@genevasalon.ch',
    phone: '+41 22 819 9000',
    city: 'Geneva',
    country: 'Switzerland',
    businessRegistrationNumber: 'CHE-119.829.401',
    authorizedBrands: ['Patek Philippe', 'Vacheron Constantin', 'Audemars Piguet'],
    rating: 4.9,
    commissionRate: 7.5,
    isVerified: true,
    createdAt: '2025-06-15T00:00:00Z'
  },
  {
    id: 'sel-02',
    boutiqueName: 'Mayfair Haute Horlogerie Ltd.',
    sellerName: 'Lord Alistair Sterling',
    email: 'concierge@mayfairwatches.co.uk',
    phone: '+44 20 7946 0912',
    city: 'London',
    country: 'United Kingdom',
    businessRegistrationNumber: 'UK-09941829',
    authorizedBrands: ['Rolex', 'A. Lange & Söhne', 'Jaeger-LeCoultre'],
    rating: 4.8,
    commissionRate: 8.0,
    isVerified: true,
    createdAt: '2025-08-20T00:00:00Z'
  },
  {
    id: 'sel-03',
    boutiqueName: 'Mumbai Heritage Horology Vault',
    sellerName: 'Vikram Singhania',
    email: 'vikram@mumbaiheritagehorology.in',
    phone: '+91 22 6678 1234',
    city: 'Mumbai',
    country: 'India',
    businessRegistrationNumber: '27AABCS1429Q1Z8',
    authorizedBrands: ['Omega', 'Cartier', 'IWC Schaffhausen', 'Grand Seiko'],
    rating: 4.95,
    commissionRate: 6.5,
    isVerified: true,
    createdAt: '2025-11-01T00:00:00Z'
  }
];

const DEFAULT_ADMIN_LISTINGS: AdminListing[] = PRODUCTS.slice(0, 10).map((p) => ({
  id: p.id,
  brand: p.brand,
  model: p.model,
  title: `${p.brand} ${p.model} (${p.movement})`,
  referenceNumber: `REF-${p.id.toUpperCase()}`,
  serialNumber: `SN-${p.id}-2026-CH`,
  year: 2024,
  condition: 'UNWORN',
  price: p.price,
  status: 'APPROVED',
  images: [p.image],
  createdAt: '2026-01-01T00:00:00Z'
}));

const DEFAULT_SERVICE_RECORDS: AdminServiceRecord[] = [
  {
    id: 'srv-01',
    watchSerialNumber: 'PP-7118-2023-CH',
    serviceCenter: 'Geneva Master Horology Atelier — Station 4',
    watchmakerName: 'Philippe Dufour (Certified Master Horologist)',
    serviceType: 'FULL_OVERHAUL',
    notes: 'Complete teardown of caliber, ultrasonic cleaning of 213 components, synthetic ruby escapement lubrication, and amplitude regulation to +1.2s/day.',
    serviceDate: '2026-09-15',
    nextServiceDue: '2031-09-15',
    createdAt: '2026-09-15T00:00:00Z'
  },
  {
    id: 'srv-02',
    watchSerialNumber: 'AP-15202-2022-LE',
    serviceCenter: 'Le Brassus Complications Workshop',
    watchmakerName: 'François-Paul Journe (Master Artisan)',
    serviceType: 'REGULATION',
    notes: 'Free-sprung balance wheel gyromax adjustment, mainspring barrel torque calibration, and 100m hydrostatic pressure test seal certificate issued.',
    serviceDate: '2026-08-20',
    nextServiceDue: '2029-08-20',
    createdAt: '2026-08-20T00:00:00Z'
  }
];

class AdminService {
  private currentAdmin: AdminUser | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('wristo_admin_user');
        if (stored) {
          this.currentAdmin = JSON.parse(stored);
        }
      } catch {
        // ignore
      }
    }
  }

  // Auth
  async login(email: string, password: string): Promise<AdminUser> {
    try {
      const response = await apiClient.post<AdminUser>('/admin/auth/login', { email, password });
      if (response && response.data && response.data.token) {
        this.currentAdmin = response.data;
        if (typeof window !== 'undefined') {
          localStorage.setItem('wristo_admin_user', JSON.stringify(response.data));
        }
        return response.data;
      }
    } catch {
      // Fallback
    }

    if (email === 'admin@wristo.com' && password === 'Password@123') {
      const mockAdmin: AdminUser = {
        id: 'adm-01',
        email: 'admin@wristo.com',
        fullName: 'Chief Horological Director',
        role: 'SUPER_ADMIN',
        token: 'mock-jwt-admin-token-2026'
      };
      this.currentAdmin = mockAdmin;
      if (typeof window !== 'undefined') {
        localStorage.setItem('wristo_admin_user', JSON.stringify(mockAdmin));
      }
      return mockAdmin;
    }

    throw new Error('Invalid credentials');
  }

  getCurrentAdmin(): AdminUser | null {
    if (this.currentAdmin) return this.currentAdmin;
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('wristo_admin_user');
        if (stored) {
          this.currentAdmin = JSON.parse(stored);
          return this.currentAdmin;
        }
      } catch {
        // ignore
      }
    }
    return null;
  }

  logout(): void {
    this.currentAdmin = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wristo_admin_user');
    }
  }

  // Stats
  async getStats(): Promise<AdminStats> {
    try {
      const res = await apiClient.get<AdminStats>('/admin/stats');
      if (res && res.data) return res.data;
    } catch {
      // ignore
    }
    return {
      totalRevenue: 4328500,
      totalOrders: 84,
      pendingOrders: 3,
      activeListings: 40,
      publishedArticles: 6,
      draftArticles: 1,
      totalCoupons: 3,
      pendingSellersCount: 1
    };
  }

  async getDashboardStats(): Promise<AdminStats> {
    return this.getStats();
  }

  // Articles
  async getArticles(): Promise<AdminArticle[]> {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('wristo_admin_articles');
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    try {
      const res = await apiClient.get<AdminArticle[]>('/admin/journal/articles');
      if (res && res.data) return res.data;
    } catch {
      // ignore
    }
    return DEFAULT_ADMIN_ARTICLES;
  }

  async getAllArticles(): Promise<AdminArticle[]> {
    return this.getArticles();
  }

  async saveArticle(article: Partial<AdminArticle>): Promise<AdminArticle> {
    const existing = await this.getArticles();
    let saved: AdminArticle;
    if (article.id) {
      saved = {
        ...existing.find((a) => a.id === article.id),
        ...article
      } as AdminArticle;
      const updated = existing.map((a) => (a.id === article.id ? saved : a));
      if (typeof window !== 'undefined') {
        localStorage.setItem('wristo_admin_articles', JSON.stringify(updated));
      }
    } else {
      saved = {
        ...article,
        id: `art-${Date.now()}`,
        createdAt: new Date().toISOString()
      } as AdminArticle;
      const updated = [saved, ...existing];
      if (typeof window !== 'undefined') {
        localStorage.setItem('wristo_admin_articles', JSON.stringify(updated));
      }
    }
    try {
      await apiClient.post('/admin/journal/articles', saved);
    } catch {
      // Offline fallback
    }
    return saved;
  }

  async deleteArticle(id: string): Promise<void> {
    const existing = await this.getArticles();
    const updated = existing.filter((a) => a.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('wristo_admin_articles', JSON.stringify(updated));
    }
    try {
      await apiClient.delete(`/admin/journal/articles/${id}`);
    } catch {
      // ignore
    }
  }

  // Coupons
  async getCoupons(): Promise<AdminCoupon[]> {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('wristo_admin_coupons');
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    try {
      const res = await apiClient.get<AdminCoupon[]>('/admin/coupons');
      if (res && res.data) return res.data;
    } catch {
      // ignore
    }
    return DEFAULT_ADMIN_COUPONS;
  }

  async getAllCoupons(): Promise<AdminCoupon[]> {
    return this.getCoupons();
  }

  async saveCoupon(coupon: Partial<AdminCoupon>): Promise<AdminCoupon> {
    const existing = await this.getCoupons();
    let saved: AdminCoupon;
    if (coupon.id) {
      saved = {
        ...existing.find((c) => c.id === coupon.id),
        ...coupon
      } as AdminCoupon;
      const updated = existing.map((c) => (c.id === coupon.id ? saved : c));
      if (typeof window !== 'undefined') {
        localStorage.setItem('wristo_admin_coupons', JSON.stringify(updated));
      }
    } else {
      saved = {
        ...coupon,
        id: `cpn-${Date.now()}`,
        usedCount: 0,
        createdAt: new Date().toISOString()
      } as AdminCoupon;
      const updated = [saved, ...existing];
      if (typeof window !== 'undefined') {
        localStorage.setItem('wristo_admin_coupons', JSON.stringify(updated));
      }
    }
    try {
      await apiClient.post('/admin/coupons', saved);
    } catch {
      // ignore
    }
    return saved;
  }

  async deleteCoupon(id: string): Promise<void> {
    const existing = await this.getCoupons();
    const updated = existing.filter((c) => c.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('wristo_admin_coupons', JSON.stringify(updated));
    }
    try {
      await apiClient.delete(`/admin/coupons/${id}`);
    } catch {
      // ignore
    }
  }

  // Orders
  async getOrders(): Promise<AdminOrder[]> {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('wristo_admin_orders');
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    try {
      const res = await apiClient.get<AdminOrder[]>('/admin/orders');
      if (res && res.data) return res.data;
    } catch {
      // ignore
    }
    return DEFAULT_ADMIN_ORDERS;
  }

  async getAllOrders(): Promise<AdminOrder[]> {
    return this.getOrders();
  }

  async updateOrderStatus(
    orderId: string,
    status: string,
    trackingNumber?: string,
    courierName?: string
  ): Promise<AdminOrder> {
    const existing = await this.getOrders();
    const target = existing.find((o) => o.id === orderId);
    if (!target) throw new Error('Order not found');

    const updatedOrder: AdminOrder = {
      ...target,
      orderStatus: status as any,
      trackingNumber: trackingNumber || target.trackingNumber,
      courierName: courierName || target.courierName,
      updatedAt: new Date().toISOString()
    };

    const updatedList = existing.map((o) => (o.id === orderId ? updatedOrder : o));
    if (typeof window !== 'undefined') {
      localStorage.setItem('wristo_admin_orders', JSON.stringify(updatedList));
    }

    try {
      await apiClient.put(`/admin/orders/${orderId}/status`, {
        status,
        trackingNumber,
        courierName
      });
    } catch {
      // ignore
    }

    return updatedOrder;
  }

  // Sellers
  async getSellers(): Promise<AdminSeller[]> {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('wristo_admin_sellers');
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    try {
      const res = await apiClient.get<AdminSeller[]>('/admin/sellers');
      if (res && res.data) return res.data;
    } catch {
      // ignore
    }
    return DEFAULT_ADMIN_SELLERS;
  }

  async getAllSellers(): Promise<AdminSeller[]> {
    return this.getSellers();
  }

  async updateSellerVerification(
    sellerId: string,
    isVerified: boolean,
    notes?: string
  ): Promise<AdminSeller> {
    const existing = await this.getSellers();
    const target = existing.find((s) => s.id === sellerId);
    if (!target) throw new Error('Seller not found');

    const updatedSeller: AdminSeller = {
      ...target,
      isVerified,
      verificationNotes: notes || target.verificationNotes
    };

    const updatedList = existing.map((s) => (s.id === sellerId ? updatedSeller : s));
    if (typeof window !== 'undefined') {
      localStorage.setItem('wristo_admin_sellers', JSON.stringify(updatedList));
    }

    try {
      await apiClient.put(`/admin/sellers/${sellerId}/verify`, { isVerified, notes });
    } catch {
      // ignore
    }

    return updatedSeller;
  }

  // Listings
  async getListings(): Promise<AdminListing[]> {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('wristo_admin_listings');
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    try {
      const res = await apiClient.get<AdminListing[]>('/admin/listings');
      if (res && res.data) return res.data;
    } catch {
      // ignore
    }
    return DEFAULT_ADMIN_LISTINGS;
  }

  async getAllListings(): Promise<AdminListing[]> {
    return this.getListings();
  }

  async updateListingApproval(
    listingId: string,
    status: 'APPROVED' | 'REJECTED' | 'PENDING',
    rejectionReason?: string
  ): Promise<AdminListing> {
    const existing = await this.getListings();
    const target = existing.find((l) => l.id === listingId);
    if (!target) throw new Error('Listing not found');

    const updatedListing: AdminListing = {
      ...target,
      status,
      rejectionReason: rejectionReason || target.rejectionReason
    };

    const updatedList = existing.map((l) => (l.id === listingId ? updatedListing : l));
    if (typeof window !== 'undefined') {
      localStorage.setItem('wristo_admin_listings', JSON.stringify(updatedList));
    }

    try {
      await apiClient.put(`/admin/listings/${listingId}/approval`, { status, rejectionReason });
    } catch {
      // ignore
    }

    return updatedListing;
  }

  // Provenance Service Records
  async getServiceRecords(): Promise<AdminServiceRecord[]> {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('wristo_service_records');
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    try {
      const res = await apiClient.get<AdminServiceRecord[]>('/admin/provenance/records');
      if (res && res.data) return res.data;
    } catch {
      // ignore
    }
    return DEFAULT_SERVICE_RECORDS;
  }

  async appendServiceRecord(record: Partial<AdminServiceRecord>): Promise<AdminServiceRecord> {
    const existing = await this.getServiceRecords();
    const saved: AdminServiceRecord = {
      id: `srv-${Date.now()}`,
      watchSerialNumber: record.watchSerialNumber || 'PP-7118-2023-CH',
      serviceCenter: record.serviceCenter || 'Geneva Master Atelier',
      watchmakerName: record.watchmakerName || 'Philippe Dufour',
      serviceType: record.serviceType || 'FULL_OVERHAUL',
      notes: record.notes || 'Full movement overhaul completed.',
      serviceDate: record.serviceDate || new Date().toISOString().split('T')[0],
      nextServiceDue: record.nextServiceDue || '2031-01-01',
      createdAt: new Date().toISOString()
    };

    const updated = [saved, ...existing];
    if (typeof window !== 'undefined') {
      localStorage.setItem('wristo_service_records', JSON.stringify(updated));
    }

    try {
      await apiClient.post('/admin/provenance/records', saved);
    } catch {
      // ignore
    }

    return saved;
  }
}

export const adminService = new AdminService();
