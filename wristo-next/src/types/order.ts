export interface CustomerAddress {
  fullName: string;
  email: string;
  phone: string;
  pincode: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  landmark?: string;
  deliveryNotes?: string;
}

export type DeliveryTier = 'insured_express' | 'white_glove';

export interface DeliveryOption {
  id: DeliveryTier;
  title: string;
  description: string;
  estimatedDelivery: string;
  price: number;
  badge?: string;
}

export type PaymentMethodType = 'razorpay' | 'upi' | 'card' | 'netbanking' | 'cod';

export interface PaymentOption {
  id: PaymentMethodType;
  title: string;
  subtitle: string;
  badge?: string;
}

export interface AppliedCoupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  calculatedDiscount: number;
}

export interface OrderCartItem {
  productId: string;
  model: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderTotals {
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  giftPouchThreshold: number;
  amountNeededForGiftPouch: number;
  giftPouchUnlocked: boolean;
}

export type OrderStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'processing'
  | 'processing_vault'
  | 'dispatched'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface OrderRecord {
  orderId: string;
  certificateId: string;
  createdAt: string;
  items: OrderCartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  isGiftWrapped: boolean;
  giftMessage?: string;
  coupon?: AppliedCoupon;
  address: CustomerAddress;
  deliveryTier: DeliveryTier;
  paymentMethod: PaymentMethodType;
  status: OrderStatus;
}

export interface CreateOrderPayload {
  items: OrderCartItem[];
  address: CustomerAddress;
  deliveryTier: DeliveryTier;
  paymentMethod: PaymentMethodType;
  coupon?: AppliedCoupon;
  isGiftWrapped: boolean;
  giftMessage?: string;
  paymentTransactionId?: string;
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  gatewaySignature?: string;
}
