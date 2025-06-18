import { getSession } from 'next-auth/react';

type ApiResponse<T> = Promise<T>;
type ApiMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

// Use the deployed backend URL
const API_BASE_URL = 'https://yearbook.ethioace.com/api';

export const getAuthToken = async (suppressRedirect = false): Promise<string | null> => {
  try {
    console.log('Getting auth token...');
    const session = await getSession();
    console.log('Session in getAuthToken:', session);
    
    if (!session) {
      console.log('No session found');
      if (!suppressRedirect && typeof window !== 'undefined') {
        // Only redirect if we're not already on the login page
        if (!window.location.pathname.startsWith('/auth/login')) {
          const currentPath = window.location.pathname + window.location.search;
          window.location.href = `/auth/login?callbackUrl=${encodeURIComponent(currentPath)}`;
        }
      }
      return null;
    }
    
    // Try both accessToken and access_token for compatibility
    const token = (session as any).accessToken || (session as any).access_token;
    console.log('Auth token found:', !!token);
    
    if (!token && !suppressRedirect) {
      handleUnauthorized();
    }
    
    return token || null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    if (!suppressRedirect) {
      handleUnauthorized();
    }
    return null;
  }
};

const createHeaders = async (customHeaders: HeadersInit = {}): Promise<HeadersInit> => {
  try {
    console.log('Creating headers with custom headers:', customHeaders);
    const headers = new Headers(customHeaders);
    
    // Skip authentication if skip-auth header is present
    if (headers.has('skip-auth')) {
      headers.delete('skip-auth');
      console.log('Skipping authentication for public endpoint');
      return headers;
    }
    
    const token = await getAuthToken();
    
    // Log current headers
    console.log('Current headers:', Object.fromEntries(headers.entries()));
    
    // Only set Content-Type to application/json if it's not already set and not FormData
    const isFormData = headers.get('Content-Type')?.includes('multipart/form-data') || 
                     (customHeaders instanceof Headers && customHeaders.get('Content-Type')?.includes('multipart/form-data'));
    
    console.log('Is FormData:', isFormData);
    
    if (!headers.has('Content-Type') && !isFormData) {
      headers.set('Content-Type', 'application/json');
      console.log('Set Content-Type to application/json');
    }
    
    // Add authorization header if token exists
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
      console.log('Added Authorization header');
    } else {
      console.warn('No auth token available');
    }
    
    console.log('Final headers:', Object.fromEntries(headers.entries()));
    return headers;
  } catch (error) {
    console.error('Error creating headers:', error);
    throw error;
  }
};

// Function to handle unauthorized access
const handleUnauthorized = () => {
  console.log('Handling unauthorized access - redirecting to login');
  // Clear the current session
  if (typeof window !== 'undefined') {
    // Redirect to login page with a return URL
    const currentPath = window.location.pathname + window.location.search;
    const loginUrl = `/auth/login?callbackUrl=${encodeURIComponent(currentPath)}`;
    
    // Only redirect if we're not already on the login page to avoid infinite redirects
    if (!window.location.pathname.startsWith('/auth/login')) {
      window.location.href = loginUrl;
    }
  }
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  console.log(`Response status: ${response.status} ${response.statusText}`);
  
  if (!response.ok) {
    let errorData: any;
    try {
      errorData = await response.json().catch(() => ({}));
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        error: errorData
      });
    } catch (e) {
      console.error('Failed to parse error response:', e);
      errorData = { message: 'Failed to parse error response' };
    }
    
    if (response.status === 401) {
      console.error('Authentication failed. Possible issues:');
      console.error('- Invalid or expired token');
      console.error('- Missing authentication header');
      console.error('- Token not properly set in session');
      
      // Handle unauthorized access
      handleUnauthorized();
      
      // Return a rejected promise to stop further execution
      return Promise.reject(new Error('Authentication required'));
    }
    
    const errorMessage = errorData.detail || errorData.message || 
                       `API request failed: ${response.status} ${response.statusText}`;
    const error = new Error(errorMessage);
    (error as any).status = response.status;
    (error as any).data = errorData;
    throw error;
  }
  
  // Handle 204 No Content
  if (response.status === 204) {
    console.log('204 No Content response');
    return undefined as T;
  }
  
  try {
    const data = await response.json();
    console.log('API Response data:', data);
    return data;
  } catch (error) {
    console.error('Failed to parse response JSON:', error);
    throw new Error('Failed to parse response data');
  }
};

export const api = {
  get: async <T>(endpoint: string, options: RequestInit = {}): ApiResponse<T> => {
    const headers = await createHeaders(options.headers);
    const skipAuth = (options.headers as Record<string, string>)?.['skip-auth'] === 'true';
    
    const fetchOptions: RequestInit = {
      ...options,
      headers: {
        ...(options.headers || {}),
        ...headers,
      },
      credentials: 'include',
    };

    // Remove skip-auth header before sending the request
    if (fetchOptions.headers && 'delete' in fetchOptions.headers) {
      (fetchOptions.headers as Headers).delete('skip-auth');
    } else if (typeof fetchOptions.headers === 'object') {
      delete (fetchOptions.headers as Record<string, string>)['skip-auth'];
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);
    return handleResponse<T>(response);
  },
  
  post: async <T>(
    endpoint: string, 
    data: any,
    options: RequestInit = {}
  ): ApiResponse<T> => {
    const headers = await createHeaders(options.headers);
    const body = data instanceof FormData ? data : JSON.stringify(data);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'POST',
      headers,
      body,
      credentials: 'include',
    });

    return handleResponse<T>(response);
  },

  patch: async <T>(
    endpoint: string,
    data: any,
    options: RequestInit = {}
  ): ApiResponse<T> => {
    const headers = await createHeaders(options.headers);
    const body = data instanceof FormData ? data : JSON.stringify(data);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'PATCH',
      headers,
      body,
      credentials: 'include',
    });

    return handleResponse<T>(response);
  },

  delete: async <T>(
    endpoint: string,
    data?: any,
    options: RequestInit = {}
  ): ApiResponse<T> => {
    const headers = await createHeaders(options.headers);
    const body = data ? (data instanceof FormData ? data : JSON.stringify(data)) : undefined;
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'DELETE',
      headers,
      body,
      credentials: 'include',
    });

    return handleResponse<T>(response);
  },

  put: async <T>(
    endpoint: string,
    data: any,
    options: RequestInit = {}
  ): ApiResponse<T> => {
    const headers = await createHeaders(options.headers);
    const body = data instanceof FormData ? data : JSON.stringify(data);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'PUT',
      headers,
      body,
      credentials: 'include',
    });

    return handleResponse<T>(response);
  },

  getApiUrl: () => API_BASE_URL
};
