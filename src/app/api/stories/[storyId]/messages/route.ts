import { NextRequest, NextResponse } from 'next/server';
import { getStoryMessages, getStoryStatus } from '@/lib/db-utils';

export async function GET(request: NextRequest) {
  try {
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

    console.log('Retrieved messages:', messages); // Debug log

    return NextResponse.json({
      success: true,
      messages: messages.map((msg) => ({
        id: msg.id,
        content: msg.content,
        is_bot: msg.is_bot,
        choices: msg.choices,
        image_url: msg.image_url,
      })),
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
