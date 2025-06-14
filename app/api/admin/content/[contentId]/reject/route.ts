import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: { contentId: string } }
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

    const { contentId } = params;

    // Call your backend API to reject the content
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/content/${contentId}/reject`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reject content');
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error(`Error in POST /api/admin/content/${params.contentId}/reject:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
