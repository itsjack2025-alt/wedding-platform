import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { nanoid } from 'nanoid';

// GET /api/media — List media with pagination and filters
export async function GET(request: NextRequest) {
  const supabase = createServerClient();
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get('page') ?? '1');
  const pageSize = parseInt(searchParams.get('pageSize') ?? '24');
  const eventId = searchParams.get('eventId');
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const sortBy = searchParams.get('sortBy') ?? 'created_at';
  const sortOrder = searchParams.get('sortOrder') ?? 'desc';

  let query = supabase
    .from('media')
    .select('*, media_blurhash(blurhash, width, height)', { count: 'exact' })
    .eq('is_public', true)
    .order(sortBy, { ascending: sortOrder === 'asc' })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (eventId) {
    query = query.eq('event_id', eventId);
  }
  if (category) {
    query = query.eq('ai_category', category);
  }
  if (featured === 'true') {
    query = query.eq('is_featured', true);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data,
    total: count ?? 0,
    page,
    pageSize,
    hasMore: (count ?? 0) > page * pageSize,
  });
}

// POST /api/media — Initiate media upload (returns presigned URLs)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filename, contentType, fileSize, eventId } = body;

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: 'filename and contentType are required' },
        { status: 400 }
      );
    }

    // Check file size limit (50MB for photos)
    const maxSize = 50 * 1024 * 1024;
    if (fileSize && fileSize > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 50MB limit' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const mediaId = nanoid();
    const ext = filename.split('.').pop()?.toLowerCase() ?? 'jpg';
    const key = `uploads/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${mediaId}.${ext}`;

    // Generate presigned PUT URL for direct upload
    // In production, use @aws-sdk/s3-request-presigner
    // For now, return the key and mediaId for the client to use
    const uploadUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/upload/${process.env.AWS_S3_BUCKET_PRIVATE ?? 'wedding-raw'}/${key}`;

    // Create DB record with pending status
    const { error: insertError } = await supabase.from('media').insert({
      id: mediaId,
      filename,
      format: ext,
      file_size_bytes: fileSize,
      event_id: eventId ?? null,
      s3_key_original: key,
      wedding_config_id: '00000000-0000-0000-0000-000000000001',
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      mediaId,
      key,
      uploadUrl,
      expiresIn: 3600,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// PATCH /api/media — Update media metadata
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, caption, alt_text, ai_category, is_featured, is_public, sort_order } = body;

    if (!id) {
      return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
    }

    const supabase = createServerClient();

    const updates: Record<string, unknown> = {};
    if (caption !== undefined) updates.caption = caption;
    if (alt_text !== undefined) updates.alt_text = alt_text;
    if (ai_category !== undefined) updates.ai_category = ai_category;
    if (is_featured !== undefined) updates.is_featured = is_featured;
    if (is_public !== undefined) updates.is_public = is_public;
    if (sort_order !== undefined) updates.sort_order = sort_order;

    const { data, error } = await supabase
      .from('media')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// DELETE /api/media — Delete media
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
  }

  const supabase = createServerClient();

  // Soft delete — set is_public to false instead of actually deleting
  const { error } = await supabase
    .from('media')
    .update({ is_public: false })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
