import {
  AppliedCoupon,
  CreateOrderPayload,
  DeliveryOption,
  DeliveryTier,
  OrderCartItem,
  OrderRecord,
  OrderTotals,
  PaymentOption
} from '@/types/order';
import { apiClient } from './apiClient';

export const GIFT_POUCH_THRESHOLD = 15000;

export const AVAILABLE_COUPONS = [
  {
    code: 'WRISTO10',
    description: '10% Horological Privilege Discount',
    discountType: 'percentage' as const,
    discountValue: 10,
    minSubtotal: 0
  },
  {
    code: 'HOROLOGYVIP',
    description: '₹2,500 VIP Collector Privilege',
    discountType: 'fixed' as const,
    discountValue: 2500,
    minSubtotal: 15000
  },
  {
    code: 'FIRST15',
    description: '15% First Timepiece Acquisition',
    discountType: 'percentage' as const,
    discountValue: 15,
    minSubtotal: 0
  }
];

export const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    id: 'insured_express',
    title: 'Complimentary Insured Air Express',
    description: 'Dispatched in armored tamper-evident horology case with 100% transit insurance.',
    estimatedDelivery: '2–3 Business Days',
    price: 0,
    badge: 'COMPLIMENTARY'
  },
  {
    id: 'white_glove',
    title: 'White-Glove Hand Courier',
    description: 'Personalized delivery with horologist inspection and authenticity seal verification on spot.',
    estimatedDelivery: '1–2 Business Days',
    price: 999,
    badge: 'BOUTIQUE SERVICE'
  }
];

export const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: 'upi',
    title: 'Instant UPI / QR Code',
    subtitle: 'Google Pay, PhonePe, Paytm, BHIM & All UPI Apps',
    badge: 'FAST & SECURE'
  },
  {
    id: 'card',
    title: 'Credit / Debit Card & EMI',
    subtitle: 'Visa, Mastercard, Amex • 0% No-Cost EMI up to 12 months',
    badge: '0% EMI AVAILABLE'
  },
  {
    id: 'netbanking',
    title: 'Netbanking',
    subtitle: 'HDFC, ICICI, SBI, Axis, Kotak & 50+ Banks',
  },
  {
    id: 'cod',
    title: 'Pay on Inspection (COD)',
    subtitle: 'Inspect official authenticity seal before releasing payment to courier',
    badge: 'INSPECT FIRST'
  }
];

export function validateCoupon(
  code: string,
  subtotal: number
): { valid: boolean; coupon?: AppliedCoupon; message?: string } {
  if (!code || !code.trim()) {
    return { valid: false, message: 'Please enter a coupon code.' };
  }

  const normalized = code.trim().toUpperCase();

  // 1. Check dynamic admin coupons first
  let dynamicCoupons: any[] = [];
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('wristo_admin_coupons');
      if (stored) {
        dynamicCoupons = JSON.parse(stored);
      }
    } catch {
      // ignore
    }
  }

  const matchedDynamic = dynamicCoupons.find((c: any) => c.code.toUpperCase() === normalized && c.active);

  if (matchedDynamic) {
    if (subtotal < (matchedDynamic.minOrderAmount || 0)) {
      return {
        valid: false,
        message: `Privilege code "${matchedDynamic.code}" requires a minimum order value of $${matchedDynamic.minOrderAmount.toLocaleString()}.`
      };
    }

    let calculatedDiscount = 0;
    if (matchedDynamic.discountType === 'PERCENTAGE') {
      calculatedDiscount = Math.round((subtotal * matchedDynamic.discountValue) / 100);
      if (matchedDynamic.maxDiscountAmount && calculatedDiscount > matchedDynamic.maxDiscountAmount) {
        calculatedDiscount = matchedDynamic.maxDiscountAmount;
      }
    } else {
      calculatedDiscount = Math.min(matchedDynamic.discountValue, subtotal);
    }

    return {
      valid: true,
      coupon: {
        code: matchedDynamic.code,
        description: `Exclusive Privilege Concession (${matchedDynamic.discountValue}${matchedDynamic.discountType === 'PERCENTAGE' ? '%' : '$'} off)`,
        discountType: matchedDynamic.discountType.toLowerCase() as 'percentage' | 'fixed',
        discountValue: matchedDynamic.discountValue,
        calculatedDiscount
      }
    };
  }

  // 2. Check static default coupons
  const matched = AVAILABLE_COUPONS.find(c => c.code === normalized);

  if (!matched) {
    return { valid: false, message: `"${normalized}" is not a valid horological promo code.` };
  }

  if (subtotal < matched.minSubtotal) {
    return {
      valid: false,
      message: `Code "${matched.code}" requires a minimum order value of ₹${matched.minSubtotal.toLocaleString('en-IN')}.`
    };
  }

  let calculatedDiscount = 0;
  if (matched.discountType === 'percentage') {
    calculatedDiscount = Math.round((subtotal * matched.discountValue) / 100);
  } else {
    calculatedDiscount = Math.min(matched.discountValue, subtotal);
  }

  return {
    valid: true,
    coupon: {
      code: matched.code,
      description: matched.description,
      discountType: matched.discountType,
      discountValue: matched.discountValue,
      calculatedDiscount
    }
  };
}

