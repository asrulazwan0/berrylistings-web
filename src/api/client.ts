import type { PropertiesResponse, PropertyResponse } from './types';

const API_BASE = '/api/v1';

export interface UserItem {
  uuid: string;
  email: string;
  role: string;
  isEnabled: boolean;
  permissions: string[];
}

export interface UsersResponse {
  message: string;
  data: UserItem[];
}

export interface UserResponse {
  message: string;
  data: UserItem;
}

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem('berry_jwt');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) ?? {}),
  };
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (response.status === 204) return undefined as T;

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || err.error || `API error: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

// ── Properties ──

export function getProperties(params: Record<string, string> = {}): Promise<PropertiesResponse> {
  const q = new URLSearchParams(params).toString();
  return fetchApi<PropertiesResponse>(`/properties${q ? `?${q}` : ''}`);
}

export function getProperty(id: string): Promise<PropertyResponse> {
  return fetchApi<PropertyResponse>(`/properties/${id}`);
}

export function createProperty(data: Record<string, unknown>): Promise<PropertyResponse> {
  return fetchApi<PropertyResponse>('/properties', { method: 'POST', body: JSON.stringify(data) });
}

export function updateProperty(uuid: string, data: Record<string, unknown>): Promise<PropertyResponse> {
  return fetchApi<PropertyResponse>(`/properties/${uuid}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function deleteProperty(uuid: string): Promise<void> {
  return fetchApi<void>(`/properties/${uuid}`, { method: 'DELETE' });
}

// ── Auth ──

export function postAuthGoogle(idToken: string): Promise<{ token: string }> {
  return fetchApi<{ data: { token: string } }>('/auth/google', {
    method: 'POST', body: JSON.stringify({ idToken }),
  }).then((res) => ({ token: res.data.token }));
}

// ── Users ──

export function getUsers(): Promise<UsersResponse> {
  return fetchApi<UsersResponse>('/users');
}

export function getUser(uuid: string): Promise<UserResponse> {
  return fetchApi<UserResponse>(`/users/${uuid}`);
}

export function createUser(email: string, role = 'USER'): Promise<UserResponse> {
  return fetchApi<UserResponse>('/users', { method: 'POST', body: JSON.stringify({ email, role }) });
}

export function updateUser(uuid: string, data: { email?: string; isEnabled?: boolean; role?: string }): Promise<UserResponse> {
  return fetchApi<UserResponse>(`/users/${uuid}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function deleteUser(uuid: string): Promise<void> {
  return fetchApi<void>(`/users/${uuid}`, { method: 'DELETE' });
}
