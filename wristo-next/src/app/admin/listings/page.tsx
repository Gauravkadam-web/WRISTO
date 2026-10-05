'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Watch,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { AdminListing } from '@/types/admin';
import ListingApprovalModal from '@/components/admin/ListingApprovalModal';

export default function AdminListingsPage() {
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<AdminListing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<AdminListing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadListings = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getListings();
      setListings(data);
      setFilteredListings(data);
    } catch (err) {
      console.error('Failed to load listings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  useEffect(() => {
    let result = [...listings];

    if (statusFilter !== 'ALL') {
      result = result.filter((l) => l.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.brand.toLowerCase().includes(q) ||
          l.model.toLowerCase().includes(q) ||
          l.referenceNumber.toLowerCase().includes(q)
      );
    }

    setFilteredListings(result);
  }, [searchQuery, statusFilter, listings]);

  const handleOpenModeration = (listing: AdminListing) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  const handleUpdateApproval = async (
    listingId: string,
    status: 'APPROVED' | 'REJECTED' | 'PENDING',
    rejectionReason?: string
  ) => {
    await adminService.updateListingApproval(listingId, status, rejectionReason);
    await loadListings();
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
        return 'danger';
      default:
        return 'neutral';
    }
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
            Marketplace Watch Moderation & Stock
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted, #8A8A8A)' }}>
            Authenticate timepiece provenance, inspect dealer listings, and manage WRISTO live catalog availability.
          </p>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="admin-card">
        {/* Toolbar */}
        <div className="admin-table-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
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
                placeholder="Search by brand, model, or reference #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-search-input"
                style={{ paddingLeft: '34px', minWidth: '300px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={14} strokeWidth={1.5} color="var(--brand-bronze)" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="admin-form-select"
                style={{ padding: '7px 12px', fontSize: '12px' }}
              >
                <option value="ALL">All Statuses</option>
                <option value="APPROVED">APPROVED (Live)</option>
                <option value="PENDING">PENDING (Inspection)</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Showing <strong>{filteredListings.length}</strong> of {listings.length} timepieces
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Timepiece</th>
                <th>Reference #</th>
                <th>Condition & Year</th>
                <th>Asking Price</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)' }}>
                    Loading horological catalog...
                  </td>
                </tr>
              ) : filteredListings.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)' }}>
                    No timepiece listings match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredListings.map((listing) => (
                  <tr key={listing.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '4px',
                          background: '#0F0F0F',
                          backgroundImage: `url(${listing.images?.[0] || '/assets/watches/watch-patek-5711.png'})`,
                          backgroundSize: 'contain',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          flexShrink: 0
                        }} />
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--brand-ivory)' }}>
                            {listing.brand} {listing.model}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                            {listing.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        color: 'var(--brand-bronze)',
                        fontWeight: 600
                      }}>
                        {listing.referenceNumber}
                      </span>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--brand-ivory)' }}>
                          {listing.condition}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                          {listing.year || '2023'}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--color-accent-champagne)', fontSize: '14px' }}>
                        {formatCurrency(listing.price)}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill ${getStatusClass(listing.status)}`}>
                        {listing.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <Link
                          href={`/products/${listing.id}`}
                          target="_blank"
                          className="admin-action-btn"
                          title="View Live PDP"
                        >
                          <ExternalLink size={13} strokeWidth={1.5} />
                        </Link>
                        <button
                          onClick={() => handleOpenModeration(listing)}
                          className="admin-btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '11.5px' }}
                        >
                          <ShieldCheck size={12} strokeWidth={1.5} />
                          <span>Moderate</span>
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

      {/* Moderation Modal */}
      <ListingApprovalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUpdateApproval}
        listing={selectedListing}
      />
    </div>
  );
}
