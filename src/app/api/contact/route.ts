import { NextResponse } from 'next/server';
import { createMessage } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const createdMsg = await createMessage({ name, email, subject, message });

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
      data: createdMsg
    });
  } catch (error) {
    console.error('Contact submit error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
