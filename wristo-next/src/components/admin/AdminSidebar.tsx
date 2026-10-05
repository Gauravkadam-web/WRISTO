'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Tag,
  PackageCheck,
  Store,
  Watch,
  Award,
  LogOut,
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';
import { adminService } from '@/services/adminService';

const NAV_ITEMS = [
  { href: '/admin', label: 'Executive Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/journal', label: 'Editorial Journal CMS', icon: FileText },
  { href: '/admin/coupons', label: 'Coupons & Discounts', icon: Tag },
  { href: '/admin/orders', label: 'Order Fulfillment', icon: PackageCheck },
  { href: '/admin/sellers', label: 'Seller Boutiques & KYC', icon: Store },
  { href: '/admin/listings', label: 'Watch Moderation', icon: Watch },
  { href: '/admin/provenance', label: 'Provenance Ledger', icon: Award }
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    adminService.logout();
    router.push('/admin/login');
  };

  return (
    <aside className="admin-sidebar">
      {/* Brand Monogram Header */}
      <div className="admin-sidebar-brand">
        <Link href="/admin" className="admin-brand-lockup">
          <div className="admin-logo-mark">
            <ShieldCheck size={20} strokeWidth={1.5} className="admin-logo-icon" />
          </div>
          <div className="admin-brand-text">
            <span className="admin-brand-name">WRISTO</span>
            <span className="admin-brand-portal">Executive Vault</span>
          </div>
        </Link>
      </div>

      {/* Navigation List */}
      <nav className="admin-nav-menu" aria-label="Admin Navigation">
        <div className="admin-nav-section-title">GOVERNANCE &amp; CMS</div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} strokeWidth={1.5} className="admin-nav-icon" />
              <span className="admin-nav-label">{item.label}</span>
              {isActive && <div className="admin-active-indicator" />}
            </Link>
          );
        })}
      </nav>

      {/* Storefront Link & Logout Footer */}
      <div className="admin-sidebar-footer">
        <Link href="/" target="_blank" className="admin-storefront-link">
          <span>View Public Boutique</span>
          <ArrowUpRight size={14} strokeWidth={1.5} />
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="admin-logout-btn"
          title="Sign out of Administrative Session"
        >
          <LogOut size={16} strokeWidth={1.5} />
          <span>Exit Vault</span>
        </button>
      </div>
    </aside>
  );
}
