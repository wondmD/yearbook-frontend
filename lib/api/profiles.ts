import { getSession } from 'next-auth/react';
import { getApiUrl } from '../api';

export interface UserProfile extends Omit<Profile, 'id' | 'created_at' | 'updated_at'> {
  id?: number;
  created_at?: string;
  updated_at?: string;
  user?: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_approved: boolean;
    student_id?: string;
    batch?: string;
    role?: string;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_approved: boolean;
  student_id?: string;
  batch?: string;
  role?: string;
}

export interface Profile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_approved: boolean;
  student_id?: string;
  batch?: string;
  role?: string;
  nickname?: string;
  bio?: string;
  location?: string;
  interests?: string[];
  image?: string;
  fun_fact?: string;
  social_links?: {
    [key: string]: string;
  };
  created_at: string;
  updated_at: string;
  user?: User; // Nested user object for when profile is fetched with user data
}

export const fetchProfiles = async (searchQuery = ''): Promise<Profile[]> => {
  try {
    const session = await getSession();
    // Use the correct endpoint path with 'auth' prefix
    const baseUrl = 'https://yearbook.ethioace.com/api/auth/profiles/';
    
    if (searchQuery) {
      baseUrl.searchParams.append('search', searchQuery);
    }

    // Prepare headers - include auth token if available, but don't require it
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Only add Authorization header if we have a valid session
    if (session?.accessToken) {
      headers['Authorization'] = `Bearer ${session.accessToken}`;
    }

    const response = await fetch(baseUrl.toString(), {
      headers,
    });

    if (!response.ok) {
      console.error('Failed to fetch profiles:', await response.text());
      return [];
    }

    const data = await response.json();
    // Handle both paginated and non-paginated responses
    return Array.isArray(data) ? data : (data.results || []);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }
};

export const getMyProfile = async (): Promise<Profile | null> => {
  try {
    const session = await getSession();
    if (!session?.accessToken) {
      console.error('No access token available');
      return null;
    }

    const response = await fetch(getApiUrl('profiles/me/'), {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // If no profile exists yet, return null
      if (response.status === 404) {
        return null;
      }
      console.error('Failed to fetch profile:', await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

export const createProfile = async (profileData: Partial<Profile>): Promise<Profile | null> => {
  try {
    const session = await getSession();
    if (!session?.accessToken) {
      console.error('No access token available');
      return null;
    }

    const response = await fetch(getApiUrl('profiles/'), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      console.error('Failed to create profile:', await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating profile:', error);
    return null;
  }
};

export const updateProfile = async (profileData: Partial<Profile>): Promise<Profile | null> => {
  try {
    const session = await getSession();
    if (!session?.accessToken) {
      console.error('No access token available');
      return null;
    }

    // For updates, we don't need to specify the ID in the URL
    // as the backend will use the authenticated user's profile
    const response = await fetch(getApiUrl('profiles/me/'), {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      console.error('Failed to update profile:', await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating profile:', error);
    return null;
  }
};

export const uploadProfileImage = async (file: File): Promise<{ url: string } | null> => {
  try {
    const session = await getSession();
    if (!session?.accessToken) {
      console.error('No access token available');
      return null;
    }

    const formData = new FormData();
    formData.append('image', file);

    // Use the full URL with /auth/ prefix
    const response = await fetch(`https://yearbook.ethioace.com/api/auth/users/profile/image/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        // Don't set Content-Type header, let the browser set it with the correct boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to upload image:', errorText);
      throw new Error(errorText || 'Failed to upload image');
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error; // Re-throw to be handled by the caller
  }
};

export interface ProfileFormData {
  // User fields
  first_name: string;
  last_name: string;
  email: string;
  
  // Profile fields
  nickname: string;
  bio: string;
  location: string;
  interests: string[];
  fun_fact: string;
  image?: string | null;
  social_links?: {
    github: string;
    linkedin: string;
    twitter: string;
    instagram: string;
    website: string;
    email: string;
  };
}

export const createOrUpdateProfile = async (profileData: ProfileFormData): Promise<Profile> => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error('Not authenticated');
  }

  // Handle image upload if it's a File object
  let imageUrl: string | null = null;
  if (profileData.image) {
    const img = profileData.image as unknown;
    if (img instanceof File) {
      const result = await uploadProfileImage(img);
      if (!result) {
        throw new Error('Failed to upload image');
      }
      imageUrl = result.url;
    } else if (typeof img === 'string') {
      imageUrl = img;
    } else if (typeof img === 'object' && img !== null && 'name' in img) {
      // Handle File-like objects that might come from file inputs
      const result = await uploadProfileImage(img as File);
      if (!result) {
        throw new Error('Failed to upload image');
      }
      imageUrl = result.url;
    }
  }

  // Ensure interests is always an array of strings
  const interestsArray = Array.isArray(profileData.interests) 
    ? profileData.interests 
    : String(profileData.interests || '').split(',').map(i => i.trim()).filter(Boolean);

  // Prepare the data to send
  const dataToSend = {
    // User data
    first_name: profileData.first_name,
    last_name: profileData.last_name,
    email: profileData.email,
    // Profile data
    profile: {
      nickname: profileData.nickname,
      bio: profileData.bio,
      location: profileData.location,
      interests: interestsArray,
      image: imageUrl,
      fun_fact: profileData.fun_fact,
      social_links: profileData.social_links || {
        github: '',
        linkedin: '',
        twitter: '',
        instagram: '',
        website: '',
        email: ''
      }
    }
  };

  const response = await fetch(`https://yearbook.ethioace.com/api/auth/users/me/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify(dataToSend),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to save profile');
  }

  return response.json();
};

export const fetchMyProfile = async (): Promise<Profile | null> => {
  const session = await getSession();
  if (!session?.accessToken) {
    return null;
  }

  try {
    const response = await fetch(`https://yearbook.ethioace.com/api/auth/users/me/`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Failed to fetch profile');
    }

    const data = await response.json();
    
    // If the response has a nested profile object, flatten it
    if (data.profile) {
      const { profile, ...userData } = data;
      return {
        ...userData,
        ...profile,
        // Ensure required fields have defaults
        is_approved: userData.is_approved || false,
        interests: profile.interests || [],
        social_links: profile.social_links || {}
      } as Profile;
    }
    
    // Ensure the response matches the Profile interface
    return {
      ...data,
      interests: data.interests || [],
      social_links: data.social_links || {},
      is_approved: data.is_approved || false
    } as Profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};
