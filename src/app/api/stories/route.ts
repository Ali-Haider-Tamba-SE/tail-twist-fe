import { NextResponse } from 'next/server';
import { createStory, saveStoryMessage } from '@/lib/db-utils';

export async function POST(request: Request) {
  try {
    const { userId, title, initialMessage } = await request.json();

    const story = await createStory(userId, title);

    if (initialMessage) {
      await saveStoryMessage(
        story.id,
        initialMessage.content,
        initialMessage.isBot,
        initialMessage.choices
      );
    }

    return NextResponse.json({ success: true, story });
  } catch (error) {
    console.error('Error creating story:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create story' },
      { status: 500 }
    );
  }
}
