import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { createSkill, getSkills } from '@/lib/data';

export async function GET() {
  const skills = await getSkills();
  return NextResponse.json({ skills });
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
    return NextResponse.json({ success: true, skill: created });
  } catch (error) {
    console.error('Create skill error:', error);
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}
