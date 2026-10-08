/**
 * WRISTO — Centralized Environment & System Configuration
 * 
 * Safely parses and validates runtime environment variables.
 * Provides resilient fallback defaults so missing environment variables
 * will never cause unexpected runtime crashes on Vercel production.
 */

export interface AppConfig {
  apiUrl: string;
  siteUrl: string;
  isProduction: boolean;
  isDevelopment: boolean;
}

function getSanitizedEnvUrl(key: string, defaultValue: string): string {
  const value = process.env[key];
  if (!value || typeof value !== 'string') {
    return defaultValue;
  }
  const trimmed = value.trim();
  if (!trimmed || trimmed === 'undefined' || trimmed === 'null') {
    return defaultValue;
  }
  // Strip trailing slash for consistency
  return trimmed.replace(/\/+$/, '');
}

export const env: AppConfig = {
  apiUrl: getSanitizedEnvUrl(
    'NEXT_PUBLIC_API_URL',
    'https://wristo.onrender.com/api/v1'
  ),
  siteUrl: getSanitizedEnvUrl(
    'NEXT_PUBLIC_SITE_URL',
    'https://wristo.vercel.app'
  ),
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
};

// Validate configuration on initialization (log warning instead of crashing)
if (typeof window === 'undefined') {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    console.info(
      `[WRISTO Config] NEXT_PUBLIC_API_URL not explicitly set. Defaulting to: ${env.apiUrl}`
    );
  }
}
