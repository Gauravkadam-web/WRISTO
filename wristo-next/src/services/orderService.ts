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
    title: 'Instant UPI (Zero Surcharge)',
    subtitle: 'Google Pay, PhonePe, Paytm, BHIM or any UPI App via Razorpay.',
    badge: 'RECOMMENDED'
  },
  {
    id: 'card',
    title: 'Credit / Debit Cards (Amex & International)',
    subtitle: 'Visa, MasterCard, RuPay, American Express with 3D Secure 2.0 verification.'
  },
  {
    id: 'netbanking',
    title: 'Private Wealth NetBanking',
    subtitle: 'Direct high-value authentication across 50+ premier Indian and international banking institutions.'
  },
  {
    id: 'cod',
    title: 'Boutique Escrow Cash on Delivery',
    subtitle: 'Physical verification before cash release at your doorstep for timepieces under ₹50,000.'
  }
];

export async function getAvailableCoupons(): Promise<any[]> {
  const res = await apiClient.get<any[]>('/coupons');
  if (res && res.data && Array.isArray(res.data)) {
    return res.data;
  }
  return [];
}

export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<{ valid: boolean; coupon?: AppliedCoupon; message?: string }> {
  const normalized = code.trim().toUpperCase();
  if (!normalized) {
    return { valid: false, message: 'Please enter a valid coupon code.' };
  }

  try {
    const res = await apiClient.post<any>('/coupons/validate', {
      code: normalized,
      subtotal
    });

    if (res && res.data) {
      const data = res.data;
      const isPercentage = (data.discountType || '').toUpperCase() === 'PERCENTAGE';
      const discountValue = Number(data.discountValue || data.discount || 0);
      let calculatedDiscount = Number(data.calculatedDiscount || 0);

      if (!calculatedDiscount) {
        if (isPercentage) {
          calculatedDiscount = Math.round((subtotal * discountValue) / 100);
        } else {
          calculatedDiscount = Math.min(discountValue, subtotal);
        }
      }

      return {
        valid: true,
        coupon: {
          code: data.code || normalized,
          description: data.description || `${discountValue}${isPercentage ? '%' : '₹'} privilege concession applied`,
          discountType: isPercentage ? 'percentage' : 'fixed',
          discountValue,
          calculatedDiscount
        }
      };
    }
  } catch (err: any) {
    return {
      valid: false,
      message: err?.message || `Privilege code "${normalized}" is invalid or expired in our ledger.`
    };
  }

  return { valid: false, message: `Privilege code "${normalized}" could not be verified.` };
}

export const validateCouponAsync = validateCoupon;
export const AVAILABLE_COUPONS: any[] = [];



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
    giftPouchUnlocked,
    amountNeededForGiftPouch
  };
}

export async function createOrder(payload: CreateOrderPayload): Promise<OrderRecord> {
  const totals = calculateOrderTotals(payload.items, payload.coupon, payload.deliveryTier);

  const backendItems = payload.items.map(item => ({
    productId: item.productId,
    quantity: item.quantity,
    unitPrice: item.price
  }));

  const backendAddress = {
    fullName: payload.address.fullName,
    email: payload.address.email,
    phone: payload.address.phone,
    pincode: payload.address.pincode,
    addressLine1: payload.address.addressLine1,
    addressLine2: payload.address.addressLine2 || '',
    city: payload.address.city,
    state: payload.address.state,
    landmark: payload.address.landmark || '',
    deliveryNotes: payload.address.deliveryNotes || ''
  };

  const paymentMap: Record<string, string> = {
    cod: 'COD',
    upi: 'RAZORPAY_UPI',
    card: 'STRIPE_CARD',
    netbanking: 'NETBANKING'
  };
  const backendPaymentMethod = paymentMap[payload.paymentMethod] || 'RAZORPAY_UPI';

  const res = await apiClient.post<any>('/checkout/complete', {
    items: backendItems,
    address: backendAddress,
    paymentMethod: backendPaymentMethod,
    deliveryTier: payload.deliveryTier,
    isGiftWrapped: payload.isGiftWrapped || false,
    giftMessage: payload.giftMessage || '',
    couponCode: payload.coupon?.code || undefined
  });

  const data = res.data;
  const createdOrderRecord: OrderRecord = {
    orderId: data.orderNumber || data.orderId,
    certificateId: data.certificateNumber || data.certificateId || 'CERT-AUTHENTIC',
    createdAt: data.placedAt || data.createdAt || new Date().toISOString(),
    items: payload.items,
    subtotal: Number(data.subtotalAmount ?? data.subtotal ?? totals.subtotal),
    discount: Number(data.discountAmount ?? data.discount ?? totals.discount),
    shippingFee: Number(data.shippingFee ?? totals.shippingFee),
    total: Number(data.totalAmount ?? data.total ?? totals.total),
    isGiftWrapped: payload.isGiftWrapped,
    giftMessage: payload.giftMessage,
    coupon: payload.coupon,
    address: payload.address,
    deliveryTier: payload.deliveryTier,
    paymentMethod: payload.paymentMethod,
    status: (data.status || 'CONFIRMED').toLowerCase() as any
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('wristo_latest_order', JSON.stringify(createdOrderRecord));
    } catch {
      // Ignore
    }
  }

  return createdOrderRecord;
}

export async function getOrders(): Promise<OrderRecord[]> {
  const res = await apiClient.get<any>('/orders/my-orders');
  if (res && res.data && (Array.isArray(res.data) || Array.isArray(res.data.content))) {
    const list = Array.isArray(res.data) ? res.data : res.data.content;
    return list.map((o: any) => ({
      orderId: o.orderNumber || o.orderId,
      certificateId: o.certificateNumber || o.certificateId || 'CERT-AUTHENTIC',
      createdAt: o.placedAt || o.createdAt,
      items: o.items || [],
      subtotal: Number(o.subtotalAmount ?? o.subtotal ?? 0),
      discount: Number(o.discountAmount ?? o.discount ?? 0),
      shippingFee: Number(o.shippingFee ?? 0),
      total: Number(o.totalAmount ?? o.total ?? 0),
      isGiftWrapped: Boolean(o.isGiftWrapped),
      giftMessage: o.giftMessage,
      address: o.address || {},
      deliveryTier: o.deliveryTier || 'insured_express',
      paymentMethod: o.paymentMethod || 'SECURE_ESCROW',
      status: (o.status || 'CONFIRMED').toLowerCase() as any
    }));
  }
  return [];
}

export async function getOrderById(orderId: string): Promise<OrderRecord | null> {
  const res = await apiClient.get<any>(`/orders/${orderId}`);
  if (res && res.data) {
    const o = res.data;
    return {
      orderId: o.orderNumber || o.orderId,
      certificateId: o.certificateNumber || o.certificateId || 'CERT-AUTHENTIC',
      createdAt: o.placedAt || o.createdAt,
      items: o.items || [],
      subtotal: Number(o.subtotalAmount ?? o.subtotal ?? 0),
      discount: Number(o.discountAmount ?? o.discount ?? 0),
      shippingFee: Number(o.shippingFee ?? 0),
      total: Number(o.totalAmount ?? o.total ?? 0),
      isGiftWrapped: Boolean(o.isGiftWrapped),
      giftMessage: o.giftMessage,
      address: o.address || {},
      deliveryTier: o.deliveryTier || 'insured_express',
      paymentMethod: o.paymentMethod || 'SECURE_ESCROW',
      status: (o.status || 'CONFIRMED').toLowerCase() as any
    };
  }
  return null;
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
