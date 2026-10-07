'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AccountTab, CollectorProfile, SavedAddress } from '@/types/account';
import { OrderRecord } from '@/types/order';
import { getCollectorProfile, getSavedAddresses, DEFAULT_PROFILE, DEFAULT_ADDRESSES } from '@/services/accountService';
import { getOrders } from '@/services/orderService';
import { authService, AuthUser } from '@/services/authService';
import { useWishlist } from '@/context/WishlistContext';

import AccountHeader from '@/components/account/AccountHeader';
import AccountNav from '@/components/account/AccountNav';
import OverviewTab from '@/components/account/OverviewTab';
import OrdersTab from '@/components/account/OrdersTab';
import AddressesTab from '@/components/account/AddressesTab';
import WishlistTab from '@/components/account/WishlistTab';
import SettingsTab from '@/components/account/SettingsTab';
import CertificateModal from '@/components/account/CertificateModal';
import VaultAuthView from '@/components/account/VaultAuthView';

const SEED_SAMPLE_ORDERS: OrderRecord[] = [
  {
    orderId: 'WRT-2026-39226',
    certificateId: 'CERT-CHRONO-484138',
    createdAt: '2026-10-01T10:30:00Z',
    items: [
      {
        productId: 'WRT-001',
        model: 'Atlas Black',
        brand: 'AUREN',
        price: 4999,
        quantity: 1,
        image: '/assets/products/watch-01.png'
      },
      {
        productId: 'WRT-005',
        model: 'Regent Green',
        brand: 'AUREN',
        price: 14999,
        quantity: 1,
        image: '/assets/products/watch-05.png'
      }
    ],
    subtotal: 19998,
    discount: 2000,
    shippingFee: 999,
    total: 18997,
    isGiftWrapped: true,
    giftMessage: 'To an extraordinary horological milestone. May time honor your legacy.',
    coupon: {
      code: 'WRISTO10',
      description: '10% privilege discount applied',
      discountType: 'percentage',
      discountValue: 10,
      calculatedDiscount: 2000
    },
    address: {
      fullName: 'Gaurav Kadam',
      email: 'gauravkadam@gmail.com',
      phone: '+91 98765 43210',
      pincode: '411048',
      addressLine1: 'Row House 04, Clover Highlands, NIBM Road, Kondhwa',
      addressLine2: 'Near Corinthian Club',
      city: 'Pune',
      state: 'Maharashtra',
      landmark: 'Near Corinthian Club',
      deliveryNotes: 'Please ring private security reception.'
    },
    deliveryTier: 'white_glove',
    paymentMethod: 'cod',
    status: 'confirmed'
  }
];

interface AccountClientProps {
  initialTab?: AccountTab;
  initialCert?: string;
}

export default function AccountClient({ initialTab = 'overview', initialCert }: AccountClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = (searchParams.get('tab') as AccountTab | null) || initialTab;
  const certParam = searchParams.get('cert') || initialCert;

  const validTabs: AccountTab[] = ['overview', 'orders', 'addresses', 'wishlist', 'settings', 'provenance'];
  const [activeTab, setActiveTab] = useState<AccountTab>(
    tabParam && validTabs.includes(tabParam)
      ? (tabParam === 'provenance' ? 'orders' : tabParam)
      : initialTab
  );

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);

  const [profile, setProfile] = useState<CollectorProfile>(DEFAULT_PROFILE);
  const [addresses, setAddresses] = useState<SavedAddress[]>(DEFAULT_ADDRESSES);
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  const [selectedCertOrder, setSelectedCertOrder] = useState<OrderRecord | null>(null);

  const { wishlistCount } = useWishlist();

  // Initialize and verify authentication state
  useEffect(() => {
    const authed = authService.isAuthenticated();
    const user = authService.getCurrentUser();
    setIsAuthenticated(authed);
    setCurrentUser(user);
    setIsAuthChecking(false);

    if (authed) {
      loadAccountData();
    }
  }, [searchParams, certParam]);

  const loadAccountData = async () => {
    try {
      const [userProfile, savedAddrs, savedOrders] = await Promise.all([
        getCollectorProfile(),
        getSavedAddresses(),
        getOrders()
      ]);

      setProfile(userProfile);
      setAddresses(savedAddrs);
      const resolvedOrders = savedOrders && savedOrders.length > 0 ? savedOrders : SEED_SAMPLE_ORDERS;
      setOrders(resolvedOrders);

      if (certParam === 'open' || certParam === 'sample' || tabParam === 'provenance') {
        setSelectedCertOrder(resolvedOrders[0]);
      }
    } catch {
      // Fallback
    }
  };

  const handleAuthSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    loadAccountData();

    // If role is ADMIN, smoothly allow user to explore or navigate to admin
    const role = (user.role || '').toUpperCase();
    if (role.includes('ADMIN') || role.includes('SUPER')) {
      // Auto prompt or redirect
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    router.replace('/account', { scroll: false });
  };

  const handleTabChange = (newTab: AccountTab) => {
    setActiveTab(newTab);
    router.replace(`/account?tab=${newTab}`, { scroll: false });
    if (typeof window !== 'undefined') {
      const navElement = document.querySelector('.account-tabs-nav');
      if (navElement && window.scrollY > 200) {
        navElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  if (isAuthChecking) {
    return (
      <div className="account-loading-skeleton">
        <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
          <div className="section-label">HOROLOGICAL VAULT</div>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '8px' }}>
            Verifying 256-bit client identity...
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated, display luxury Role-Based Persona Vault Login / Register
  if (!isAuthenticated) {
    return (
      <div className="account-page-wrapper">
        <div className="container">
          <VaultAuthView onAuthSuccess={handleAuthSuccess} />
        </div>
      </div>
    );
  }

  return (
    <div className="account-page-wrapper">
      <div className="container">
        {/* Collector Profile Header Banner with Role Badge & Logout */}
        <AccountHeader
          profile={profile}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Tab Navigation */}
        <AccountNav
          activeTab={activeTab === 'provenance' ? 'orders' : activeTab}
          onSelectTab={handleTabChange}
          orderCount={orders.length}
          wishlistCount={wishlistCount}
          addressCount={addresses.length}
        />

        {/* Tab Content Container */}
        <div className="account-tab-body">
          {activeTab === 'overview' && (
            <OverviewTab
              profile={profile}
              orders={orders}
              wishlistCount={wishlistCount}
              onNavigateTab={handleTabChange}
              onViewCertificate={setSelectedCertOrder}
            />
          )}

          {(activeTab === 'orders' || activeTab === 'provenance') && (
            <OrdersTab
              orders={orders}
              onViewCertificate={setSelectedCertOrder}
            />
          )}

          {activeTab === 'addresses' && (
            <AddressesTab
              addresses={addresses}
              onRefreshAddresses={setAddresses}
            />
          )}

          {activeTab === 'wishlist' && (
            <WishlistTab />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              profile={profile}
              onUpdateProfile={setProfile}
            />
          )}
        </div>
      </div>

      {/* Provenance Certificate Modal */}
      {selectedCertOrder && (
        <CertificateModal
          order={selectedCertOrder}
          onClose={() => setSelectedCertOrder(null)}
        />
      )}
    </div>
  );
}
