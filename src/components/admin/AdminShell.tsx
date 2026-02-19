'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Film,
  Clapperboard,
  Briefcase,
  Users,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Tag,
  Play,
  UserCog,
  ImageIcon,
  FolderOpen,
  Video,
} from 'lucide-react';

interface AdminShellProps {
  children: React.ReactNode;
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/portfolio', label: 'Portfolio', icon: Film },
  { href: '/admin/thumbnails', label: 'Thumbnails', icon: ImageIcon },
  { href: '/admin/reels', label: 'Reels', icon: Video },
  { href: '/admin/showreel', label: 'Showreel', icon: Clapperboard },
  { href: '/admin/about-video', label: 'About Video', icon: Play },
  { href: '/admin/team', label: 'Team Members', icon: UserCog },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/thumbnail-categories', label: 'Thumb Categories', icon: FolderOpen },
  { href: '/admin/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/admin/applications', label: 'Applications', icon: Users },
  { href: '/admin/contacts', label: 'Contacts', icon: MessageSquare },
];

export default function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  }, [router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 border-r border-slate-800 flex flex-col transform transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <Link href="/admin" className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">
              Edolv <span className="text-violet-500">Admin</span>
            </h1>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  active
                    ? 'bg-violet-600/20 text-violet-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
                {active && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 shrink-0">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
          >
            <LogOut className="w-5 h-5" />
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
          <Link
            href="/"
            className="flex items-center gap-3 mt-1 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:text-violet-400 hover:bg-slate-800 transition"
          >
            ← Back to Website
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="text-sm text-slate-400">
              {navItems.find((item) => isActive(item.href))?.label || 'Admin'}
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
