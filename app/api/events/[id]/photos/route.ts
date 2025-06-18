import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { headers } from 'next/headers';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const eventId = params.id;

  if (!session?.accessToken) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // Get the form data from the request
    const formData = await request.formData();
    
    // Forward the request to the Django backend
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/events/events/${eventId}/photos/`;
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('Error uploading photo:', error);
      return NextResponse.json(
        { error: 'Failed to upload photo', details: error },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
