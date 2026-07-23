import React from 'react';
import { Cpu, CheckCircle2 } from 'lucide-react';
import { SkillData } from '@/lib/data';

interface SkillsSectionProps {
  skills: SkillData[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  // Group skills by category
  const categoriesMap: Record<string, SkillData[]> = {};
  skills.forEach((skill) => {
    if (!categoriesMap[skill.category]) {
      categoriesMap[skill.category] = [];
    }
    categoriesMap[skill.category].push(skill);
  });

  return (
    <section id="skills" className="py-20 bg-slate-950/60 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
            <Cpu className="w-3.5 h-3.5" />
            Skills & Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Technical Stack & Expertise
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mt-3">
            Technologies, frameworks, and database engines I work with regularly to build full-stack cloud products.
          </p>
        </div>

        {/* Skills Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(categoriesMap).map(([category, items]) => (
            <div key={category} className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-sky-400" />
                {category}
              </h3>

              <div className="space-y-5">
                {items.map((skill) => (
                  <div key={skill.id || skill.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-sky-400" />
                        {skill.name}
                      </span>
                      <span className="text-xs font-medium text-slate-400">{skill.level}%</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
