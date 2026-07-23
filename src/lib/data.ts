import { prisma } from './prisma';

export interface ProfileData {
  id?: string;
  name: string;
  title: string;
  tagline: string;
  bio: string;
  avatarUrl?: string;
  email: string;
  phone?: string;
  location?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  resumeUrl?: string;
  availableForWork: boolean;
}

export interface ProjectData {
  id?: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  imageUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  tags: string;
  featured: boolean;
  order?: number;
}

export interface SkillData {
  id?: string;
  name: string;
  category: string;
  icon?: string;
  level: number;
  order?: number;
}

export interface ExperienceData {
  id?: string;
  role: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  description: string;
  technologies: string;
  order?: number;
}

export interface MessageData {
  id?: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read?: boolean;
  createdAt?: string;
}

// Initial default profile & portfolio seed content
export const DEFAULT_PROFILE: ProfileData = {
  name: "Alex Rivera",
  title: "Full-Stack Developer & Cloud Architect",
  tagline: "Building scalable web applications, sleek user experiences, and cloud infrastructure.",
  bio: "Passionate Software Engineer with expertise in Next.js, React, Node.js, and AWS Cloud Architecture. Dedicated to crafting clean code, high-performance web systems, and intuitive CMS interfaces.",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  email: "alex.rivera@example.com",
  phone: "+1 (555) 234-5678",
  location: "San Francisco, CA",
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  twitterUrl: "https://twitter.com",
  resumeUrl: "#",
  availableForWork: true
};

export const DEFAULT_PROJECTS: ProjectData[] = [
  {
    id: "proj-1",
    title: "AI Power Analytics Dashboard",
    slug: "ai-power-analytics-dashboard",
    description: "Real-time energy consumption and predictive analytics platform built for enterprise systems.",
    content: "Detailed case study on building a high-throughput telemetry analytics dashboard using Next.js and AWS infrastructure.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    demoUrl: "https://example.com",
    githubUrl: "https://github.com",
    tags: "Next.js, PostgreSQL, AWS, Tailwind CSS",
    featured: true,
    order: 1
  },
  {
    id: "proj-2",
    title: "CloudVault Storage Solution",
    slug: "cloudvault-storage-solution",
    description: "Encrypted file management system with multi-tenant permissions and fast cloud sync.",
    content: "Secure cloud document platform with client-side encryption and S3 bucket synchronization.",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    demoUrl: "https://example.com",
    githubUrl: "https://github.com",
    tags: "React, Node.js, AWS RDS, Docker",
    featured: true,
    order: 2
  },
  {
    id: "proj-3",
    title: "EcoTrack Carbon Footprint App",
    slug: "ecotrack-carbon-footprint-app",
    description: "Mobile & web platform helping users track, understand, and offset their daily emissions.",
    content: "Comprehensive sustainability tracking tool featuring dynamic charts, goal tracking, and API integrations.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    demoUrl: "https://example.com",
    githubUrl: "https://github.com",
    tags: "TypeScript, Next.js, Prisma, Tailwind",
    featured: false,
    order: 3
  }
];

export const DEFAULT_SKILLS: SkillData[] = [
  { id: "sk-1", name: "Next.js / React", category: "Frontend", level: 95, order: 1 },
  { id: "sk-2", name: "TypeScript", category: "Frontend", level: 90, order: 2 },
  { id: "sk-3", name: "Tailwind CSS", category: "Frontend", level: 92, order: 3 },
  { id: "sk-4", name: "Node.js / Express", category: "Backend", level: 88, order: 4 },
  { id: "sk-5", name: "PostgreSQL & Prisma", category: "Database", level: 85, order: 5 },
  { id: "sk-6", name: "AWS RDS & EC2 / S3", category: "DevOps & Cloud", level: 82, order: 6 },
  { id: "sk-7", name: "Vercel Deployment", category: "DevOps & Cloud", level: 94, order: 7 },
  { id: "sk-8", name: "REST APIs & GraphQL", category: "Backend", level: 87, order: 8 }
];

