import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { SearchProvider } from '@/context/SearchContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import SearchModal from '@/components/search/SearchModal';
import { OrganizationJsonLd } from '@/components/seo/JsonLd';

export const viewport: Viewport = {
  themeColor: '#0A0A0C',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://wristo.vercel.app'),
  title: {
    default: 'WRISTO — Your Time. Your Style. | Ultra-Luxury Watch Marketplace',
    template: '%s | WRISTO Luxury Watches',
  },
  description: 'Curated luxury, automatic, minimalist, and connected timepieces from trusted global watchmakers. Intelligent AI-powered watch styling for every wrist and occasion.',
  keywords: [
    'luxury watches',
    'automatic watches',
    'chronographs',
    'WRISTO',
    'minimalist watches',
    'timepieces',
    'Swiss horology',
    'watch collectors',
  ],
  authors: [{ name: 'WRISTO Haute Horlogerie' }],
  creator: 'WRISTO',
  publisher: 'WRISTO Haute Horlogerie',
  icons: {
    icon: '/assets/brand/app-icon.png',
    apple: '/assets/brand/app-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://wristo.vercel.app',
    siteName: 'WRISTO',
    title: 'WRISTO — Your Time. Your Style. | Ultra-Luxury Watch Marketplace',
    description: 'Curated luxury, automatic, minimalist, and connected timepieces from trusted global watchmakers.',
    images: [
      {
        url: '/assets/brand/app-icon.png',
        width: 512,
        height: 512,
        alt: 'WRISTO Luxury Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WRISTO — Ultra-Luxury Watch Marketplace',
    description: 'Curated luxury, automatic, and mechanical timepieces from trusted global watchmakers.',
    images: ['/assets/brand/app-icon.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
        <OrganizationJsonLd />
      </head>
      <body>
        <a href="#main-content-view" className="skip-to-content-link">
          Skip to Timepiece Collection
        </a>
        <CartProvider>
          <WishlistProvider>
            <SearchProvider>
              <Header />
              <main id="main-content-view" tabIndex={-1}>
                {children}
              </main>
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

