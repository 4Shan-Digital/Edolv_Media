'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { Trash2, Users, ExternalLink, ChevronDown } from 'lucide-react';

interface ApplicationItem {
  _id: string;
  name: string;
  email: string;
  phone: string;
  coverLetter?: string;
  resumeUrl: string;
  portfolioUrl?: string;
  status: string;
  createdAt: string;
  jobId?: { _id: string; title: string; department: string };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const statuses = ['pending', 'reviewing', 'shortlisted', 'interview', 'rejected', 'hired'];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  reviewing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  shortlisted: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  interview: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
  hired: 'bg-green-500/20 text-green-400 border-green-500/30',
};

export default function AdminApplicationsPage() {
  const [items, setItems] = useState<ApplicationItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchApplications = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const params = new URLSearchParams({ page: page.toString(), limit: '20' });
        if (filterStatus) params.set('status', filterStatus);

        const res = await fetch(`/api/admin/applications?${params}`);
        const data = await res.json();
        if (data.success) {
          setItems(data.data.applications);
          setPagination(data.data.pagination);
        }
      } catch (err) {
        console.error('Failed to fetch applications:', err);
      } finally {
        setLoading(false);
      }
    },
    [filterStatus]
  );

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setItems((prev) =>
          prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;

    try {
      const res = await fetch(`/api/admin/applications/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setItems((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Applications</h1>
            <p className="text-slate-400 mt-1">
              {pagination ? `${pagination.total} total applications` : 'Manage job applications'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="">All statuses</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 animate-pulse">
                <div className="h-5 w-48 bg-slate-800 rounded mb-2" />
                <div className="h-4 w-32 bg-slate-800 rounded" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No applications found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden"
              >
                <div
                  className="p-5 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === item._id ? null : item._id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-sm font-semibold text-white">{item.name}</h3>
                        <span
                          className={`px-2 py-0.5 text-xs rounded-lg border ${
                            statusColors[item.status]
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {item.jobId?.title || 'Unknown Position'} • {item.jobId?.department || ''} •{' '}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform ${
                        expandedId === item._id ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </div>

                {expandedId === item._id && (
                  <div className="px-5 pb-5 border-t border-slate-800 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500 text-xs mb-1">Email</p>
                        <a href={`mailto:${item.email}`} className="text-violet-400 hover:underline">
                          {item.email}
                        </a>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs mb-1">Phone</p>
                        <p className="text-white">{item.phone}</p>
                      </div>
                      {item.portfolioUrl && (
                        <div>
                          <p className="text-slate-500 text-xs mb-1">Portfolio</p>
                          <a
                            href={item.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-violet-400 hover:underline flex items-center gap-1"
                          >
                            View Portfolio <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                      <div>
                        <p className="text-slate-500 text-xs mb-1">Resume</p>
                        <a
                          href={item.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-violet-400 hover:underline flex items-center gap-1"
                        >
                          Download Resume <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {item.coverLetter && (
                      <div className="mt-4">
                        <p className="text-slate-500 text-xs mb-1">Cover Letter</p>
                        <p className="text-sm text-slate-300 bg-slate-800/50 p-3 rounded-xl">
                          {item.coverLetter}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">Change status:</span>
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item._id, e.target.value)}
                          className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-violet-500"
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item._id);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 pt-4">
                {Array.from({ length: pagination.totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => fetchApplications(i + 1)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition ${
                      pagination.page === i + 1
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
