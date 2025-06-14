import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const eventId = params.eventId;

    console.log('Uploading photo for event:', eventId);
    
    // First, verify the event exists
    const eventResponse = await fetch(`${API_BASE_URL}/api/events/events/${eventId}/`, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!eventResponse.ok) {
      console.error('Event not found or access denied:', await eventResponse.text());
      return NextResponse.json(
        { error: 'Event not found or you do not have permission to upload photos to this event' },
        { status: 404 }
      );
    }
    
    const response = await fetch(`${API_BASE_URL}/api/events/events/${eventId}/photos/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Upload failed:', errorData);
      return NextResponse.json(
        { error: errorData.detail || 'Failed to upload photo' },
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
