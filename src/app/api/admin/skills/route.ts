import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { createSkill, getSkills } from '@/lib/data';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  const skills = await getSkills();
  return NextResponse.json({ skills }, {
    headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' }
  });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    if (!data.name || !data.category) {
      return NextResponse.json({ error: 'Name and category are required' }, { status: 400 });
    }

    const created = await createSkill(data);

    revalidatePath('/');
    revalidatePath('/admin/dashboard');

    return NextResponse.json({ success: true, skill: created }, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' }
    });
  } catch (error) {
    console.error('Create skill error:', error);
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}
