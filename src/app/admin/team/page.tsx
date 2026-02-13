'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { Plus, Edit, Trash2, X, Users } from 'lucide-react';

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  order: number;
  social?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  isActive: boolean;
  createdAt: string;
}

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [order, setOrder] = useState(0);
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/team');
      const data = await res.json();
      if (data.success) setMembers(data.data);
    } catch (err) {
      console.error('Failed to fetch team members:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const resetForm = () => {
    setName('');
    setRole('');
    setBio('');
    setOrder(0);
    setLinkedin('');
    setTwitter('');
    setInstagram('');
    setImageFile(null);
    setEditingId(null);
    setShowForm(false);
    setError('');
    setUploadProgress(0);
  };

  const handleEdit = (member: TeamMember) => {
    setName(member.name);
    setRole(member.role);
    setBio(member.bio);
    setOrder(member.order);
    setLinkedin(member.social?.linkedin || '');
    setTwitter(member.social?.twitter || '');
    setInstagram(member.social?.instagram || '');
    setEditingId(member._id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setUploadProgress(0);

    try {
      if (!editingId && !imageFile) {
        setError('Image is required for new team members');
        setSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.set('name', name);
      formData.set('role', role);
      formData.set('bio', bio);
      formData.set('order', order.toString());
      if (linkedin) formData.set('linkedin', linkedin);
      if (twitter) formData.set('twitter', twitter);
      if (instagram) formData.set('instagram', instagram);
      if (imageFile) formData.set('image', imageFile);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percentComplete);
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
              reject(new Error(data.error || 'Operation failed'));
            } catch {
              reject(new Error('Operation failed'));
            }
          }
        });

        xhr.addEventListener('error', () => reject(new Error('Network error')));
        
        const url = editingId
          ? `/api/admin/team?id=${editingId}`
          : '/api/admin/team';
        const method = editingId ? 'PUT' : 'POST';
        
        xhr.open(method, url);
        xhr.send(formData);
      });

      resetForm();
      fetchMembers();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Operation failed';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    try {
      const res = await fetch(`/api/admin/team?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchMembers();
      else alert(data.error);
    } catch {
      alert('Failed to delete team member');
    }
  };

  return (
    <AdminShell>
      <div className="mb-6">
        <button
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Add Team Member'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Team Member' : 'Add New Team Member'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Role *</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., Creative Director"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Bio * (Max 500 characters)</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
                maxLength={500}
                required
              />
              <p className="text-xs text-gray-500 mt-1">{bio.length}/500 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Display Order (lower numbers appear first)
              </label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border rounded-lg"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Profile Image * (JPG, PNG)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="w-full"
                required={!editingId}
              />
              {imageFile && (
                <p className="text-sm text-gray-600 mt-1">{imageFile.name}</p>
              )}
              {editingId && !imageFile && (
                <p className="text-sm text-gray-500 mt-1">
                  Leave empty to keep current image
                </p>
              )}
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Social Media Links (Optional)</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Twitter URL</label>
                  <input
                    type="url"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="https://twitter.com/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Instagram URL</label>
                  <input
                    type="url"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="https://instagram.com/username"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
            )}

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Uploading...</span>
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
              {submitting
                ? editingId
                  ? 'Updating...'
                  : 'Adding...'
                : editingId
                ? 'Update Member'
                : 'Add Member'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : members.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Users className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600">No team members added yet</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div key={member._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative aspect-square bg-gray-200">
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-blue-400/20 flex items-center justify-center"><span class="text-6xl font-bold text-gray-400">${member.name.charAt(0)}</span></div>`;
                    }
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-primary-600 text-sm mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm line-clamp-3 mb-3">{member.bio}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <span>Order: {member.order}</span>
                  {member.social?.linkedin && <span>• LinkedIn</span>}
                  {member.social?.twitter && <span>• Twitter</span>}
                  {member.social?.instagram && <span>• Instagram</span>}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center justify-center gap-1 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member._id)}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 flex items-center gap-1 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
