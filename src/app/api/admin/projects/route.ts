import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { createProject, getProjects } from '@/lib/data';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  const projects = await getProjects();
  return NextResponse.json({ projects }, {
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
    if (!data.title || !data.description || !data.tags) {
      return NextResponse.json({ error: 'Title, description, and tags are required' }, { status: 400 });
    }

    const created = await createProject(data);

    revalidatePath('/');
    revalidatePath('/admin/dashboard');

    return NextResponse.json({ success: true, project: created }, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' }
    });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
