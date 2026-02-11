'use client';

import { useState, useEffect } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import {
  Film,
  Clapperboard,
  Briefcase,
  Users,
  MessageSquare,
  Clock,
  TrendingUp,
} from 'lucide-react';

interface DashboardStats {
  portfolio: { total: number; active: number };
  showreels: { total: number };
  jobs: { total: number; active: number };
  applications: { total: number; pending: number };
  contacts: { total: number; unread: number };
}

interface RecentItem {
  _id: string;
  name?: string;
  email?: string;
  status?: string;
  service?: string;
  message?: string;
  createdAt: string;
  jobId?: { title: string };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentApplications, setRecentApplications] = useState<RecentItem[]>([]);
  const [recentContacts, setRecentContacts] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      const data = await res.json();
      if (data.success) {
        setStats(data.data.stats);
        setRecentApplications(data.data.recentApplications);
        setRecentContacts(data.data.recentContacts);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats
    ? [
        { label: 'Portfolio Items', value: stats.portfolio.active, sub: `${stats.portfolio.total} total`, icon: Film, color: 'violet' },
        { label: 'Showreels', value: stats.showreels.total, sub: 'uploaded', icon: Clapperboard, color: 'blue' },
        { label: 'Active Jobs', value: stats.jobs.active, sub: `${stats.jobs.total} total`, icon: Briefcase, color: 'emerald' },
        { label: 'Pending Applications', value: stats.applications.pending, sub: `${stats.applications.total} total`, icon: Users, color: 'amber' },
        { label: 'Unread Messages', value: stats.contacts.unread, sub: `${stats.contacts.total} total`, icon: MessageSquare, color: 'rose' },
      ]
    : [];

  const colorMap: Record<string, string> = {
    violet: 'bg-violet-600/20 text-violet-400',
    blue: 'bg-blue-600/20 text-blue-400',
    emerald: 'bg-emerald-600/20 text-emerald-400',
    amber: 'bg-amber-600/20 text-amber-400',
    rose: 'bg-rose-600/20 text-rose-400',
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    reviewing: 'bg-blue-500/20 text-blue-400',
    shortlisted: 'bg-emerald-500/20 text-emerald-400',
    interview: 'bg-violet-500/20 text-violet-400',
    rejected: 'bg-red-500/20 text-red-400',
    hired: 'bg-green-500/20 text-green-400',
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Overview of your media platform</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 animate-pulse">
                <div className="h-10 w-10 bg-slate-800 rounded-xl mb-3" />
                <div className="h-8 w-16 bg-slate-800 rounded mb-2" />
                <div className="h-4 w-24 bg-slate-800 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {statCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.label}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colorMap[card.color]}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-bold text-white">{card.value}</p>
                    <p className="text-sm text-slate-400">{card.label}</p>
                    <p className="text-xs text-slate-500 mt-1">{card.sub}</p>
                  </div>
                );
              })}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Applications */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <h2 className="text-lg font-semibold text-white">Recent Applications</h2>
                </div>
                {recentApplications.length === 0 ? (
                  <p className="text-slate-500 text-sm">No applications yet</p>
                ) : (
                  <div className="space-y-3">
                    {recentApplications.map((app) => (
                      <div
                        key={app._id}
                        className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl"
                      >
                        <div>
                          <p className="text-sm font-medium text-white">{app.name}</p>
                          <p className="text-xs text-slate-400">
                            {app.jobId?.title || 'Unknown Position'}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-medium ${
                            statusColors[app.status || 'pending']
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Messages */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-slate-400" />
                  <h2 className="text-lg font-semibold text-white">Recent Messages</h2>
                </div>
                {recentContacts.length === 0 ? (
                  <p className="text-slate-500 text-sm">No messages yet</p>
                ) : (
                  <div className="space-y-3">
                    {recentContacts.map((contact) => (
                      <div
                        key={contact._id}
                        className="p-3 bg-slate-800/50 rounded-xl"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-white">{contact.name}</p>
                          <span className="text-xs text-slate-500">
                            {new Date(contact.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-violet-400">{contact.service}</p>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {contact.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminShell>
  );
}
