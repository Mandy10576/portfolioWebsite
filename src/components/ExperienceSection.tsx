import React from 'react';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { ExperienceData } from '@/lib/data';

interface ExperienceSectionProps {
  experiences: ExperienceData[];
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <section id="experience" className="py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            Career History
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Work Experience
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mt-3">
            My professional journey building production applications and scalable architecture.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative border-l-2 border-slate-800 ml-4 sm:ml-32 space-y-12">
          {experiences.map((exp, index) => (
            <div key={exp.id || index} className="relative pl-6 sm:pl-8 group">
              {/* Timeline Dot */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-sky-400 group-hover:bg-sky-400 transition-colors" />

              {/* Date badge on left for desktop */}
              <div className="sm:absolute sm:-left-36 sm:top-1 sm:text-right sm:w-28 text-xs font-semibold text-sky-400 mb-2 sm:mb-0 flex items-center gap-1.5 sm:justify-end">
                <Calendar className="w-3.5 h-3.5 sm:hidden" />
                {exp.startDate} — {exp.endDate}
              </div>

              {/* Card Content */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 group-hover:border-slate-700 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors">
                    {exp.role}
                  </h3>
                  <span className="text-sm font-semibold text-indigo-300">
                    {exp.company}
                  </span>
                </div>

                {exp.location && (
                  <p className="text-xs text-slate-400 flex items-center gap-1 mb-4">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {exp.location}
                  </p>
                )}

                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  {exp.description}
                </p>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {exp.technologies.split(',').map((tech, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-medium px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400"
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
