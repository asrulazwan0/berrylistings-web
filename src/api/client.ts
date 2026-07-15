import type { PropertiesResponse, PropertyResponse } from './types';

const API_BASE = '/api/v1';

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem('berry_jwt');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      (errorBody as { message?: string }).message ||
        `API error: ${response.status}`,
    );
  }

  return response.json() as Promise<T>;
}

export function getProperties(
  params: Record<string, string> = {},
): Promise<PropertiesResponse> {
  const query = new URLSearchParams(params).toString();
  return fetchApi<PropertiesResponse>(`/properties${query ? `?${query}` : ''}`);
}

export function getProperty(id: string): Promise<PropertyResponse> {
  return fetchApi<PropertyResponse>(`/properties/${id}`);
}

export function postAuthGoogle(credential: string): Promise<{ token: string }> {
  return fetchApi<{ token: string }>('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ credential }),
  });
}
