'use client';

import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, Phone, MapPin, Loader2 } from 'lucide-react';
import { ProfileData } from '@/lib/data';

interface ContactSectionProps {
  profile: ProfileData;
}

export default function ContactSection({ profile }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus({
        type: 'success',
        message: 'Thank you! Your message has been saved in the PostgreSQL database & sent to the Admin CMS!',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({
        type: 'error',
        message: (err as Error).message || 'Failed to submit form',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-950/80 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-3">
            <Mail className="w-3.5 h-3.5" />
            Let's Connect
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Send Me a Message
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mt-3">
            Have a project in mind or want to collaborate? Send me a message below. Messages are saved securely into AWS RDS PostgreSQL.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Card */}
          <div className="glass-panel p-8 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-6">Contact Details</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</h4>
                    <a href={`mailto:${profile.email}`} className="text-sm font-medium text-white hover:text-sky-400 transition-colors">
                      {profile.email}
                    </a>
                  </div>
                </div>

                {profile.phone && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone</h4>
                      <p className="text-sm font-medium text-white">{profile.phone}</p>
                    </div>
                  </div>
                )}

                {profile.location && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</h4>
                      <p className="text-sm font-medium text-white">{profile.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400">
              ⚡ All messages submitted here trigger an instant notification in your Admin CMS inbox.
            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-2 glass-panel p-8 rounded-2xl border border-slate-800">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full bg-slate-900/90 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full bg-slate-900/90 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Project Inquiry / Job Opportunity"
                  className="w-full bg-slate-900/90 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Message *
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about your project or inquiry..."
                  className="w-full bg-slate-900/90 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>

              {status && (
                <div
                  className={`p-4 rounded-xl flex items-center gap-3 text-sm ${
                    status.type === 'success'
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                      : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                  }`}
                >
                  {status.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 shrink-0" />
                  )}
                  {status.message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-sky-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
