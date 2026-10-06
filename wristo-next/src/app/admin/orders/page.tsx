'use client';

import React, { useEffect, useState } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Edit2,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { AdminOrder } from '@/types/admin';
import OrderStatusModal from '@/components/admin/OrderStatusModal';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<AdminOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getOrders();
      setOrders(data);
      setFilteredOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    let result = [...orders];

    if (statusFilter !== 'ALL') {
      result = result.filter((o) => o.orderStatus === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q)
      );
    }

    setFilteredOrders(result);
  }, [searchQuery, statusFilter, orders]);

  const handleOpenStatusModal = (order: AdminOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    status: string,
    trackingNumber?: string,
    courierName?: string
  ) => {
    await adminService.updateOrderStatus(orderId, status, trackingNumber, courierName);
    await loadOrders();
  };

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
        return 'success';
      case 'PENDING':
      case 'PROCESSING':
      case 'SHIPPED':
        return 'warning';
      case 'CANCELLED':
      case 'REJECTED':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
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
            fontSize: '26px',
            fontWeight: 500,
            color: 'var(--brand-ivory, #F7F3EC)',
            marginBottom: '4px'
          }}>
            Boutique Order Fulfillment Pipeline
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted, #8A8A8A)' }}>
            Monitor luxury acquisitions, dispatch armored couriers, and maintain horological client records.
          </p>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="admin-card">
        {/* Toolbar */}
        <div className="admin-table-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} strokeWidth={1.5} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)'
              }} />
              <input
                type="text"
                placeholder="Search by order ref, client name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-search-input"
                style={{ paddingLeft: '34px', minWidth: '300px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={14} strokeWidth={1.5} color="var(--brand-bronze)" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="admin-form-select"
                style={{ padding: '7px 12px', fontSize: '12px' }}
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">PENDING</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Showing <strong>{filteredOrders.length}</strong> of {orders.length} acquisitions
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Client</th>
                <th>Timepieces Acquired</th>
                <th style={{ textAlign: 'right' }}>Total Gross</th>
                <th>Payment</th>
                <th>Fulfillment Pipeline</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)' }}>
                    Loading acquisition ledger...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)' }}>
                    No acquisitions match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <div>
                        <span className="tabular-nums" style={{
                          fontFamily: 'monospace',
                          fontSize: '13px',
                          fontWeight: 700,
                          color: 'var(--brand-ivory)'
                        }}>
                          {order.orderNumber}
                        </span>
                        <div className="tabular-nums" style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN')}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--brand-ivory)' }}>{order.customerName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{order.customerEmail}</div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '12.5px' }}>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{ color: 'var(--color-text-secondary)', marginBottom: '2px' }}>
                            <strong style={{ color: 'var(--brand-ivory)' }}>{item.brand}</strong> {item.model}
                            <span style={{ fontSize: '11px', color: 'var(--brand-bronze)', marginLeft: '4px' }}>x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="tabular-nums" style={{ fontWeight: 700, color: 'var(--color-accent-champagne)', fontSize: '14px' }}>
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </td>
                    <td>
                      <div>
                        <span className={`status-pill ${order.paymentStatus === 'PAID' ? 'success' : 'warning'}`}>
                          {order.paymentStatus}
                        </span>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                          {order.paymentMethod}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <span className={`status-pill ${getStatusClass(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                        {order.trackingNumber && (
                          <div style={{ fontSize: '10.5px', color: 'var(--brand-bronze)', fontFamily: 'monospace', marginTop: '4px' }}>
                            {order.trackingNumber}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleOpenStatusModal(order)}
                        className="admin-btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '11.5px' }}
                      >
                        <Truck size={12} strokeWidth={1.5} />
                        <span>Fulfillment</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Status Modal */}
      <OrderStatusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUpdateOrderStatus}
        order={selectedOrder}
      />
    </div>
  );
}
