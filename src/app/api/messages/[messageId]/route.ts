import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Extract messageId from URL
    const messageId = parseInt(request.url.split('/messages/')[1], 10);

    if (isNaN(messageId)) {
      return NextResponse.json(
        { error: 'Invalid message ID' },
        { status: 400 }
      );
    }

    const result = await sql`
      SELECT image_url
      FROM story_messages
      WHERE id = ${messageId}
    `;

    return NextResponse.json(result.rows[0] || {});
  } catch (error) {
    console.error('Error fetching message:', error);
    return NextResponse.json(
      { error: 'Failed to fetch message' },
      { status: 500 }
    );
  }
}
