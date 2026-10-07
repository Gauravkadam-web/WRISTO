'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { adminService } from '@/services/adminService';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // If on /admin/login, bypass check
    if (pathname === '/admin/login') {
      setIsAuthorized(true);
      return;
    }

    const admin = adminService.getCurrentAdmin();
    if (!admin) {
      setIsAuthorized(false);
      router.push('/admin/login');
      return;
    }

    const role = (admin.role || '').toUpperCase();
    const isAllowed = role.includes('ADMIN') || role.includes('SUPER') || role === 'OWNER';

    if (!isAllowed) {
      setIsAuthorized(false);
      router.push('/admin/login');
    } else {
      setIsAuthorized(true);
    }
  }, [pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isAuthorized === null) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--brand-soft-black, #0F0F0F)',
        color: 'var(--color-accent-champagne, #E8C89A)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '2px solid rgba(232, 200, 154, 0.2)',
            borderTopColor: 'var(--color-accent-champagne, #E8C89A)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Verifying Horological Security Credentials...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
