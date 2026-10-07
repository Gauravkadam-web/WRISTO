'use client';

import React, { useEffect, useState } from 'react';
import {
  Tag,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Percent,
  IndianRupee
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { AdminCoupon } from '@/types/admin';
import CouponModal from '@/components/admin/CouponModal';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [filteredCoupons, setFilteredCoupons] = useState<AdminCoupon[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [couponToEdit, setCouponToEdit] = useState<AdminCoupon | null>(null);

  const loadCoupons = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getCoupons();
      setCoupons(data);
      setFilteredCoupons(data);
    } catch (err) {
      console.error('Failed to load coupons:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCoupons(coupons);
      return;
    }
    const q = searchQuery.toLowerCase();
    setFilteredCoupons(
      coupons.filter(
        (c) =>
          c.code.toLowerCase().includes(q) ||
          c.discountType.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, coupons]);

  const handleOpenCreate = () => {
    setCouponToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (coupon: AdminCoupon) => {
    setCouponToEdit(coupon);
    setIsModalOpen(true);
  };

  const handleSaveCoupon = async (couponData: Partial<AdminCoupon>) => {
    await adminService.saveCoupon(couponData);
    await loadCoupons();
  };

  const handleToggleActive = async (coupon: AdminCoupon) => {
    await adminService.saveCoupon({
      ...coupon,
      active: !coupon.active
    });
    await loadCoupons();
  };

  const handleDeleteCoupon = async (id: string) => {
    if (window.confirm('Are you sure you wish to decommission this privilege code?')) {
      await adminService.deleteCoupon(id);
      await loadCoupons();
    }
  };

  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null) return '—';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '26px',
            fontWeight: 500,
            color: 'var(--brand-ivory, #F7F3EC)',
            marginBottom: '4px'
          }}>
            Promotions & Privilege Codes
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted, #8A8A8A)' }}>
            Configure bespoke acquisition concessions, minimum cart thresholds, and VIP customer codes.
          </p>
        </div>

        <button onClick={handleOpenCreate} className="admin-btn-primary">
          <Plus size={15} strokeWidth={2} />
          <span>New Privilege Code</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="admin-card">
        {/* Toolbar */}
        <div className="admin-table-toolbar">
          <div style={{ position: 'relative' }}>
            <Search size={14} strokeWidth={1.5} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)'
            }} />
            <input
              type="text"
              placeholder="Search by code (e.g. VIP10)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-search-input"
              style={{ paddingLeft: '34px' }}
            />
          </div>

          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Showing <strong>{filteredCoupons.length}</strong> privilege codes
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Privilege Code</th>
                <th>Discount Benefit</th>
                <th>Spend Threshold</th>
                <th>Validity Window</th>
                <th>Usage</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)' }}>
                    Loading promotional campaigns...
                  </td>
                </tr>
              ) : filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)' }}>
                    No privilege codes found.
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => (
                  <tr key={coupon.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontFamily: 'monospace',
                          fontSize: '13px',
                          fontWeight: 700,
                          color: 'var(--brand-ivory)',
                          background: 'rgba(255, 255, 255, 0.05)',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                          {coupon.code}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="tabular-nums" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--color-accent-champagne)' }}>
                        {coupon.discountType === 'PERCENTAGE' ? (
                          <>
                            <Percent size={13} strokeWidth={2} />
                            <span>{coupon.discountValue}% OFF</span>
                          </>
                        ) : (
                          <>
                            <IndianRupee size={13} strokeWidth={2} />
                            <span>{formatCurrency(coupon.discountValue)} OFF</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="tabular-nums" style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)' }}>
                        Min {formatCurrency(coupon.minOrderAmount ?? coupon.minSubtotal ?? 0)}
                      </span>
                    </td>
                    <td>
                      <div className="tabular-nums" style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
                        {coupon.validFrom || (coupon.startsAt ? coupon.startsAt.split('T')[0] : '2026-01-01')} → {coupon.validUntil || (coupon.expiresAt ? coupon.expiresAt.split('T')[0] : '2026-12-31')}
                      </div>
                    </td>
                    <td>
                      <span className="tabular-nums" style={{ fontSize: '12px', fontWeight: 500 }}>
                        {coupon.usedCount ?? coupon.timesUsed ?? 0} / {coupon.usageLimit || '∞'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill ${coupon.active !== false && coupon.isActive !== false ? 'success' : 'neutral'}`}>
                        {coupon.active !== false && coupon.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => handleToggleActive(coupon)}
                          className="admin-action-btn"
                          title={coupon.active !== false && coupon.isActive !== false ? 'Deactivate Code' : 'Activate Code'}
                        >
                          {coupon.active !== false && coupon.isActive !== false ? <XCircle size={13} strokeWidth={1.5} /> : <CheckCircle size={13} strokeWidth={1.5} />}
                        </button>
                        <button
                          onClick={() => handleOpenEdit(coupon)}
                          className="admin-action-btn"
                          title="Edit Code"
                        >
                          <Edit2 size={13} strokeWidth={1.5} />
                        </button>
                        <button
                          onClick={() => handleDeleteCoupon(coupon.id)}
                          className="admin-action-btn"
                          title="Delete Code"
                          style={{ color: '#E57373' }}
                        >
                          <Trash2 size={13} strokeWidth={1.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coupon Modal */}
      <CouponModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCoupon}
        couponToEdit={couponToEdit}
      />
    </div>
  );
}
