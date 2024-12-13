import { sql } from './db';
import { Message } from '@/types/story';

export async function createUser(
  email: string,
  passwordHash: string,
  name: string
) {
  const result = await sql`
    INSERT INTO users (email, password_hash, name)
    VALUES (${email}, ${passwordHash}, ${name})
    RETURNING id, email, name;
  `;
  return result.rows[0];
}

export async function createStory(userId: number, title: string) {
  const result = await sql`
    INSERT INTO stories (user_id, title, status)
    VALUES (${userId}, ${title}, 'in_progress')
    RETURNING id, title;
  `;
  return result.rows[0];
}

export async function saveStoryMessage(
  storyId: number,
  content: string,
  isBot: boolean,
  choices?: string[]
) {
  const result = await sql`
    INSERT INTO story_messages (story_id, content, is_bot, choices)
    VALUES (${storyId}, ${content}, ${isBot}, ${
    choices ? JSON.stringify(choices) : null
  })
    RETURNING id, content, is_bot, choices;
  `;
  return result.rows[0];
}

export async function getStoryMessages(storyId: number): Promise<Message[]> {
  const result = await sql`
    SELECT id, content, is_bot, choices
    FROM story_messages
    WHERE story_id = ${storyId}
    ORDER BY created_at ASC;
  `;
  return result.rows.map((row) => ({
    id: row.id,
    content: row.content,
    isBot: row.is_bot,
    choices: row.choices,
  }));
}

export async function getUserStories(userId: number) {
  const result = await sql`
    SELECT id, title, status, created_at
    FROM stories
    WHERE user_id = ${userId}
    ORDER BY created_at DESC;
  `;
  return result.rows;
}
