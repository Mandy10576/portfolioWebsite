'use client';

import React from 'react';
import { X, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export default function ImageUploader({
  value,
  onChange,
  label = 'Project Cover Image URL',
  placeholder = 'https://images.unsplash.com/... or https://i.imgur.com/...',
  className = '',
}: ImageUploaderProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-xs font-semibold text-slate-300">
        {label}
      </label>

      {/* URL Input Box */}
      <div className="relative flex items-center">
        <div className="absolute left-3 text-slate-500 pointer-events-none">
          <LinkIcon className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500 transition-colors"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-3 text-slate-500 hover:text-rose-400 transition-colors p-1"
            title="Clear URL"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Image Preview Box */}
      {value && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-2.5 flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-slate-950 shrink-0 border border-slate-800 flex items-center justify-center">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <ImageIcon className="w-5 h-5 text-slate-600 absolute -z-10" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium text-emerald-400 mb-0.5">Image Preview Loaded</p>
            <p className="text-[10px] text-slate-400 truncate font-mono">{value}</p>
          </div>
        </div>
      )}
    </div>
  );
}
