import { NextResponse } from 'next/server';
import { generateStoryPrompt, generateStoryImage } from '@/lib/openai';
import {
  createStory,
  saveStoryMessage,
  updateStoryStatus,
} from '@/lib/db-utils';

export async function POST(request: Request) {
  try {
    const {
      userId,
      userInput,
      storyId,
      messageCount = 0,
    } = await request.json();

    console.log('Generating story with:', {
      userId,
      userInput,
      storyId,
      messageCount,
    });

    // Generate story content
    const storyResponse = await generateStoryPrompt(userInput, messageCount);
    console.log('Story response:', storyResponse);

    // Ensure choices exist for non-ending messages
    if (!storyResponse.choices && messageCount < 4) {
      storyResponse.choices = [
        'Continue the journey',
        'Take a different path',
        'Make a bold decision',
      ];
    }

    // Generate image based on the story content
    const imageUrl = await generateStoryImage(storyResponse.content);
    console.log('Generated image URL:', imageUrl);

    if (!storyId) {
      // Create new story if storyId is not provided
      const story = await createStory(
        userId,
        storyResponse.title || 'New Interactive Tale'
      );
      console.log('Created story:', story);

      const message = await saveStoryMessage(
        story.id,
        storyResponse.content,
        true,
        storyResponse.choices,
        imageUrl as string
      );
      console.log('Saved message:', message);

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
        storyResponse.choices,
        imageUrl as string
      );

      // If this is the final message, update story status
      if (messageCount >= 4) {
        await updateStoryStatus(storyId, 'completed');
      }

      return NextResponse.json({
        success: true,
        message,
        isComplete: messageCount >= 4,
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
