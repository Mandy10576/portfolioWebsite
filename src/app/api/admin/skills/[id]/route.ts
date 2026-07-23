import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { deleteSkill } from '@/lib/data';

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    await deleteSkill(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete skill error:', error);
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}
