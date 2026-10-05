'use client';

import React, { useEffect, useState } from 'react';
import {
  Shield,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Award,
  Wrench,
  FileCheck,
  Calendar
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { AdminServiceRecord } from '@/types/admin';

export default function AdminProvenancePage() {
  const [records, setRecords] = useState<AdminServiceRecord[]>([]);
  const [searchSerial, setSearchSerial] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<AdminServiceRecord>>({
    watchSerialNumber: 'PP-7118-2023-CH',
    serviceCenter: 'Geneva Master Horology Atelier — Station 4',
    watchmakerName: 'Philippe Dufour (Certified Swiss Master Watchmaker)',
    serviceType: 'FULL_OVERHAUL',
    notes: 'Complete teardown of movement, ultrasonic bath of 213 components, synthetic ruby escapement lubrication, and amplitude regulation to +1.2s/day.',
    serviceDate: new Date().toISOString().split('T')[0],
    nextServiceDue: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const loadRecords = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getServiceRecords();
      setRecords(data);
    } catch (err) {
      console.error('Failed to load service records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);
    try {
      await adminService.appendServiceRecord(formData);
      setSuccessMessage('Official Swiss Horology Service Record cryptographically appended to Provenance Ledger.');
      await loadRecords();
    } catch (err) {
      console.error('Failed to append record:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRecords = searchSerial.trim()
    ? records.filter((r) =>
        r.watchSerialNumber.toLowerCase().includes(searchSerial.toLowerCase()) ||
        r.watchmakerName.toLowerCase().includes(searchSerial.toLowerCase())
      )
    : records;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '26px',
          fontWeight: 500,
          color: 'var(--brand-ivory, #F7F3EC)',
          marginBottom: '4px'
        }}>
          Swiss Horology Provenance Ledger
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted, #8A8A8A)' }}>
          Cryptographic maintenance records, master watchmaker certifications, and immutable serial history.
        </p>
      </div>

      {successMessage && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '14px 18px',
          background: 'rgba(63, 138, 98, 0.15)',
          border: '1px solid rgba(63, 138, 98, 0.3)',
          borderRadius: '6px',
          color: '#52B788',
          fontSize: '13px'
        }}>
          <CheckCircle2 size={16} strokeWidth={1.5} style={{ flexShrink: 0 }} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* 2 Column Layout: Append Record Form + Ledger Stream */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1.5fr',
        gap: '24px'
      }}>
        {/* Form */}
        <div className="admin-card">
          <div style={{
            padding: '18px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Wrench size={16} strokeWidth={1.5} color="var(--brand-bronze)" />
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '17px',
              fontWeight: 600,
              color: 'var(--brand-ivory)'
            }}>
              Append Certified Service Record
            </h3>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="admin-form-group">
              <label className="admin-form-label">Watch Serial Number</label>
              <input
                type="text"
                required
                value={formData.watchSerialNumber || ''}
                onChange={(e) => setFormData({ ...formData, watchSerialNumber: e.target.value })}
                placeholder="e.g. PP-7118-2023-CH"
                className="admin-form-input"
                style={{ fontFamily: 'monospace', fontWeight: 600 }}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Certified Service Center / Atelier</label>
              <input
                type="text"
                required
                value={formData.serviceCenter || ''}
                onChange={(e) => setFormData({ ...formData, serviceCenter: e.target.value })}
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Master Watchmaker Name & Title</label>
              <input
                type="text"
                required
                value={formData.watchmakerName || ''}
                onChange={(e) => setFormData({ ...formData, watchmakerName: e.target.value })}
                className="admin-form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Service Type</label>
                <select
                  value={formData.serviceType || 'FULL_OVERHAUL'}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="admin-form-select"
                >
                  <option value="FULL_OVERHAUL">Full Movement Overhaul</option>
                  <option value="REGULATION">Chronometer Regulation</option>
                  <option value="WATER_RESISTANCE">Water Resistance & Pressure Seal</option>
                  <option value="POLISHING">Hand-Polishing & Bezel Refinish</option>
                  <option value="AUTHENTICATION">Authentication Certificate Issuance</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Next Service Due</label>
                <input
                  type="date"
                  required
                  value={formData.nextServiceDue || ''}
                  onChange={(e) => setFormData({ ...formData, nextServiceDue: e.target.value })}
                  className="admin-form-input"
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Diagnostic Notes & Performed Caliber Operations</label>
              <textarea
                rows={4}
                required
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="admin-form-textarea"
                style={{ fontSize: '12.5px' }}
              />
            </div>

            <button type="submit" disabled={isSubmitting} className="admin-btn-primary" style={{ padding: '12px', marginTop: '4px' }}>
              <Award size={14} strokeWidth={1.5} />
              <span>{isSubmitting ? 'Appending to Ledger...' : 'Commit to Swiss Ledger'}</span>
            </button>
          </form>
        </div>

        {/* Existing Records Stream */}
        <div className="admin-card">
          <div style={{
            padding: '18px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileCheck size={16} strokeWidth={1.5} color="var(--color-accent-champagne)" />
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '17px',
                fontWeight: 600,
                color: 'var(--brand-ivory)'
              }}>
                Immutable Provenance Stream
              </h3>
            </div>

            <div style={{ position: 'relative' }}>
              <Search size={13} strokeWidth={1.5} style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)'
              }} />
              <input
                type="text"
                placeholder="Filter by serial #..."
                value={searchSerial}
                onChange={(e) => setSearchSerial(e.target.value)}
                className="admin-search-input"
                style={{ paddingLeft: '28px', minWidth: '180px', fontSize: '11.5px', padding: '6px 10px 6px 28px' }}
              />
            </div>
          </div>

          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '640px', overflowY: 'auto' }}>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                Verifying cryptographic ledger...
              </div>
            ) : filteredRecords.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                No maintenance records found.
              </div>
            ) : (
              filteredRecords.map((rec) => (
                <div key={rec.id} style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '6px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: 'var(--color-accent-champagne)'
                    }}>
                      {rec.watchSerialNumber}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--brand-bronze)',
                      background: 'rgba(176, 141, 107, 0.1)',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      {rec.serviceType.replace('_', ' ')}
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--brand-ivory)', fontWeight: 500 }}>
                    {rec.serviceCenter}
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    {rec.notes}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '11px',
                    color: 'var(--color-text-muted)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.04)',
                    paddingTop: '8px',
                    marginTop: '4px'
                  }}>
                    <span>Watchmaker: <strong style={{ color: 'var(--brand-ivory)' }}>{rec.watchmakerName}</strong></span>
                    <span>Service: {rec.serviceDate}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
