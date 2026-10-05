'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  Search,
  CheckCircle,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  Star,
  MapPin,
  Building
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { AdminSeller } from '@/types/admin';
import SellerReviewModal from '@/components/admin/SellerReviewModal';

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<AdminSeller[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<AdminSeller[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSeller, setSelectedSeller] = useState<AdminSeller | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadSellers = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getSellers();
      setSellers(data);
      setFilteredSellers(data);
    } catch (err) {
      console.error('Failed to load sellers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSellers();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSellers(sellers);
      return;
    }
    const q = searchQuery.toLowerCase();
    setFilteredSellers(
      sellers.filter(
        (s) =>
          s.boutiqueName.toLowerCase().includes(q) ||
          s.sellerName.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q) ||
          s.country.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, sellers]);

  const handleOpenReview = (seller: AdminSeller) => {
    setSelectedSeller(seller);
    setIsModalOpen(true);
  };

  const handleSaveVerification = async (sellerId: string, isVerified: boolean, notes?: string) => {
    await adminService.updateSellerVerification(sellerId, isVerified, notes);
    await loadSellers();
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
            Verified Sellers & Brand Authorizations
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted, #8A8A8A)' }}>
            Authenticate luxury watch dealers, manage brand dealership rights, and track commission rates.
          </p>
        </div>
      </div>

      {/* Main Table Card */}
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
              placeholder="Search boutique by name, dealer, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-search-input"
              style={{ paddingLeft: '34px', minWidth: '300px' }}
            />
          </div>

          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Showing <strong>{filteredSellers.length}</strong> verified boutiques
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Boutique & Jurisdiction</th>
                <th>Dealer Contact</th>
                <th>Authorized Brands</th>
                <th>Reputation</th>
                <th>Fee Tier</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)' }}>
                    Loading boutique roster...
                  </td>
                </tr>
              ) : filteredSellers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)' }}>
                    No luxury sellers match your search query.
                  </td>
                </tr>
              ) : (
                filteredSellers.map((seller) => (
                  <tr key={seller.id}>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--brand-ivory)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Building size={14} strokeWidth={1.5} color="var(--color-accent-champagne)" />
                          <span>{seller.boutiqueName}</span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <MapPin size={11} strokeWidth={1.5} />
                          <span>{seller.city}, {seller.country}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 500 }}>{seller.sellerName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{seller.email}</div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '240px' }}>
                        {seller.authorizedBrands.map((b, idx) => (
                          <span key={idx} style={{
                            fontSize: '10px',
                            fontWeight: 600,
                            color: 'var(--brand-bronze)',
                            background: 'rgba(176, 141, 107, 0.1)',
                            padding: '2px 6px',
                            borderRadius: '3px',
                            border: '1px solid rgba(176, 141, 107, 0.2)'
                          }}>
                            {b}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: 'var(--color-accent-champagne)' }}>
                        <Star size={13} strokeWidth={2} fill="currentColor" />
                        <span>{seller.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--brand-ivory)' }}>
                        {seller.commissionRate}%
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill ${seller.isVerified ? 'success' : 'warning'}`}>
                        {seller.isVerified ? 'Verified' : 'Pending Audit'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleOpenReview(seller)}
                        className="admin-btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '11.5px' }}
                      >
                        <ShieldCheck size={12} strokeWidth={1.5} />
                        <span>Audit KYC</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seller Review Modal */}
      <SellerReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveVerification}
        seller={selectedSeller}
      />
    </div>
  );
}
