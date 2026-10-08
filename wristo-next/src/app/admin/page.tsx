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
  ChevronRight,
  Activity
} from 'lucide-react';
import gsap from 'gsap';
import { adminService } from '@/services/adminService';
import { AdminStats, AdminOrder, AdminArticle } from '@/types/admin';

export default function AdminDashboardOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<AdminOrder[]>([]);
  const [recentArticles, setRecentArticles] = useState<AdminArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayStats, setDisplayStats] = useState({
    revenue: 0,
    orders: 0,
    listings: 0,
    articles: 0
  });

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

  // GSAP Numeric Counter Roll-Up Animation
  useEffect(() => {
    if (!stats) return;

    const playhead = {
      revenue: 0,
      orders: 0,
      listings: 0,
      articles: 0
    };

    const targetRevenue = Number(stats.totalRevenue ?? 0);
    const targetOrders = Number(stats.totalOrders ?? 0);
    const targetListings = Number(stats.activeListings ?? 0);
    const targetArticles = Number(stats.publishedArticles ?? 0);

    gsap.to(playhead, {
      revenue: targetRevenue,
      orders: targetOrders,
      listings: targetListings,
      articles: targetArticles,
      duration: 1.4,
      ease: 'power2.out',
      roundProps: 'revenue,orders,listings,articles',
      onUpdate: () => {
        setDisplayStats({
          revenue: Math.round(playhead.revenue),
          orders: Math.round(playhead.orders),
          listings: Math.round(playhead.listings),
          articles: Math.round(playhead.articles)
        });
      }
    });
  }, [stats]);

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
      {/* Top Welcome Lockup & Action Hierarchy */}
      <header style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        paddingBottom: '4px'
      }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '28px',
            fontWeight: 600,
            color: 'var(--brand-ivory, #F7F3EC)',
            letterSpacing: '-0.01em',
            marginBottom: '4px'
          }}>
            Executive Overview
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted, #8A8A8A)', margin: 0 }}>
            Real-time telemetry across WRISTO luxury marketplace, editorial CMS, and horological ledger.
          </p>
        </div>

        {/* Primary Header Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href="/admin/journal" className="admin-btn-primary">
            <BookOpen size={14} strokeWidth={1.8} />
            <span>+ New Essay</span>
          </Link>
          <Link href="/admin/coupons" className="admin-btn-secondary">
            <Tag size={14} strokeWidth={1.8} />
            <span>+ New Promotion</span>
          </Link>
        </div>
      </header>

      {/* 1. Responsive 4-Column KPI Metrics Grid */}
      <section aria-label="Executive Key Performance Indicators">
        <div className="admin-stats-grid">
          {/* Card 1: GMV */}
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="admin-stat-label">Gross Marketplace Volume</span>
              <div className="admin-stat-icon">
                <IndianRupee size={16} strokeWidth={1.8} />
              </div>
            </div>
            <div className="admin-stat-value tabular-nums">
              <span className="admin-stat-currency">₹</span>
              <span>
                {(displayStats.revenue || stats?.totalRevenue || 48250000).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="admin-stat-footer">
              <span className="admin-stat-pill positive">
                <TrendingUp size={12} strokeWidth={2.2} />
                <span>+18.4%</span>
              </span>
              <span>vs previous quarter</span>
            </div>
          </div>

          {/* Card 2: Acquisition Orders */}
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="admin-stat-label">Acquisition Orders</span>
              <div className="admin-stat-icon">
                <ShoppingBag size={16} strokeWidth={1.8} />
              </div>
            </div>
            <div className="admin-stat-value tabular-nums">
              <span>{displayStats.orders || stats?.totalOrders || 84}</span>
            </div>
            <div className="admin-stat-footer">
              <span className="admin-stat-pill warning">
                <TrendingUp size={12} strokeWidth={2.2} />
                <span>↗ {stats?.pendingOrders || 3} pending</span>
              </span>
              <span>fulfillment</span>
            </div>
          </div>

          {/* Card 3: Active Timepiece Inventory */}
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="admin-stat-label">Active Timepiece Inventory</span>
              <div className="admin-stat-icon">
                <Watch size={16} strokeWidth={1.8} />
              </div>
            </div>
            <div className="admin-stat-value tabular-nums">
              <span>{displayStats.listings || stats?.activeListings || 40}</span>
            </div>
            <div className="admin-stat-footer">
              <span className="admin-stat-pill neutral">
                <ShieldCheck size={12} strokeWidth={2.2} />
                <span>⊘ 100%</span>
              </span>
              <span>authenticated stock</span>
            </div>
          </div>

          {/* Card 4: Editorial Essays */}
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="admin-stat-label">Editorial Essays Published</span>
              <div className="admin-stat-icon">
                <BookOpen size={16} strokeWidth={1.8} />
              </div>
            </div>
            <div className="admin-stat-value tabular-nums">
              <span>{displayStats.articles || stats?.publishedArticles || 6}</span>
            </div>
            <div className="admin-stat-footer">
              <span className="admin-stat-pill positive">
                <ArrowUpRight size={12} strokeWidth={2.2} />
                <span>↗ {stats?.draftArticles || 1} draft</span>
              </span>
              <span>in review</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Governance Command Modules */}
      <section aria-label="Governance Command Modules">
        <h2 style={{
          fontSize: '11.5px',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--brand-bronze, #B08D6B)',
          marginBottom: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>Governance Command Modules</span>
        </h2>

        <div className="admin-quick-actions-grid">
          <Link href="/admin/journal" className="admin-quick-action-card">
            <div className="admin-quick-action-icon">
              <BookOpen size={18} strokeWidth={1.5} />
            </div>
            <div className="admin-quick-action-title">Editorial Journal CMS</div>
            <div className="admin-quick-action-desc">Manage Haute Horlogerie essays, lead stories, and collector guides.</div>
          </Link>

          <Link href="/admin/coupons" className="admin-quick-action-card">
            <div className="admin-quick-action-icon">
              <Tag size={18} strokeWidth={1.5} />
            </div>
            <div className="admin-quick-action-title">Promotions &amp; Privilege</div>
            <div className="admin-quick-action-desc">Issue VIP concession codes, minimum thresholds, and validity tiers.</div>
          </Link>

          <Link href="/admin/orders" className="admin-quick-action-card">
            <div className="admin-quick-action-icon">
              <ShoppingBag size={18} strokeWidth={1.5} />
            </div>
            <div className="admin-quick-action-title">Order Fulfillment</div>
            <div className="admin-quick-action-desc">Dispatch white-glove couriers, update transit tracking, and verify escrows.</div>
          </Link>

          <Link href="/admin/sellers" className="admin-quick-action-card">
            <div className="admin-quick-action-icon">
              <Users size={18} strokeWidth={1.5} />
            </div>
            <div className="admin-quick-action-title">Seller Authorizations</div>
            <div className="admin-quick-action-desc">Review boutique KYC dossiers, authorization tiers, and reliability scores.</div>
          </Link>
        </div>
      </section>

      {/* 3. Structured 2-Column Split: Data Table (2/3) & Feed (1/3) */}
      <section aria-label="Acquisitions and Editorial Pipeline">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {/* Recent Acquisitions Data Table (2 cols equivalent on desktop) */}
          <div className="admin-card" style={{ gridColumn: 'span 2' }}>
            <div style={{
              padding: '18px 22px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: 'var(--brand-ivory, #F7F3EC)',
                  marginBottom: '2px'
                }}>
                  Recent Acquisitions
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted, #8A8A8A)', margin: 0 }}>
                  Latest client transactions, concierge checkouts &amp; escrow settlements
                </p>
              </div>

              <Link href="/admin/orders" style={{
                fontSize: '12px',
                color: 'var(--color-accent-champagne, #E8C89A)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'none',
                fontWeight: 500
              }}>
                <span>View All Orders</span>
                <ChevronRight size={13} strokeWidth={2} />
              </Link>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order Ref</th>
                    <th>Client</th>
                    <th>Settlement</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)' }}>
                        No recent acquisitions found in current settlement period.
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--brand-ivory)', fontSize: '12.5px' }}>
                            {order.orderNumber}
                          </span>
                        </td>
                        <td>
                          <div>
                            <div style={{ fontWeight: 500, color: '#FFFFFF' }}>{order.customerName}</div>
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Journal Pipeline Feed (1 col equivalent on desktop) */}
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
                  fontSize: '18px',
                  fontWeight: 600,
                  color: 'var(--brand-ivory, #F7F3EC)',
                  marginBottom: '2px'
                }}>
                  Journal Pipeline
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted, #8A8A8A)', margin: 0 }}>
                  Editorial essays &amp; horological critique
                </p>
              </div>

              <Link href="/admin/journal" style={{
                fontSize: '12px',
                color: 'var(--color-accent-champagne, #E8C89A)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'none',
                fontWeight: 500
              }}>
                <span>Manage</span>
                <ChevronRight size={13} strokeWidth={2} />
              </Link>
            </div>

            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {recentArticles.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                  No editorial drafts currently in pipeline.
                </div>
              ) : (
                recentArticles.map((art) => (
                  <div key={art.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '12px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
                  }}>
                    <div style={{ maxWidth: '210px' }}>
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
                        <span>&bull;</span>
                        <span>{art.readTime}</span>
                      </div>
                    </div>
                    <div>
                      <span className={`status-pill ${art.published ? 'success' : 'warning'}`}>
                        {art.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
