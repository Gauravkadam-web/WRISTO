'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  IndianRupee,
  ShoppingBag,
  Watch,
  BookOpen,
  ArrowUpRight,
  TrendingUp,
  Tag,
  Users,
  ShieldCheck,
  Clock,
  ChevronRight
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { AdminStats, AdminOrder, AdminArticle } from '@/types/admin';

export default function AdminDashboardOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<AdminOrder[]>([]);
  const [recentArticles, setRecentArticles] = useState<AdminArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsData, ordersData, articlesData] = await Promise.all([
          adminService.getStats(),
          adminService.getOrders(),
          adminService.getArticles()
        ]);
        setStats(statsData);
        setRecentOrders(ordersData.slice(0, 5));
        setRecentArticles(articlesData.slice(0, 4));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'DELIVERED':
      case 'APPROVED':
      case 'ACTIVE':
        return 'success';
      case 'PENDING':
      case 'PROCESSING':
      case 'SHIPPED':
        return 'warning';
      case 'CANCELLED':
      case 'REJECTED':
      case 'EXPIRED':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '2px solid rgba(232, 200, 154, 0.2)',
          borderTopColor: 'var(--color-accent-champagne, #E8C89A)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 12px'
        }} />
        <p style={{ fontSize: '13px', letterSpacing: '0.05em' }}>Loading Executive Vault Telemetry...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Welcome Lockup */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '28px',
            fontWeight: 500,
            color: 'var(--brand-ivory, #F7F3EC)',
            marginBottom: '4px'
          }}>
            Executive Overview
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted, #8A8A8A)' }}>
            Real-time telemetry across WRISTO luxury marketplace, editorial CMS, and horological ledger.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/admin/journal" className="admin-btn-primary">
            <BookOpen size={14} strokeWidth={1.5} />
            <span>New Essay</span>
          </Link>
          <Link href="/admin/coupons" className="admin-btn-secondary">
            <Tag size={14} strokeWidth={1.5} />
            <span>New Promotion</span>
          </Link>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Gross Marketplace Volume</span>
            <div className="admin-stat-icon">
              <IndianRupee size={18} strokeWidth={1.5} />
            </div>
          </div>
          <div className="admin-stat-value tabular-nums">
            {formatCurrency(stats?.totalRevenue || 4328500)}
          </div>
          <div className="admin-stat-footer">
            <span className="admin-stat-trend positive">
              <TrendingUp size={13} strokeWidth={2} />
              +18.4%
            </span>
            <span>vs previous quarter</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Acquisition Orders</span>
            <div className="admin-stat-icon">
              <ShoppingBag size={18} strokeWidth={1.5} />
            </div>
          </div>
          <div className="admin-stat-value">
            {stats?.totalOrders || 84}
          </div>
          <div className="admin-stat-footer">
            <span className="admin-stat-trend positive">
              <TrendingUp size={13} strokeWidth={2} />
              {stats?.pendingOrders || 3} pending
            </span>
            <span>fulfillment</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Active Timepiece Inventory</span>
            <div className="admin-stat-icon">
              <Watch size={18} strokeWidth={1.5} />
            </div>
          </div>
          <div className="admin-stat-value">
            {stats?.activeListings || 40}
          </div>
          <div className="admin-stat-footer">
            <span className="admin-stat-trend positive">
              <ShieldCheck size={13} strokeWidth={2} />
              100%
            </span>
            <span>authenticated stock</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Editorial Essays Published</span>
            <div className="admin-stat-icon">
              <BookOpen size={18} strokeWidth={1.5} />
            </div>
          </div>
          <div className="admin-stat-value">
            {stats?.publishedArticles || 6}
          </div>
          <div className="admin-stat-footer">
            <span className="admin-stat-trend positive">
              <ArrowUpRight size={13} strokeWidth={2} />
              {stats?.draftArticles || 1} draft
            </span>
            <span>in review</span>
          </div>
        </div>
      </div>

      {/* Quick Access Matrix */}
      <div>
        <h2 style={{
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--brand-bronze, #B08D6B)',
          marginBottom: '14px'
        }}>
          Governance Command Modules
        </h2>
        <div className="admin-quick-actions-grid">
          <Link href="/admin/journal" className="admin-quick-action-card">
            <div className="admin-quick-action-icon">
              <BookOpen size={18} strokeWidth={1.5} />
            </div>
            <div className="admin-quick-action-title">Editorial Journal CMS</div>
            <div className="admin-quick-action-desc">Manage horological essays, lead stories, and collectors guides.</div>
          </Link>

          <Link href="/admin/coupons" className="admin-quick-action-card">
            <div className="admin-quick-action-icon">
              <Tag size={18} strokeWidth={1.5} />
            </div>
            <div className="admin-quick-action-title">Promotions & Privilege</div>
            <div className="admin-quick-action-desc">Issue VIP concession codes, min-order thresholds, and validity periods.</div>
          </Link>

          <Link href="/admin/orders" className="admin-quick-action-card">
            <div className="admin-quick-action-icon">
              <ShoppingBag size={18} strokeWidth={1.5} />
            </div>
            <div className="admin-quick-action-title">Order Fulfillment</div>
            <div className="admin-quick-action-desc">Dispatch white-glove couriers, update statuses, and verify payments.</div>
          </Link>

          <Link href="/admin/sellers" className="admin-quick-action-card">
            <div className="admin-quick-action-icon">
              <Users size={18} strokeWidth={1.5} />
            </div>
            <div className="admin-quick-action-title">Seller Authorizations</div>
            <div className="admin-quick-action-desc">Review boutique KYC dossiers, authorization tiers, and ratings.</div>
          </Link>
        </div>
      </div>

      {/* 2 Column Layout: Recent Orders & Editorial Pipeline */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: '24px'
      }}>
        {/* Recent Orders Card */}
        <div className="admin-card">
          <div style={{
            padding: '18px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '17px',
                fontWeight: 600,
                color: 'var(--brand-ivory, #F7F3EC)'
              }}>
                Recent Acquisitions
              </h3>
              <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted, #8A8A8A)' }}>
                Latest luxury client transactions & concierge checkouts
              </p>
            </div>
            <Link href="/admin/orders" style={{
              fontSize: '12px',
              color: 'var(--color-accent-champagne, #E8C89A)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none'
            }}>
              <span>View All</span>
              <ChevronRight size={13} strokeWidth={1.5} />
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order Ref</th>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--brand-ivory)' }}>
                        {order.orderNumber}
                      </span>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 500 }}>{order.customerName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{order.customerEmail}</div>
                      </div>
                    </td>
                    <td>
                      <span className="tabular-nums" style={{ fontWeight: 600, color: 'var(--color-accent-champagne)' }}>
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill ${getStatusClass(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Editorial Pipeline Card */}
        <div className="admin-card">
          <div style={{
            padding: '18px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '17px',
                fontWeight: 600,
                color: 'var(--brand-ivory, #F7F3EC)'
              }}>
                Journal Pipeline
              </h3>
              <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted, #8A8A8A)' }}>
                Editorial essays & horological critique
              </p>
            </div>
            <Link href="/admin/journal" style={{
              fontSize: '12px',
              color: 'var(--color-accent-champagne, #E8C89A)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none'
            }}>
              <span>Manage</span>
              <ChevronRight size={13} strokeWidth={1.5} />
            </Link>
          </div>

          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {recentArticles.map((art) => (
              <div key={art.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '12px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
              }}>
                <div style={{ maxWidth: '240px' }}>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--brand-ivory)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {art.title}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: 'var(--brand-bronze)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '2px'
                  }}>
                    <span>{art.category}</span>
                    <span>•</span>
                    <span>{art.readTime}</span>
                  </div>
                </div>
                <div>
                  <span className={`status-pill ${art.published ? 'success' : 'warning'}`}>
                    {art.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
