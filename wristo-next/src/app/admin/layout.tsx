'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <AdminAuthGuard>
      {isLoginPage ? (
        <main className="admin-login-layout">
          {children}
        </main>
      ) : (
        <div className="admin-app-container">
          <AdminSidebar />
          <div className="admin-main-wrapper">
            <AdminHeader />
            <main className="admin-content-area">
              {children}
            </main>
          </div>
        </div>
      )}
    </AdminAuthGuard>
  );
}
