/**
 * WRISTO — Centralized Resilient API Client
 * 
 * Provides unified HTTP communication to Spring Boot 3.3.4 REST endpoints
 * with automatic JWT authorization injection, timeout protection,
 * cold-start retry capability, and structured telemetry logging for Vercel.
 */

import { env } from '@/config/env';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

export const API_BASE_URL = env.apiUrl;

const DEFAULT_TIMEOUT_MS = 9000;
const MAX_RETRIES = 1;

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  const adminToken = localStorage.getItem('wristo_admin_token');
  if (adminToken) return adminToken;

  const authToken = localStorage.getItem('wristo_auth_token');
  if (authToken) return authToken;

  try {
    const adminUser = localStorage.getItem('wristo_admin_user');
    if (adminUser) {
      const parsed = JSON.parse(adminUser);
      if (parsed?.token) return parsed.token;
    }
  } catch {
    // ignore
  }

  try {
    const authUser = localStorage.getItem('wristo_auth_user');
    if (authUser) {
      const parsed = JSON.parse(authUser);
      if (parsed?.token || parsed?.accessToken) return parsed.token || parsed.accessToken;
    }
  } catch {
    // ignore
  }

  return null;
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
  retryCount: number = 0
): Promise<ApiResponse<T>> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullUrl = `${API_BASE_URL}${cleanEndpoint}`;

  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const startTime = Date.now();

  try {
    const response = await fetchWithTimeout(
      fullUrl,
      {
        ...options,
        headers
      },
      timeoutMs
    );

    if (!response.ok) {
      // If server returned 502/503/504 (e.g. Render spinning up), attempt one retry
      if ((response.status >= 500 && response.status <= 504) && retryCount < MAX_RETRIES) {
        console.warn(`[API] Retrying ${cleanEndpoint} after status ${response.status} (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
        await new Promise(r => setTimeout(r, 1200));
        return apiRequest<T>(endpoint, options, timeoutMs, retryCount + 1);
      }

      let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const errorJson = await response.json();
        if (errorJson.message) errorMessage = errorJson.message;
      } catch {
        // Ignore parse failure
      }
      throw new Error(errorMessage);
    }

    const json = await response.json();
    return json;
  } catch (error: any) {
    const duration = Date.now() - startTime;
    const isAbort = error?.name === 'AbortError' || error?.code === 20;

    // Retry once on timeout/network abort if within budget
    if (isAbort && retryCount < MAX_RETRIES) {
      console.warn(`[API Timeout] Retrying ${cleanEndpoint} (elapsed: ${duration}ms, attempt ${retryCount + 1}/${MAX_RETRIES})...`);
      await new Promise(r => setTimeout(r, 1000));
      return apiRequest<T>(endpoint, options, timeoutMs + 3000, retryCount + 1);
    }

    // Log diagnostic error details for Vercel Telemetry
    console.error(`[API Exception] ${options.method || 'GET'} ${cleanEndpoint} failed (${duration}ms):`, {
      message: error?.message || 'Unknown network deviation',
      endpoint: cleanEndpoint,
      fullUrl,
      retryCount,
      stack: error?.stack
    });

    throw error;
  }
}

export const apiClient = {
  get: <T>(endpoint: string, timeoutMs?: number) =>
    apiRequest<T>(endpoint, { method: 'GET' }, timeoutMs),

  post: <T>(endpoint: string, body?: unknown, timeoutMs?: number) =>
    apiRequest<T>(
      endpoint,
      {
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined
      },
      timeoutMs
    ),

  put: <T>(endpoint: string, body?: unknown, timeoutMs?: number) =>
    apiRequest<T>(
      endpoint,
      {
        method: 'PUT',
        body: body ? JSON.stringify(body) : undefined
      },
      timeoutMs
    ),

  patch: <T>(endpoint: string, body?: unknown, timeoutMs?: number) =>
    apiRequest<T>(
      endpoint,
      {
        method: 'PATCH',
        body: body ? JSON.stringify(body) : undefined
      },
      timeoutMs
    ),

  delete: <T>(endpoint: string, timeoutMs?: number) =>
    apiRequest<T>(endpoint, { method: 'DELETE' }, timeoutMs)
};
