import { NextResponse } from 'next/server';
import { generateStoryPrompt } from '@/lib/openai';
import { createStory, saveStoryMessage } from '@/lib/db-utils';

export async function POST(request: Request) {
  try {
    const { userId, userInput, storyId } = await request.json();

    // Generate story content
    const storyResponse = await generateStoryPrompt(userInput);

    if (!storyId) {
      // Create new story if storyId is not provided
      const story = await createStory(userId, 'New Interactive Tale');
      const message = await saveStoryMessage(
        story.id,
        storyResponse.content,
        true,
        storyResponse.choices
      );

      return NextResponse.json({
        success: true,
        story,
        message,
      });
    } else {
      // Save user's choice and generate next part
      if (userInput) {
        await saveStoryMessage(storyId, userInput, false);
      }

      const message = await saveStoryMessage(
        storyId,
        storyResponse.content,
        true,
        storyResponse.choices
      );

      return NextResponse.json({
        success: true,
        message,
      });
    }
  } catch (error) {
    console.error('Story generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate story' },
      { status: 500 }
    );
  }
}
