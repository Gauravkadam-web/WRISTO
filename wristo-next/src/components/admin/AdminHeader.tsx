'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronRight, Shield, Activity } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { API_BASE_URL } from '@/services/apiClient';
import { AdminUser } from '@/types/admin';

export default function AdminHeader() {
  const pathname = usePathname();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(true);

  useEffect(() => {
    setAdminUser(adminService.getCurrentAdmin());

    // Check backend health
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
  }, []);

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

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <div className="admin-breadcrumbs">
          <span className="admin-crumb-root">VAULT</span>
          <ChevronRight size={14} strokeWidth={1.5} className="admin-crumb-sep" />
          <span className="admin-crumb-current">{getPageTitle()}</span>
        </div>
      </div>

      <div className="admin-header-right">
        {/* Connection Status Telemetry */}
        <div
          className={`admin-telemetry-badge ${isLiveConnected ? 'connected' : 'offline'}`}
          title={isLiveConnected ? 'Connected to Live Spring Boot REST API' : 'Operating in Standalone Resilient Fallback Mode'}
        >
          <span className="admin-pulse-dot" />
          <Activity size={13} strokeWidth={1.5} />
          <span>{isLiveConnected ? 'Live API Connected' : 'Resilient Offline Mode'}</span>
        </div>

        {/* Admin Identity Lockup */}
        <div className="admin-user-pill">
          <div className="admin-user-avatar">
            <Shield size={14} strokeWidth={1.5} />
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
