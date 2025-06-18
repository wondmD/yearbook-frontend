// Use the deployed backend URL
export const API_BASE_URL = 'https://yearbook.ethioace.com';

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
 * @param endpoint API endpoint (e.g., 'memories' or 'memories/1/like')
 * @returns Full URL string with proper formatting
 */
export function getApiUrl(endpoint: string = ''): string {
  // Remove any leading/trailing slashes
  let cleanEndpoint = endpoint.replace(/^\/+|\/+$/g, '');
  
  // Special handling for memory-related endpoints
  if (cleanEndpoint === '' || 
      cleanEndpoint === 'memories' || 
      cleanEndpoint.startsWith('memories/') ||
      cleanEndpoint === 'my_memories' ||
      cleanEndpoint.startsWith('my_memories/')) {
    
    // Handle base memories endpoint
    if (cleanEndpoint === '' || cleanEndpoint === 'memories') {
      return `${API_BASE_URL}/api/memories/`;
    }
    
    // Handle my_memories endpoint
    if (cleanEndpoint === 'my_memories' || cleanEndpoint.startsWith('my_memories/')) {
      const rest = cleanEndpoint.replace('my_memories', '').replace(/^\/+/, '');
      return `${API_BASE_URL}/api/memories/my_memories/${rest ? rest + '/' : ''}`;
    }
    
    // Handle like endpoint
    if (cleanEndpoint.endsWith('/like') || cleanEndpoint.endsWith('/like/')) {
      const memoryId = cleanEndpoint.split('/')[0];
      return `${API_BASE_URL}/api/memories/${memoryId}/like/`;
    }
    
    // Handle other memory endpoints
    return `${API_BASE_URL}/api/memories/${cleanEndpoint.replace('memories/', '')}`;
  }
  
  // Handle admin endpoints
  if (cleanEndpoint.startsWith('admin/')) {
    const adminPath = cleanEndpoint.replace('admin/', '');
    return `${API_BASE_URL}/api/admin/${adminPath}`;
  }
  
  // Default case - prepend with /api/ and ensure proper slashes
  const normalizedEndpoint = cleanEndpoint ? `/${cleanEndpoint}/` : '/';
  return `${API_BASE_URL}/api${normalizedEndpoint}`;
}

/**
 * Get the full API URL for admin endpoints
 * @param endpoint Admin API endpoint (e.g., 'pending-photos', 'pending-events', 'pending-memories')
 * @returns Full URL string with trailing slash
 */
export function getAdminApiUrl(endpoint: string): string {
  // Remove any leading/trailing slashes
  const cleanEndpoint = endpoint.replace(/^\/+|\/+$/g, '');
  
  // Handle event management (approve/reject)
  if (cleanEndpoint.startsWith('events/')) {
    const parts = cleanEndpoint.split('/');
    if (parts.length > 1) {
      const eventId = parts[1];
      return `${API_BASE_URL}/api/events/admin/pending-events/${eventId}/`;
    }
  }
  
  // Handle pending events list and specific event actions
  if (cleanEndpoint.startsWith('pending-events')) {
    const parts = cleanEndpoint.split('/');
    if (parts.length > 1 && parts[1]) {
      // Handle specific event (e.g., pending-events/3/)
      return `${API_BASE_URL}/api/events/admin/pending-events/${parts[1]}/`;
    }
    return `${API_BASE_URL}/api/events/admin/pending-events/`;
  }
  
  // Handle pending photos
  if (cleanEndpoint === 'pending-photos') {
    return `${API_BASE_URL}/api/events/admin/pending-photos/`;
  }
  
  // Handle pending memories
  if (cleanEndpoint === 'pending-memories') {
    return `${API_BASE_URL}/api/memories/admin/pending-memories/`;
  }
  
  // Handle specific memory actions (approve/reject)
  if (cleanEndpoint.startsWith('pending-memories/')) {
    const parts = cleanEndpoint.split('/');
    if (parts.length > 1 && parts[1]) {
      // Handle specific memory (e.g., pending-memories/1/approve/)
      return `${API_BASE_URL}/api/memories/admin/pending-memories/${parts[1]}/`;
    }
  }
  
  // Handle manage photo (approve/reject)
  if (cleanEndpoint.includes('photos/') && (cleanEndpoint.includes('/approve') || cleanEndpoint.includes('/reject'))) {
    const parts = cleanEndpoint.split('/');
    const photoId = parts[0];
    const action = parts[2]; // 'approve' or 'reject'
    return `${API_BASE_URL}/api/events/admin/pending-photos/${photoId}/`;
  }
  
  // Handle specific photo management
  if (cleanEndpoint.startsWith('pending-photos/')) {
    const parts = cleanEndpoint.split('/');
    if (parts.length > 1) {
      return `${API_BASE_URL}/api/events/admin/pending-photos/${parts[1]}/`;
    }
  }
  
  // Legacy support for photos/ format
  if (cleanEndpoint.startsWith('photos/')) {
    const parts = cleanEndpoint.split('/');
    if (parts.length > 1) {
      return `${API_BASE_URL}/api/events/admin/pending-photos/${parts[1]}/`;
    }
  }
  
  // Handle manage memory (approve/reject)
  if (cleanEndpoint.includes('memories/') && (cleanEndpoint.includes('/approve') || cleanEndpoint.includes('/reject'))) {
    const parts = cleanEndpoint.split('/');
    const memoryId = parts[0];
    const action = parts[2]; // 'approve' or 'reject'
    return getApiUrl(`memories/admin/pending-memories/${memoryId}/`);
  }
  
  // For any other admin endpoints, assume they're under /api/admin/
  return `${API_BASE_URL}/api/admin/${cleanEndpoint}/`;
}