export const DEFAULT_EXPERIENCE: ExperienceData[] = [
  {
    id: "exp-1",
    role: "Senior Full-Stack Engineer",
    company: "Apex Tech Labs",
    location: "San Francisco, CA",
    startDate: "2023",
    endDate: "Present",
    description: "Led development of core cloud services and admin CMS tooling. Migrated legacy databases to AWS RDS PostgreSQL, reducing latency by 40%.",
    technologies: "Next.js, AWS RDS, PostgreSQL, Prisma, Docker",
    order: 1
  },
  {
    id: "exp-2",
    role: "Frontend Engineer",
    company: "Vanguard Digital",
    location: "Remote",
    startDate: "2021",
    endDate: "2023",
    description: "Designed responsive Web interfaces, built design tokens, and integrated RESTful APIs with Vercel serverless functions.",
    technologies: "React, TypeScript, Tailwind CSS, REST APIs",
    order: 2
  }
];

// Memory store fallback if DB connection is unavailable locally during development
let memoryProfile = { ...DEFAULT_PROFILE };
let memoryProjects = [...DEFAULT_PROJECTS];
let memorySkills = [...DEFAULT_SKILLS];
let memoryExperience = [...DEFAULT_EXPERIENCE];
let memoryMessages: MessageData[] = [
  {
    id: "msg-1",
    name: "Sarah Jenkins",
    email: "sarah@techpartners.com",
    subject: "Freelance Project Inquiry",
    message: "Hi Alex! We loved your portfolio and would like to discuss a custom web application project.",
    read: false,
    createdAt: new Date().toISOString()
  }
];

export async function getProfile(): Promise<ProfileData> {
  try {
    const prof = await prisma.profile.findFirst();
    if (prof) return prof;
  } catch {
    // Fallback to memory state
  }
  return memoryProfile;
}

export async function updateProfile(data: Partial<ProfileData>): Promise<ProfileData> {
  try {
    const existing = await prisma.profile.findFirst();
    if (existing) {
      return await prisma.profile.update({
        where: { id: existing.id },
        data: {
          name: data.name ?? existing.name,
          title: data.title ?? existing.title,
          tagline: data.tagline ?? existing.tagline,
          bio: data.bio ?? existing.bio,
          avatarUrl: data.avatarUrl ?? existing.avatarUrl,
          email: data.email ?? existing.email,
          phone: data.phone ?? existing.phone,
          location: data.location ?? existing.location,
          githubUrl: data.githubUrl ?? existing.githubUrl,
          linkedinUrl: data.linkedinUrl ?? existing.linkedinUrl,
          twitterUrl: data.twitterUrl ?? existing.twitterUrl,
          resumeUrl: data.resumeUrl ?? existing.resumeUrl,
          availableForWork: data.availableForWork ?? existing.availableForWork,
        }
      });
    } else {
      return await prisma.profile.create({
        data: {
          ...DEFAULT_PROFILE,
          ...data,
        }
      });
    }
  } catch {
    memoryProfile = { ...memoryProfile, ...data };
    return memoryProfile;
  }
}

export async function getProjects(): Promise<ProjectData[]> {
  try {
    const projs = await prisma.project.findMany({ orderBy: { order: 'asc' } });
    if (projs.length > 0) return projs;
  } catch {
    // Fallback
  }
  return memoryProjects;
}

export async function createProject(data: Omit<ProjectData, 'id'>): Promise<ProjectData> {
  try {
    return await prisma.project.create({
      data: {
        title: data.title,
        slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: data.description,
        content: data.content,
        imageUrl: data.imageUrl,
        demoUrl: data.demoUrl,
        githubUrl: data.githubUrl,
        tags: data.tags,
        featured: data.featured ?? false,
        order: data.order ?? memoryProjects.length + 1,
      }
    });
  } catch {
    const newProj: ProjectData = {
      id: `proj-${Date.now()}`,
      ...data,
      slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };
    memoryProjects.push(newProj);
    return newProj;
  }
}

