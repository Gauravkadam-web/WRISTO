'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Clock,
  Sliders,
  Box,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { AdminWatch, SaveWatchPayload } from '@/types/admin';

interface WatchEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (watchData: SaveWatchPayload) => Promise<void>;
  watchToEdit?: AdminWatch | null;
}

type TabType = 'identity' | 'horology' | 'assets3d' | 'ai_inventory';

export default function WatchEditorModal({
  isOpen,
  onClose,
  onSave,
  watchToEdit
}: WatchEditorModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('identity');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<SaveWatchPayload>({
    id: '',
    num: '',
    brandName: 'Patek Philippe',
    model: '',
    price: 1500000,
    originalPrice: 1800000,
    imageUrl: '/assets/products/watch-01.png',
    categoryName: 'Grand Complications',
    gender: 'Men',
    movement: 'Automatic Calibre',
    style: 'Luxury',
    caseSize: '41mm',
    strap: 'Alligator Leather',
    dial: 'Sunburst Dial',
    material: 'Stainless Steel',
    waterResistance: '50m',
    badge: 'VAULT MASTERPIECE',
    tagline: 'Precision haute horlogerie curated for the modern connoisseur.',
    description: 'Impeccably finished timepiece adhering to the highest standards of Swiss watchmaking excellence.',
    aiMatchScore: 98,
    aiReason: 'Pairs impeccably with bespoke evening wear and executive appointments.',
    stockCount: 5,
    isActive: true,
    caseDiameterMm: '41mm',
    caseMaterial: 'Stainless Steel',
    dialFinish: 'Sunburst Opaline',
    strapMaterial: 'Hand-stitched Alligator',
    waterResistanceAtm: '5 ATM',
    powerReserveHours: '48 Hours',
    glassCrystal: 'Sapphire Crystal (Anti-Reflective)',
    claspType: 'Deployant Fold-over Clasp',
    warrantyPeriod: '5-Year Manufacturer Warranty',
    model3dUrl: '',
    posterImageUrl: '',
    caseLugToLug: '48mm',
    caseThickness: '11.5mm',
    lugWidth: '20mm'
  });

  useEffect(() => {
    if (watchToEdit) {
      setFormData({
        id: watchToEdit.id,
        num: watchToEdit.num,
        brandName: watchToEdit.brand,
        model: watchToEdit.model,
        price: watchToEdit.price,
        originalPrice: watchToEdit.originalPrice,
        imageUrl: watchToEdit.imageUrl,
        categoryName: watchToEdit.category,
        gender: watchToEdit.gender,
        movement: watchToEdit.movement,
        style: watchToEdit.style,
        caseSize: watchToEdit.caseSize,
        strap: watchToEdit.strap,
        dial: watchToEdit.dial,
        material: watchToEdit.material,
        waterResistance: watchToEdit.waterResistance,
        badge: watchToEdit.badge || '',
        tagline: watchToEdit.tagline,
        description: watchToEdit.description,
        aiMatchScore: watchToEdit.aiMatchScore,
        aiReason: watchToEdit.aiReason,
        stockCount: watchToEdit.stockCount,
        isActive: watchToEdit.isActive,
        caseDiameterMm: watchToEdit.specifications?.caseDiameter || watchToEdit.caseSize,
        caseMaterial: watchToEdit.specifications?.caseMaterial || watchToEdit.material,
        dialFinish: watchToEdit.specifications?.dialFinish || watchToEdit.dial,
        strapMaterial: watchToEdit.specifications?.strapMaterial || watchToEdit.strap,
        waterResistanceAtm: watchToEdit.specifications?.waterResistance || watchToEdit.waterResistance,
        powerReserveHours: watchToEdit.specifications?.powerReserve || '48 Hours',
        glassCrystal: watchToEdit.specifications?.glassCrystal || 'Sapphire Crystal (Anti-Reflective)',
        claspType: watchToEdit.specifications?.claspType || 'Deployant Fold-over Clasp',
        warrantyPeriod: watchToEdit.specifications?.warrantyPeriod || '5-Year Manufacturer Warranty',
        model3dUrl: watchToEdit.assets3d?.modelUrl || '',
        posterImageUrl: watchToEdit.assets3d?.posterUrl || '',
        caseLugToLug: watchToEdit.dimensions?.lugToLug || '48mm',
        caseThickness: watchToEdit.dimensions?.caseThickness || '11.5mm',
        lugWidth: watchToEdit.dimensions?.lugWidth || '20mm'
      });
    } else {
      setFormData({
        id: '',
        num: '',
        brandName: 'Patek Philippe',
        model: '',
        price: 1500000,
        originalPrice: 1800000,
        imageUrl: '/assets/products/watch-01.png',
        categoryName: 'Grand Complications',
        gender: 'Men',
        movement: 'Automatic Calibre',
        style: 'Luxury',
        caseSize: '41mm',
        strap: 'Alligator Leather',
        dial: 'Sunburst Dial',
        material: 'Stainless Steel',
        waterResistance: '50m',
        badge: 'VAULT MASTERPIECE',
        tagline: 'Precision haute horlogerie curated for the modern connoisseur.',
        description: 'Impeccably finished timepiece adhering to the highest standards of Swiss watchmaking excellence.',
        aiMatchScore: 98,
        aiReason: 'Pairs impeccably with bespoke evening wear and executive appointments.',
        stockCount: 5,
        isActive: true,
        caseDiameterMm: '41mm',
        caseMaterial: 'Stainless Steel',
        dialFinish: 'Sunburst Opaline',
        strapMaterial: 'Hand-stitched Alligator',
        waterResistanceAtm: '5 ATM',
        powerReserveHours: '48 Hours',
        glassCrystal: 'Sapphire Crystal (Anti-Reflective)',
        claspType: 'Deployant Fold-over Clasp',
        warrantyPeriod: '5-Year Manufacturer Warranty',
        model3dUrl: '',
        posterImageUrl: '',
        caseLugToLug: '48mm',
        caseThickness: '11.5mm',
        lugWidth: '20mm'
      });
    }
    setActiveTab('identity');
    setErrorMessage(null);
  }, [watchToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.model?.trim()) {
      setErrorMessage('Timepiece model name is required.');
      setActiveTab('identity');
      return;
    }
    if (!formData.brandName?.trim()) {
      setErrorMessage('Brand manufacture is required.');
      setActiveTab('identity');
      return;
    }
    if (!formData.price || formData.price <= 0) {
      setErrorMessage('Valid retail acquisition price is required.');
      setActiveTab('identity');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save master timepiece into catalog.');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs: { key: TabType; label: string; icon: React.ElementType }[] = [
    { key: 'identity', label: 'Identity & Details', icon: Layers },
    { key: 'horology', label: 'Horological Specs', icon: Sliders },
    { key: 'assets3d', label: '3D CAD & Blueprint', icon: Box },
    { key: 'ai_inventory', label: 'AI Concierge & Stock', icon: Sparkles }
  ];

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div
        className="admin-modal-card"
        style={{ maxWidth: '840px', width: '92vw' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="admin-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(197, 160, 89, 0.12)',
                color: 'var(--brand-gold, #C5A059)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Clock size={18} strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="admin-modal-title" style={{ fontSize: '18px' }}>
                {watchToEdit ? `Curate Model: ${watchToEdit.model}` : 'Acquire New Master Timepiece'}
              </h2>
              <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '2px' }}>
                SRS Master Catalog Governance &amp; Horological Blueprint Specifications
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="admin-action-btn"
            aria-label="Close modal"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
            background: 'rgba(0, 0, 0, 0.2)',
            padding: '0 24px',
            gap: '8px'
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 14px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '2px solid var(--brand-gold, #C5A059)' : '2px solid transparent',
                  color: isActive ? 'var(--brand-gold, #C5A059)' : 'rgba(255, 255, 255, 0.55)',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={14} strokeWidth={1.5} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div
            className="admin-modal-body"
            style={{
              overflowY: 'auto',
              flex: 1,
              maxHeight: '62vh',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}
          >
            {errorMessage && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '6px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#EF4444',
                  fontSize: '13px'
                }}
              >
                {errorMessage}
              </div>
            )}

            {/* TAB 1: IDENTITY & DETAILS */}
            {activeTab === 'identity' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Manufacture / Brand</label>
                    <input
                      type="text"
                      required
                      value={formData.brandName}
                      onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                      placeholder="e.g. Patek Philippe"
                      className="admin-form-input"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Model Name &amp; Reference</label>
                    <input
                      type="text"
                      required
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      placeholder="e.g. Grand Complications 5270P-001"
                      className="admin-form-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Retail Price (INR)</label>
                    <input
                      type="number"
                      required
                      min={1000}
                      value={formData.price || ''}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      placeholder="18500000"
                      className="admin-form-input"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">MSRP / Original Price (INR)</label>
                    <input
                      type="number"
                      min={1000}
                      value={formData.originalPrice || ''}
                      onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                      placeholder="21000000"
                      className="admin-form-input"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Catalog Identifier / Num</label>
                    <input
                      type="text"
                      value={formData.num || ''}
                      onChange={(e) => setFormData({ ...formData, num: e.target.value })}
                      placeholder="e.g. 01"
                      className="admin-form-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Category</label>
                    <input
                      type="text"
                      value={formData.categoryName || ''}
                      onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                      placeholder="Grand Complications"
                      className="admin-form-input"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Gender Segment</label>
                    <select
                      value={formData.gender || 'Men'}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="admin-form-input"
                    >
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Unisex">Unisex</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Curatorial Badge</label>
                    <select
                      value={formData.badge || ''}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="admin-form-input"
                    >
                      <option value="">None (Standard Vault)</option>
                      <option value="VAULT MASTERPIECE">VAULT MASTERPIECE</option>
                      <option value="EXCLUSIVE">EXCLUSIVE</option>
                      <option value="ICON">ICON</option>
                      <option value="LIMITED EDITION">LIMITED EDITION</option>
                      <option value="HISTORIC">HISTORIC</option>
                    </select>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Primary High-Res Image URL</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      required
                      value={formData.imageUrl || ''}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="/assets/products/patek-5270p.png"
                      className="admin-form-input"
                      style={{ flex: 1 }}
                    />
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
                        background: 'rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                      }}
                    >
                      {formData.imageUrl ? (
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { (e.target as any).style.display = 'none'; }}
                        />
                      ) : (
                        <ImageIcon size={18} strokeWidth={1.5} color="rgba(255,255,255,0.4)" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Tagline (Editorial Headline)</label>
                  <input
                    type="text"
                    value={formData.tagline || ''}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="Perpetual Calendar Chronograph in Platinum."
                    className="admin-form-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Horological Description</label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter comprehensive provenance and craft details..."
                    className="admin-form-input"
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </>
            )}

            {/* TAB 2: HOROLOGICAL SPECIFICATIONS */}
            {activeTab === 'horology' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Calibre Movement</label>
                    <input
                      type="text"
                      value={formData.movement || ''}
                      onChange={(e) => setFormData({ ...formData, movement: e.target.value })}
                      placeholder="e.g. Calibre CH 29-535 PS Q Manual Wind"
                      className="admin-form-input"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Power Reserve</label>
                    <input
                      type="text"
                      value={formData.powerReserveHours || ''}
                      onChange={(e) => setFormData({ ...formData, powerReserveHours: e.target.value })}
                      placeholder="e.g. 65 Hours"
                      className="admin-form-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Case Size / Diameter</label>
                    <input
                      type="text"
                      value={formData.caseDiameterMm || formData.caseSize || ''}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          caseDiameterMm: e.target.value,
                          caseSize: e.target.value
                        });
                      }}
                      placeholder="e.g. 41mm"
                      className="admin-form-input"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Case Material</label>
                    <input
                      type="text"
                      value={formData.caseMaterial || formData.material || ''}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          caseMaterial: e.target.value,
                          material: e.target.value
                        });
                      }}
                      placeholder="e.g. Platinum 950 / 18k White Gold"
                      className="admin-form-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Dial Finish</label>
                    <input
                      type="text"
                      value={formData.dialFinish || formData.dial || ''}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          dialFinish: e.target.value,
                          dial: e.target.value
                        });
                      }}
                      placeholder="e.g. Salmon Opaline with Tachymeter Scale"
                      className="admin-form-input"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Strap &amp; Clasp</label>
                    <input
                      type="text"
                      value={formData.strapMaterial || formData.strap || ''}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          strapMaterial: e.target.value,
                          strap: e.target.value
                        });
                      }}
                      placeholder="e.g. Hand-stitched Alligator Leather"
                      className="admin-form-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Water Resistance</label>
                    <input
                      type="text"
                      value={formData.waterResistanceAtm || formData.waterResistance || ''}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          waterResistanceAtm: e.target.value,
                          waterResistance: e.target.value
                        });
                      }}
                      placeholder="e.g. 30m / 3 ATM"
                      className="admin-form-input"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Glass Crystal</label>
                    <input
                      type="text"
                      value={formData.glassCrystal || ''}
                      onChange={(e) => setFormData({ ...formData, glassCrystal: e.target.value })}
                      placeholder="e.g. Scratch-resistant Sapphire (Anti-Reflective)"
                      className="admin-form-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Clasp Architecture</label>
                    <input
                      type="text"
                      value={formData.claspType || ''}
                      onChange={(e) => setFormData({ ...formData, claspType: e.target.value })}
                      placeholder="e.g. Fold-over Deployant Clasp with Safety Lock"
                      className="admin-form-input"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Warranty Period</label>
                    <input
                      type="text"
                      value={formData.warrantyPeriod || ''}
                      onChange={(e) => setFormData({ ...formData, warrantyPeriod: e.target.value })}
                      placeholder="e.g. 5-Year Manufacture International Warranty"
                      className="admin-form-input"
                    />
                  </div>
                </div>
              </>
            )}

            {/* TAB 3: 3D CAD & BLUEPRINT */}
            {activeTab === 'assets3d' && (
              <>
                <div className="admin-form-group">
                  <label className="admin-form-label">3D Model GLB Asset URL</label>
                  <input
                    type="text"
                    value={formData.model3dUrl || ''}
                    onChange={(e) => setFormData({ ...formData, model3dUrl: e.target.value })}
                    placeholder="/assets/models/patek-5270p.glb"
                    className="admin-form-input"
                  />
                  <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)', marginTop: '4px' }}>
                    Powers interactive 3D WebGL cursor inspection and AR view on PDP.
                  </span>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">3D Poster Fallback Image URL</label>
                  <input
                    type="text"
                    value={formData.posterImageUrl || ''}
                    onChange={(e) => setFormData({ ...formData, posterImageUrl: e.target.value })}
                    placeholder="/assets/products/patek-5270p.png"
                    className="admin-form-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Lug-to-Lug (mm)</label>
                    <input
                      type="text"
                      value={formData.caseLugToLug || ''}
                      onChange={(e) => setFormData({ ...formData, caseLugToLug: e.target.value })}
                      placeholder="49.5mm"
                      className="admin-form-input"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Case Thickness (mm)</label>
                    <input
                      type="text"
                      value={formData.caseThickness || ''}
                      onChange={(e) => setFormData({ ...formData, caseThickness: e.target.value })}
                      placeholder="12.4mm"
                      className="admin-form-input"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Lug Width (mm)</label>
                    <input
                      type="text"
                      value={formData.lugWidth || ''}
                      onChange={(e) => setFormData({ ...formData, lugWidth: e.target.value })}
                      placeholder="21mm"
                      className="admin-form-input"
                    />
                  </div>
                </div>
              </>
            )}

            {/* TAB 4: AI CONCIERGE & INVENTORY */}
            {activeTab === 'ai_inventory' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Vault Inventory Stock Count</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.stockCount || 0}
                      onChange={(e) => setFormData({ ...formData, stockCount: Number(e.target.value) })}
                      placeholder="5"
                      className="admin-form-input"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">AI Match Score (0 - 100)</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={formData.aiMatchScore || 95}
                      onChange={(e) => setFormData({ ...formData, aiMatchScore: Number(e.target.value) })}
                      placeholder="98"
                      className="admin-form-input"
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">AI Concierge Reasoning &amp; Curatorial Logic</label>
                  <textarea
                    rows={3}
                    value={formData.aiReason || ''}
                    onChange={(e) => setFormData({ ...formData, aiReason: e.target.value })}
                    placeholder="e.g. Best suited for high-consequence gala events and bespoke tailoring."
                    className="admin-form-input"
                    style={{ resize: 'vertical' }}
                  />
                  <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)', marginTop: '4px' }}>
                    Presented to prospective buyers inside the AI Concierge matching drawer.
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))'
                  }}
                >
                  <input
                    type="checkbox"
                    id="isActiveToggle"
                    checked={formData.isActive !== false}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--brand-gold, #C5A059)', cursor: 'pointer' }}
                  />
                  <label htmlFor="isActiveToggle" style={{ cursor: 'pointer' }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--brand-ivory, #F7F3EC)' }}>
                      Active Storefront Listing
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                      When checked, this canonical timepiece is discoverable across the catalog, search, and checkout.
                    </div>
                  </label>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="admin-modal-footer">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="admin-btn admin-btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="admin-btn admin-btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {isSaving ? (
                <span>Synchronizing...</span>
              ) : (
                <>
                  <Save size={15} strokeWidth={1.5} />
                  <span>{watchToEdit ? 'Commit Timepiece Changes' : 'Curate to Master Catalog'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
