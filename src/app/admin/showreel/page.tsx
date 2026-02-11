'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { Plus, Trash2, Eye, Upload, Clapperboard, X } from 'lucide-react';

interface ShowreelItem {
  _id: string;
  title: string;
  description?: string;
  duration: string;
  year: string;
  thumbnailUrl: string;
  videoUrl: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminShowreelPage() {
  const [items, setItems] = useState<ShowreelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [processingUpload, setProcessingUpload] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const fetchShowreels = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/showreel');
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch (err) {
      console.error('Failed to fetch showreels:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShowreels();
  }, [fetchShowreels]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setUploadProgress(0);

    try {
      if (!videoFile || !thumbnailFile) {
        setError('Video and thumbnail are required');
        setSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.set('title', title);
      formData.set('description', description);
      formData.set('duration', duration);
      formData.set('year', year);
      formData.set('video', videoFile);
      formData.set('thumbnail', thumbnailFile);

      // Use XMLHttpRequest to track upload progress
      const xhr = new XMLHttpRequest();

      // Track progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percentComplete);
          setUploadingVideo(videoFile !== null);
          if (percentComplete === 100) {
            setProcessingUpload(true);
          }
        }
      });

      // Promisify the XHR request
      await new Promise<void>((resolve, reject) => {
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              if (!data.success) reject(new Error(data.error));
              else resolve();
            } catch {
              reject(new Error('Invalid response'));
            }
          } else {
            try {
              const data = JSON.parse(xhr.responseText);
              reject(new Error(data.error || 'Upload failed'));
            } catch {
              reject(new Error('Upload failed'));
            }
          }
        });

        xhr.addEventListener('error', () => reject(new Error('Network error')));
        xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));

        xhr.open('POST', '/api/admin/showreel');
        xhr.send(formData);
      });

      // Success - close form and refresh
      await fetchShowreels();
      setShowForm(false);
      setTitle('');
      setDescription('');
      setDuration('');
      setYear(new Date().getFullYear().toString());
      setVideoFile(null);
      setThumbnailFile(null);
      setUploadProgress(0);
      setUploadingVideo(false);
      setProcessingUpload(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setProcessingUpload(false);
    } finally {
      setSubmitting(false);
      setUploadingVideo(false);
      setProcessingUpload(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this showreel? This will also remove the video from storage.')) return;

    try {
      const res = await fetch(`/api/admin/showreel/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setItems((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const handleSetActive = async (id: string) => {
    try {
      const formData = new FormData();
      formData.set('isActive', 'true');

      const res = await fetch(`/api/admin/showreel/${id}`, {
        method: 'PATCH',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        fetchShowreels();
      }
    } catch (err) {
      console.error('Failed to set active:', err);
    }
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Showreel</h1>
            <p className="text-slate-400 mt-1">Manage your showreel video (only one is active at a time)</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition"
          >
            <Plus className="w-4 h-4" />
            Upload Showreel
          </button>
        </div>

        {/* Upload Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg">
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <h2 className="text-lg font-semibold text-white">Upload New Showreel</h2>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Upload Progress Bar */}
                {submitting && uploadProgress > 0 && (
                  <div className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-violet-300">
                        {processingUpload ? 'Processing on server...' : uploadingVideo ? 'Uploading video...' : 'Processing...'}
                      </span>
                      <span className="text-sm font-semibold text-violet-400">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    {videoFile && (
                      <p className="text-xs text-violet-300/70 mt-2">
                        {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                    placeholder="Edolv Media Showreel 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Description (optional)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm resize-none"
                    placeholder="Our best work from this year"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Duration</label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      required
                      pattern="\d{1,2}:\d{2}"
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                      placeholder="2:30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Year</label>
                    <input
                      type="text"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      required
                      pattern="\d{4}"
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                      placeholder="2024"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Video</label>
                  <label className="flex items-center gap-3 px-4 py-4 bg-slate-800 border border-slate-700 border-dashed rounded-xl cursor-pointer hover:border-violet-500 transition">
                    <Upload className="w-5 h-5 text-slate-400" />
                    <span className="text-sm text-slate-400 truncate">
                      {videoFile ? videoFile.name : 'Choose showreel video'}
                    </span>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Thumbnail</label>
                  <label className="flex items-center gap-3 px-4 py-4 bg-slate-800 border border-slate-700 border-dashed rounded-xl cursor-pointer hover:border-violet-500 transition">
                    <Upload className="w-5 h-5 text-slate-400" />
                    <span className="text-sm text-slate-400 truncate">
                      {thumbnailFile ? thumbnailFile.name : 'Choose thumbnail image'}
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2.5 text-slate-400 hover:text-white text-sm font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-600/50 text-white text-sm font-medium rounded-xl transition flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {processingUpload ? 'Processing...' : uploadProgress > 0 ? `${uploadProgress}%` : 'Starting...'}
                      </>
                    ) : (
                      'Upload Showreel'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Showreel List */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 animate-pulse">
                <div className="h-48 bg-slate-800 rounded-xl" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
            <Clapperboard className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No showreel uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className={`bg-slate-900 border ${
                  item.isActive ? 'border-violet-500/50' : 'border-slate-800'
                } rounded-2xl overflow-hidden`}
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-72 h-44 bg-slate-800 flex-shrink-0">
                    {item.thumbnailUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-semibold text-white">{item.title}</h3>
                          {item.isActive && (
                            <span className="px-2 py-0.5 bg-violet-500/20 text-violet-400 text-xs rounded-lg font-medium">
                              Active
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-sm text-slate-400 mt-1">{item.description}</p>
                        )}
                        <p className="text-xs text-slate-500 mt-2">
                          {item.duration} • {item.year} • Uploaded {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      {!item.isActive && (
                        <button
                          onClick={() => handleSetActive(item._id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-violet-600/20 hover:bg-violet-600/30 text-violet-400 text-xs rounded-lg transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Set as Active
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded-lg transition ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
