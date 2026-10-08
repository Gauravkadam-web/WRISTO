'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronRight, Shield, Activity, AlertCircle } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { API_BASE_URL } from '@/services/apiClient';
import { AdminUser } from '@/types/admin';

export default function AdminHeader() {
  const pathname = usePathname();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(true);
  const [isAuthed, setIsAuthed] = useState<boolean>(true);

  useEffect(() => {
    const user = adminService.getCurrentAdmin();
    const authenticated = adminService.isAuthenticated();
    setAdminUser(user);
    setIsAuthed(authenticated);

    // Check backend health & telemetry
    const checkHealth = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(3000)
        });
        setIsLiveConnected(res.ok);
      } catch {
        setIsLiveConnected(false);
      }
    };
    checkHealth();
  }, [pathname]);

  const getPageTitle = () => {
    if (pathname === '/admin') return 'Executive Performance Dashboard';
    if (pathname.startsWith('/admin/journal')) return 'Editorial Journal & Essays CMS';
    if (pathname.startsWith('/admin/coupons')) return 'Promotions & Privilege Codes';
    if (pathname.startsWith('/admin/orders')) return 'Boutique Order Fulfillment Pipeline';
    if (pathname.startsWith('/admin/sellers')) return 'Verified Sellers & Brand Authorizations';
    if (pathname.startsWith('/admin/listings')) return 'Marketplace Watch Moderation & Stock';
    if (pathname.startsWith('/admin/provenance')) return 'Swiss Horology Provenance Ledger';
    return 'Executive Portal';
  };

  const getStatusBadge = () => {
    if (!isAuthed) {
      return {
        className: 'offline',
        label: 'Auth Required',
        title: 'Authentication session requires elevated credentials or renewal'
      };
    }
    if (!isLiveConnected) {
      return {
        className: 'offline',
        label: 'Degraded Telemetry',
        title: 'Operating in Standalone Resilient Fallback Mode'
      };
    }
    return {
      className: 'connected',
      label: 'Live API Connected',
      title: 'Connected to Live Spring Boot REST API'
    };
  };

  const status = getStatusBadge();

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <div className="admin-breadcrumbs" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <span className="admin-crumb-root" style={{ fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--brand-bronze, #B08D6B)' }}>
            VAULT
          </span>
          <ChevronRight size={13} strokeWidth={2} className="admin-crumb-sep" style={{ color: '#666666' }} />
          <span className="admin-crumb-current" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--brand-ivory, #F7F3EC)' }}>
            {getPageTitle()}
          </span>
        </div>
      </div>

      <div className="admin-header-right">
        {/* Connection & Auth Status Telemetry */}
        <div
          className={`admin-telemetry-badge ${status.className}`}
          title={status.title}
          style={{ cursor: 'default' }}
        >
          <span className="admin-pulse-dot" />
          {isLiveConnected && isAuthed ? (
            <Activity size={12} strokeWidth={2} />
          ) : (
            <AlertCircle size={12} strokeWidth={2} />
          )}
          <span style={{ fontSize: '11.5px', fontWeight: 500 }}>{status.label}</span>
        </div>

        {/* Admin Identity Lockup */}
        <div className="admin-user-pill">
          <div className="admin-user-avatar">
            <Shield size={13} strokeWidth={1.8} />
          </div>
          <div className="admin-user-details">
            <span className="admin-user-name">{adminUser?.fullName || 'System Administrator'}</span>
            <span className="admin-user-role">{adminUser?.role || 'ADMIN'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
