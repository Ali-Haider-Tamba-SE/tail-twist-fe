import { NextRequest, NextResponse } from 'next/server';
import { getStoryMessages, getStoryStatus } from '@/lib/db-utils';

export async function GET(request: NextRequest) {
  try {
    // Extract storyId from URL pattern
    const storyId = request.url.split('/stories/')[1].split('/')[0];
    const parsedStoryId = parseInt(storyId, 10);

    if (isNaN(parsedStoryId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid story ID' },
        { status: 400 }
      );
    }

    const [messages, status] = await Promise.all([
      getStoryMessages(parsedStoryId),
      getStoryStatus(parsedStoryId),
    ]);

    return NextResponse.json({
      success: true,
      messages,
      status: status.status,
    });
  } catch (error) {
    console.error('Error fetching story messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch story messages' },
      { status: 500 }
    );
  }
}
