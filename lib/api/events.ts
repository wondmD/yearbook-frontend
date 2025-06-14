import { getSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface EventPhoto {
  id: number;
  image: string;
  image_url: string;
  caption?: string;
  uploaded_by: {
    id: number;
    username: string;
  };
  uploaded_at: string;
  is_approved: boolean;
  likes?: number;
  event?: number | string;
  category?: string;
}

export interface Event {
  id: number;
  title: string;
  slug: string;
  date: string;
  location: string;
  description: string;
  attendees_count: number;
  photos_count: number;
  highlights: string[];
  category: string;
  cover_image_url: string | null;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  created_by: {
    id: number;
    username: string;
  };
}

export interface CreateEventData {
  title: string;
  date: string;
  location: string;
  description: string;
  category: string;
  highlights?: string[];
  cover_image?: File;
}

export const fetchEvent = async (eventId: number): Promise<Event> => {
  try {
    const session = await getSession();
    const url = `${API_BASE_URL}/api/events/events/${eventId}/`;
    console.log(`Fetching event from: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(session?.accessToken && { 'Authorization': `Bearer ${session.accessToken}` }),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error fetching event:', {
        status: response.status,
        statusText: response.statusText,
        url,
        error: errorData,
      });
      throw new Error(`Failed to fetch event: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Fetched event data:', data);
    return data;
  } catch (error) {
    console.error('Error in fetchEvent:', error);
    throw error;
  }
};

export const fetchEvents = async (category?: string): Promise<Event[]> => {
  const session = await getSession();
  const url = new URL('/api/events/events/', API_BASE_URL);
  
  if (category && category !== 'All') {
    url.searchParams.append('category', category);
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
      ...(session?.accessToken && { 'Authorization': `Bearer ${session.accessToken}` }),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }

  const data = await response.json();
  // Return the results array from the paginated response
  return data.results || [];
};

export const createEvent = async (data: FormData): Promise<Event> => {
  const session = await getSession();
  
  if (!session?.accessToken) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}/api/events/events/`, {
    method: 'POST',
    body: data,
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to create event');
  }

  return response.json();
};

export const uploadEventPhoto = async (eventId: number, file: File, caption?: string): Promise<void> => {
  const session = await getSession();
  
  if (!session?.accessToken) {
    throw new Error('Not authenticated');
  }

  const formData = new FormData();
  formData.append('image', file);
  if (caption) {
    formData.append('caption', caption);
  }

  const response = await fetch(`/api/events/events/${eventId}/photos/`, {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to upload photo');
  }
};

export const fetchEventPhotos = async (eventId: number): Promise<EventPhoto[]> => {
  try {
    const session = await getSession();
    const url = `${API_BASE_URL}/api/events/events/${eventId}/photos/`;
    console.log(`[fetchEventPhotos] Fetching event photos from: ${url}`);
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (session?.accessToken) {
      headers['Authorization'] = `Bearer ${session.accessToken}`;
      console.log('[fetchEventPhotos] Added auth token to headers');
    } else {
      console.warn('[fetchEventPhotos] No auth token available');
    }
    
    console.log('[fetchEventPhotos] Sending request with headers:', headers);
    const response = await fetch(url, { headers });
    console.log('[fetchEventPhotos] Received response, status:', response.status);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: 'Failed to parse error response' };
      }
      
      console.error('[fetchEventPhotos] Error response:', {
        status: response.status,
        statusText: response.statusText,
        url,
        error: errorData,
        headers: Object.fromEntries(response.headers.entries()),
      });
      
      console.warn('[fetchEventPhotos] Returning empty photos array due to error');
      return [];
    }

    let data;
    try {
      data = await response.json();
      console.log('[fetchEventPhotos] Response data:', data);
    } catch (e) {
      console.error('[fetchEventPhotos] Failed to parse response as JSON:', e);
      return [];
    }
    
    // Ensure we always return an array, even if the response is not in the expected format
    const photos = Array.isArray(data) ? data : [];
    console.log(`[fetchEventPhotos] Fetched ${photos.length} photos for event ${eventId}`);
    
    // Log the first photo's structure if available
    if (photos.length > 0) {
      console.log('[fetchEventPhotos] First photo structure:', JSON.stringify(photos[0], null, 2));
      if (photos[0].image_url) {
        console.log('[fetchEventPhotos] First photo URL:', photos[0].image_url);
      } else {
        console.warn('[fetchEventPhotos] First photo is missing image_url');
      }
    }
    
    return photos;
  } catch (error) {
    console.error('Error in fetchEventPhotos:', error);
    throw error;
  }
};
