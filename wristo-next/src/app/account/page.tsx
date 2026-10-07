import { Suspense } from 'react';
import type { Metadata } from 'next';
import AccountClient from './AccountClient';
import { AccountTab } from '@/types/account';

export const metadata: Metadata = {
  title: 'Client Vault & Provenance Register | WRISTO',
  description: 'Private collector account, verified horological provenance certificates, insured delivery destinations, and private watch vault.',
  robots: {
    index: false,
    follow: false
  }
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AccountPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const validTabs: AccountTab[] = ['overview', 'orders', 'addresses', 'wishlist', 'settings', 'provenance'];
  const tabCandidate = typeof params?.tab === 'string' ? params.tab : 'overview';
  const initialTab = validTabs.includes(tabCandidate as AccountTab) ? (tabCandidate as AccountTab) : 'overview';
  const initialCert = typeof params?.cert === 'string' ? params.cert : undefined;

  return (
    <Suspense fallback={null}>
      <AccountClient initialTab={initialTab} initialCert={initialCert} />
    </Suspense>
  );
}
