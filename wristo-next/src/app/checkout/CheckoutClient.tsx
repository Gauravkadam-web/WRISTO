'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { CustomerAddress, DeliveryTier, PaymentMethodType } from '@/types/order';
import { createOrder, DELIVERY_OPTIONS } from '@/services/orderService';
import { PRODUCTS } from '@/data/products';
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import CheckoutStepper from '@/components/checkout/CheckoutStepper';
import AddressStep from '@/components/checkout/AddressStep';
import DeliveryStep from '@/components/checkout/DeliveryStep';
import PaymentStep from '@/components/checkout/PaymentStep';
import ReviewStep from '@/components/checkout/ReviewStep';
import OrderSummarySidebar from '@/components/checkout/OrderSummarySidebar';

export default function CheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get('step');
  const initialStep = stepParam ? Math.min(4, Math.max(1, parseInt(stepParam, 10))) : 1;

  const {
    cartProducts: realCartProducts,
    totals: realTotals,
    appliedCoupon,
    isGiftWrapped,
    giftMessage,
    clearCart
  } = useCart();

  // If testing with ?step=X and cart is empty, provide demo fallback items so that steps 1-4 can be previewed
  const isDemoPreview = initialStep > 1 && realCartProducts.length === 0;
  const cartProducts = isDemoPreview
    ? [
        {
          productId: 'WRT-001',
          model: 'Atlas Black',
          brand: 'AUREN',
          price: 4999,
          quantity: 1,
          image: '/assets/products/watch-01.png',
          product: PRODUCTS[0]
        },
        {
          productId: 'WRT-005',
          model: 'Regent Green',
          brand: 'AUREN',
          price: 14999,
          quantity: 1,
          image: '/assets/products/watch-05.png',
          product: PRODUCTS[4]
        }
      ]
    : realCartProducts;

  const totals = isDemoPreview
    ? {
        subtotal: 19998,
        discount: 2000,
        shippingFee: 0,
        total: 17998,
        giftPouchThreshold: 15000,
        amountNeededForGiftPouch: 0,
        giftPouchUnlocked: true
      }
    : realTotals;

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [isPlacing, setIsPlacing] = useState(false);

  const [address, setAddress] = useState<CustomerAddress>({
    fullName: initialStep > 1 ? 'Aditya Vikram Singhania' : '',
    email: initialStep > 1 ? 'aditya.singhania@horology.com' : '',
    phone: initialStep > 1 ? '9820198201' : '',
    pincode: initialStep > 1 ? '400001' : '',
    addressLine1: initialStep > 1 ? 'Penthouse 12, Altamount Towers, Altamount Road' : '',
    addressLine2: '',
    city: initialStep > 1 ? 'Mumbai' : '',
    state: initialStep > 1 ? 'Maharashtra' : '',
    landmark: 'Near Royal Opera House',
    deliveryNotes: 'Please ring private security reception.'
  });

  const [deliveryTier, setDeliveryTier] = useState<DeliveryTier>(
    initialStep >= 3 ? 'white_glove' : 'insured_express'
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(
    initialStep >= 4 ? 'cod' : 'upi'
  );

  const selectedDelivery = DELIVERY_OPTIONS.find(d => d.id === deliveryTier);
  const deliveryFee = selectedDelivery ? selectedDelivery.price : 0;
  const finalCalculatedTotal = Math.max(0, totals.subtotal - totals.discount + deliveryFee);

  const handleUpdateAddress = (updated: Partial<CustomerAddress>) => {
    setAddress(prev => ({ ...prev, ...updated }));
  };

  const handlePlaceOrder = async () => {
    setIsPlacing(true);
    try {
      const order = await createOrder({
        items: cartProducts.map(cp => ({
          productId: cp.productId,
          model: cp.model,
          brand: cp.brand,
          price: cp.price,
          quantity: cp.quantity,
          image: cp.image
        })),
        address,
        deliveryTier,
        paymentMethod,
        coupon: appliedCoupon || (isDemoPreview ? {
          code: 'WRISTO10',
          description: '10% Horological Privilege Discount',
          discountType: 'percentage',
          discountValue: 10,
          calculatedDiscount: 2000
        } : undefined),
        isGiftWrapped,
        giftMessage: isGiftWrapped ? giftMessage : undefined
      });

      // Clear shopping bag after order is registered
      clearCart();

      // Navigate to order confirmation
      router.push(`/checkout/success?orderId=${order.orderId}`);
    } catch {
      alert('An unexpected error occurred while securing your timepiece. Please try again.');
      setIsPlacing(false);
    }
  };

  // If bag is empty and not in demo preview and not placing order
  if (cartProducts.length === 0 && !isPlacing) {
    return (
      <div className="checkout-page-wrapper">
        <CheckoutHeader />
        <div className="checkout-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🛍️</div>
          <h1 className="checkout-card-title" style={{ fontSize: '32px', marginBottom: '12px' }}>
            Your Shopping Bag is Empty
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', maxWidth: '480px', margin: '0 auto 28px' }}>
            There are no timepieces currently in your shopping bag. Explore our 40-piece master collection to begin your acquisition.
          </p>
          <Link href="/watches" className="btn btn-primary btn-lg">
            Explore Curated Watches &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page-wrapper">
      <CheckoutHeader />

      <main className="checkout-container">
        <CheckoutStepper currentStep={currentStep} />

        <div className="checkout-main-grid">
          {/* Active Step Panel */}
          <div className="checkout-steps-col">
            {currentStep === 1 && (
              <AddressStep
                address={address}
                onChange={handleUpdateAddress}
                onNext={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 2 && (
              <DeliveryStep
                selectedDelivery={deliveryTier}
                onSelect={setDeliveryTier}
                onNext={() => setCurrentStep(3)}
                onBack={() => setCurrentStep(1)}
              />
            )}

            {currentStep === 3 && (
              <PaymentStep
                selectedPayment={paymentMethod}
                onSelect={setPaymentMethod}
                onNext={() => setCurrentStep(4)}
                onBack={() => setCurrentStep(2)}
                totalAmount={finalCalculatedTotal}
              />
            )}

            {currentStep === 4 && (
              <ReviewStep
                address={address}
                deliveryTier={deliveryTier}
                paymentMethod={paymentMethod}
                isGiftWrapped={isGiftWrapped}
                giftMessage={giftMessage}
                totalAmount={finalCalculatedTotal}
                onEditStep={step => setCurrentStep(step)}
                onPlaceOrder={handlePlaceOrder}
                onBack={() => setCurrentStep(3)}
                isPlacing={isPlacing}
              />
            )}
          </div>

          {/* Sticky Order Summary Sidebar */}
          <div className="checkout-summary-col">
            <OrderSummarySidebar
              deliveryTier={deliveryTier}
              items={cartProducts}
              totals={totals}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
