import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const eventId = params.id;

  try {
    // Forward the request to your Django backend
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/events/events/${eventId}/photos/`;
    
    const response = await fetch(backendUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...(session?.accessToken && { 'Authorization': `Bearer ${session.accessToken}` }),
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: 'Failed to fetch photos', details: error },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(Array.isArray(data) ? data : []);
    
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
