import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { createProject, getProjects } from '@/lib/data';

export async function GET() {
  const projects = await getProjects();
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    if (!data.title || !data.description || !data.tags) {
      return NextResponse.json({ error: 'Title, description, and tags are required' }, { status: 400 });
    }

    const created = await createProject(data);
    return NextResponse.json({ success: true, project: created });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
