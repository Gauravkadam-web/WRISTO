'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { OrderRecord } from '@/types/order';
import { getLatestOrder, getOrderById } from '@/services/orderService';
import CheckoutHeader from '@/components/checkout/CheckoutHeader';

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const demoParam = searchParams.get('demo');

  useEffect(() => {
    async function load() {
      if (orderId === 'demo' || demoParam === 'true') {
        const demoOrder: OrderRecord = {
          orderId: 'WRT-2026-88492',
          certificateId: 'CERT-CHRONO-99412',
          createdAt: new Date().toISOString(),
          items: [
            {
              productId: 'WRT-001',
              model: 'Atlas Black',
              brand: 'AUREN',
              price: 4999,
              quantity: 1,
              image: '/assets/products/watch-01.png'
            },
            {
              productId: 'WRT-005',
              model: 'Regent Green',
              brand: 'AUREN',
              price: 14999,
              quantity: 1,
              image: '/assets/products/watch-05.png'
            }
          ],
          subtotal: 19998,
          discount: 2000,
          shippingFee: 999,
          total: 18997,
          isGiftWrapped: true,
          giftMessage: 'To an extraordinary horological milestone. May time honor your legacy.',
          coupon: {
            code: 'WRISTO10',
            description: '10% privilege discount applied',
            discountType: 'percentage',
            discountValue: 10,
            calculatedDiscount: 2000
          },
          address: {
            fullName: 'Aditya Vikram Singhania',
            email: 'aditya.singhania@horology.com',
            phone: '9820198201',
            pincode: '400001',
            addressLine1: 'Penthouse 12, Altamount Towers, Altamount Road',
            addressLine2: '',
            city: 'Mumbai',
            state: 'Maharashtra',
            landmark: 'Near Royal Opera House',
            deliveryNotes: 'Please ring private security reception.'
          },
          deliveryTier: 'white_glove',
          paymentMethod: 'cod',
          status: 'confirmed'
        };
        setOrder(demoOrder);
        setLoading(false);
        return;
      }

      if (orderId) {
        const found = await getOrderById(orderId);
        if (found) {
          setOrder(found);
          setLoading(false);
          return;
        }
      }
      const latest = await getLatestOrder();
      setOrder(latest);
      setLoading(false);
    }
    load();
  }, [orderId, demoParam]);

  if (loading) {
    return (
      <div className="checkout-page-wrapper">
        <CheckoutHeader />
        <div style={{ textAlign: 'center', padding: '100px 20px', color: 'var(--color-text-secondary)' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
          <p>Retrieving Horological Provenance Ledger...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="checkout-page-wrapper">
        <CheckoutHeader />
        <div className="checkout-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h1 className="checkout-card-title" style={{ fontSize: '28px', marginBottom: '12px' }}>
            No Order Record Found
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
            We could not locate this acquisition session. Please check your order reference or browse our catalog.
          </p>
          <Link href="/watches" className="btn btn-primary">
            Explore Curated Watches &rarr;
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const estimatedArrivalDate = new Date(new Date(order.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="checkout-page-wrapper">
      <CheckoutHeader />

      <main className="checkout-success-wrap">
        <div className="success-hero-card">
          <div className="success-gold-seal">✓</div>
          <h1 className="success-order-title">Your Timepiece Has Been Secured</h1>
          <p className="success-order-subtitle">
            Our master horologists have reserved your selection and begun technical movement inspection prior to insured dispatch.
          </p>

          {/* Official Provenance Certificate Box */}
          <div className="provenance-certificate-card">
            <div className="provenance-card-header">
              <div className="provenance-heading">
                <span>📜</span>
                <span>Certificate of Provenance &amp; Order Register</span>
              </div>
              <div className="provenance-cert-id">
                {order.certificateId}
              </div>
            </div>

            <div className="provenance-grid">
              <div>
                <div className="provenance-item-label">Order Reference</div>
                <div className="provenance-item-val" style={{ fontFamily: 'monospace', fontSize: '15px' }}>
                  {order.orderId}
                </div>
              </div>

              <div>
                <div className="provenance-item-label">Acquisition Date</div>
                <div className="provenance-item-val">{formattedDate}</div>
              </div>

              <div>
                <div className="provenance-item-label">Inscribed Collector</div>
                <div className="provenance-item-val">{order.address.fullName}</div>
              </div>

              <div>
                <div className="provenance-item-label">Estimated Delivery</div>
                <div className="provenance-item-val" style={{ color: 'var(--color-success)' }}>
                  {estimatedArrivalDate}
                </div>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <div className="provenance-item-label">Insured Destination</div>
                <div className="provenance-item-val" style={{ fontWeight: 400 }}>
                  {order.address.addressLine1}, {order.address.city}, {order.address.state} — {order.address.pincode}
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Order List */}
          <div style={{
            textAlign: 'left',
            padding: '20px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border-light)',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '18px',
              fontWeight: 600,
              marginBottom: '16px',
              borderBottom: '1px solid var(--color-border-light)',
              paddingBottom: '8px'
            }}>
              Acquired Horological Pieces ({order.items.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {order.items.map(item => (
                <div key={item.productId} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    position: 'relative',
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#F8F6F2',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}>
                    <Image
                      src={item.image}
                      alt={item.model}
                      fill
                      sizes="60px"
                      style={{ objectFit: 'contain', padding: '4px' }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                      {item.brand}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {item.model}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                      Qty: {item.quantity} &times; ₹{item.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              borderTop: '1px solid var(--color-border-light)',
              marginTop: '16px',
              paddingTop: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline'
            }}>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Total Settlement</span>
              <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                ₹{order.total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="success-actions-row">
            <button
              type="button"
              onClick={() => window.print()}
              className="btn btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <span>🖨️</span>
              <span>Print Certificate &amp; Receipt</span>
            </button>

            <Link href="/watches" className="btn btn-primary">
              Explore More Watches &rarr;
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
