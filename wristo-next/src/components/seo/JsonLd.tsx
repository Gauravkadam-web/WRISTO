import React from 'react';
import { Product } from '@/types/product';
import { EditorialArticle } from '@/types/editorial';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wristo.vercel.app';

export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'WRISTO',
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/assets/brand/app-icon.png`,
          width: 512,
          height: 512,
        },
        description: 'Curated luxury, automatic, minimalist, and connected timepieces from trusted global watchmakers.',
        knowsAbout: [
          'Horology',
          'Luxury Watches',
          'Automatic Calibers',
          'Swiss Watchmaking',
          'Chronographs',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'Customer Concierge',
          availableLanguage: ['English', 'Hindi'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'WRISTO — Ultra-Luxury Watch Marketplace',
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/watches?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductJsonLd({ product }: { product: Product }) {
  const imageUrl = product.image.startsWith('http')
    ? product.image
    : `${SITE_URL}${product.image}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${product.brand} ${product.model}`,
    image: [imageUrl],
    description: product.description || product.tagline,
    sku: product.id,
    mpn: product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    category: product.category,
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/product/${product.id}`,
      priceCurrency: 'INR',
      price: product.price,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'WRISTO Authorized Timepieces',
      },
    },
    aggregateRating: product.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviewsCount || 24,
          bestRating: '5',
          worstRating: '1',
        }
      : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ArticleJsonLd({ article }: { article: EditorialArticle }) {
  const imageUrl = article.coverImage.startsWith('http')
    ? article.coverImage
    : `${SITE_URL}${article.coverImage}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    image: [imageUrl],
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author.name,
      jobTitle: article.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'WRISTO Horological Journal',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/assets/brand/app-icon.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/journal/${article.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbsJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
