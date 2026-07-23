import { NextResponse } from 'next/server';
import { setAdminSessionCookie, signToken, verifyPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const defaultAdminUsername = process.env.ADMIN_USERNAME || 'admin';
    const defaultAdminPassword = process.env.ADMIN_PASSWORD || 'adminpassword123';

    let adminUser = null;
    try {
      adminUser = await prisma.admin.findUnique({ where: { username } });
    } catch {
      // If DB not connected yet, allow default admin credentials
    }

    let isValid = false;

    if (adminUser) {
      isValid = verifyPassword(password, adminUser.password);
    } else {
      isValid = username === defaultAdminUsername && password === defaultAdminPassword;
    }

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const token = signToken({
      id: adminUser?.id || 'admin-root',
      username: username,
      name: adminUser?.name || 'Administrator',
    });

    await setAdminSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        username,
        name: adminUser?.name || 'Administrator',
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
