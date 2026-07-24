'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, Link as LinkIcon, RefreshCw, CheckCircle } from 'lucide-react';

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
  label = 'Upload Image',
  placeholder = 'Select an image file from your computer',
  className = '',
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await uploadFile(files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP, GIF, SVG).');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      onChange(data.url);
    } catch (err: any) {
      console.error('Upload error:', err);
      setUploadError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      // Clear file input value so user can upload the same file again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    onChange('');
    setUploadError(null);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-300">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1 font-medium"
        >
          {showUrlInput ? (
            <>
              <Upload className="w-3 h-3" /> Use File Upload
            </>
          ) : (
            <>
              <LinkIcon className="w-3 h-3" /> Paste Image URL instead
            </>
          )}
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Main Upload / Preview Box */}
      {!showUrlInput ? (
        <div className="space-y-2">
          {value ? (
            /* Image Preview Card */
            <div className="relative group rounded-xl border border-slate-800 bg-slate-900/80 p-2.5 flex items-center gap-3 overflow-hidden">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-950 shrink-0 border border-slate-800 flex items-center justify-center">
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <ImageIcon className="w-6 h-6 text-slate-600 absolute -z-10" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 mb-0.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Image Uploaded / Selected
                </div>
                <p className="text-[11px] text-slate-400 truncate max-w-full font-mono">
                  {value}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="p-2 text-slate-300 hover:text-sky-400 bg-slate-800/80 hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1"
                  title="Change Image"
                >
                  {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline text-[11px]">Change</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isUploading}
                  className="p-2 text-slate-400 hover:text-rose-400 bg-slate-800/80 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Remove Image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Upload Dropzone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? 'border-sky-500 bg-sky-500/10 scale-[1.01]'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900/90'
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center justify-center py-2 space-y-2 text-sky-400">
                  <Loader2 className="w-7 h-7 animate-spin" />
                  <p className="text-xs font-semibold">Uploading image to server...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-1 space-y-2">
                  <div className="p-3 bg-slate-800/80 rounded-full text-sky-400 shadow-inner">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-200">
                      Click to upload <span className="text-slate-400 font-normal">or drag & drop image</span>
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Supports PNG, JPG, WEBP, GIF, SVG (Max 10MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Fallback Direct URL Input */
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://images.unsplash.com/... or /uploads/..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500 pr-10"
          />
          {value && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-rose-400 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-1">
          <span>⚠️</span> {uploadError}
        </p>
      )}
    </div>
  );
}
