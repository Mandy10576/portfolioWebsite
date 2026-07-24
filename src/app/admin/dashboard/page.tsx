'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUploader from '@/components/ImageUploader';
import {
  ShieldCheck,
  FolderPlus,
  User,
  LogOut,
  Mail,
  Cpu,
  Briefcase,
  Database,
  Plus,
  Trash2,
  Check,
  Globe,
  Loader2,
  Save,
  CheckCircle2,
  ExternalLink,
  Github,
  Star,
  Pencil,
  X
} from 'lucide-react';
import { ExperienceData, ProfileData, ProjectData, SkillData, MessageData } from '@/lib/data';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'skills' | 'experience' | 'messages' | 'database'>('projects');
  
  // Data states
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [messages, setMessages] = useState<MessageData[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Editing modal state
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);

  // Forms states
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    tags: '',
    demoUrl: '',
    githubUrl: '',
    imageUrl: '',
    featured: false,
  });

  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'Frontend',
    level: 85,
  });

  const [newExp, setNewExp] = useState({
    role: '',
    company: '',
    location: '',
    startDate: '',
    endDate: 'Present',
    description: '',
    technologies: '',
  });

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      setLoading(true);
      const authRes = await fetch('/api/auth/me');
      if (!authRes.ok) {
        router.push('/admin/login');
        return;
      }

      await loadAllData();
    } catch {
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const loadAllData = async () => {
    const [profRes, projRes, skRes, expRes, msgRes] = await Promise.all([
      fetch('/api/admin/profile'),
      fetch('/api/admin/projects'),
      fetch('/api/admin/skills'),
      fetch('/api/admin/experience'),
      fetch('/api/admin/messages'),
    ]);

    if (profRes.ok) setProfile((await profRes.json()).profile);
    if (projRes.ok) setProjects((await projRes.json()).projects);
    if (skRes.ok) setSkills((await skRes.json()).skills);
    if (expRes.ok) setExperiences((await expRes.json()).experiences);
    if (msgRes.ok) setMessages((await msgRes.json()).messages);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  // Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        setFeedback({ type: 'success', message: 'Profile updated successfully!' });
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (err) {
      setFeedback({ type: 'error', message: (err as Error).message });
    } finally {
      setSaving(false);
    }
  };

  // Add Project
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });
      if (res.ok) {
        setNewProject({
          title: '',
          description: '',
          tags: '',
          demoUrl: '',
          githubUrl: '',
          imageUrl: '',
          featured: false,
        });
        await loadAllData();
        setFeedback({ type: 'success', message: 'Project created successfully!' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: (err as Error).message });
    } finally {
      setSaving(false);
    }
  };

  // Delete Project (Optimistic UI - Instant 0ms)
  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    const prevProjects = projects;
    setProjects(prev => prev.filter(p => (p.id || p.slug) !== id));

    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        setProjects(prevProjects);
        setFeedback({ type: 'error', message: 'Failed to delete project.' });
      }
    } catch {
      setProjects(prevProjects);
      setFeedback({ type: 'error', message: 'Failed to delete project.' });
    }
  };

  // Update Project
  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.id) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/projects/${editingProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProject),
      });
      if (res.ok) {
        setEditingProject(null);
        await loadAllData();
        setFeedback({ type: 'success', message: 'Project updated successfully!' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: (err as Error).message });
    } finally {
      setSaving(false);
    }
  };

  // Add Skill
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSkill),
      });
      if (res.ok) {
        setNewSkill({ name: '', category: 'Frontend', level: 85 });
        await loadAllData();
        setFeedback({ type: 'success', message: 'Skill added successfully!' });
      }
    } finally {
      setSaving(false);
    }
  };

  // Delete Skill (Optimistic UI - Instant 0ms)
  const handleDeleteSkill = async (id: string) => {
    const prevSkills = skills;
    setSkills(prev => prev.filter(s => s.id !== id));
    try {
      const res = await fetch(`/api/admin/skills/${id}`, { method: 'DELETE' });
      if (!res.ok) setSkills(prevSkills);
    } catch {
      setSkills(prevSkills);
    }
  };

  // Add Experience
  const handleAddExp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExp),
      });
      if (res.ok) {
        setNewExp({
          role: '',
          company: '',
          location: '',
          startDate: '',
          endDate: 'Present',
          description: '',
          technologies: '',
        });
        await loadAllData();
        setFeedback({ type: 'success', message: 'Experience added successfully!' });
      }
    } finally {
      setSaving(false);
    }
  };

  // Delete Experience (Optimistic UI - Instant 0ms)
  const handleDeleteExp = async (id: string) => {
    const prevExps = experiences;
    setExperiences(prev => prev.filter(e => e.id !== id));
    try {
      const res = await fetch(`/api/admin/experience/${id}`, { method: 'DELETE' });
      if (!res.ok) setExperiences(prevExps);
    } catch {
      setExperiences(prevExps);
    }
  };

  // Mark Message Read
  const handleMarkRead = async (id: string) => {
    await fetch(`/api/admin/messages/${id}`, { method: 'PATCH' });
    await loadAllData();
  };

  // Delete Message (Optimistic UI - Instant 0ms)
  const handleDeleteMessage = async (id: string) => {
    const prevMsgs = messages;
    setMessages(prev => prev.filter(m => m.id !== id));
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
      if (!res.ok) setMessages(prevMsgs);
    } catch {
      setMessages(prevMsgs);
    }
  };

  // Seed DB
  const handleSeedDatabase = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: 'success', message: data.message });
        await loadAllData();
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setFeedback({ type: 'error', message: (err as Error).message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      {/* CMS Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/25">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base text-white flex items-center gap-2">
                Portfolio CMS Dashboard
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Live
                </span>
              </h1>
              <p className="text-xs text-slate-400">Content Management & Database System</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"
            >
              <Globe className="w-4 h-4 text-sky-400" />
              View Site
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl text-rose-300 hover:text-rose-200 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main CMS Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="md:col-span-1 space-y-2">
          <button
            onClick={() => { setActiveTab('projects'); setFeedback(null); }}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl font-medium text-xs transition-all ${
              activeTab === 'projects'
                ? 'bg-sky-500 text-white font-semibold shadow-lg shadow-sky-500/25'
                : 'glass-card text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <FolderPlus className="w-4 h-4" />
              Projects ({projects.length})
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('profile'); setFeedback(null); }}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl font-medium text-xs transition-all ${
              activeTab === 'profile'
                ? 'bg-sky-500 text-white font-semibold shadow-lg shadow-sky-500/25'
                : 'glass-card text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <User className="w-4 h-4" />
              Profile & Bio
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('skills'); setFeedback(null); }}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl font-medium text-xs transition-all ${
              activeTab === 'skills'
                ? 'bg-sky-500 text-white font-semibold shadow-lg shadow-sky-500/25'
                : 'glass-card text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Cpu className="w-4 h-4" />
              Skills ({skills.length})
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('experience'); setFeedback(null); }}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl font-medium text-xs transition-all ${
              activeTab === 'experience'
                ? 'bg-sky-500 text-white font-semibold shadow-lg shadow-sky-500/25'
                : 'glass-card text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Briefcase className="w-4 h-4" />
              Experience ({experiences.length})
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('messages'); setFeedback(null); }}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl font-medium text-xs transition-all ${
              activeTab === 'messages'
                ? 'bg-sky-500 text-white font-semibold shadow-lg shadow-sky-500/25'
                : 'glass-card text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Mail className="w-4 h-4" />
              Inbox ({messages.filter(m => !m.read).length} new)
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('database'); setFeedback(null); }}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl font-medium text-xs transition-all ${
              activeTab === 'database'
                ? 'bg-sky-500 text-white font-semibold shadow-lg shadow-sky-500/25'
                : 'glass-card text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Database className="w-4 h-4" />
              AWS RDS Setup
            </span>
          </button>
        </aside>

        {/* CMS Main Content Area */}
        <main className="md:col-span-3">
          {feedback && (
            <div
              className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold ${
                feedback.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {feedback.message}
            </div>
          )}

          {/* TAB 1: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-8">
              {/* Create Project Form */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-sky-400" />
                  Add New Project
                </h3>
                <form onSubmit={handleAddProject} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Project Title *</label>
                      <input
                        type="text"
                        required
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        placeholder="e.g. Enterprise Cloud Analytics"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Tags (Comma Separated) *</label>
                      <input
                        type="text"
                        required
                        value={newProject.tags}
                        onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                        placeholder="Next.js, AWS RDS, PostgreSQL, Tailwind"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Short Description *</label>
                    <textarea
                      rows={2}
                      required
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      placeholder="Brief overview of features and architecture..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Live Demo URL</label>
                      <input
                        type="text"
                        value={newProject.demoUrl}
                        onChange={(e) => setNewProject({ ...newProject, demoUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">GitHub Repo URL</label>
                      <input
                        type="text"
                        value={newProject.githubUrl}
                        onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                        placeholder="https://github.com/..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <ImageUploader
                      value={newProject.imageUrl}
                      onChange={(url) => setNewProject({ ...newProject, imageUrl: url })}
                      label="Project Cover Image"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={newProject.featured}
                      onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })}
                      className="rounded border-slate-800 bg-slate-900 text-sky-500 focus:ring-sky-500"
                    />
                    <label htmlFor="featured" className="text-xs text-slate-300">
                      Feature on homepage badge
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/20"
                  >
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                    Save Project
                  </button>
                </form>
              </div>

              {/* Projects List */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">Existing Projects</h3>
                <div className="grid grid-cols-1 gap-4">
                  {projects.map((proj) => (
                    <div
                      key={proj.id || proj.slug}
                      className="glass-card p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        {proj.imageUrl && (
                          <img
                            src={proj.imageUrl}
                            alt={proj.title}
                            className="w-12 h-12 rounded-lg object-cover bg-slate-900 shrink-0"
                          />
                        )}
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            {proj.title}
                            {proj.featured && (
                              <span className="text-[10px] bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded-md">
                                Featured
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-1">{proj.description}</p>
                          <span className="text-[10px] text-indigo-400">{proj.tags}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setEditingProject(proj)}
                          className="p-2 rounded-lg bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 text-xs transition-colors"
                          title="Edit project"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => proj.id && handleDeleteProject(proj.id)}
                          className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs transition-colors"
                          title="Delete project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Edit Project Modal */}
              {editingProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Pencil className="w-4 h-4 text-sky-400" />
                        Edit Project Details
                      </h3>
                      <button
                        onClick={() => setEditingProject(null)}
                        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleUpdateProject} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Project Title *</label>
                          <input
                            type="text"
                            required
                            value={editingProject.title}
                            onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Tags (Comma Separated) *</label>
                          <input
                            type="text"
                            required
                            value={editingProject.tags}
                            onChange={(e) => setEditingProject({ ...editingProject, tags: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Short Description *</label>
                        <textarea
                          rows={3}
                          required
                          value={editingProject.description}
                          onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Live Demo URL</label>
                          <input
                            type="text"
                            value={editingProject.demoUrl || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, demoUrl: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">GitHub Repo URL</label>
                          <input
                            type="text"
                            value={editingProject.githubUrl || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                          />
                        </div>
                      </div>

                      <div>
                        <ImageUploader
                          value={editingProject.imageUrl || ''}
                          onChange={(url) => setEditingProject({ ...editingProject, imageUrl: url })}
                          label="Project Cover Image"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="edit-featured"
                          checked={editingProject.featured}
                          onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                          className="rounded border-slate-800 bg-slate-900 text-sky-500 focus:ring-sky-500"
                        />
                        <label htmlFor="edit-featured" className="text-xs text-slate-300">
                          Feature on homepage badge
                        </label>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => setEditingProject(null)}
                          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={saving}
                          className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/20"
                        >
                          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                          Update Project
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROFILE */}
          {activeTab === 'profile' && profile && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <h3 className="text-base font-bold text-white mb-6">Edit Profile & Bio</h3>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Professional Title</label>
                    <input
                      type="text"
                      value={profile.title}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Bio</label>
                  <textarea
                    rows={4}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Location</label>
                    <input
                      type="text"
                      value={profile.location || ''}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">GitHub Profile URL</label>
                    <input
                      type="text"
                      value={profile.githubUrl || ''}
                      onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">LinkedIn Profile URL</label>
                    <input
                      type="text"
                      value={profile.linkedinUrl || ''}
                      onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <ImageUploader
                    value={profile.avatarUrl || ''}
                    onChange={(url) => setProfile({ ...profile, avatarUrl: url })}
                    label="Profile Avatar Image"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/20"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Update Profile Details
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: SKILLS */}
          {activeTab === 'skills' && (
            <div className="space-y-8">
              <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <h3 className="text-base font-bold text-white mb-4">Add Technical Skill</h3>
                <form onSubmit={handleAddSkill} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Skill Name *</label>
                      <input
                        type="text"
                        required
                        value={newSkill.name}
                        onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                        placeholder="e.g. AWS RDS PostgreSQL"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Category *</label>
                      <select
                        value={newSkill.category}
                        onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                      >
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="Database">Database</option>
                        <option value="DevOps & Cloud">DevOps & Cloud</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Proficiency Level ({newSkill.level}%)</label>
                      <input
                        type="range"
                        min="50"
                        max="100"
                        value={newSkill.level}
                        onChange={(e) => setNewSkill({ ...newSkill, level: Number(e.target.value) })}
                        className="w-full mt-2 accent-sky-400"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs flex items-center gap-2"
                  >
                    <Plus className="w-3.5 h-3.5" /> Save Skill
                  </button>
                </form>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {skills.map((skill) => (
                  <div key={skill.id || skill.name} className="glass-card p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{skill.name}</h4>
                      <p className="text-xs text-sky-400">{skill.category} — {skill.level}%</p>
                    </div>
                    <button
                      onClick={() => skill.id && handleDeleteSkill(skill.id)}
                      className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="space-y-8">
              <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <h3 className="text-base font-bold text-white mb-4">Add Work Experience</h3>
                <form onSubmit={handleAddExp} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Job Role *</label>
                      <input
                        type="text"
                        required
                        value={newExp.role}
                        onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                        placeholder="Full-Stack Engineer"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Company Name *</label>
                      <input
                        type="text"
                        required
                        value={newExp.company}
                        onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                        placeholder="Tech Corp"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Start Date *</label>
                      <input
                        type="text"
                        required
                        value={newExp.startDate}
                        onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })}
                        placeholder="2022"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">End Date *</label>
                      <input
                        type="text"
                        required
                        value={newExp.endDate}
                        onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
                        placeholder="Present or 2024"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Description *</label>
                    <textarea
                      rows={3}
                      required
                      value={newExp.description}
                      onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                      placeholder="Responsibilities and achievements..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Technologies Used</label>
                    <input
                      type="text"
                      value={newExp.technologies}
                      onChange={(e) => setNewExp({ ...newExp, technologies: e.target.value })}
                      placeholder="Next.js, PostgreSQL, AWS RDS"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs flex items-center gap-2"
                  >
                    <Plus className="w-3.5 h-3.5" /> Save Experience
                  </button>
                </form>
              </div>

              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id || exp.role} className="glass-card p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{exp.role} @ {exp.company}</h4>
                      <p className="text-xs text-slate-400">{exp.startDate} — {exp.endDate}</p>
                    </div>
                    <button
                      onClick={() => exp.id && handleDeleteExp(exp.id)}
                      className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white mb-4">Contact Inbox</h3>
              {messages.length === 0 ? (
                <div className="glass-card p-8 rounded-2xl text-center text-slate-400 text-xs">
                  No messages in inbox yet.
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`glass-card p-5 rounded-2xl border ${
                      msg.read ? 'border-slate-800/80 opacity-75' : 'border-sky-500/30 bg-sky-500/5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          {msg.name}
                          {!msg.read && (
                            <span className="text-[10px] bg-sky-500 text-white px-2 py-0.5 rounded-full font-semibold">
                              New
                            </span>
                          )}
                        </h4>
                        <a href={`mailto:${msg.email}`} className="text-xs text-sky-400 hover:underline">
                          {msg.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        {!msg.read && (
                          <button
                            onClick={() => msg.id && handleMarkRead(msg.id)}
                            className="p-2 text-emerald-400 hover:bg-emerald-500/20 rounded-lg text-xs"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => msg.id && handleDeleteMessage(msg.id)}
                          className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-lg text-xs"
                          title="Delete message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {msg.subject && (
                      <p className="text-xs font-semibold text-slate-300 mb-2">Subject: {msg.subject}</p>
                    )}
                    <p className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      {msg.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 6: DATABASE & AWS RDS */}
          {activeTab === 'database' && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-orange-400" />
                  AWS RDS PostgreSQL & Vercel Integration
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  This portfolio website connects to AWS RDS PostgreSQL via Prisma ORM.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider">Database Operations</h4>
                <p className="text-xs text-slate-300">
                  Click below to seed default profile data, projects, skills, and admin accounts into your connected database:
                </p>
                <button
                  onClick={handleSeedDatabase}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-orange-500/20"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
                  Seed Initial Data to Database
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <h4 className="font-bold text-white">How AWS RDS Connection Works:</h4>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                  <li>In production on Vercel, set your environment variable: <code className="text-sky-400 font-mono">DATABASE_URL="postgresql://user:pass@host:5432/dbname?sslmode=require"</code></li>
                  <li>Prisma ORM handles schema migrations, queries, and connection pooling smoothly.</li>
                  <li>Every CRUD operation done in this CMS updates the live PostgreSQL tables instantly.</li>
                </ul>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
