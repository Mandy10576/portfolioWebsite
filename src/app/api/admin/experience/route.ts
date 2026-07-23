import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { createExperience, getExperiences } from '@/lib/data';

export async function GET() {
  const experiences = await getExperiences();
  return NextResponse.json({ experiences });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    if (!data.role || !data.company || !data.startDate || !data.endDate) {
      return NextResponse.json({ error: 'Role, company, startDate, and endDate are required' }, { status: 400 });
    }

    const created = await createExperience(data);
    return NextResponse.json({ success: true, experience: created });
  } catch (error) {
    console.error('Create experience error:', error);
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
  }
}
