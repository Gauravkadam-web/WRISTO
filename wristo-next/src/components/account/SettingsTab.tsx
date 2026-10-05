'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { CollectorProfile } from '@/types/account';
import { updateCollectorProfile } from '@/services/accountService';

interface SettingsTabProps {
  profile: CollectorProfile;
  onUpdateProfile: (updated: CollectorProfile) => void;
}

export default function SettingsTab({ profile, onUpdateProfile }: SettingsTabProps) {
  const [formData, setFormData] = useState({
    fullName: profile.fullName,
    email: profile.email,
    phone: profile.phone,
    salutation: profile.salutation,
    wristSizeMm: profile.wristSizeMm,
    notifications: { ...profile.notifications }
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const wristInches = (formData.wristSizeMm / 25.4).toFixed(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await updateCollectorProfile(formData);
    onUpdateProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="account-settings-content">
      <div className="account-orders-header">
        <div>
          <h2 className="account-section-title">Horological Calibration &amp; Profile</h2>
          <p className="account-section-subtitle">
            Configure your client salutation, bespoke wrist sizing for custom strap adjustments, and concierge communication channels.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="account-save-alert" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={16} strokeWidth={2} />
          <span>Collector profile and wrist calibration saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="account-settings-form">
        {/* Section 1: Client Identity */}
        <div className="account-settings-card">
          <h3 className="account-settings-card-title">Client Identity &amp; Salutation</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="checkout-label">Salutation</label>
              <select
                value={formData.salutation}
                onChange={e => setFormData({ ...formData, salutation: e.target.value as any })}
                className="checkout-input"
              >
                <option value="Mr.">Mr.</option>
                <option value="Ms.">Ms.</option>
                <option value="Dr.">Dr.</option>
                <option value="Lord">Lord</option>
                <option value="Collector">Collector</option>
              </select>
            </div>
            <div>
              <label className="checkout-label">Full Legal Name (For Provenance Certificates)</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                className="checkout-input"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="checkout-label">Email Address (Dispatches &amp; Provenance Ledger)</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="checkout-input"
                required
              />
            </div>
            <div>
              <label className="checkout-label">Contact Phone (Secure Courier Telemetry)</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="checkout-input"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Wrist Size Calibration */}
        <div className="account-settings-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 className="account-settings-card-title">Bespoke Wrist Calibration</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '4px 0 16px' }}>
                All bracelets and leather straps are calibrated by certified horologists prior to dispatch.
              </p>
            </div>
            <div className="account-wrist-badge">
              <strong>{formData.wristSizeMm} mm</strong> / {wristInches} inches
            </div>
          </div>

          <div className="account-slider-box">
            <input
              type="range"
              min={150}
              max={215}
              step={1}
              value={formData.wristSizeMm}
              onChange={e => setFormData({ ...formData, wristSizeMm: parseInt(e.target.value, 10) })}
              className="account-wrist-slider"
            />
            <div className="account-slider-labels">
              <span>150mm (Slim 5.9&quot;)</span>
              <span>175mm (Standard 6.9&quot;)</span>
              <span>215mm (Prominent 8.5&quot;)</span>
            </div>
          </div>

          <div className="account-sizing-note">
            ⏱️ <strong>Horological Custom Fitting:</strong> Links removed during bracelet calibration are packaged securely in your presentation case for future adjustment.
          </div>
        </div>

        {/* Section 3: Concierge Telemetry Channels */}
        <div className="account-settings-card">
          <h3 className="account-settings-card-title">Concierge &amp; Dispatch Channels</h3>

          <div className="account-notifications-list">
            <label className="account-notif-row">
              <div>
                <div style={{ fontWeight: 600, fontSize: '13px' }}>Armored Courier Telemetry (SMS &amp; WhatsApp)</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  Receive live armored vehicle milestone coordinates and OTP delivery clearance.
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.notifications.orderTelemetry}
                onChange={e => setFormData({
                  ...formData,
                  notifications: { ...formData.notifications, orderTelemetry: e.target.checked }
                })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--color-gold-primary)' }}
              />
            </label>

            <label className="account-notif-row">
              <div>
                <div style={{ fontWeight: 600, fontSize: '13px' }}>Rare Allocation &amp; Vault Access</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  Prioritized private invitations before new limited edition complications are listed publicly.
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.notifications.rareAllocations}
                onChange={e => setFormData({
                  ...formData,
                  notifications: { ...formData.notifications, rareAllocations: e.target.checked }
                })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--color-gold-primary)' }}
              />
            </label>

            <label className="account-notif-row">
              <div>
                <div style={{ fontWeight: 600, fontSize: '13px' }}>Chief Concierge Quarterly Briefings</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  Curated editorial horology dossiers and market valuation reports.
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.notifications.conciergeBriefings}
                onChange={e => setFormData({
                  ...formData,
                  notifications: { ...formData.notifications, conciergeBriefings: e.target.checked }
                })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--color-gold-primary)' }}
              />
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
          >
            Save Calibration &amp; Profile &rarr;
          </button>
        </div>
      </form>
    </div>
  );
}
