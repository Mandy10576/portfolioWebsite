import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getMessages } from '@/lib/data';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const messages = await getMessages();
  return NextResponse.json({ messages });
}
