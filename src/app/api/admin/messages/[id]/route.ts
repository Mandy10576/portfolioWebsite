import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { deleteMessage, markMessageRead } from '@/lib/data';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    await markMessageRead(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mark read error:', error);
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    await deleteMessage(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete message error:', error);
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
