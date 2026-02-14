'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { Plus, Edit, Trash2, Eye, EyeOff, X, Upload, Film } from 'lucide-react';

interface PortfolioItem {
  _id: string;
  title: string;
  category: string;
  description: string;
  client: string;
  duration: string;
  year: string;
  thumbnailUrl: string;
  thumbnailKey?: string;
  videoUrl: string;
  videoKey?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

interface CategoryItem {
  _id: string;
  name: string;
  isActive: boolean;
}

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [processingUpload, setProcessingUpload] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [client, setClient] = useState('');
  const [duration, setDuration] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  const fetchPortfolios = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/portfolio');
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch (err) {
      console.error('Failed to fetch portfolios:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchPortfolios();
  }, [fetchCategories, fetchPortfolios]);

  const resetForm = () => {
    setTitle('');
    setCategory(categories.length > 0 ? categories[0].name : '');
    setDescription('');
    setClient('');
    setDuration('');
    setYear(new Date().getFullYear().toString());
    setVideoFile(null);
    setThumbnailFile(null);
    setEditing(null);
    setError('');
    setUploadProgress(0);
    setUploadingVideo(false);
    setProcessingUpload(false);
  };

  const openCreateForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (item: PortfolioItem) => {
    setEditing(item);
    setTitle(item.title);
    setCategory(item.category);
    setDescription(item.description);
    setClient(item.client);
    setDuration(item.duration);
    setYear(item.year);
    setVideoFile(null);
    setThumbnailFile(null);
    setShowForm(true);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setUploadProgress(0);

    try {
      if (!editing && (!videoFile || !thumbnailFile)) {
        setError('Video and thumbnail are required for new items');
        setSubmitting(false);
        return;
      }

      let videoUrl = editing?.videoUrl;
      let videoKey = editing?.videoKey;
      let thumbnailUrl = editing?.thumbnailUrl;
      let thumbnailKey = editing?.thumbnailKey;

      // Upload files directly to R2 using presigned URLs (bypasses Vercel limits)
      if (videoFile || thumbnailFile) {
        setUploadingVideo(true);
        const totalFiles = (videoFile ? 1 : 0) + (thumbnailFile ? 1 : 0);
        let uploadedFiles = 0;

        // Upload video if provided
        if (videoFile) {
          setUploadProgress(10);
          
          // Get presigned URL for video
          const presignedRes = await fetch('/api/admin/portfolio/presigned-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: videoFile.name,
              contentType: videoFile.type,
              folder: 'portfolio'
            })
          });

          if (!presignedRes.ok) {
            throw new Error('Failed to get video upload URL');
          }

          const { uploadUrl, key, publicUrl } = (await presignedRes.json()).data;

          // Upload directly to R2 with progress tracking
          await new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (e) => {
              if (e.lengthComputable) {
                const fileProgress = (e.loaded / e.total) * 100;
                const totalProgress = 10 + ((uploadedFiles + fileProgress / 100) / totalFiles) * 80;
                setUploadProgress(Math.round(totalProgress));
              }
            });

