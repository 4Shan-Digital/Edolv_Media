'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import {
  Trash2,
  Eye,
  EyeOff,
  ImageIcon,
  Upload,
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface ThumbnailItem {
  _id: string;
  title: string;
  imageUrl: string;
  imageKey: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

/* ─── Per-file upload state ─────────────────────────────────── */
interface FileEntry {
  id: string;          // unique local id
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
  progress: number;
  error?: string;
}

export default function AdminThumbnailsPage() {
  const [items, setItems] = useState<ThumbnailItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fileEntries, setFileEntries] = useState<FileEntry[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ─── Fetch existing thumbnails ─────────────────────────── */
  const fetchThumbnails = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/thumbnails');
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch (err) {
      console.error('Failed to fetch thumbnails:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchThumbnails();
  }, [fetchThumbnails]);

  /* ─── File selection helper ─────────────────────────────── */
  const addFiles = (incomingFiles: FileList | File[]) => {
    const accepted = Array.from(incomingFiles).filter((f) =>
      f.type.startsWith('image/')
    );
    const entries: FileEntry[] = accepted.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      status: 'pending',
      progress: 0,
    }));
    setFileEntries((prev) => [...prev, ...entries]);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    // reset input so same files can be re-selected
    e.target.value = '';
  };

  const removeEntry = (id: string) => {
    setFileEntries((prev) => {
      const entry = prev.find((e) => e.id === id);
      if (entry) URL.revokeObjectURL(entry.preview);
      return prev.filter((e) => e.id !== id);
    });
  };

  /* ─── Drag-and-drop ─────────────────────────────────────── */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  /* ─── Upload a single file via presigned URL ────────────── */
  const uploadOne = async (entry: FileEntry): Promise<void> => {
    // mark uploading
    setFileEntries((prev) =>
      prev.map((e) => (e.id === entry.id ? { ...e, status: 'uploading' } : e))
    );

    try {
      // 1. Get presigned URL
      const presignRes = await fetch('/api/admin/portfolio/presigned-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: entry.file.name,
          contentType: entry.file.type,
          folder: 'thumbnails',
        }),
      });
      const presignData = await presignRes.json();
      if (!presignData.success)
        throw new Error(presignData.error || 'Failed to get upload URL');

      const { uploadUrl, key, publicUrl } = presignData.data;

      // 2. Upload to R2 with progress
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', uploadUrl, true);
        xhr.setRequestHeader('Content-Type', entry.file.type);

        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) {
            const pct = Math.round((ev.loaded / ev.total) * 100);
            setFileEntries((prev) =>
              prev.map((e) => (e.id === entry.id ? { ...e, progress: pct } : e))
            );
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`Upload failed (${xhr.status})`));
        };
        xhr.onerror = () => reject(new Error('Network error during upload'));
        xhr.send(entry.file);
      });

      // 3. Save thumbnail record (title auto-derived in API)
      const saveRes = await fetch('/api/admin/thumbnails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: publicUrl, imageKey: key }),
      });
      const saveData = await saveRes.json();
      if (!saveData.success) throw new Error(saveData.error || 'Failed to save');

      setFileEntries((prev) =>
        prev.map((e) =>
          e.id === entry.id ? { ...e, status: 'done', progress: 100 } : e
        )
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setFileEntries((prev) =>
        prev.map((e) =>
          e.id === entry.id ? { ...e, status: 'error', error: msg } : e
        )
      );
    }
  };

  /* ─── Upload all pending files ──────────────────────────── */
  const handleUploadAll = async () => {
    const pending = fileEntries.filter((e) => e.status === 'pending');
    if (!pending.length) return;

    setIsUploading(true);
    await Promise.all(pending.map((e) => uploadOne(e)));
    setIsUploading(false);
    await fetchThumbnails();

    // Clear completed entries after a brief delay so user sees "done" state
    setTimeout(() => {
      setFileEntries((prev) => prev.filter((e) => e.status !== 'done'));
    }, 1500);
  };

  /* ─── Existing thumbnail actions ────────────────────────── */
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this thumbnail?')) return;
    try {
      const res = await fetch(`/api/admin/thumbnails/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const handleToggleActive = async (item: ThumbnailItem) => {
    try {
      const res = await fetch(`/api/admin/thumbnails/${item._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      const data = await res.json();
      if (data.success)
        setItems((prev) =>
          prev.map((i) => (i._id === item._id ? { ...i, isActive: !i.isActive } : i))
        );
    } catch (err) {
      console.error('Failed to toggle:', err);
    }
  };

  const pendingCount = fileEntries.filter((e) => e.status === 'pending').length;

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Thumbnails</h1>
            <p className="text-slate-400 mt-1">Upload multiple images at once — no title or category needed.</p>
          </div>
        </div>

        {/* ── Drop / Select zone ─────────────────────────────── */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-3 p-10 border-2 border-dashed border-slate-700 hover:border-violet-500 rounded-2xl cursor-pointer transition bg-slate-900/50 hover:bg-slate-900 group"
        >
          <Upload className="w-8 h-8 text-slate-500 group-hover:text-violet-400 transition" />
          <p className="text-slate-400 text-sm text-center">
            <span className="font-medium text-violet-400">Click to select</span> or drag &amp; drop images here
          </p>
          <p className="text-xs text-slate-600">JPEG, PNG, WEBP, AVIF — multiple files supported</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>

        {/* ── Selected file previews ──────────────────────────── */}
        {fileEntries.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-300">
                {fileEntries.length} image{fileEntries.length !== 1 ? 's' : ''} selected
                {pendingCount > 0 && ` (${pendingCount} ready to upload)`}
              </p>
              {pendingCount > 0 && (
                <button
                  onClick={handleUploadAll}
                  disabled={isUploading}
                  className="flex items-center gap-2 px-5 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition"
                >
                  {isUploading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</>
                  ) : (
                    <><Upload className="w-4 h-4" /> Upload {pendingCount} Image{pendingCount !== 1 ? 's' : ''}</>
                  )}
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {fileEntries.map((entry) => (
                <div key={entry.id} className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-900 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={entry.preview} alt={entry.file.name} className="w-full aspect-video object-cover" />

                  {/* Status overlay */}
                  {entry.status === 'uploading' && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1 px-2">
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                      <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-violet-500 transition-all duration-300"
                          style={{ width: `${entry.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-white/80">{entry.progress}%</span>
                    </div>
                  )}
                  {entry.status === 'done' && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                    </div>
                  )}
                  {entry.status === 'error' && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1 px-2">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <span className="text-xs text-red-300 text-center line-clamp-2">{entry.error}</span>
                    </div>
                  )}

                  {/* Remove button (pending/error only) */}
                  {(entry.status === 'pending' || entry.status === 'error') && (
                    <button
                      onClick={(e) => { e.stopPropagation(); removeEntry(entry.id); }}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 hover:bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* File name tooltip */}
                  <div className="px-1.5 py-1 bg-slate-900/90">
                    <p className="text-xs text-slate-400 truncate">{entry.file.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Existing thumbnails grid ────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-video bg-slate-800" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
            <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No thumbnails uploaded yet.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500">{items.length} thumbnail{items.length !== 1 ? 's' : ''}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className={`bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group ${!item.isActive ? 'opacity-60' : ''}`}
                >
                  <div className="relative aspect-video overflow-hidden">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-slate-600" />
                      </div>
                    )}

                    {/* Hover action overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleToggleActive(item)}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition"
                        title={item.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {item.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 bg-red-500/30 hover:bg-red-500/50 rounded-lg text-white transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {!item.isActive && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-red-500/80 rounded-lg text-xs text-white">
                        Inactive
                      </span>
                    )}
                  </div>

                  <div className="p-2">
                    <p className="text-xs text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </AdminShell>
  );
}

