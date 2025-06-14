// Default to local development URL if environment variable is not set
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Get the full API URL for a given endpoint
 * @param endpoint API endpoint (e.g., 'admin/users/unapproved/')
 * @returns Full URL string
 */
export function getApiUrl(endpoint: string): string {
  // Remove leading/trailing slashes to avoid double slashes
  const cleanEndpoint = endpoint.replace(/^\/+|\/+$/g, '');
  return `${API_BASE_URL}/api/auth/${cleanEndpoint}/`;
}
