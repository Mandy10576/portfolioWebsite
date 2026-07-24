import { prisma } from './prisma';
import fs from 'fs';
import path from 'path';

export interface ProfileData {
  id?: string;
  name: string;
  title: string;
  tagline: string;
  bio: string;
  avatarUrl?: string | null;
  email: string;
  phone?: string | null;
  location?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  resumeUrl?: string | null;
  availableForWork: boolean;
}

export interface ProjectData {
  id?: string;
  title: string;
  slug: string;
  description: string;
  content?: string | null;
  imageUrl?: string | null;
  demoUrl?: string | null;
  githubUrl?: string | null;
  tags: string;
  featured: boolean;
  order?: number;
}

export interface SkillData {
  id?: string;
  name: string;
  category: string;
  icon?: string | null;
  level: number;
  order?: number;
}

export interface ExperienceData {
  id?: string;
  role: string;
  company: string;
  location?: string | null;
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
  subject?: string | null;
  message: string;
  read?: boolean;
  createdAt?: string;
}

// Initial default profile & portfolio seed content
export const DEFAULT_PROFILE: ProfileData = {
  name: "Mandeep Rao",
  title: "Full-Stack Developer & Cloud Architect",
  tagline: "Building scalable web applications, sleek user experiences, and cloud infrastructure.",
  bio: "Passionate Software Engineer with expertise in Next.js, React, Node.js, and AWS Cloud Architecture. Dedicated to crafting clean code, high-performance web systems, and intuitive CMS interfaces.",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  email: "mandeep.rao@example.com",
  phone: "+1 (555) 234-5678",
  location: "India",
  githubUrl: "https://github.com/Mandy10576",
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
    description: "Distributed file storage & sharing service with end-to-end encryption and fast CDN delivery.",
    content: "Architectural overview of CloudVault, focusing on zero-knowledge encryption algorithms and multi-region S3 replication.",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    demoUrl: "https://example.com",
    githubUrl: "https://github.com",
    tags: "React, Node.js, AWS S3, Redis",
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
  { id: "sk-8", name: "REST APIs & GraphQL", category: "Backend", level: 87, order: 8 },
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

// Persistent File Store Fallback Helper
const getFallbackFilePath = () => {
  const tmpDir = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), '.data');
  if (!fs.existsSync(tmpDir)) {
    try { fs.mkdirSync(tmpDir, { recursive: true }); } catch {}
  }
  return path.join(tmpDir, 'fallback-store.json');
};

const hasLocalStoreFile = () => {
  try {
    const filePath = getFallbackFilePath();
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
};

interface LocalStore {
  profile: ProfileData;
  projects: ProjectData[];
  skills: SkillData[];
  experiences: ExperienceData[];
  messages: MessageData[];
}

function loadLocalStore(): LocalStore {
  try {
    const filePath = getFallbackFilePath();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    }
  } catch {}
  
  const initialStore: LocalStore = {
    profile: { ...DEFAULT_PROFILE },
    projects: [...DEFAULT_PROJECTS],
    skills: [...DEFAULT_SKILLS],
    experiences: [...DEFAULT_EXPERIENCE],
    messages: [
      {
        id: "msg-1",
        name: "Sarah Jenkins",
        email: "sarah@techpartners.com",
        subject: "Freelance Project Inquiry",
        message: "Hi Alex! We loved your portfolio and would like to discuss a custom web application project.",
        read: false,
        createdAt: new Date().toISOString()
      }
    ]
  };

  saveLocalStore(initialStore);
  return initialStore;
}

function saveLocalStore(store: LocalStore) {
  try {
    const filePath = getFallbackFilePath();
    fs.writeFileSync(filePath, JSON.stringify(store, null, 2), 'utf8');
  } catch {}
}

let dbDisabled = false;