export async function updateProject(id: string, data: Partial<ProjectData>): Promise<ProjectData> {
  try {
    return await prisma.project.update({
      where: { id },
      data
    });
  } catch {
    const idx = memoryProjects.findIndex(p => p.id === id);
    if (idx !== -1) {
      memoryProjects[idx] = { ...memoryProjects[idx], ...data };
      return memoryProjects[idx];
    }
    throw new Error('Project not found');
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    await prisma.project.delete({ where: { id } });
    return true;
  } catch {
    memoryProjects = memoryProjects.filter(p => p.id !== id);
    return true;
  }
}

export async function getSkills(): Promise<SkillData[]> {
  try {
    const sks = await prisma.skill.findMany({ orderBy: { order: 'asc' } });
    if (sks.length > 0) return sks;
  } catch {
    // Fallback
  }
  return memorySkills;
}

export async function createSkill(data: Omit<SkillData, 'id'>): Promise<SkillData> {
  try {
    return await prisma.skill.create({
      data: {
        name: data.name,
        category: data.category,
        icon: data.icon,
        level: Number(data.level),
        order: data.order ?? memorySkills.length + 1,
      }
    });
  } catch {
    const newSk: SkillData = {
      id: `sk-${Date.now()}`,
      ...data
    };
    memorySkills.push(newSk);
    return newSk;
  }
}

export async function deleteSkill(id: string): Promise<boolean> {
  try {
    await prisma.skill.delete({ where: { id } });
    return true;
  } catch {
    memorySkills = memorySkills.filter(s => s.id !== id);
    return true;
  }
}

export async function getExperiences(): Promise<ExperienceData[]> {
  try {
    const exps = await prisma.experience.findMany({ orderBy: { order: 'asc' } });
    if (exps.length > 0) return exps;
  } catch {
    // Fallback
  }
  return memoryExperience;
}

export async function createExperience(data: Omit<ExperienceData, 'id'>): Promise<ExperienceData> {
  try {
    return await prisma.experience.create({
      data: {
        role: data.role,
        company: data.company,
        location: data.location,
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description,
        technologies: data.technologies,
        order: data.order ?? memoryExperience.length + 1,
      }
    });
  } catch {
    const newExp: ExperienceData = {
      id: `exp-${Date.now()}`,
      ...data
    };
    memoryExperience.push(newExp);
    return newExp;
  }
}

export async function deleteExperience(id: string): Promise<boolean> {
  try {
    await prisma.experience.delete({ where: { id } });
    return true;
  } catch {
    memoryExperience = memoryExperience.filter(e => e.id !== id);
    return true;
  }
}

export async function getMessages(): Promise<MessageData[]> {
  try {
    const msgs = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
    if (msgs.length > 0) {
      return msgs.map(m => ({ ...m, createdAt: m.createdAt.toISOString() }));
    }
  } catch {
    // Fallback
  }
  return memoryMessages;
}

export async function createMessage(data: { name: string; email: string; subject?: string; message: string }): Promise<MessageData> {
  try {
    const created = await prisma.message.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      }
    });
    return { ...created, createdAt: created.createdAt.toISOString() };
  } catch {
    const newMsg: MessageData = {
      id: `msg-${Date.now()}`,
      ...data,
      read: false,
      createdAt: new Date().toISOString()
    };
    memoryMessages.unshift(newMsg);
    return newMsg;
  }
}

export async function markMessageRead(id: string): Promise<boolean> {
  try {
    await prisma.message.update({ where: { id }, data: { read: true } });
    return true;
  } catch {
    const msg = memoryMessages.find(m => m.id === id);
    if (msg) msg.read = true;
    return true;
  }
}

export async function deleteMessage(id: string): Promise<boolean> {
  try {
    await prisma.message.delete({ where: { id } });
    return true;
  } catch {
    memoryMessages = memoryMessages.filter(m => m.id !== id);
    return true;
  }
}
