import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getApiUrl } from '@/lib/api';

interface User {
  id: string;
  username: string;
  email: string;
  is_approved: boolean;
  // Add other user fields as needed
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is admin
    if (!session || !session.user.isAdmin) {
      console.error('Unauthorized access attempt to unapproved users endpoint');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, statusText: 'Unauthorized' }
      );
    }

    // Fetch unapproved users from the backend API
    const apiUrl = getApiUrl('admin/users/unapproved/');
    console.log('Fetching unapproved users from:', apiUrl);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    console.log('Backend response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Backend error response:', errorData);
      throw new Error(errorData.error || 'Failed to fetch unapproved users');
    }

    const data = await response.json();
    console.log('Received response from backend:', data);
    
    // Handle the response format from the backend
    // The backend returns { success: boolean, count: number, users: User[] }
    const users = Array.isArray(data) ? data : (data.users || []);
    
    console.log('Extracted users:', users);
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/admin/users/unapproved:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch unapproved users',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined 
      },
      { status: 500, statusText: 'Internal Server Error' }
    );
  }
}
