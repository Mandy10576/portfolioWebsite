import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
import { DEFAULT_EXPERIENCE, DEFAULT_PROFILE, DEFAULT_PROJECTS, DEFAULT_SKILLS } from '@/lib/data';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
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
      message: 'Database seeded successfully with initial profile, projects, skills, experiences, and admin credentials!'
    });
  } catch (error) {
    console.error('Seed DB Error:', error);
    return NextResponse.json({ error: 'Failed to seed database: ' + (error as Error).message }, { status: 500 });
  }
}
