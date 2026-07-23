'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Code2, ShieldCheck, Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <nav className="glass-panel rounded-2xl px-5 py-3.5 flex items-center justify-between shadow-2xl">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-transform">
              <Code2 className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white group-hover:text-sky-400 transition-colors">
              Dev<span className="text-sky-400">Portfolio</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#projects" className="hover:text-sky-400 transition-colors">Projects</a>
            <a href="#skills" className="hover:text-sky-400 transition-colors">Skills</a>
            <a href="#experience" className="hover:text-sky-400 transition-colors">Experience</a>
            <a href="#contact" className="hover:text-sky-400 transition-colors">Contact</a>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/admin/login"
              className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Admin CMS
            </Link>
            <a
              href="#contact"
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/20 transition-all hover:scale-105"
            >
              Get In Touch
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 p-5 glass-panel rounded-2xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <a
              href="#projects"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-200 hover:text-sky-400 py-1 text-sm font-medium"
            >
              Projects
            </a>
            <a
              href="#skills"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-200 hover:text-sky-400 py-1 text-sm font-medium"
            >
              Skills
            </a>
            <a
              href="#experience"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-200 hover:text-sky-400 py-1 text-sm font-medium"
            >
              Experience
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-200 hover:text-sky-400 py-1 text-sm font-medium"
            >
              Contact
            </a>
            <hr className="border-slate-800" />
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2 rounded-xl text-slate-200 bg-slate-800 text-sm font-medium"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Admin CMS Login
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
