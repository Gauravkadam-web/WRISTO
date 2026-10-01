'use client';

import React from 'react';
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
  const tabs: { id: AccountTab; label: string; icon: string; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: '🏛️' },
    { id: 'orders', label: 'Acquisitions & Provenance', icon: '📜', count: orderCount },
    { id: 'addresses', label: 'Address Book', icon: '📍', count: addressCount },
    { id: 'wishlist', label: 'Private Vault', icon: '💎', count: wishlistCount },
    { id: 'settings', label: 'Horological Profile', icon: '⚙️' }
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
            <span className="account-tab-icon">{tab.icon}</span>
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
