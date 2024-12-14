import { NextResponse } from 'next/server';
import { getStoryMessages, getStoryStatus } from '@/lib/db-utils';

export async function GET(
  request: Request,
  { params }: { params: { storyId: string } }
) {
  try {
    const storyId = parseInt(params.storyId);
    const [messages, status] = await Promise.all([
      getStoryMessages(storyId),
      getStoryStatus(storyId),
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
