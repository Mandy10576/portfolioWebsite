import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { getAdminSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // 1. Authenticate admin user
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Please log in as admin.' }, { status: 401 });
    }

    // 2. Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided in request.' }, { status: 400 });
    }

    // 3. Validate file type (allow any image format)
    const mimeType = file.type || '';
    if (mimeType && !mimeType.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file format. Please upload an image file (PNG, JPG, WEBP, GIF, SVG, etc.).' },
        { status: 400 }
      );
    }

    // 4. Validate file size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit. Please choose a smaller image.' },
        { status: 400 }
      );
    }

    // 5. Read file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 6. Generate filename safely
    const originalName = file.name || 'image.jpg';
    const ext = path.extname(originalName) || '.jpg';
    const cleanExt = ext.startsWith('.') ? ext : `.${ext}`;
    const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${cleanExt}`;

    // 7. Try writing to public/uploads folder with base64 fallback
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);

      const fileUrl = `/uploads/${filename}`;

      return NextResponse.json({
        success: true,
        url: fileUrl,
        filename: filename,
      });
    } catch (fsError) {
      console.warn('FileSystem save failed, falling back to base64 Data URL:', fsError);
      
      // Fallback: Convert to Base64 Data URL
      const finalMime = mimeType || 'image/jpeg';
      const base64Url = `data:${finalMime};base64,${buffer.toString('base64')}`;

      return NextResponse.json({
        success: true,
        url: base64Url,
        filename: filename,
      });
    }
  } catch (error: any) {
    console.error('Image upload error:', error);
    const errorMessage = error?.message || 'Failed to process image upload.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
