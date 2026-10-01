'use client';

import React from 'react';
import { CollectorProfile } from '@/types/account';

interface AccountHeaderProps {
  profile: CollectorProfile;
}

export default function AccountHeader({ profile }: AccountHeaderProps) {
  // Extract initials for the luxury monogram
  const initials = profile.fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');

  return (
    <div className="account-hero-banner">
      <div className="account-hero-left">
        <div className="account-monogram-circle" title="Collector Provenance Monogram">
          <span>{initials || 'WR'}</span>
        </div>
        <div className="account-collector-info">
          <div className="account-eyebrow">
            <span>{profile.salutation}</span>
            <span className="account-vip-badge">{profile.vipTier}</span>
          </div>
          <h1 className="account-collector-name">{profile.fullName}</h1>
          <p className="account-collector-meta">
            <span>{profile.email}</span>
            <span className="account-dot-separator">&bull;</span>
            <span>{profile.phone}</span>
            <span className="account-dot-separator">&bull;</span>
            <span>Client since {profile.joinedDate}</span>
          </p>
        </div>
      </div>

      <div className="account-hero-right">
        <div className="account-security-tag">
          <span className="account-security-icon">🛡️</span>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '12px' }}>
              Vault Protected Ledger
            </div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '11px' }}>
              256-Bit Encrypted Client Register
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
