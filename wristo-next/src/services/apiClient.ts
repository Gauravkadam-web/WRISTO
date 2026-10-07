/**
 * WRISTO — Centralized Resilient API Client
 * 
 * Provides unified HTTP communication to Spring Boot 3.3.4 REST endpoints
 * with automatic JWT authorization injection, timeout protection,
 * and resilient error handling.
 */

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://wristo.onrender.com/api/v1';

const DEFAULT_TIMEOUT_MS = 6000;

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return (
    localStorage.getItem('wristo_admin_token') ||
    localStorage.getItem('wristo_auth_token') ||
    null
  );
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
  timeoutMs: number = DEFAULT_TIMEOUT_MS
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

  const response = await fetchWithTimeout(
    fullUrl,
    {
      ...options,
      headers
    },
    timeoutMs
  );

  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const errorJson = await response.json();
      if (errorJson.message) errorMessage = errorJson.message;
    } catch {
      // Ignore parse failure
    }
    throw new Error(errorMessage);
  }

  return response.json();
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
