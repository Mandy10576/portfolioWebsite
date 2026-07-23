import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
import { DEFAULT_EXPERIENCE, DEFAULT_PROFILE, DEFAULT_PROJECTS, DEFAULT_SKILLS } from '@/lib/data';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    // 0. Ensure PostgreSQL Tables exist (Auto-create schema if missing)
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Admin" (
          "id" TEXT NOT NULL,
          "username" TEXT NOT NULL,
          "password" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
      );
    `);
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Admin_username_key" ON "Admin"("username");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Profile" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "title" TEXT NOT NULL,
          "tagline" TEXT NOT NULL,
          "bio" TEXT NOT NULL,
          "avatarUrl" TEXT,
          "email" TEXT NOT NULL,
          "phone" TEXT,
          "location" TEXT,
          "githubUrl" TEXT,
          "linkedinUrl" TEXT,
          "twitterUrl" TEXT,
          "resumeUrl" TEXT,
          "availableForWork" BOOLEAN NOT NULL DEFAULT true,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Project" (
          "id" TEXT NOT NULL,
          "title" TEXT NOT NULL,
          "slug" TEXT NOT NULL,
          "description" TEXT NOT NULL,
          "content" TEXT,
          "imageUrl" TEXT,
          "demoUrl" TEXT,
          "githubUrl" TEXT,
          "tags" TEXT NOT NULL,
          "featured" BOOLEAN NOT NULL DEFAULT false,
          "order" INTEGER NOT NULL DEFAULT 0,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
      );
    `);
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Project_slug_key" ON "Project"("slug");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Skill" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "category" TEXT NOT NULL,
          "icon" TEXT,
          "level" INTEGER NOT NULL DEFAULT 80,
          "order" INTEGER NOT NULL DEFAULT 0,
          CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Experience" (
          "id" TEXT NOT NULL,
          "role" TEXT NOT NULL,
          "company" TEXT NOT NULL,
          "location" TEXT,
          "startDate" TEXT NOT NULL,
          "endDate" TEXT NOT NULL,
          "description" TEXT NOT NULL,
          "technologies" TEXT NOT NULL,
          "order" INTEGER NOT NULL DEFAULT 0,
          CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Message" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "email" TEXT NOT NULL,
          "subject" TEXT,
          "message" TEXT NOT NULL,
          "read" BOOLEAN NOT NULL DEFAULT false,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
      );
    `);

    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword123';

    // 1. Create default admin if not exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { username: adminUsername }
    });

    if (!existingAdmin) {
      await prisma.admin.create({
        data: {
          username: adminUsername,
          password: hashPassword(adminPassword),
          name: 'Portfolio Admin'
        }
      });
    }

    // 2. Profile
    const profileCount = await prisma.profile.count();
    if (profileCount === 0) {
      await prisma.profile.create({
        data: DEFAULT_PROFILE
      });
    }

    // 3. Projects
    const projectCount = await prisma.project.count();
    if (projectCount === 0) {
      for (const proj of DEFAULT_PROJECTS) {
        await prisma.project.create({
          data: {
            title: proj.title,
            slug: proj.slug,
            description: proj.description,
            content: proj.content,
            imageUrl: proj.imageUrl,
            demoUrl: proj.demoUrl,
            githubUrl: proj.githubUrl,
            tags: proj.tags,
            featured: proj.featured,
            order: proj.order,
          }
        });
      }
    }

    // 4. Skills
    const skillCount = await prisma.skill.count();
    if (skillCount === 0) {
      for (const sk of DEFAULT_SKILLS) {
        await prisma.skill.create({
          data: {
            name: sk.name,
            category: sk.category,
            level: sk.level,
            order: sk.order,
          }
        });
      }
    }

    // 5. Experiences
    const expCount = await prisma.experience.count();
    if (expCount === 0) {
      for (const exp of DEFAULT_EXPERIENCE) {
        await prisma.experience.create({
          data: {
            role: exp.role,
            company: exp.company,
            location: exp.location,
            startDate: exp.startDate,
            endDate: exp.endDate,
            description: exp.description,
            technologies: exp.technologies,
            order: exp.order,
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database schema created & seeded successfully with initial profile, projects, skills, experiences, and admin credentials!'
    });
  } catch (error) {
    console.error('Seed DB Error:', error);
    return NextResponse.json({ error: 'Failed to seed database: ' + (error as Error).message }, { status: 500 });
  }
}
