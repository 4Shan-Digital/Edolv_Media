'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { Upload, Trash2, Eye, X, Play } from 'lucide-react';

interface AboutVideoItem {
  _id: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
  videoUrl: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminAboutVideoPage() {
  const [items, setItems] = useState<AboutVideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [processingUpload, setProcessingUpload] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const fetchVideos = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/about-video');
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch (err) {
      console.error('Failed to fetch about videos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

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
      if (description) formData.set('description', description);
      formData.set('video', videoFile);
      formData.set('thumbnail', thumbnailFile);

      const xhr = new XMLHttpRequest();

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
        xhr.open('POST', '/api/admin/about-video');
        xhr.send(formData);
      });

      setShowForm(false);
      setTitle('');
      setDescription('');
      setVideoFile(null);
      setThumbnailFile(null);
      setUploadProgress(0);
      setUploadingVideo(false);
      setProcessingUpload(false);
      fetchVideos();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    try {
      const res = await fetch(`/api/admin/about-video?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchVideos();
      else alert(data.error);
    } catch {
      alert('Failed to delete video');
    }
  };

  return (
    <AdminShell>
      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          {showForm ? <X className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Upload New Video'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Upload About Video</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Video File * (MP4, MOV)</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                className="w-full"
                required
              />
              {videoFile && (
                <p className="text-sm text-gray-600 mt-1">
                  {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Thumbnail * (JPG, PNG)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                className="w-full"
                required
              />
              {thumbnailFile && (
                <p className="text-sm text-gray-600 mt-1">{thumbnailFile.name}</p>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
            )}

            {uploadProgress > 0 && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>
                    {processingUpload
                      ? 'Processing...'
                      : uploadingVideo
                      ? 'Uploading video...'
                      : 'Preparing...'}
                  </span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Uploading...' : 'Upload Video'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Play className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600">No about video uploaded yet</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 relative aspect-video bg-gray-200">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-blue-400/20 flex items-center justify-center"><span class="text-4xl text-gray-400">📹</span></div>';
                      }
                    }}
                  />
                  {item.isActive && (
                    <span className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs rounded">
                      Active
                    </span>
                  )}
                </div>
                <div className="flex-1 p-6">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  {item.description && (
                    <p className="text-gray-600 mb-4">{item.description}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    Uploaded: {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <a
                      href={item.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center gap-1 text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </a>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 flex items-center gap-1 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
