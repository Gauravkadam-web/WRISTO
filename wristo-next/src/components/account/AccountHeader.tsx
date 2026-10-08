'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, LogOut, Shield, ExternalLink } from 'lucide-react';
import { CollectorProfile } from '@/types/account';
import { AuthUser } from '@/services/authService';

interface AccountHeaderProps {
  profile: CollectorProfile;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
}

export default function AccountHeader({ profile, currentUser, onLogout }: AccountHeaderProps) {
  // Extract initials for the luxury monogram
  const initials = profile.fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');

  const role = (currentUser?.role || 'CUSTOMER').toUpperCase();
  const isAdmin = role.includes('ADMIN') || role.includes('SUPER') || role === 'OWNER';

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
            {isAdmin && (
              <span className="account-admin-badge" style={{
                background: 'rgba(212, 163, 115, 0.15)',
                color: 'var(--brand-bronze-light)',
                border: '1px solid rgba(212, 163, 115, 0.4)',
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '11px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Shield size={11} />
                <span>Executive Admin</span>
              </span>
            )}
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

      <div className="account-hero-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {isAdmin && (
          <Link
            href="/admin"
            className="btn btn-outline-gold"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              fontSize: '12px',
              borderRadius: '4px',
              background: 'rgba(212, 163, 115, 0.12)',
              border: '1px solid var(--brand-bronze)',
              color: 'var(--brand-bronze-light)'
            }}
          >
            <Shield size={14} />
            <span>Admin Dashboard</span>
            <ExternalLink size={12} />
          </Link>
        )}

        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="btn btn-ghost-luxury"
            title="Sign out of account"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              fontSize: '12px',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: '4px',
              background: 'rgba(255, 255, 255, 0.03)',
              cursor: 'pointer'
            }}
          >
            <LogOut size={14} />
            <span>Log Out</span>
          </button>
        )}

        <div className="account-security-tag">
          <span className="account-security-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
            <ShieldCheck size={16} strokeWidth={1.5} color="var(--brand-bronze)" />
          </span>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '12px' }}>
              Verified Account
            </div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '11px' }}>
              Secure Session
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
