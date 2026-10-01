import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { SearchProvider } from '@/context/SearchContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import SearchModal from '@/components/search/SearchModal';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://wristo-luxury.vercel.app'),
  title: 'WRISTO — Your Time. Your Style. | Ultra-Luxury Watch Marketplace',
  description: 'Curated luxury, automatic, minimalist, and connected timepieces from trusted global watchmakers. Intelligent AI-powered watch styling for every wrist and occasion.',
  keywords: ['luxury watches', 'automatic watches', 'chronographs', 'WRISTO', 'minimalist watches', 'timepieces'],
  icons: {
    icon: '/assets/brand/app-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Sora:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          <WishlistProvider>
            <SearchProvider>
              <Header />
              <main id="main-content-view">{children}</main>
              <Footer />
              <CartDrawer />
              <SearchModal />
            </SearchProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
