import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProjectsSection from '@/components/ProjectsSection';
import SkillsSection from '@/components/SkillsSection';
import ExperienceSection from '@/components/ExperienceSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import { getExperiences, getProfile, getProjects, getSkills } from '@/lib/data';

// Enforce dynamic rendering so added/edited projects appear instantly on refresh
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const profile = await getProfile();
  const projects = await getProjects();
  const skills = await getSkills();
  const experiences = await getExperiences();

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans flex flex-col justify-between">
      <Navbar />

      <main className="flex-1">
        <Hero profile={profile} />
        <ProjectsSection projects={projects} />
        <SkillsSection skills={skills} />
        <ExperienceSection experiences={experiences} />
        <ContactSection profile={profile} />
      </main>

      <Footer profile={profile} />
    </div>
  );
}
