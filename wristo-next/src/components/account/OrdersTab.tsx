'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FileText, Check, Gift, ArrowRight, ShieldCheck } from 'lucide-react';
import { OrderRecord } from '@/types/order';

interface OrdersTabProps {
  orders: OrderRecord[];
  onViewCertificate: (order: OrderRecord) => void;
}

export default function OrdersTab({ orders, onViewCertificate }: OrdersTabProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'dispatched'>('all');

  const filteredOrders = orders.filter(o => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  return (
    <div className="account-orders-content">
      <div className="account-orders-header">
        <div>
          <h2 className="account-section-title">Acquisition Register &amp; Provenance Ledger</h2>
          <p className="account-section-subtitle">
            All registered acquisitions with verified horological certificates and tamper-evident courier dispatch telemetry.
          </p>
        </div>

        {/* Status Filter Chips */}
        <div className="account-filter-chips">
          <button
            type="button"
            className={`account-chip ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All Registrations ({orders.length})
          </button>
          <button
            type="button"
            className={`account-chip ${statusFilter === 'confirmed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('confirmed')}
          >
            Confirmed &amp; Secured
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="account-orders-empty">
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(176, 141, 107, 0.1)',
            color: 'var(--brand-bronze)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <FileText size={28} strokeWidth={1.5} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', marginBottom: '8px' }}>
            No Acquisitions Found
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', maxWidth: '440px', margin: '0 auto 24px' }}>
            There are no recorded orders matching this filter. Explore our 40-piece archive to secure an authentic timepiece.
          </p>
          <Link href="/watches" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span>Explore Master Archive</span>
            <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </div>
      ) : (
        <div className="account-orders-list">
          {filteredOrders.map(order => (
            <div key={order.orderId} className="account-order-card">
              {/* Order Card Head */}
              <div className="account-order-card-head">
                <div className="account-order-id-block">
                  <span className="account-order-num tabular-nums">{order.orderId}</span>
                  <span className="account-order-cert-pill tabular-nums" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <FileText size={12} strokeWidth={1.5} />
                    <span>{order.certificateId}</span>
                  </span>
                </div>
                <div className="account-order-head-right">
                  <span className="account-order-date-text">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                  <span className="account-order-status confirmed" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <Check size={12} strokeWidth={2.5} />
                    <span>Secured &amp; Inspected</span>
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="account-order-items-grid">
                {order.items.map((item, idx) => (
                  <div key={idx} className="account-order-item-tile">
                    <div className="account-order-item-img">
                      <Image
                        src={item.image}
                        alt={item.model}
                        fill
                        sizes="64px"
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    <div className="account-order-item-meta">
                      <span className="account-order-item-brand">{item.brand}</span>
                      <span className="account-order-item-model">{item.model}</span>
                      <span className="account-order-item-price-qty tabular-nums">
                        Qty: {item.quantity} &bull; ₹{item.price.toLocaleString('en-IN')} each
                      </span>
                    </div>
                    <div className="account-order-item-total tabular-nums">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Meta Strip */}
              <div className="account-order-details-strip">
                <div>
                  <span className="account-order-detail-label">Destination</span>
                  <span className="account-order-detail-val">
                    {order.address.fullName}, {order.address.city}, {order.address.state} ({order.address.pincode})
                  </span>
                </div>
                <div>
                  <span className="account-order-detail-label">Transit Protocol</span>
                  <span className="account-order-detail-val">
                    {order.deliveryTier === 'white_glove' ? 'White-Glove Hand Courier' : 'Complimentary Insured Air Express'}
                  </span>
                </div>
                <div>
                  <span className="account-order-detail-label">Settlement</span>
                  <span className="account-order-detail-val" style={{ textTransform: 'uppercase' }}>
                    {order.paymentMethod}
                  </span>
                </div>
                <div>
                  <span className="account-order-detail-label">Total Amount</span>
                  <span className="account-order-detail-val total tabular-nums">
                    ₹{order.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Gift message banner if present */}
              {order.isGiftWrapped && order.giftMessage && (
                <div className="account-order-gift-banner" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Gift size={15} strokeWidth={1.5} color="var(--brand-bronze)" />
                  <span>
                    <strong>Bespoke Gift Note:</strong> &ldquo;{order.giftMessage}&rdquo;
                  </span>
                </div>
              )}

              {/* Card Footer Actions */}
              <div className="account-order-actions">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => onViewCertificate(order)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <FileText size={13} strokeWidth={1.5} />
                  <span>View Provenance Certificate</span>
                </button>
                <Link
                  href={`/checkout/success?orderId=${order.orderId}`}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>View Receipt</span>
                  <ArrowRight size={13} strokeWidth={1.5} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
