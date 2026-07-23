import React from 'react';
import Image from 'next/image';
import { ArrowDown, Mail, Github, Linkedin, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import { ProfileData } from '@/lib/data';

interface HeroProps {
  profile: ProfileData;
}

export default function Hero({ profile }: HeroProps) {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Gradient Blurs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sky-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-indigo-500/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            {profile.availableForWork && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Available for Projects & Full-time Roles
              </div>
            )}

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
              Hi, I'm <span className="gradient-text">{profile.name}</span>
            </h1>

            <p className="text-xl font-medium text-sky-300/90 mb-4 flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-sky-400" />
              {profile.title}
            </p>

            <p className="text-base text-slate-300 leading-relaxed max-w-2xl mb-8">
              {profile.bio}
            </p>

            {profile.location && (
              <p className="text-sm text-slate-400 flex items-center justify-center md:justify-start gap-1.5 mb-8">
                <MapPin className="w-4 h-4 text-sky-400" />
                Based in {profile.location}
              </p>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <a
                href="#projects"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-sky-500/25 flex items-center gap-2 transition-all hover:scale-105"
              >
                View My Projects
                <ArrowDown className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                className="px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white font-semibold text-sm border border-slate-700 flex items-center gap-2 transition-all hover:scale-105"
              >
                <Mail className="w-4 h-4 text-sky-400" />
                Contact Me
              </a>
            </div>
          </div>

          {/* Avatar / Profile Graphic Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-3xl blur-lg opacity-40 group-hover:opacity-75 transition duration-500" />
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden glass-panel border border-slate-700/60 p-3">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500">
                  No Image Set
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
