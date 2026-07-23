'use client';

import React, { useState } from 'react';
import { ExternalLink, Github, Sparkles, Search, Tag } from 'lucide-react';
import { ProjectData } from '@/lib/data';

interface ProjectsSectionProps {
  projects: ProjectData[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Extract unique tags
  const allTags = ['All'];
  projects.forEach((p) => {
    p.tags.split(',').forEach((t) => {
      const cleanTag = t.trim();
      if (cleanTag && !allTags.includes(cleanTag)) {
        allTags.push(cleanTag);
      }
    });
  });

  const filteredProjects = projects.filter((project) => {
    const matchesTag =
      selectedTag === 'All' ||
      project.tags.toLowerCase().includes(selectedTag.toLowerCase());
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <section id="projects" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Featured Work & Projects
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Selected Portfolio Projects
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mt-3">
            Explore my latest web applications, APIs, and cloud architecture solutions managed dynamically via the Admin CMS.
          </p>
        </div>

        {/* Search & Tag Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          {/* Tag Pills */}
          <div className="flex flex-wrap items-center gap-2 max-w-full overflow-x-auto pb-2 sm:pb-0">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`text-xs font-medium px-4 py-2 rounded-xl transition-all ${
                  selectedTag === tag
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800 focus:border-sky-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id || project.slug}
              className="glass-card rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1.5"
            >
              {/* Project Image */}
              <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500 text-xs">
                    No Preview Available
                  </div>
                )}
                {project.featured && (
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-sky-500/90 text-white text-[10px] font-bold tracking-wide uppercase shadow-md">
                    Featured
                  </span>
                )}
              </div>

              {/* Project Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.tags.split(',').map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-300"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-3 border-t border-slate-800/60 pt-4">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        aria-label="GitHub Source Code"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 glass-card rounded-2xl">
            <p className="text-slate-400 text-sm">No projects found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
}
