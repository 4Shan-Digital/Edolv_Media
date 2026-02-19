'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  X,
  Film,
  Upload,
  Loader2,
  Play,
} from 'lucide-react';

interface ReelItem {
  _id: string;
  title: string;
  videoUrl: string;
  videoKey: string;
  thumbnailUrl: string;
  thumbnailKey: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminReelsPage() {
  const [items, setItems] = useState<ReelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ReelItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Upload states
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [thumbUploadProgress, setThumbUploadProgress] = useState(0);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState('');

  // Presigned upload state
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState('');
  const [uploadedVideoKey, setUploadedVideoKey] = useState('');
  const [uploadedThumbUrl, setUploadedThumbUrl] = useState('');
  const [uploadedThumbKey, setUploadedThumbKey] = useState('');

  const fetchReels = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/reels');
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch (err) {
      console.error('Failed to fetch reels:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReels();
  }, [fetchReels]);

  const resetForm = () => {
    setTitle('');
    setVideoFile(null);
    setThumbFile(null);
    setThumbPreview('');
    setUploadedVideoUrl('');
    setUploadedVideoKey('');
    setUploadedThumbUrl('');
    setUploadedThumbKey('');
    setVideoUploadProgress(0);
    setThumbUploadProgress(0);
    setEditing(null);
    setError('');
  };

  const openEditForm = (item: ReelItem) => {
    setEditing(item);
    setTitle(item.title);
    setThumbPreview(item.thumbnailUrl || '');
    setUploadedVideoUrl('');
    setUploadedVideoKey('');
    setUploadedThumbUrl('');
    setUploadedThumbKey('');
    setVideoFile(null);
    setThumbFile(null);
    setVideoUploadProgress(0);
    setThumbUploadProgress(0);
    setShowForm(true);
    setError('');
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setUploadedVideoUrl('');
      setUploadedVideoKey('');
    }
  };

  const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbFile(file);
      setThumbPreview(URL.createObjectURL(file));
      setUploadedThumbUrl('');
      setUploadedThumbKey('');
    }
  };

  const uploadViaPresignedUrl = async (
    file: File,
    folder: string,
    onProgress: (p: number) => void,
    setUploading: (v: boolean) => void
  ): Promise<{ url: string; key: string }> => {
    // 1. Get presigned URL
    const presignRes = await fetch('/api/admin/portfolio/presigned-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: file.name, contentType: file.type, folder }),
    });
    const presignData = await presignRes.json();
    if (!presignData.success) throw new Error(presignData.error || 'Failed to get upload URL');

    const { uploadUrl, key, publicUrl } = presignData.data;

    // 2. Upload directly to R2 via XHR for progress
    setUploading(true);
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
      });
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else reject(new Error(`Upload failed: ${xhr.status}`));
      });
      xhr.addEventListener('error', () => reject(new Error('Upload failed')));
      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
    setUploading(false);

    return { url: publicUrl, key };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      let videoUrl = uploadedVideoUrl;
      let videoKey = uploadedVideoKey;
      let thumbnailUrl = uploadedThumbUrl;
      let thumbnailKey = uploadedThumbKey;

      // Upload video if a new file was selected
      if (videoFile) {
        const result = await uploadViaPresignedUrl(
          videoFile,
          'reels',
          setVideoUploadProgress,
          setIsUploadingVideo
        );
        videoUrl = result.url;
        videoKey = result.key;
      }

      // Upload thumbnail if a new file was selected
      if (thumbFile) {
        const result = await uploadViaPresignedUrl(
          thumbFile,
          'reels',
          setThumbUploadProgress,
          setIsUploadingThumb
        );
        thumbnailUrl = result.url;
        thumbnailKey = result.key;
      }

      if (editing) {
        // PATCH – only send fields that changed
        const body: Record<string, unknown> = { title };
        if (videoKey) { body.videoUrl = videoUrl; body.videoKey = videoKey; }
        if (thumbnailKey) { body.thumbnailUrl = thumbnailUrl; body.thumbnailKey = thumbnailKey; }

        const res = await fetch(`/api/admin/reels/${editing._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'Update failed');
      } else {
        // POST – create new
        if (!videoUrl || !videoKey) {
          setError('Please upload a video file.');
          setSubmitting(false);
          return;
        }
        const res = await fetch('/api/admin/reels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, videoUrl, videoKey, thumbnailUrl, thumbnailKey }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'Create failed');
      }

      await fetchReels();
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (item: ReelItem) => {
    try {
      const res = await fetch(`/api/admin/reels/${item._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      const data = await res.json();
      if (data.success) await fetchReels();
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this reel? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/reels/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) await fetchReels();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reels</h1>
            <p className="text-gray-500 text-sm mt-1">Manage short video reels shown in the portfolio.</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Reel
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                  {editing ? 'Edit Reel' : 'Add New Reel'}
                </h2>
                <button onClick={() => { setShowForm(false); resetForm(); }}>
                  <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    placeholder="e.g. Brand Reel 2025"
                  />
                </div>

                {/* Video Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video File {!editing && '*'}
                  </label>
                  {editing && (
                    <p className="text-xs text-gray-400 mb-2">Leave blank to keep existing video.</p>
                  )}
                  <label className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-purple-400 transition">
                    <Upload className="w-6 h-6 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {videoFile ? videoFile.name : 'Click to select video (MP4, MOV, WebM)'}
                    </span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="hidden"
                    />
                  </label>
                  {isUploadingVideo && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 transition-all duration-300"
                          style={{ width: `${videoUploadProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Uploading video… {videoUploadProgress}%</p>
                    </div>
                  )}
                </div>

                {/* Thumbnail Upload (optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Image <span className="text-gray-400">(optional)</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-purple-400 transition">
                    {thumbPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumbPreview} alt="cover" className="w-16 h-10 object-cover rounded" />
                    ) : (
                      <Film className="w-6 h-6 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-500">
                      {thumbFile ? thumbFile.name : 'Click to select cover image (optional)'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbChange}
                      className="hidden"
                    />
                  </label>
                  {isUploadingThumb && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 transition-all duration-300"
                          style={{ width: `${thumbUploadProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Uploading image… {thumbUploadProgress}%</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); resetForm(); }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || isUploadingVideo || isUploadingThumb}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving…
                      </>
                    ) : editing ? 'Save Changes' : 'Upload Reel'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Film className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No reels yet. Add your first reel!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item) => (
              <div
                key={item._id}
                className={`bg-white rounded-2xl border overflow-hidden shadow-sm transition ${
                  item.isActive ? 'border-gray-100' : 'border-gray-200 opacity-60'
                }`}
              >
                {/* Preview */}
                <div className="relative aspect-video bg-gray-100">
                  {item.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="w-10 h-10 text-gray-300" />
                    </div>
                  )}
                  {!item.isActive && (
                    <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full border">
                        Hidden
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm truncate mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 px-4 pb-4">
                  <button
                    onClick={() => openEditForm(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 hover:bg-gray-100 text-gray-600 transition"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleActive(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 hover:bg-gray-100 text-gray-600 transition"
                  >
                    {item.isActive ? (
                      <><EyeOff className="w-3.5 h-3.5" />Hide</>
                    ) : (
                      <><Eye className="w-3.5 h-3.5" />Show</>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 hover:bg-red-100 text-red-600 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
