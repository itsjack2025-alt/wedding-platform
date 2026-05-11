'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Image,
  Calendar,
  Heart,
  FolderOpen,
  Play,
  BarChart3,
  Palette,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Users,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { WeddingLogo } from '@/components/branding/WeddingLogos';

const navItems = [
  { section: 'overview', label: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
  { section: 'media', label: 'Media', icon: Image, href: '/dashboard/media', badge: 0 },
  { section: 'events', label: 'Events', icon: Calendar, href: '/dashboard/events' },
  { section: 'blessings', label: 'Blessings', icon: Heart, href: '/dashboard/blessings', badge: 0 },
  { section: 'collections', label: 'Collections', icon: FolderOpen, href: '/dashboard/collections' },
  { section: 'videos', label: 'Videos', icon: Play, href: '/dashboard/videos' },
  { section: 'analytics', label: 'Analytics', icon: BarChart3, href: '/dashboard/analytics' },
  { section: 'branding', label: 'Branding', icon: Palette, href: '/dashboard/branding' },
  { section: 'settings', label: 'Settings', icon: Settings, href: '/dashboard/settings' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="min-h-screen flex bg-wedding-background">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-40 h-screen w-64 flex flex-col border-r transition-transform duration-300',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        style={{
          background: 'rgba(15,10,10,0.95)',
          backdropFilter: 'blur(20px)',
          borderColor: 'rgba(212,160,23,0.15)',
        }}
      >
        {/* Logo */}
        <div className="p-6 border-b" style={{ borderColor: 'rgba(212,160,23,0.1)' }}>
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <WeddingLogo style="monogram" variant="gold" size={36} />
              <div>
                <p className="font-heading text-xs tracking-widest text-wedding-text">
                  V &amp; S
                </p>
                <p className="text-[10px] text-wedding-muted">Admin Panel</p>
              </div>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-wedding-muted hover:text-wedding-text"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.section}>
                  <Link
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                      isActive
                        ? 'text-gold-400'
                        : 'text-wedding-muted hover:text-wedding-text hover:bg-white/5'
                    )}
                    style={isActive ? { background: 'rgba(212,160,23,0.08)' } : undefined}
                  >
                    <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-gold-400')} />
                    <span className="flex-1 text-sm font-body">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                        style={{
                          background: 'rgba(196,30,58,0.2)',
                          color: '#c41e3a',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-gold-400/50" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t" style={{ borderColor: 'rgba(212,160,23,0.1)' }}>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-wedding-muted hover:text-gold-400 transition-colors mb-3 px-3"
          >
            <LayoutDashboard className="w-4 h-4" />
            View Live Site
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 text-sm text-wedding-muted hover:text-red-400 transition-colors px-3 py-2.5 rounded-lg hover:bg-red-500/5"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header
          className="lg:hidden sticky top-0 z-20 flex items-center gap-4 px-4 py-3 border-b"
          style={{
            background: 'rgba(15,10,10,0.95)',
            backdropFilter: 'blur(20px)',
            borderColor: 'rgba(212,160,23,0.15)',
          }}
        >
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-wedding-muted hover:text-wedding-text"
          >
            <Menu className="w-6 h-6" />
          </button>
          <p className="font-heading text-sm tracking-widest text-wedding-text">
            ADMIN PANEL
          </p>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
