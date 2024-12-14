import { NextResponse } from 'next/server';
import { getStoryMessages } from '@/lib/db-utils';

export async function GET(
  request: Request,
  { params }: { params: { storyId: string } }
) {
  try {
    const messages = await getStoryMessages(parseInt(params.storyId));
    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error('Error fetching story messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch story messages' },
      { status: 500 }
    );
  }
}
