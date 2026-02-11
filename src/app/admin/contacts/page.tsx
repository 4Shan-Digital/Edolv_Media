'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { Trash2, MessageSquare, Mail, CheckCircle, Circle } from 'lucide-react';

interface ContactItem {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminContactsPage() {
  const [items, setItems] = useState<ContactItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterRead, setFilterRead] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchContacts = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const params = new URLSearchParams({ page: page.toString(), limit: '20' });
        if (filterRead !== '') params.set('isRead', filterRead);

        const res = await fetch(`/api/admin/contacts?${params}`);
        const data = await res.json();
        if (data.success) {
          setItems(data.data.contacts);
          setPagination(data.data.pagination);
          setUnreadCount(data.data.unreadCount);
        }
      } catch (err) {
        console.error('Failed to fetch contacts:', err);
      } finally {
        setLoading(false);
      }
    },
    [filterRead]
  );

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleToggleRead = async (item: ContactItem) => {
    try {
      const res = await fetch(`/api/admin/contacts/${item._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: !item.isRead }),
      });
      const data = await res.json();
      if (data.success) {
        setItems((prev) =>
          prev.map((i) => (i._id === item._id ? { ...i, isRead: !i.isRead } : i))
        );
        setUnreadCount((prev) => (item.isRead ? prev + 1 : prev - 1));
      }
    } catch (err) {
      console.error('Failed to toggle read:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const res = await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        const deleted = items.find((i) => i._id === id);
        if (deleted && !deleted.isRead) {
          setUnreadCount((prev) => prev - 1);
        }
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
            <h1 className="text-2xl font-bold text-white">Contact Messages</h1>
            <p className="text-slate-400 mt-1">
              {unreadCount > 0 && (
                <span className="text-violet-400 font-medium">{unreadCount} unread</span>
              )}
              {unreadCount > 0 && pagination ? ' • ' : ''}
              {pagination ? `${pagination.total} total` : 'Manage contact form submissions'}
            </p>
          </div>
          <select
            value={filterRead}
            onChange={(e) => setFilterRead(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="">All messages</option>
            <option value="false">Unread only</option>
            <option value="true">Read only</option>
          </select>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 animate-pulse">
                <div className="h-5 w-48 bg-slate-800 rounded mb-2" />
                <div className="h-4 w-64 bg-slate-800 rounded" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
            <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No messages found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item._id}
                className={`bg-slate-900 border rounded-2xl overflow-hidden transition ${
                  !item.isRead
                    ? 'border-violet-500/30 bg-violet-500/5'
                    : 'border-slate-800'
                }`}
              >
                <div
                  className="p-5 cursor-pointer"
                  onClick={() => {
                    setExpandedId(expandedId === item._id ? null : item._id);
                    if (!item.isRead) handleToggleRead(item);
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {!item.isRead ? (
                          <Circle className="w-2.5 h-2.5 fill-violet-500 text-violet-500 flex-shrink-0" />
                        ) : null}
                        <h3 className={`text-sm font-semibold truncate ${!item.isRead ? 'text-white' : 'text-slate-300'}`}>
                          {item.name}
                        </h3>
                        <span className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded-lg flex-shrink-0">
                          {item.service}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 truncate">{item.email}</p>
                      <p className="text-sm text-slate-500 mt-2 line-clamp-1">{item.message}</p>
                    </div>
                    <span className="text-xs text-slate-500 flex-shrink-0">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {expandedId === item._id && (
                  <div className="px-5 pb-5 border-t border-slate-800 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm mb-4">
                      <div>
                        <p className="text-slate-500 text-xs mb-1">Email</p>
                        <a href={`mailto:${item.email}`} className="text-violet-400 hover:underline flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {item.email}
                        </a>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs mb-1">Phone</p>
                        <p className="text-white">{item.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs mb-1">Service</p>
                        <p className="text-white">{item.service}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-slate-500 text-xs mb-1">Message</p>
                      <p className="text-sm text-slate-300 bg-slate-800/50 p-4 rounded-xl whitespace-pre-wrap">
                        {item.message}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleRead(item);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
                      >
                        {item.isRead ? (
                          <>
                            <Circle className="w-3 h-3" />
                            Mark as Unread
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Mark as Read
                          </>
                        )}
                      </button>
                      <div className="flex items-center gap-2">
                        <a
                          href={`mailto:${item.email}`}
                          className="flex items-center gap-1 px-3 py-1.5 bg-violet-600/20 hover:bg-violet-600/30 text-violet-400 text-xs rounded-lg transition"
                        >
                          <Mail className="w-3 h-3" />
                          Reply
                        </a>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item._id);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded-lg transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
                    onClick={() => fetchContacts(i + 1)}
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
