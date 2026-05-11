import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { nanoid } from 'nanoid';
import { createHash } from 'crypto';

// GET /api/blessings — List approved blessings
export async function GET(request: NextRequest) {
  const supabase = createServerClient();
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get('page') ?? '1');
  const pageSize = parseInt(searchParams.get('pageSize') ?? '12');
  const featured = searchParams.get('featured') === 'true';

  let query = supabase
    .from('blessings')
    .select('*', { count: 'exact' })
    .eq('is_approved', true)
    .order(featured ? 'is_featured' : 'created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (featured) {
    query = query.eq('is_featured', true);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get reaction counts for each blessing
  const blessingIds = data?.map((b) => b.id) ?? [];
  if (blessingIds.length > 0) {
    const { data: reactions } = await supabase
      .from('reactions')
      .select('blessing_id, emoji')
      .in('blessing_id', blessingIds);

    const reactionMap: Record<string, Record<string, number>> = {};
    reactions?.forEach((r) => {
      if (!reactionMap[r.blessing_id]) reactionMap[r.blessing_id] = {};
      reactionMap[r.blessing_id][r.emoji] = (reactionMap[r.blessing_id][r.emoji] ?? 0) + 1;
    });

    data?.forEach((b) => {
      b.reaction_counts = reactionMap[b.id] ?? {};
    });
  }

  return NextResponse.json({
    data,
    total: count ?? 0,
    page,
    pageSize,
    hasMore: (count ?? 0) > page * pageSize,
  });
}

// POST /api/blessings — Submit a new blessing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { authorName, authorEmail, message, location } = body;

    if (!authorName?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Name and message are required' },
        { status: 400 }
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { error: 'Message must be 1000 characters or less' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Get IP hash for deduplication (don't store raw IP)
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0] ?? 'unknown';
    const ipHash = createHash('sha256').update(ip + 'wedding-salt').digest('hex').slice(0, 16);

    // Check rate limit: 1 blessing per IP per hour
    const { data: recent } = await supabase
      .from('blessings')
      .select('id')
      .eq('ip_hash', ipHash)
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
      .limit(1);

    if (recent && recent.length > 0) {
      return NextResponse.json(
        { error: 'You can only submit one blessing per hour. Please try again later.' },
        { status: 429 }
      );
    }

    const { data, error } = await supabase
      .from('blessings')
      .insert({
        id: nanoid(),
        author_name: authorName.trim(),
        author_email: authorEmail?.trim() ?? null,
        message: message.trim(),
        location: location?.trim() ?? null,
        ip_hash: ipHash,
        user_agent: request.headers.get('user-agent'),
        is_approved: false, // Requires moderation
        wedding_config_id: '00000000-0000-0000-0000-000000000001',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data,
      message: 'Thank you! Your blessing has been received and will appear after moderation.',
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
