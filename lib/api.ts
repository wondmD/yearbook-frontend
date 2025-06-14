// Default to local development URL if environment variable is not set
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// Helper function to get auth token
async function getAuthToken() {
  const session = await fetch('/api/auth/session');
  const data = await session.json();
  return data?.accessToken || '';
}

// Common headers for authenticated requests
async function getAuthHeaders() {
  const token = await getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

/**
 * Make an authenticated GET request
 */
export async function authGet(url: string) {
  const response = await fetch(url, {
    headers: await getAuthHeaders(),
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Make an authenticated PATCH request
 */
export async function authPatch(url: string, data: any) {
  const response = await fetch(url, {
    method: 'PATCH',
    headers: await getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Get the full API URL for a given endpoint
 * @param endpoint API endpoint (e.g., 'users/unapproved/')
 * @returns Full URL string
 */
export function getApiUrl(endpoint: string): string {
  // Remove leading/trailing slashes to avoid double slashes
  const cleanEndpoint = endpoint.replace(/^\/+|\/+$/g, '');
  return `${API_BASE_URL}/api/auth/${cleanEndpoint}/`;
}

/**
 * Get the full API URL for admin endpoints
 * @param endpoint Admin API endpoint (e.g., 'pending-photos')
 * @returns Full URL string
 */
export function getAdminApiUrl(endpoint: string): string {
  // Remove leading/trailing slashes to avoid double slashes
  const cleanEndpoint = endpoint.replace(/^\/+|\/+$/g, '');
  return `${API_BASE_URL}/api/events/admin/${cleanEndpoint}/`;
}
