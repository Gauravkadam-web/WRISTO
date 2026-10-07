/**
 * WRISTO Dynamic Storage Resolver
 * 
 * Provides unified, environment-driven resolution for luxury timepiece assets.
 * - If NEXT_PUBLIC_STORAGE_BASE_URL is set (e.g. Supabase Storage CDN), it prepends the CDN host.
 * - If unset or offline, it safely and gracefully falls back to local static `/assets/products/`.
 */

export function getProductImageUrl(imagePathOrKey?: string): string {
  if (!imagePathOrKey) {
    return '/assets/products/watch-01.png';
  }

  // If already a full external URL (https://...), return as-is
  if (imagePathOrKey.startsWith('http://') || imagePathOrKey.startsWith('https://')) {
    return imagePathOrKey;
  }

  const storageBaseUrl = process.env.NEXT_PUBLIC_STORAGE_BASE_URL?.trim().replace(/\/$/, '');

  // Extract clean filename: e.g. "watch-01.png" from "/assets/products/watch-01.png"
  const fileName = imagePathOrKey.split('/').pop() || imagePathOrKey;

  if (storageBaseUrl) {
    return `${storageBaseUrl}/${fileName}`;
  }

  // Local static asset fallback
  return imagePathOrKey.startsWith('/') ? imagePathOrKey : `/assets/products/${imagePathOrKey}`;
}
