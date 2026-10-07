'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AccountTab, CollectorProfile, SavedAddress } from '@/types/account';
import { OrderRecord } from '@/types/order';
import { getCollectorProfile, getSavedAddresses, DEFAULT_PROFILE, DEFAULT_ADDRESSES } from '@/services/accountService';
import { getOrders } from '@/services/orderService';
import { useWishlist } from '@/context/WishlistContext';

import AccountHeader from '@/components/account/AccountHeader';
import AccountNav from '@/components/account/AccountNav';
import OverviewTab from '@/components/account/OverviewTab';
import OrdersTab from '@/components/account/OrdersTab';
import AddressesTab from '@/components/account/AddressesTab';
import WishlistTab from '@/components/account/WishlistTab';
import SettingsTab from '@/components/account/SettingsTab';
import CertificateModal from '@/components/account/CertificateModal';

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
      fullName: 'Aditya Vikram Singhania',
      email: 'aditya.singhania@horology.com',
      phone: '9820198201',
      pincode: '400001',
      addressLine1: 'Penthouse 12, Altamount Towers, Altamount Road',
      addressLine2: '',
      city: 'Mumbai',
      state: 'Maharashtra',
      landmark: 'Near Royal Opera House',
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

  const validTabs: AccountTab[] = ['overview', 'orders', 'addresses', 'wishlist', 'settings'];
  const [activeTab, setActiveTab] = useState<AccountTab>(
    tabParam && validTabs.includes(tabParam) ? tabParam : initialTab
  );

  const [profile, setProfile] = useState<CollectorProfile>(DEFAULT_PROFILE);
  const [addresses, setAddresses] = useState<SavedAddress[]>(DEFAULT_ADDRESSES);
  const [orders, setOrders] = useState<OrderRecord[]>(SEED_SAMPLE_ORDERS);

  const [selectedCertOrder, setSelectedCertOrder] = useState<OrderRecord | null>(
    certParam === 'open' || certParam === 'sample' ? SEED_SAMPLE_ORDERS[0] : null
  );

  const { wishlistCount } = useWishlist();

  useEffect(() => {
    async function loadData() {
      const [userProfile, savedAddrs, savedOrders] = await Promise.all([
        getCollectorProfile(),
        getSavedAddresses(),
        getOrders()
      ]);

      setProfile(userProfile);
      setAddresses(savedAddrs);
      const resolvedOrders = savedOrders.length > 0 ? savedOrders : SEED_SAMPLE_ORDERS;
      setOrders(resolvedOrders);

      if (certParam === 'open' || certParam === 'sample') {
        setSelectedCertOrder(resolvedOrders[0]);
      }
    }
    loadData();
  }, [searchParams, certParam]);

  const handleTabChange = (newTab: AccountTab) => {
    setActiveTab(newTab);
    router.replace(`/account?tab=${newTab}`, { scroll: false });
    if (typeof window !== 'undefined') {
      const navElement = document.querySelector('.account-nav-bar');
      if (navElement && window.scrollY > 200) {
        navElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  return (
    <div className="account-page-wrapper">
      <div className="container">
        {/* Collector Profile Header Banner */}
        <AccountHeader profile={profile} />

        {/* Tab Navigation */}
        <AccountNav
          activeTab={activeTab}
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

          {activeTab === 'orders' && (
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