async function dbQuery<T>(promise: Promise<T>, timeoutMs: number = 400): Promise<T> {
  if (dbDisabled) {
    throw new Error('Database temporary disabled due to connection reset');
  }

  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<T>((_, reject) => {
    timer = setTimeout(() => reject(new Error('DB Timeout')), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } catch (err: any) {
    // If AWS RDS PostgreSQL resets connection or times out, pause DB attempts for 30s to prevent Next.js dev overlay errors
    const msg = err?.message || '';
    if (msg.includes('ConnectionReset') || msg.includes('forcibly closed') || msg.includes('DB Timeout') || err?.code === 'P1001') {
      dbDisabled = true;
      setTimeout(() => { dbDisabled = false; }, 30000);
    }
    throw err;
  } finally {
    clearTimeout(timer!);
  }
}

// PROFILE
export async function getProfile(): Promise<ProfileData> {
  if (hasLocalStoreFile()) {
    return loadLocalStore().profile;
  }
  try {
    const prof = await dbQuery(prisma.profile.findFirst());
    if (prof) return prof;
  } catch {}
  return loadLocalStore().profile;
}

export async function updateProfile(data: Partial<ProfileData>): Promise<ProfileData> {
  const store = loadLocalStore();
  store.profile = { ...store.profile, ...data };
  saveLocalStore(store);

  try {
    const existing = await dbQuery(prisma.profile.findFirst());
    if (existing) {
      await dbQuery(prisma.profile.update({
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
      }));
    } else {
      await dbQuery(prisma.profile.create({
        data: {
          ...DEFAULT_PROFILE,
          ...data,
        }
      }));
    }
  } catch {}
  
  return store.profile;
}

// PROJECTS
export async function getProjects(): Promise<ProjectData[]> {
  if (hasLocalStoreFile()) {
    return loadLocalStore().projects;
  }
  try {
    const projs = await dbQuery(prisma.project.findMany({ orderBy: { order: 'asc' } }));
    if (projs && projs.length > 0) return projs;
  } catch {}
  return loadLocalStore().projects;
}

export async function createProject(data: Omit<ProjectData, 'id'>): Promise<ProjectData> {
  const store = loadLocalStore();
  const newProj: ProjectData = {
    id: `proj-${Date.now()}`,
    ...data,
    slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  };
  store.projects.unshift(newProj);
  saveLocalStore(store);

  try {
    await dbQuery(prisma.project.create({
      data: {
        title: data.title,
        slug: newProj.slug,
        description: data.description,
        content: data.content,
        imageUrl: data.imageUrl,
        demoUrl: data.demoUrl,
        githubUrl: data.githubUrl,
        tags: data.tags,
        featured: data.featured ?? false,
        order: data.order ?? 1,
      }
    }));
  } catch {}

  return newProj;
}

export async function updateProject(id: string, data: Partial<ProjectData>): Promise<ProjectData> {
  const store = loadLocalStore();
  const idx = store.projects.findIndex(p => p.id === id || p.slug === id);
  if (idx !== -1) {
    store.projects[idx] = { ...store.projects[idx], ...data };
    saveLocalStore(store);
  }

  try {
    await dbQuery(prisma.project.update({
      where: { id },
      data
    }));
  } catch {}

  if (idx !== -1) {
    return store.projects[idx];
  }
  throw new Error('Project not found');
}

export async function deleteProject(id: string): Promise<boolean> {
  const store = loadLocalStore();
  store.projects = store.projects.filter(p => p.id !== id && p.slug !== id);
  saveLocalStore(store);

  try {
    await dbQuery(prisma.project.delete({ where: { id } }));
  } catch {}

  return true;
}

// SKILLS
export async function getSkills(): Promise<SkillData[]> {
  if (hasLocalStoreFile()) {
    return loadLocalStore().skills;
  }
  try {
    const sks = await dbQuery(prisma.skill.findMany({ orderBy: { order: 'asc' } }));
    if (sks && sks.length > 0) return sks;
  } catch {}
  return loadLocalStore().skills;
}

export async function createSkill(data: Omit<SkillData, 'id'>): Promise<SkillData> {
  const store = loadLocalStore();
  const newSk: SkillData = {
    id: `sk-${Date.now()}`,
    ...data
  };
  store.skills.push(newSk);
  saveLocalStore(store);

  try {
    await dbQuery(prisma.skill.create({
      data: {
        name: data.name,
        category: data.category,
        icon: data.icon,
        level: Number(data.level),
        order: data.order ?? 1,
      }
    }));
  } catch {}

  return newSk;
}

export async function deleteSkill(id: string): Promise<boolean> {
  const store = loadLocalStore();
  store.skills = store.skills.filter(s => s.id !== id);
  saveLocalStore(store);

  try {
    await dbQuery(prisma.skill.delete({ where: { id } }));
  } catch {}

  return true;
}

// EXPERIENCES
export async function getExperiences(): Promise<ExperienceData[]> {
  if (hasLocalStoreFile()) {
    return loadLocalStore().experiences;
  }
  try {
    const exps = await dbQuery(prisma.experience.findMany({ orderBy: { order: 'asc' } }));
    if (exps && exps.length > 0) return exps;
  } catch {}
  return loadLocalStore().experiences;
}

export async function createExperience(data: Omit<ExperienceData, 'id'>): Promise<ExperienceData> {
  const store = loadLocalStore();
  const newExp: ExperienceData = {
    id: `exp-${Date.now()}`,
    ...data
  };
  store.experiences.push(newExp);
  saveLocalStore(store);

  try {
    await dbQuery(prisma.experience.create({
      data: {
        role: data.role,
        company: data.company,
        location: data.location,
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description,
        technologies: data.technologies,
        order: data.order ?? 1,
      }
    }));
  } catch {}

  return newExp;
}

export async function deleteExperience(id: string): Promise<boolean> {
  const store = loadLocalStore();
  store.experiences = store.experiences.filter(e => e.id !== id);
  saveLocalStore(store);

  try {
    await dbQuery(prisma.experience.delete({ where: { id } }));
  } catch {}

  return true;
}

// MESSAGES
export async function getMessages(): Promise<MessageData[]> {
  if (hasLocalStoreFile()) {
    return loadLocalStore().messages;
  }
  try {
    const msgs = await dbQuery(prisma.message.findMany({ orderBy: { createdAt: 'desc' } }));
    if (msgs && msgs.length > 0) {
      return msgs.map(m => ({ ...m, createdAt: m.createdAt.toISOString() }));
    }
  } catch {}
  return loadLocalStore().messages;
}

export async function createMessage(data: { name: string; email: string; subject?: string; message: string }): Promise<MessageData> {
  const store = loadLocalStore();
  const newMsg: MessageData = {
    id: `msg-${Date.now()}`,
    ...data,
    read: false,
    createdAt: new Date().toISOString()
  };
  store.messages.unshift(newMsg);
  saveLocalStore(store);

  try {
    await dbQuery(prisma.message.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      }
    }));
  } catch {}

  return newMsg;
}

export async function markMessageRead(id: string): Promise<boolean> {
  const store = loadLocalStore();
  const msg = store.messages.find(m => m.id === id);
  if (msg) msg.read = true;
  saveLocalStore(store);

  try {
    await dbQuery(prisma.message.update({ where: { id }, data: { read: true } }));
  } catch {}

  return true;
}

export async function deleteMessage(id: string): Promise<boolean> {
  const store = loadLocalStore();
  store.messages = store.messages.filter(m => m.id !== id);
  saveLocalStore(store);

  try {
    await dbQuery(prisma.message.delete({ where: { id } }));
  } catch {}

  return true;
}
