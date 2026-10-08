import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductById, getSimilarProducts, getAllProductIds } from '@/services/productService';
import ProductDetailClient from '@/components/product/ProductDetailClient';
import { ProductJsonLd, BreadcrumbsJsonLd } from '@/components/seo/JsonLd';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const ids = await getAllProductIds();
  return (ids || []).map((id) => ({ id }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
      return {
        title: 'Timepiece Not Found | WRISTO Luxury Watches',
        description: 'The requested luxury watch could not be located in our horological archive.'
      };
    }

    const title = `${product.brand || 'Luxury'} ${product.model || 'Timepiece'} — ${product.movement || 'Precision'} ${product.caseSize || ''} | WRISTO`;
    const description = `${product.tagline || ''} ${(product.description || '').slice(0, 140)}... Free insured shipping & 2-year international warranty.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: product.image ? [
          {
            url: product.image,
            width: 800,
            height: 800,
            alt: `${product.brand} ${product.model}`
          }
        ] : []
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: product.image ? [product.image] : []
      }
    };
  } catch {
    return {
      title: 'Luxury Timepiece | WRISTO',
      description: 'Haute Horlogerie timepiece in the WRISTO Master Archive.'
    };
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const similarProducts = (await getSimilarProducts(product.id, 4).catch(() => [])) || [];

  return (
    <>
      <ProductJsonLd product={product} />
      <BreadcrumbsJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Timepieces', url: '/watches' },
          { name: product.brand, url: `/watches?brand=${encodeURIComponent(product.brand)}` },
          { name: `${product.brand} ${product.model}`, url: `/product/${product.id}` },
        ]}
      />
      <ProductDetailClient
        product={product}
        similarProducts={similarProducts}
      />
    </>
  );
}

