import React from 'react';
import Link from 'next/link';
import { Github, Linkedin, Twitter, Heart, Database, Server } from 'lucide-react';
import { ProfileData } from '@/lib/data';

interface FooterProps {
  profile: ProfileData;
}

export default function Footer({ profile }: FooterProps) {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-12 text-slate-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="text-xl font-bold text-white tracking-tight">
              {profile.name} <span className="text-sky-400">.</span>
            </Link>
            <p className="text-sm text-slate-400 max-w-md text-center md:text-left">
              {profile.title}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {profile.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-sky-500/50 hover:bg-slate-800 transition-all"
                aria-label="GitHub Profile"
              >
                <Github className="w-5 h-5" />
              </a>
            )}
            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-sky-500/50 hover:bg-slate-800 transition-all"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {profile.twitterUrl && (
              <a
                href={profile.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-sky-500/50 hover:bg-slate-800 transition-all"
                aria-label="Twitter Profile"
              >
                <Twitter className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
              <Server className="w-3.5 h-3.5 text-sky-400" />
              Deployed on Vercel
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
              <Database className="w-3.5 h-3.5 text-orange-400" />
              AWS RDS PostgreSQL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
