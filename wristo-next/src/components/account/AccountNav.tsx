'use client';

import React from 'react';
import { Landmark, FileText, MapPin, Sparkles, Settings } from 'lucide-react';
import { AccountTab } from '@/types/account';

interface AccountNavProps {
  activeTab: AccountTab;
  onSelectTab: (tab: AccountTab) => void;
  orderCount: number;
  wishlistCount: number;
  addressCount: number;
}

export default function AccountNav({
  activeTab,
  onSelectTab,
  orderCount,
  wishlistCount,
  addressCount
}: AccountNavProps) {
  const tabs: { id: AccountTab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <Landmark size={15} strokeWidth={1.5} /> },
    { id: 'orders', label: 'Acquisitions & Provenance', icon: <FileText size={15} strokeWidth={1.5} />, count: orderCount },
    { id: 'addresses', label: 'Address Book', icon: <MapPin size={15} strokeWidth={1.5} />, count: addressCount },
    { id: 'wishlist', label: 'Private Vault', icon: <Sparkles size={15} strokeWidth={1.5} />, count: wishlistCount },
    { id: 'settings', label: 'Horological Profile', icon: <Settings size={15} strokeWidth={1.5} /> }
  ];

  return (
    <nav className="account-tabs-nav" aria-label="Account Portal Sections">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            className={`account-tab-btn ${isActive ? 'active' : ''}`}
            onClick={() => onSelectTab(tab.id)}
          >
            <span className="account-tab-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
              {tab.icon}
            </span>
            <span className="account-tab-label">{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span className={`account-tab-count ${isActive ? 'active' : ''}`}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
