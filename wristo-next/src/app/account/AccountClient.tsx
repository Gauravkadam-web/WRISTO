'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AccountTab, CollectorProfile, SavedAddress } from '@/types/account';
import { OrderRecord } from '@/types/order';
import { getCollectorProfile, getSavedAddresses } from '@/services/accountService';
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

const INITIAL_PROFILE: CollectorProfile = {
  id: '',
  fullName: 'Valued Collector',
  email: '',
  phone: '',
  salutation: 'Collector',
  vipTier: 'Grand Complication Patron',
  joinedDate: '',
  wristSizeMm: 175,
  currency: 'INR',
  notifications: {
    orderTelemetry: true,
    rareAllocations: true,
    conciergeBriefings: false
  }
};

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

  const [profile, setProfile] = useState<CollectorProfile>(INITIAL_PROFILE);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  const [selectedCertOrder, setSelectedCertOrder] = useState<OrderRecord | null>(null);

  const { wishlistCount } = useWishlist();

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
        getCollectorProfile().catch(() => null),
        getSavedAddresses().catch(() => []),
        getOrders().catch(() => [])
      ]);

      if (userProfile) setProfile(userProfile);
      if (savedAddrs) setAddresses(savedAddrs);
      if (savedOrders) setOrders(savedOrders);

      if ((certParam === 'open' || certParam === 'sample' || tabParam === 'provenance') && savedOrders && savedOrders.length > 0) {
        setSelectedCertOrder(savedOrders[0]);
      }
    } catch {
      // Ignore
    }
  };

  const handleAuthSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    loadAccountData();
  };

  const handleLogout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setProfile(INITIAL_PROFILE);
    setOrders([]);
    setAddresses([]);
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
          <div className="section-label">ACCOUNT</div>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '8px' }}>
            Loading your account...
          </p>
        </div>
      </div>
    );
  }

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
