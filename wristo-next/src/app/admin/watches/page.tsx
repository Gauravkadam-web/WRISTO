'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Clock,
  Search,
  Filter,
  Plus,
  Edit2,
  Box,
  Eye,
  CheckCircle,
  XCircle,
  Archive,
  Layers,
  Sparkles,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { AdminWatch, SaveWatchPayload } from '@/types/admin';
import WatchEditorModal from '@/components/admin/WatchEditorModal';

export default function AdminWatchesPage() {
  const [watches, setWatches] = useState<AdminWatch[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'ARCHIVED'>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWatch, setSelectedWatch] = useState<AdminWatch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const loadWatches = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getAdminWatches();
      setWatches(data.items);
    } catch (err) {
      console.error('Failed to load admin watches:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWatches();
  }, []);

  const distinctBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    watches.forEach((w) => {
      if (w.brand) brandsSet.add(w.brand);
    });
    return Array.from(brandsSet).sort();
  }, [watches]);

  const filteredWatches = useMemo(() => {
    return watches.filter((w) => {
      if (selectedBrand !== 'ALL' && w.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }

      if (statusFilter === 'ACTIVE' && !w.isActive) {
        return false;
      }
      if (statusFilter === 'ARCHIVED' && w.isActive) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesModel = w.model.toLowerCase().includes(q);
        const matchesBrand = w.brand.toLowerCase().includes(q);
        const matchesId = w.id.toLowerCase().includes(q);
        const matchesNum = String(w.num).toLowerCase().includes(q);
        return matchesModel || matchesBrand || matchesId || matchesNum;
      }

      return true;
    });
  }, [watches, selectedBrand, statusFilter, searchQuery]);

  // Executive KPI calculations
  const totalCount = watches.length;
  const activeCount = watches.filter((w) => w.isActive).length;
  const models3dCount = watches.filter((w) => w.assets3d?.has3dModel || Boolean(w.assets3d?.modelUrl)).length;
  const lowStockCount = watches.filter((w) => w.stockCount <= 5).length;

  const handleOpenCreateModal = () => {
    setSelectedWatch(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (watch: AdminWatch) => {
    setSelectedWatch(watch);
    setIsModalOpen(true);
  };

  const handleSaveWatch = async (payload: SaveWatchPayload) => {
    if (selectedWatch) {
      await adminService.updateAdminWatch(selectedWatch.id, payload);
      setActionSuccessMessage(`Timepiece "${payload.model}" updated successfully.`);
    } else {
      await adminService.createAdminWatch(payload);
      setActionSuccessMessage(`New timepiece "${payload.model}" curated into master catalog.`);
    }
    await loadWatches();
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean, modelName: string) => {
    try {
      await adminService.toggleAdminWatchStatus(id);
      await loadWatches();
      setActionSuccessMessage(`Timepiece "${modelName}" ${!currentStatus ? 'activated in storefront' : 'deactivated to draft'}.`);
      setTimeout(() => setActionSuccessMessage(null), 4000);
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleDeleteWatch = async (id: string, modelName: string) => {
    if (!confirm(`Are you sure you wish to archive timepiece "${modelName}"? It will be removed from public storefront displays.`)) {
      return;
    }
    try {
      await adminService.deleteAdminWatch(id);
      await loadWatches();
      setActionSuccessMessage(`Timepiece "${modelName}" archived.`);
      setTimeout(() => setActionSuccessMessage(null), 4000);
    } catch (err) {
      console.error('Failed to archive watch:', err);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '26px',
              fontWeight: 500,
              color: 'var(--brand-ivory, #F7F3EC)',
              marginBottom: '4px'
            }}
          >
            Master Timepieces &amp; Catalog Management
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted, #8A8A8A)' }}>
            Govern canonical luxury watches, technical horology specifications, 3D CAD assets, and active storefront states.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="admin-btn admin-btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={16} strokeWidth={1.5} />
          <span>Acquire New Master Model</span>
        </button>
      </div>

      {actionSuccessMessage && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '8px',
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            color: '#4ADE80',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <CheckCircle size={16} strokeWidth={1.5} />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* KPI Highlights */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}
      >
        <div className="admin-stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted, #8A8A8A)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Master Models
            </span>
            <Layers size={18} strokeWidth={1.5} color="var(--brand-gold, #C5A059)" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 600, color: 'var(--brand-ivory, #F7F3EC)', marginTop: '8px' }}>
            {totalCount}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)', marginTop: '4px' }}>
            Canonical timepieces in registry
          </div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted, #8A8A8A)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Active in Storefront
            </span>
            <ShieldCheck size={18} strokeWidth={1.5} color="#4ADE80" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 600, color: '#4ADE80', marginTop: '8px' }}>
            {activeCount}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)', marginTop: '4px' }}>
            Discoverable across catalog &amp; search
          </div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted, #8A8A8A)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              3D CAD Models
            </span>
            <Box size={18} strokeWidth={1.5} color="var(--color-accent-champagne, #E8C89A)" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 600, color: 'var(--color-accent-champagne, #E8C89A)', marginTop: '8px' }}>
            {models3dCount}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)', marginTop: '4px' }}>
            Interactive WebGL 3D views available
          </div>
        </div>

        <div className="admin-stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted, #8A8A8A)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Vault Scarcity
            </span>
            <AlertTriangle size={18} strokeWidth={1.5} color="#FBBF24" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 600, color: '#FBBF24', marginTop: '8px' }}>
            {lowStockCount}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)', marginTop: '4px' }}>
            Timepieces with &le; 5 units remaining
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="admin-card">
        {/* Toolbar */}
        <div className="admin-table-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
            <div style={{ position: 'relative' }}>
              <Search
                size={14}
                strokeWidth={1.5}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)'
                }}
              />
              <input
                type="text"
                placeholder="Search by model, brand, or reference #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-search-input"
                style={{ paddingLeft: '34px', minWidth: '320px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={14} strokeWidth={1.5} color="var(--brand-gold, #C5A059)" />
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="admin-form-select"
                style={{ padding: '7px 12px', fontSize: '12px' }}
              >
                <option value="ALL">All Manufactures</option>
                {distinctBrands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="admin-form-select"
              style={{ padding: '7px 12px', fontSize: '12px' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active in Storefront</option>
              <option value="ARCHIVED">Draft / Archived</option>
            </select>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--color-text-muted, #8A8A8A)' }}>
            Showing <strong>{filteredWatches.length}</strong> of <strong>{totalCount}</strong> timepieces
          </div>
        </div>

        {/* Table Container */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Timepiece &amp; Model</th>
                <th>Manufacture &amp; Ref</th>
                <th>Movement &amp; Specs</th>
                <th>Acquisition Price</th>
                <th>Stock</th>
                <th>Storefront</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ color: 'var(--brand-gold, #C5A059)', fontSize: '14px' }}>
                      Retrieving Master Horological Registry...
                    </div>
                  </td>
                </tr>
              ) : filteredWatches.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ color: 'var(--color-text-muted, #8A8A8A)', fontSize: '14px' }}>
                      No timepieces found matching the selected criteria.
                    </div>
                  </td>
                </tr>
              ) : (
                filteredWatches.map((watch) => {
                  const has3d = Boolean(watch.assets3d?.has3dModel || watch.assets3d?.modelUrl);
                  return (
                    <tr key={watch.id}>
                      {/* Column 1: Timepiece & Model */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div
                            style={{
                              width: '50px',
                              height: '50px',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              background: '#151A22',
                              border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
                              position: 'relative',
                              flexShrink: 0
                            }}
                          >
                            <img
                              src={watch.imageUrl}
                              alt={watch.model}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => {
                                (e.target as any).src = '/assets/products/watch-01.png';
                              }}
                            />
                            {has3d && (
                              <div
                                title="Interactive 3D Asset Available"
                                style={{
                                  position: 'absolute',
                                  bottom: '2px',
                                  right: '2px',
                                  background: 'rgba(0, 0, 0, 0.8)',
                                  borderRadius: '4px',
                                  padding: '2px 3px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <Box size={10} color="var(--brand-gold, #C5A059)" strokeWidth={2} />
                              </div>
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--brand-ivory, #F7F3EC)', fontSize: '14px' }}>
                              {watch.model}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                              {watch.badge && (
                                <span
                                  style={{
                                    fontSize: '10px',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    background: 'rgba(197, 160, 89, 0.15)',
                                    color: 'var(--brand-gold, #C5A059)',
                                    fontWeight: 600,
                                    letterSpacing: '0.04em'
                                  }}
                                >
                                  {watch.badge}
                                </span>
                              )}
                              <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)' }}>
                                {watch.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Manufacture & Ref */}
                      <td>
                        <div style={{ fontWeight: 500, color: 'var(--brand-ivory, #F7F3EC)', fontSize: '13px' }}>
                          {watch.brand}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)', marginTop: '2px' }}>
                          Ref #{watch.num || watch.id}
                        </div>
                      </td>

                      {/* Column 3: Movement & Specs */}
                      <td>
                        <div style={{ fontSize: '12px', color: 'var(--brand-ivory, #F7F3EC)' }}>
                          {watch.movement}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)', marginTop: '2px' }}>
                          {watch.caseSize} &bull; {watch.material}
                        </div>
                      </td>

                      {/* Column 4: Price */}
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--brand-gold, #C5A059)', fontSize: '14px' }}>
                          {formatCurrency(watch.price)}
                        </div>
                        {watch.originalPrice > watch.price && (
                          <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.35)', textDecoration: 'line-through', marginTop: '2px' }}>
                            {formatCurrency(watch.originalPrice)}
                          </div>
                        )}
                      </td>

                      {/* Column 5: Stock */}
                      <td>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: '12px',
                            background: watch.stockCount <= 3 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                            color: watch.stockCount <= 3 ? '#EF4444' : '#4ADE80'
                          }}
                        >
                          {watch.stockCount} units
                        </span>
                      </td>

                      {/* Column 6: Storefront Status */}
                      <td>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(watch.id, watch.isActive, watch.model)}
                          title="Click to toggle storefront display"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: 600,
                            background: watch.isActive ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                            color: watch.isActive ? '#4ADE80' : 'rgba(255, 255, 255, 0.45)',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {watch.isActive ? (
                            <>
                              <CheckCircle size={12} strokeWidth={2} />
                              <span>Live</span>
                            </>
                          ) : (
                            <>
                              <XCircle size={12} strokeWidth={2} />
                              <span>Draft</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Column 7: Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <Link
                            href={`/product/${watch.id}`}
                            target="_blank"
                            title="Preview Storefront PDP"
                            className="admin-action-btn"
                          >
                            <Eye size={14} strokeWidth={1.5} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(watch)}
                            title="Edit Master Specifications"
                            className="admin-action-btn"
                          >
                            <Edit2 size={14} strokeWidth={1.5} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteWatch(watch.id, watch.model)}
                            title="Archive Timepiece"
                            className="admin-action-btn"
                            style={{ color: '#EF4444' }}
                          >
                            <Archive size={14} strokeWidth={1.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Watch Editor Modal */}
      <WatchEditorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedWatch(null);
        }}
        onSave={handleSaveWatch}
        watchToEdit={selectedWatch}
      />
    </div>
  );
}
