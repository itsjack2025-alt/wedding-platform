'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Image,
  Heart,
  Eye,
  Users,
  TrendingUp,
  TrendingDown,
  Upload,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import type { AnalyticsSummary } from '@wedding/constants/types';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  color,
  index,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: number;
  trendLabel?: string;
  color: string;
  index: number;
}) {
  const isPositive = (trend ?? 0) >= 0;

  return (
    <motion.div
      variants={itemVariants}
      className="rounded-2xl p-6 border relative overflow-hidden group"
      style={{
        background: 'rgba(26,18,18,0.6)',
        borderColor: `${color}20`,
      }}
    >
      {/* Background glow */}
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-20"
        style={{ background: color }}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div
            className="p-3 rounded-xl"
            style={{ background: `${color}15`, border: `1px solid ${color}25` }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </div>

          {trend !== undefined && (
            <div
              className={`flex items-center gap-1 text-xs font-body ${
                isPositive ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              {Math.abs(trend)}%
            </div>
          )}
        </div>

        <p className="font-display text-3xl text-wedding-text mb-1" style={{ fontFamily: 'var(--font-cinzel)' }}>
          {value}
        </p>
        <p className="text-sm text-wedding-muted">{title}</p>
        {trendLabel && (
          <p className="text-xs text-wedding-muted mt-1 opacity-60">{trendLabel}</p>
        )}
      </div>
    </motion.div>
  );
}

export function DashboardHome() {
  const [stats, setStats] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const kpis = [
    {
      title: 'Total Page Views',
      value: stats?.totalPageViews?.toLocaleString() ?? '—',
      icon: Eye,
      trend: stats?.viewsTrend,
      trendLabel: 'vs last 30 days',
      color: '#d4af37',
    },
    {
      title: 'Unique Visitors',
      value: stats?.uniqueVisitors?.toLocaleString() ?? '—',
      icon: Users,
      color: '#c41e3a',
    },
    {
      title: 'Blessings Received',
      value: stats?.totalBlessings?.toLocaleString() ?? '—',
      icon: Heart,
      color: '#e87070',
    },
    {
      title: 'Photos & Videos',
      value: stats?.totalMedia?.toLocaleString() ?? '—',
      icon: Image,
      color: '#6b8afd',
    },
  ];

  const recentActivity = [
    { action: 'New media uploaded', detail: '24 photos to Reception — Bengaluru', time: '2 hours ago', icon: Upload },
    { action: 'New blessing received', detail: 'From Priya Sharma', time: '4 hours ago', icon: Heart },
    { action: 'Page view milestone', detail: '1,000 total views reached', time: '1 day ago', icon: Eye },
    { action: 'Event published', detail: 'Muhurtham Ceremony details updated', time: '2 days ago', icon: Calendar },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1
          className="font-display text-3xl text-wedding-text mb-2"
          style={{ fontFamily: 'var(--font-cinzel)' }}
        >
          Welcome Back
        </h1>
        <p className="text-wedding-muted">
          Here&apos;s what&apos;s happening with Vinay &amp; Sneha&apos;s wedding platform.
        </p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <StatCard key={kpi.title} {...kpi} index={i} />
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick actions */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl p-6 border"
          style={{
            background: 'rgba(26,18,18,0.6)',
            borderColor: 'rgba(212,160,23,0.15)',
          }}
        >
          <h2
            className="font-heading text-lg text-wedding-text mb-6"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Upload Photos', icon: Upload, color: '#d4af37' },
              { label: 'View Blessings', icon: Heart, color: '#c41e3a' },
              { label: 'Manage Events', icon: Calendar, color: '#6b8afd' },
              { label: 'View Analytics', icon: Eye, color: '#e87070' },
            ].map((action) => (
              <button
                key={action.label}
                className="flex flex-col items-center gap-3 p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: `${action.color}08`,
                  borderColor: `${action.color}25`,
                }}
              >
                <action.icon className="w-6 h-6" style={{ color: action.color }} />
                <span className="text-xs font-body text-wedding-muted">{action.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Recent activity */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl p-6 border"
          style={{
            background: 'rgba(26,18,18,0.6)',
            borderColor: 'rgba(212,160,23,0.15)',
          }}
        >
          <h2
            className="font-heading text-lg text-wedding-text mb-6"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="flex items-start gap-3"
              >
                <div
                  className="p-2 rounded-lg mt-0.5"
                  style={{ background: 'rgba(212,160,23,0.1)' }}
                >
                  <activity.icon className="w-4 h-4 text-gold-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-wedding-text font-body">{activity.action}</p>
                  <p className="text-xs text-wedding-muted truncate">{activity.detail}</p>
                </div>
                <span className="text-[10px] text-wedding-muted whitespace-nowrap">
                  {activity.time}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Wedding dates reminder */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl p-6 border"
        style={{
          background: 'linear-gradient(135deg, rgba(196,30,58,0.1), rgba(212,160,23,0.05))',
          borderColor: 'rgba(212,160,23,0.2)',
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(196,30,58,0.2), rgba(212,160,23,0.2))',
              border: '1px solid rgba(212,160,23,0.3)',
            }}
          >
            <Calendar className="w-5 h-5 text-gold-400" />
          </div>
          <div>
            <h3 className="font-heading text-wedding-text" style={{ fontFamily: 'var(--font-playfair)' }}>
              Wedding Dates
            </h3>
            <p className="text-sm text-wedding-muted">
              Reception Bengaluru — May 5, 2026 • Muhurtham — May 6, 2026 • Reception Bidar — May 9, 2026
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
