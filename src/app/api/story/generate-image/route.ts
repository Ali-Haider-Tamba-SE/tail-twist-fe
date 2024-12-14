import { NextResponse } from 'next/server';
import { generateStoryImage } from '@/lib/openai';
import { sql } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { messageId, content } = await request.json();

    // Start image generation in background
    generateImageInBackground(messageId, content);

    // Return immediately
    return NextResponse.json({
      success: true,
      message: 'Image generation started',
    });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}

async function generateImageInBackground(messageId: number, content: string) {
  try {
    const imageUrl = await generateStoryImage(content);

    if (imageUrl) {
      await sql`
        UPDATE story_messages 
        SET image_url = ${imageUrl}
        WHERE id = ${messageId}
      `;
    }
  } catch (error) {
    console.error('Background image generation failed:', error);
  }
}
