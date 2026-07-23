import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getProfile, updateProfile } from '@/lib/data';

export async function GET() {
  const profile = await getProfile();
  return NextResponse.json({ profile });
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const updated = await updateProfile(data);
    return NextResponse.json({ success: true, profile: updated });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
