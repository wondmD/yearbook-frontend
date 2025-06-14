import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getApiUrl } from '@/lib/api';

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is admin
    if (!session || !session.user.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { userId } = params;

    // Call the backend API to approve the user
    const apiUrl = getApiUrl(`admin/users/${params.userId}/approve/`);
    console.log('Approving user at:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to approve user');
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in POST /api/admin/users/[userId]/approve:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { 
        error: 'Failed to approve user',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined 
      },
      { status: 500 }
    );
  }
}
