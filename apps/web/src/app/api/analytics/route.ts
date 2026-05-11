import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { nanoid } from 'nanoid';

// POST /api/analytics — Track page views and media views
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, pagePath, sessionId, mediaId, referrer, utm } = body;

    const supabase = createServerClient();
    const weddingConfigId = '00000000-0000-0000-0000-000000000001';

    if (type === 'page_view') {
      if (!sessionId || !pagePath) {
        return NextResponse.json({ error: 'sessionId and pagePath are required' }, { status: 400 });
      }

      const deviceType = getDeviceType(request);
      const countryCode = request.headers.get('cf-ipcountry') ?? 'IN'; // Cloudflare header

      const { error } = await supabase.from('page_views').insert({
        id: nanoid(),
        wedding_config_id: weddingConfigId,
        session_id: sessionId,
        page_path: pagePath,
        referrer: referrer ?? null,
        utm_source: utm?.source ?? null,
        utm_medium: utm?.medium ?? null,
        utm_campaign: utm?.campaign ?? null,
        device_type: deviceType,
        country_code: countryCode,
      });

      if (error) {
        console.error('Analytics error:', error);
        // Don't fail the request — analytics should be non-blocking
      }
    } else if (type === 'media_view') {
      if (!sessionId || !mediaId) {
        return NextResponse.json({ error: 'sessionId and mediaId are required' }, { status: 400 });
      }

      const { error } = await supabase.from('media_views').insert({
        id: nanoid(),
        media_id: mediaId,
        session_id: sessionId,
      });

      if (error) {
        console.error('Media view error:', error);
      }

      // Increment view_count on media table (fire-and-forget, non-blocking)
      await Promise.resolve(supabase.rpc('increment_view_count', { media_id: mediaId })).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// GET /api/analytics — Get analytics summary (admin only)
export async function GET(request: NextRequest) {
  // TODO: Add admin auth check
  const supabase = createServerClient();
  const weddingConfigId = '00000000-0000-0000-0000-000000000001';

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  // Total page views
  const { count: totalPageViews } = await supabase
    .from('page_views')
    .select('*', { count: 'exact', head: true })
    .eq('wedding_config_id', weddingConfigId);

  // Page views in last 30 days
  const { count: recentPageViews } = await supabase
    .from('page_views')
    .select('*', { count: 'exact', head: true })
    .eq('wedding_config_id', weddingConfigId)
    .gte('viewed_at', thirtyDaysAgo);

  // Unique visitors (distinct sessions)
  const { count: uniqueVisitors } = await supabase
    .from('page_views')
    .select('session_id', { count: 'exact', head: true })
    .eq('wedding_config_id', weddingConfigId);

  // Total blessings
  const { count: totalBlessings } = await supabase
    .from('blessings')
    .select('*', { count: 'exact', head: true })
    .eq('wedding_config_id', weddingConfigId)
    .eq('is_approved', true);

  // Total media
  const { count: totalMedia } = await supabase
    .from('media')
    .select('*', { count: 'exact', head: true })
    .eq('wedding_config_id', weddingConfigId)
    .eq('is_public', true);

  // Views by day (last 30 days)
  const { data: viewsByDay } = await supabase
    .from('page_views')
    .select('viewed_at')
    .eq('wedding_config_id', weddingConfigId)
    .gte('viewed_at', thirtyDaysAgo)
    .order('viewed_at', { ascending: true });

  // Aggregate by day
  const viewsByDayMap: Record<string, number> = {};
  viewsByDay?.forEach((v) => {
    const day = v.viewed_at.split('T')[0];
    viewsByDayMap[day] = (viewsByDayMap[day] ?? 0) + 1;
  });

  const viewsByDayAgg = Object.entries(viewsByDayMap).map(([date, views]) => ({ date, views }));

  // Top pages
  const { data: topPagesData } = await supabase
    .from('page_views')
    .select('page_path')
    .eq('wedding_config_id', weddingConfigId);

  const pageCounts: Record<string, number> = {};
  topPagesData?.forEach((v) => {
    pageCounts[v.page_path] = (pageCounts[v.page_path] ?? 0) + 1;
  });
  const topPages = Object.entries(pageCounts)
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // Device breakdown
  const { data: deviceData } = await supabase
    .from('page_views')
    .select('device_type')
    .eq('wedding_config_id', weddingConfigId);

  const deviceCounts: Record<string, number> = {};
  deviceData?.forEach((v) => {
    const device = v.device_type ?? 'unknown';
    deviceCounts[device] = (deviceCounts[device] ?? 0) + 1;
  });
  const deviceBreakdown = Object.entries(deviceCounts).map(([device, count]) => ({ device, count }));

  // 60 days ago for trend calculation
  const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();
  const { count: previousPeriodViews } = await supabase
    .from('page_views')
    .select('*', { count: 'exact', head: true })
    .eq('wedding_config_id', weddingConfigId)
    .gte('viewed_at', sixtyDaysAgo)
    .lt('viewed_at', thirtyDaysAgo);

  const viewsTrend = previousPeriodViews
    ? Math.round(((recentPageViews ?? 0) - previousPeriodViews) / previousPeriodViews * 100)
    : 0;

  return NextResponse.json({
    totalPageViews: totalPageViews ?? 0,
    recentPageViews: recentPageViews ?? 0,
    uniqueVisitors: uniqueVisitors ?? 0,
    totalBlessings: totalBlessings ?? 0,
    totalMedia: totalMedia ?? 0,
    viewsTrend,
    topPages,
    viewsByDay: viewsByDayAgg,
    deviceBreakdown,
  });
}

function getDeviceType(request: NextRequest): 'mobile' | 'tablet' | 'desktop' {
  const ua = request.headers.get('user-agent') ?? '';
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile';
  return 'desktop';
}
