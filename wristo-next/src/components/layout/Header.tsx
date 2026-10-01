'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useSearch } from '@/context/SearchContext';

export default function Header() {
  const pathname = usePathname();
  const { cartCount, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { openSearch } = useSearch();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname?.startsWith('/checkout')) {
    return null;
  }

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`} id="site-header">
      <div className="container">
        <div className="header-inner">
          {/* Logo with official transparent dual-theme lockups */}
          <Link href="/" className="brand-logo-wrap" aria-label="WRISTO Home">
            <Image
              src="/assets/brand/logo-horizontal-dark.png"
              alt="WRISTO — Your Time. Your Style."
              width={160}
              height={36}
              priority
              className="brand-logo-img logo-theme-dark"
            />
            <Image
              src="/assets/brand/logo-horizontal-light.png"
              alt="WRISTO — Your Time. Your Style."
              width={160}
              height={36}
              priority
              className="brand-logo-img logo-theme-light"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="main-nav" aria-label="Main Navigation">
            <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
              Home
            </Link>
            <Link href="/watches" className={`nav-link ${pathname.startsWith('/watches') && !pathname.includes('gender=') ? 'active' : ''}`}>
              All Watches
            </Link>
            <Link href="/watches?gender=Men" className="nav-link">
              Men
            </Link>
            <Link href="/watches?gender=Women" className="nav-link">
              Women
            </Link>
            <Link href="/watches?category=automatic" className="nav-link">
              Automatics
            </Link>
            <Link href="/watches?category=chronograph" className="nav-link">
              Chronographs
            </Link>
          </nav>

          {/* Header Utilities */}
          <div className="header-actions">
            {/* Search Trigger */}
            <button
              type="button"
              className="header-action-btn search-trigger-btn"
              onClick={openSearch}
              title="Search Timepieces (⌘K or /)"
              aria-label="Search Timepieces"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span className="header-search-badge">⌘K</span>
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" className="header-action-btn" title="Saved Wishlist" aria-label="Wishlist">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="action-badge" style={{ display: 'flex' }}>
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart Drawer Trigger */}
            <button
              type="button"
              className="header-action-btn"
              onClick={openCartDrawer}
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cartCount > 0 && (
                <span className="action-badge" style={{ display: 'flex' }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
