'use client';

import React, { useState } from 'react';
import { SavedAddress } from '@/types/account';
import { lookupPincode } from '@/services/orderService';
import { deleteAddress, saveAddress, setDefaultAddress } from '@/services/accountService';

interface AddressesTabProps {
  addresses: SavedAddress[];
  onRefreshAddresses: (updated: SavedAddress[]) => void;
}

export default function AddressesTab({ addresses, onRefreshAddresses }: AddressesTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);

  const [formData, setFormData] = useState({
    label: 'Primary Residence',
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleOpenNew = () => {
    setEditingAddress(null);
    setFormData({
      label: 'Private Residence',
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: addresses.length === 0
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addr: SavedAddress) => {
    setEditingAddress(addr);
    setFormData({
      label: addr.label,
      fullName: addr.fullName,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || '',
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      isDefault: addr.isDefault
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handlePincodeChange = (pin: string) => {
    const cleaned = pin.replace(/\D/g, '').slice(0, 6);
    setFormData(prev => ({ ...prev, pincode: cleaned }));
    if (cleaned.length === 6) {
      const match = lookupPincode(cleaned);
      if (match) {
        setFormData(prev => ({ ...prev, city: match.city, state: match.state }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.addressLine1.trim() || !formData.pincode.trim()) {
      setErrorMsg('Please complete all mandatory delivery fields.');
      return;
    }
    if (formData.pincode.length !== 6) {
      setErrorMsg('Please enter a valid 6-digit postal PIN code.');
      return;
    }

    try {
      await saveAddress({
        ...(editingAddress ? { id: editingAddress.id } : {}),
        ...formData
      });
      // Refresh list
      const { getSavedAddresses } = await import('@/services/accountService');
      const updated = await getSavedAddresses();
      onRefreshAddresses(updated);
      setIsModalOpen(false);
    } catch {
      setErrorMsg('Could not save address. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you wish to remove this delivery destination?')) {
      const updated = await deleteAddress(id);
      onRefreshAddresses(updated);
    }
  };

  const handleSetDefault = async (id: string) => {
    const updated = await setDefaultAddress(id);
    onRefreshAddresses(updated);
  };

  return (
    <div className="account-addresses-content">
      <div className="account-orders-header">
        <div>
          <h2 className="account-section-title">Insured Delivery Destinations</h2>
          <p className="account-section-subtitle">
            Manage your verified residences, corporate suites, and private collection vaults for armored courier dispatch.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleOpenNew}
        >
          + Add New Destination
        </button>
      </div>

      <div className="account-addresses-grid">
        {addresses.map(addr => (
          <div key={addr.id} className={`account-address-card ${addr.isDefault ? 'default' : ''}`}>
            <div className="account-address-head">
              <span className="account-address-label">{addr.label}</span>
              {addr.isDefault ? (
                <span className="account-address-default-badge">★ Default Destination</span>
              ) : (
                <button
                  type="button"
                  className="account-set-default-btn"
                  onClick={() => handleSetDefault(addr.id)}
                >
                  Set as Default
                </button>
              )}
            </div>

            <div className="account-address-body">
              <div className="account-address-name">{addr.fullName}</div>
              <div className="account-address-lines">
                {addr.addressLine1}
                {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
              </div>
              <div className="account-address-city">
                {addr.city}, {addr.state} — {addr.pincode}
              </div>
              <div className="account-address-phone">Contact: {addr.phone}</div>
            </div>

            <div className="account-address-actions">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => handleOpenEdit(addr)}
              >
                Edit
              </button>
              {!addr.isDefault && (
                <button
                  type="button"
                  className="account-delete-btn"
                  onClick={() => handleDelete(addr.id)}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="cert-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="cert-modal-window"
            style={{ maxWidth: '580px', padding: '32px' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', margin: 0 }}>
                {editingAddress ? 'Modify Destination' : 'Register New Destination'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="cert-modal-close"
              >
                &times;
              </button>
            </div>

            {errorMsg && (
              <p style={{ color: '#D32F2F', fontSize: '13px', marginBottom: '16px' }}>
                {errorMsg}
              </p>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="checkout-label">Destination Label</label>
                <input
                  type="text"
                  placeholder="e.g. Primary Residence, Seaside Villa"
                  value={formData.label}
                  onChange={e => setFormData({ ...formData, label: e.target.value })}
                  className="checkout-input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="checkout-label">Recipient Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="checkout-input"
                    required
                  />
                </div>
                <div>
                  <label className="checkout-label">Mobile Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="checkout-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="checkout-label">Street Address &amp; Suite</label>
                <input
                  type="text"
                  placeholder="Building, street, landmark"
                  value={formData.addressLine1}
                  onChange={e => setFormData({ ...formData, addressLine1: e.target.value })}
                  className="checkout-input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="checkout-label">PIN Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 400001"
                    value={formData.pincode}
                    onChange={e => handlePincodeChange(e.target.value)}
                    className="checkout-input"
                    required
                  />
                </div>
                <div>
                  <label className="checkout-label">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="checkout-input"
                    required
                  />
                </div>
                <div>
                  <label className="checkout-label">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                    className="checkout-input"
                    required
                  />
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', marginTop: '4px' }}>
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={e => setFormData({ ...formData, isDefault: e.target.checked })}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--color-gold-primary)' }}
                />
                <span>Set as primary default destination for white-glove courier</span>
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Save Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