            xhr.addEventListener('load', () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                videoUrl = publicUrl;
                videoKey = key;
                uploadedFiles++;
                resolve();
              } else {
                reject(new Error('Video upload failed'));
              }
            });

            xhr.addEventListener('error', () => reject(new Error('Video upload network error')));
            xhr.open('PUT', uploadUrl);
            xhr.setRequestHeader('Content-Type', videoFile.type);
            xhr.send(videoFile);
          });
        }

        // Upload thumbnail if provided
        if (thumbnailFile) {
          setUploadProgress(videoFile ? 50 : 10);

          // Get presigned URL for thumbnail
          const presignedRes = await fetch('/api/admin/portfolio/presigned-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: thumbnailFile.name,
              contentType: thumbnailFile.type,
              folder: 'thumbnails'
            })
          });

          if (!presignedRes.ok) {
            throw new Error('Failed to get thumbnail upload URL');
          }

          const { uploadUrl, key, publicUrl } = (await presignedRes.json()).data;

          // Upload directly to R2
          await new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (e) => {
              if (e.lengthComputable) {
                const fileProgress = (e.loaded / e.total) * 100;
                const baseProgress = videoFile ? 50 : 10;
                const totalProgress = baseProgress + ((uploadedFiles + fileProgress / 100) / totalFiles) * 40;
                setUploadProgress(Math.round(totalProgress));
              }
            });

            xhr.addEventListener('load', () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                thumbnailUrl = publicUrl;
                thumbnailKey = key;
                uploadedFiles++;
                resolve();
              } else {
                reject(new Error('Thumbnail upload failed'));
              }
            });

            xhr.addEventListener('error', () => reject(new Error('Thumbnail upload network error')));
            xhr.open('PUT', uploadUrl);
            xhr.setRequestHeader('Content-Type', thumbnailFile.type);
            xhr.send(thumbnailFile);
          });
        }

        setUploadProgress(90);
        setProcessingUpload(true);
      }

      // Create/update portfolio item with metadata only (no files)
      const payload = {
        title,
        category,
        description,
        client,
        duration,
        year,
        videoUrl,
        videoKey,
        thumbnailUrl,
        thumbnailKey,
      };

      const url = editing
        ? `/api/admin/portfolio/${editing._id}`
        : '/api/admin/portfolio';
      const method = editing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to save portfolio item');
      }

      setUploadProgress(100);

      // Success - close form and refresh
      await fetchPortfolios();
      setShowForm(false);
      resetForm();
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
    if (!confirm('Are you sure you want to delete this portfolio item? This will also remove the video and thumbnail from storage.')) return;

    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setItems((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const handleToggleActive = async (item: PortfolioItem) => {
    try {
      const formData = new FormData();
      formData.set('isActive', (!item.isActive).toString());

      const res = await fetch(`/api/admin/portfolio/${item._id}`, {
        method: 'PATCH',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setItems((prev) =>
          prev.map((i) => (i._id === item._id ? { ...i, isActive: !i.isActive } : i))
        );
      }
    } catch (err) {
      console.error('Failed to toggle:', err);
    }
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Portfolio</h1>
            <p className="text-slate-400 mt-1">Manage your portfolio videos</p>
          </div>
          <button
            onClick={openCreateForm}
            className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition"
          >
            <Plus className="w-4 h-4" />
            Add Portfolio
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <h2 className="text-lg font-semibold text-white">
                  {editing ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
                </h2>
                <button onClick={() => { setShowForm(false); resetForm(); }} className="text-slate-400 hover:text-white">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                      placeholder="Project title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                    >
                      {categories.filter(c => c.isActive).map((c) => (
                        <option key={c._id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={3}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm resize-none"
                    placeholder="Project description"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Client</label>
                    <input
                      type="text"
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                      placeholder="Client name"
                    />
                  </div>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Video {editing ? '(leave empty to keep current)' : ''}
                    </label>
                    <label className="flex items-center gap-3 px-4 py-3 bg-slate-800 border border-slate-700 border-dashed rounded-xl cursor-pointer hover:border-violet-500 transition">
                      <Upload className="w-5 h-5 text-slate-400" />
                      <span className="text-sm text-slate-400 truncate">
                        {videoFile ? videoFile.name : 'Choose video file'}
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
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Thumbnail {editing ? '(leave empty to keep current)' : ''}
                    </label>
                    <label className="flex items-center gap-3 px-4 py-3 bg-slate-800 border border-slate-700 border-dashed rounded-xl cursor-pointer hover:border-violet-500 transition">
                      <Upload className="w-5 h-5 text-slate-400" />
                      <span className="text-sm text-slate-400 truncate">
                        {thumbnailFile ? thumbnailFile.name : 'Choose image file'}
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); resetForm(); }}
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
                      editing ? 'Update' : 'Create'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Portfolio List */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 animate-pulse">
                <div className="h-40 bg-slate-800 rounded-xl mb-3" />
                <div className="h-5 w-3/4 bg-slate-800 rounded mb-2" />
                <div className="h-4 w-1/2 bg-slate-800 rounded" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
            <Film className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No portfolio items yet</p>
            <button
              onClick={openCreateForm}
              className="mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm rounded-xl transition"
            >
              Add Your First Portfolio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item._id}
                className={`bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden ${
                  !item.isActive ? 'opacity-60' : ''
                }`}
              >
                {/* Thumbnail */}
                <div className="relative h-44 bg-slate-800">
                  {item.thumbnailUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <span className="px-2 py-1 bg-black/60 text-white text-xs rounded-lg">
                      {item.category}
                    </span>
                    {!item.isActive && (
                      <span className="px-2 py-1 bg-red-500/60 text-white text-xs rounded-lg">
                        Hidden
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <span className="px-2 py-1 bg-black/60 text-white text-xs rounded-lg">
                      {item.duration}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-white truncate">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{item.client} • {item.year}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800">
                    <button
                      onClick={() => openEditForm(item)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleActive(item)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
                    >
                      {item.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      {item.isActive ? 'Hide' : 'Show'}
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded-lg transition ml-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
