import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { deleteExperience } from '@/lib/data';

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    await deleteExperience(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete experience error:', error);
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}
