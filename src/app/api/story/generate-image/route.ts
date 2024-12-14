import { NextResponse } from 'next/server';
import { generateStoryImage } from '@/lib/openai';
import { sql } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { messageId, content } = await request.json();

    const imageUrl = await generateStoryImage(content);

    if (imageUrl) {
      // Update the message with the generated image URL
      await sql`
        UPDATE story_messages 
        SET image_url = ${imageUrl}
        WHERE id = ${messageId}
      `;
    }

    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}
