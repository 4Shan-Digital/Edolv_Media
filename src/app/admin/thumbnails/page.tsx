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
  ImageIcon,
  Upload,
  Loader2,
} from 'lucide-react';

interface ThumbnailItem {
  _id: string;
  title: string;
  category: string;
  imageUrl: string;
  imageKey: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

interface CategoryOption {
  _id: string;
  name: string;
  isActive: boolean;
}

export default function AdminThumbnailsPage() {
  const [items, setItems] = useState<ThumbnailItem[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ThumbnailItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  // Presigned upload state
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [uploadedImageKey, setUploadedImageKey] = useState('');

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

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/thumbnail-categories');
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  useEffect(() => {
    fetchThumbnails();
    fetchCategories();
  }, [fetchThumbnails, fetchCategories]);

  const resetForm = () => {
    setTitle('');
    setCategory('');
    setImageFile(null);
    setImagePreview('');
    setUploadedImageUrl('');
    setUploadedImageKey('');
    setUploadProgress(0);
    setEditing(null);
    setError('');
  };

  const openEditForm = (item: ThumbnailItem) => {
    setEditing(item);
    setTitle(item.title);
    setCategory(item.category);
    setImagePreview(item.imageUrl);
    setUploadedImageUrl('');
    setUploadedImageKey('');
    setImageFile(null);
    setUploadProgress(0);
    setShowForm(true);
    setError('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setUploadedImageUrl('');
      setUploadedImageKey('');
    }
  };

  const uploadImageViaPresignedUrl = async (file: File): Promise<{ url: string; key: string }> => {
    // 1. Get presigned URL
    const presignRes = await fetch('/api/admin/portfolio/presigned-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type,
        folder: 'thumbnails',
      }),
    });
    const presignData = await presignRes.json();
    if (!presignData.success) throw new Error(presignData.error || 'Failed to get upload URL');

    const { uploadUrl, key, publicUrl } = presignData.data;

    // 2. Upload directly to R2 via presigned URL with progress
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl, true);
      xhr.setRequestHeader('Content-Type', file.type);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({ url: publicUrl, key });
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error('Upload failed'));
      xhr.send(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      let imageUrl = uploadedImageUrl;
      let imageKey = uploadedImageKey;

      // Upload image if a new file was selected
      if (imageFile && !uploadedImageUrl) {
        setIsUploading(true);
        setUploadProgress(0);
        const result = await uploadImageViaPresignedUrl(imageFile);
        imageUrl = result.url;
        imageKey = result.key;
        setUploadedImageUrl(result.url);
        setUploadedImageKey(result.key);
        setIsUploading(false);
      }

      const payload: Record<string, string> = {
        title,
        category,
      };

      if (imageUrl && imageKey) {
        payload.imageUrl = imageUrl;
        payload.imageKey = imageKey;
      }

      if (editing) {
        const res = await fetch(`/api/admin/thumbnails/${editing._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
      } else {
        if (!imageUrl || !imageKey) {
          throw new Error('Please upload an image');
        }
        const res = await fetch('/api/admin/thumbnails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
      }

      setShowForm(false);
      resetForm();
      fetchThumbnails();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsUploading(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this thumbnail?')) return;

    try {
      const res = await fetch(`/api/admin/thumbnails/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setItems((prev) => prev.filter((item) => item._id !== id));
      }
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
      if (data.success) {
        setItems((prev) =>
          prev.map((i) => (i._id === item._id ? { ...i, isActive: !i.isActive } : i))
        );
      }
    } catch (err) {
      console.error('Failed to toggle:', err);
    }
  };

  const activeCategories = categories.filter((c) => c.isActive);

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Thumbnails</h1>
            <p className="text-slate-400 mt-1">Manage thumbnail portfolio items</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition"
          >
            <Plus className="w-4 h-4" />
            Add Thumbnail
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <h2 className="text-lg font-semibold text-white">
                  {editing ? 'Edit Thumbnail' : 'Add Thumbnail'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                    placeholder="Thumbnail title"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                  >
                    <option value="">Select a category</option>
                    {activeCategories.map((cat) => (
                      <option key={cat._id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Image {editing ? '(upload new to replace)' : ''}
                  </label>
                  <div className="space-y-3">
                    {imagePreview && (
                      <div className="relative rounded-xl overflow-hidden border border-slate-700">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}
                    <label className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-violet-500 transition text-sm text-slate-400 hover:text-violet-400">
                      <Upload className="w-4 h-4" />
                      {imageFile ? imageFile.name : 'Choose image file'}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>

                    {/* Upload Progress */}
                    {isUploading && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>Uploading image...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-violet-500 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="px-4 py-2.5 text-slate-400 hover:text-white text-sm font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || isUploading}
                    className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-600/50 text-white text-sm font-medium rounded-xl transition flex items-center gap-2"
                  >
                    {submitting || isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {isUploading ? 'Uploading...' : 'Saving...'}
                      </>
                    ) : editing ? (
                      'Update'
                    ) : (
                      'Create'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Thumbnails Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="aspect-video bg-slate-800" />
                <div className="p-3 space-y-2">
                  <div className="h-4 w-3/4 bg-slate-800 rounded" />
                  <div className="h-3 w-1/2 bg-slate-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
            <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No thumbnails yet</p>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm rounded-xl transition"
            >
              Add Your First Thumbnail
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div
                key={item._id}
                className={`bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group ${
                  !item.isActive ? 'opacity-60' : ''
                }`}
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-slate-600" />
                    </div>
                  )}

                  {/* Hover overlay with actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => openEditForm(item)}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleActive(item)}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition"
                      title={item.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {item.isActive ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 bg-red-500/30 hover:bg-red-500/50 rounded-lg text-white transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Category badge */}
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded-lg text-xs text-white/80">
                    {item.category}
                  </span>

                  {!item.isActive && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 bg-red-500/80 rounded-lg text-xs text-white">
                      Inactive
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="text-sm font-medium text-white truncate">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
