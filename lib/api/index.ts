// Get the API URL from environment variables or use the default
const API_BASE_URL = 'https://yearbook.ethioace.com/api';

/**
 * Helper function to get the full API URL for a given endpoint
 * @param endpoint The API endpoint (e.g., 'profiles/')
 * @returns Full URL string
 */
export function getApiUrl(endpoint: string): string {
  // Remove leading/trailing slashes for consistency
  const normalizedEndpoint = endpoint.replace(/^\/+|\/+$/g, '');
  return `${API_BASE_URL}/${normalizedEndpoint}`;
}

/**
 * Helper function to get headers for authenticated requests
 * @param token Optional authentication token
 * @returns Headers object
 */
export async function getAuthHeaders(token?: string): Promise<HeadersInit> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // If token is provided, use it
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    // Otherwise, try to get the session
    const { getSession } = await import('next-auth/react');
    const session = await getSession();
    if (session?.accessToken) {
      headers['Authorization'] = `Bearer ${session.accessToken}`;
    }
  }

  return headers;
}

/**
 * Helper function to handle API responses
 * @param response The fetch Response object
 * @returns Parsed JSON data
 * @throws {Error} If the response is not OK
 */
export async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  
  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong');
    (error as any).status = response.status;
    (error as any).data = data;
    throw error;
  }
  
  return data as T;
}
