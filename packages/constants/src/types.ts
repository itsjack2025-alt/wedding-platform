// ============================================================
// Shared TypeScript Types for Wedding Platform
// ============================================================

export interface WeddingConfig {
  id: string;
  couple_name_1: string;
  couple_name_2: string;
  wedding_date: string;
  tagline: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_dark: string;
  background_light: string;
  surface_dark: string;
  surface_light: string;
  text_dark: string;
  text_light: string;
  theme: 'royal' | 'modern' | 'traditional' | 'fusion';
  logo_style: 'monogram' | 'crest' | 'signature' | 'wordmark' | 'floral';
}

export interface WeddingEvent {
  id: string;
  wedding_config_id: string;
  slug: string;
  name: string;
  subtitle?: string;
  description?: string;
  event_type: EventType;
  start_time?: string;
  end_time?: string;
  venue_name?: string;
  venue_address?: string;
  venue_map_url?: string;
  venue_lat?: number;
  venue_lng?: number;
  cover_image_url?: string;
  cover_video_url?: string;
  sort_order: number;
  is_published: boolean;
  countdown_enabled: boolean;
  created_at: string;
}

export type EventType =
  | 'reception'
  | 'haldi'
  | 'mehendi'
  | 'sangeet'
  | 'wedding'
  | 'ceremony'
  | 'engagement'
  | 'pre-wedding'
  | 'other';

export interface MediaItem {
  id: string;
  wedding_config_id: string;
  event_id?: string;
  s3_key_original?: string;
  s3_key_thumbnail?: string;
  s3_key_optimized?: string;
  s3_key_placeholder?: string;
  cdn_url?: string;
  thumbnail_cdn_url?: string;
  filename?: string;
  file_size_bytes?: number;
  width?: number;
  height?: number;
  format?: string;
  ai_category?: AICategory;
  ai_confidence?: number;
  ai_highlight_score?: number;
  ai_caption?: string;
  caption?: string;
  alt_text?: string;
  photographer_credit?: string;
  is_watermarked: boolean;
  is_public: boolean;
  is_featured: boolean;
  sort_order: number;
  access_token?: string;
  view_count: number;
  download_count: number;
  created_at: string;
}

export type AICategory = 'portrait' | 'group' | 'candid' | 'detail' | 'venue' | 'decor' | 'food' | 'other';

export interface VideoItem {
  id: string;
  wedding_config_id: string;
  event_id?: string;
  title: string;
  description?: string;
  video_type: VideoType;
  s3_key_original?: string;
  s3_key_hls?: string;
  cdn_url?: string;
  hls_url?: string;
  thumbnail_url?: string;
  poster_url?: string;
  duration_seconds?: number;
  file_size_bytes?: number;
  resolution?: '720p' | '1080p' | '4k';
  format?: string;
  is_premium: boolean;
  is_public: boolean;
  sort_order: number;
  is_published: boolean;
  view_count: number;
  created_at: string;
}

export type VideoType =
  | 'teaser'
  | 'full_film'
  | 'reel'
  | 'drone'
  | 'ceremony'
  | 'sangeet'
  | 'highlights'
  | 'behind_scenes';

export interface Collection {
  id: string;
  wedding_config_id: string;
  name: string;
  slug: string;
  description?: string;
  cover_media_id?: string;
  access_type: 'public' | 'token' | 'password';
  access_token?: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
}

export interface Blessing {
  id: string;
  wedding_config_id: string;
  author_name: string;
  author_email?: string;
  author_avatar?: string;
  message: string;
  is_approved: boolean;
  is_featured: boolean;
  location?: string;
  reaction_counts: Record<string, number>;
  created_at: string;
}

export interface LoveStoryEntry {
  id: string;
  wedding_config_id: string;
  title: string;
  description?: string;
  story_date?: string;
  media_id?: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  avatar_url?: string;
  last_login_at?: string;
  created_at: string;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface MediaUploadResponse {
  mediaId: string;
  presignedUrls: {
    url: string;
    partNumber: number;
  }[];
  uploadId: string;
  key: string;
}

export interface AnalyticsSummary {
  totalPageViews: number;
  uniqueVisitors: number;
  totalBlessings: number;
  totalMedia: number;
  viewsTrend: number;
  blessingsTrend: number;
  topPages: { path: string; views: number }[];
  viewsByDay: { date: string; views: number }[];
  deviceBreakdown: { device: string; count: number }[];
}

// Reaction types
export const REACTION_EMOJIS = ['thumbs_up', 'heart', 'clapping', 'temple', 'fire', 'ring', 'couple'] as const;
export type ReactionEmoji = typeof REACTION_EMOJIS[number];

// Theme types
export interface WeddingTheme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
    accent: string;
    border: string;
  };
  fonts: {
    display: string;
    heading: string;
    body: string;
    script: string;
  };
}