export function calculateOrderTotals(
  items: OrderCartItem[],
  coupon?: AppliedCoupon,
  deliveryTier: DeliveryTier = 'insured_express'
): OrderTotals {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discount = 0;
  if (coupon) {
    if (coupon.discountType === 'percentage') {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
    } else {
      discount = Math.min(coupon.discountValue, subtotal);
    }
  }

  const selectedDelivery = DELIVERY_OPTIONS.find(d => d.id === deliveryTier);
  const shippingFee = selectedDelivery ? selectedDelivery.price : 0;

  const total = Math.max(0, subtotal - discount + shippingFee);

  const giftPouchUnlocked = subtotal >= GIFT_POUCH_THRESHOLD;
  const amountNeededForGiftPouch = Math.max(0, GIFT_POUCH_THRESHOLD - subtotal);

  return {
    subtotal,
    discount,
    shippingFee,
    total,
    giftPouchThreshold: GIFT_POUCH_THRESHOLD,
    amountNeededForGiftPouch,
    giftPouchUnlocked
  };
}

export async function createOrder(payload: CreateOrderPayload): Promise<OrderRecord> {
  const totals = calculateOrderTotals(payload.items, payload.coupon, payload.deliveryTier);

  // Generate unique horological order credentials
  const randomRef = Math.floor(10000 + Math.random() * 90000);
  const randomCert = Math.floor(100000 + Math.random() * 900000);

  const newOrder: OrderRecord = {
    orderId: `WRT-2026-${randomRef}`,
    certificateId: `CERT-CHRONO-${randomCert}`,
    createdAt: new Date().toISOString(),
    items: payload.items,
    subtotal: totals.subtotal,
    discount: totals.discount,
    shippingFee: totals.shippingFee,
    total: totals.total,
    isGiftWrapped: payload.isGiftWrapped,
    giftMessage: payload.giftMessage,
    coupon: payload.coupon,
    address: payload.address,
    deliveryTier: payload.deliveryTier,
    paymentMethod: payload.paymentMethod,
    status: 'confirmed'
  };

  // Attempt backend persistence
  try {
    await apiClient.post('/orders', {
      orderId: newOrder.orderId,
      certificateId: newOrder.certificateId,
      items: newOrder.items,
      subtotal: newOrder.subtotal,
      discount: newOrder.discount,
      shippingFee: newOrder.shippingFee,
      total: newOrder.total,
      address: newOrder.address,
      paymentMethod: newOrder.paymentMethod,
      deliveryTier: newOrder.deliveryTier
    });
  } catch {
    // Graceful fallback to client storage
  }

  // Persist locally for instant checkout confirmation & offline order tracking
  if (typeof window !== 'undefined') {
    try {
      const existing = localStorage.getItem('wristo_orders');
      const orders: OrderRecord[] = existing ? JSON.parse(existing) : [];
      orders.unshift(newOrder);
      localStorage.setItem('wristo_orders', JSON.stringify(orders));
      localStorage.setItem('wristo_latest_order', JSON.stringify(newOrder));
    } catch {
      // Ignore storage errors
    }
  }

  return newOrder;
}

export async function getOrders(): Promise<OrderRecord[]> {
  if (typeof window === 'undefined') return [];
  try {
    const existing = localStorage.getItem('wristo_orders');
    if (!existing) return [];
    return JSON.parse(existing);
  } catch {
    return [];
  }
}

export async function getOrderById(orderId: string): Promise<OrderRecord | null> {
  if (typeof window === 'undefined') return null;
  try {
    const orders = await getOrders();
    return orders.find(o => o.orderId === orderId) || null;
  } catch {
    return null;
  }
}

export async function getLatestOrder(): Promise<OrderRecord | null> {
  if (typeof window === 'undefined') return null;
  try {
    const latest = localStorage.getItem('wristo_latest_order');
    if (!latest) return null;
    return JSON.parse(latest);
  } catch {
    return null;
  }
}

// Simple lookup helper for Indian cities by Pincode prefix
export function lookupPincode(pincode: string): { city: string; state: string } | null {
  const p = pincode.trim();
  if (p.length !== 6 || !/^\d{6}$/.test(p)) return null;

  const prefix = p.substring(0, 2);
  switch (prefix) {
    case '11':
      return { city: 'New Delhi', state: 'Delhi' };
    case '40':
    case '41':
    case '42':
      return { city: 'Mumbai', state: 'Maharashtra' };
    case '56':
      return { city: 'Bengaluru', state: 'Karnataka' };
    case '60':
      return { city: 'Chennai', state: 'Tamil Nadu' };
    case '50':
      return { city: 'Hyderabad', state: 'Telangana' };
    case '70':
      return { city: 'Kolkata', state: 'West Bengal' };
    case '38':
      return { city: 'Ahmedabad', state: 'Gujarat' };
    case '30':
      return { city: 'Jaipur', state: 'Rajasthan' };
    case '20':
    case '22':
      return { city: 'Lucknow', state: 'Uttar Pradesh' };
    case '16':
      return { city: 'Chandigarh', state: 'Punjab' };
    default:
      return null;
  }
}
