'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Watch,
  FileText,
  Sparkles,
  Check,
  Phone,
  Mail,
  ArrowRight,
  Award
} from 'lucide-react';
import { CollectorProfile } from '@/types/account';
import { OrderRecord } from '@/types/order';

interface OverviewTabProps {
  profile: CollectorProfile;
  orders: OrderRecord[];
  wishlistCount: number;
  onNavigateTab: (tab: 'orders' | 'addresses' | 'wishlist' | 'settings') => void;
  onViewCertificate: (order: OrderRecord) => void;
}

export default function OverviewTab({
  profile,
  orders,
  wishlistCount,
  onNavigateTab,
  onViewCertificate
}: OverviewTabProps) {
  const latestOrder = orders.length > 0 ? orders[0] : null;
  const totalPiecesAcquired = orders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
    0
  );

  return (
    <div className="account-overview-content">
      {/* 3 Vault Metrics Grid */}
      <div className="account-kpi-grid">
        <div className="account-kpi-card">
          <div className="account-kpi-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Watch size={22} strokeWidth={1.5} color="var(--brand-bronze)" />
          </div>
          <div className="account-kpi-info">
            <div className="account-kpi-val">{totalPiecesAcquired}</div>
            <div className="account-kpi-label">Acquired Timepieces</div>
          </div>
          <button
            type="button"
            className="account-kpi-link"
            onClick={() => onNavigateTab('orders')}
          >
            View Register &rarr;
          </button>
        </div>

        <div className="account-kpi-card">
          <div className="account-kpi-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={22} strokeWidth={1.5} color="var(--brand-bronze)" />
          </div>
          <div className="account-kpi-info">
            <div className="account-kpi-val">{orders.length}</div>
            <div className="account-kpi-label">Registered Provenances</div>
          </div>
          <button
            type="button"
            className="account-kpi-link"
            onClick={() => onNavigateTab('orders')}
          >
            Certificates &rarr;
          </button>
        </div>

        <div className="account-kpi-card">
          <div className="account-kpi-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={22} strokeWidth={1.5} color="var(--brand-bronze)" />
          </div>
          <div className="account-kpi-info">
            <div className="account-kpi-val">{wishlistCount}</div>
            <div className="account-kpi-label">Pieces in Private Vault</div>
          </div>
          <button
            type="button"
            className="account-kpi-link"
            onClick={() => onNavigateTab('wishlist')}
          >
            Explore Vault &rarr;
          </button>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="account-overview-split">
        {/* Left Column: Recent Acquisition Spotlight */}
        <div className="account-spotlight-card">
          <div className="account-section-head">
            <h2 className="account-section-title">Latest Vault Acquisition</h2>
            {orders.length > 1 && (
              <button
                type="button"
                className="account-text-btn"
                onClick={() => onNavigateTab('orders')}
              >
                View all ({orders.length}) &rarr;
              </button>
            )}
          </div>

          {latestOrder ? (
            <div className="account-recent-order-box">
              <div className="account-recent-order-top">
                <div>
                  <div className="account-order-ref">Order: {latestOrder.orderId}</div>
                  <div className="account-order-date">
                    Acquired on {new Date(latestOrder.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
                <span className="account-order-status confirmed" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <Check size={12} strokeWidth={2.5} />
                  <span>{latestOrder.status.toUpperCase()}</span>
                </span>
              </div>

              {/* Items in latest order */}
              <div className="account-recent-items">
                {latestOrder.items.map((item, i) => (
                  <div key={i} className="account-recent-item-row">
                    <div className="account-recent-item-thumb">
                      <Image
                        src={item.image}
                        alt={item.model}
                        fill
                        sizes="56px"
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    <div className="account-recent-item-info">
                      <div className="account-recent-item-brand">{item.brand}</div>
                      <div className="account-recent-item-model">{item.model}</div>
                      <div className="account-recent-item-qty">Qty: {item.quantity}</div>
                    </div>
                    <div className="account-recent-item-price">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              <div className="account-recent-order-actions">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => onViewCertificate(latestOrder)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Award size={14} strokeWidth={1.5} />
                  <span>View Provenance Certificate</span>
                </button>
                <Link
                  href={`/checkout/success?orderId=${latestOrder.orderId}`}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>View Receipt</span>
                  <ArrowRight size={13} strokeWidth={1.5} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="account-empty-spotlight">
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(176, 141, 107, 0.1)',
                color: 'var(--brand-bronze)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
              }}>
                <Watch size={26} strokeWidth={1.5} />
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
                Your horological collection has not yet begun. Browse our 40-piece master archive to select your inaugural timepiece.
              </p>
              <Link href="/watches" className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span>Explore Master Catalog</span>
                <ArrowRight size={13} strokeWidth={1.5} />
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Private Concierge & VIP Privileges */}
        <div className="account-privileges-card">
          <div className="account-section-head">
            <h2 className="account-section-title">Patron Concierge Service</h2>
          </div>

          <p className="account-privileges-desc">
            As a <strong>{profile.vipTier}</strong>, you enjoy dedicated 24/7 private concierge support, complimentary white-glove inspection, and prioritized access to limited-edition complications.
          </p>

          <div className="account-concierge-contact-box">
            <div className="account-concierge-row">
              <span className="account-concierge-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
                <Phone size={15} strokeWidth={1.5} />
              </span>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Dedicated Line</div>
                <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>+91 (800) 974-786</div>
              </div>
            </div>
            <div className="account-concierge-row">
              <span className="account-concierge-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
                <Mail size={15} strokeWidth={1.5} />
              </span>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Private Desk</div>
                <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>concierge@wristo.com</div>
              </div>
            </div>
          </div>

          <div className="account-perks-list">
            <div className="account-perk-item">
              <Check size={14} strokeWidth={2} color="var(--brand-bronze)" />
              <span>Complimentary insured domestic &amp; international vault courier</span>
            </div>
            <div className="account-perk-item">
              <Check size={14} strokeWidth={2} color="var(--brand-bronze)" />
              <span>Bespoke wrist calibration &amp; custom sizing before shipment</span>
            </div>
            <div className="account-perk-item">
              <Check size={14} strokeWidth={2} color="var(--brand-bronze)" />
              <span>Complimentary serialized leather travel pouch on eligible acquisitions</span>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-outline"
            style={{ width: '100%', marginTop: '20px' }}
            onClick={() => onNavigateTab('settings')}
          >
            Calibrate Wrist Sizing Profile &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
