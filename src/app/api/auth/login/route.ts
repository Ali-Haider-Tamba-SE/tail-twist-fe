import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { hashPassword } from '@/lib/auth-utils';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const hashedPassword = hashPassword(password);
    const result = await sql`
      SELECT id, email, name
      FROM users
      WHERE email = ${email} AND password_hash = ${hashedPassword}
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = result.rows[0];
    return NextResponse.json({ success: true, user });
  } catch (error: Error | unknown) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to sign in' },
      { status: 500 }
    );
  }
}
