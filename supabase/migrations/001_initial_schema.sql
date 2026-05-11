-- ============================================================
-- Wedding Memory Platform — Initial Schema
-- Vinay Kumar & Sneha Wedding
-- ============================================================

BEGIN;

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Auto-update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-generate access tokens for private media
CREATE OR REPLACE FUNCTION generate_media_access_token()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.access_token IS NULL AND (NEW.is_public = false OR NEW.password_hash IS NOT NULL) THEN
    NEW.access_token = encode(gen_random_bytes(16), 'hex');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Generate random guest access token
CREATE OR REPLACE FUNCTION generate_guest_access_token()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.token IS NULL THEN
    NEW.token = encode(gen_random_bytes(24), 'hex');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- WEDDING CONFIG (singleton per installation)
-- ============================================================
CREATE TABLE wedding_config (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_name_1 TEXT NOT NULL DEFAULT 'Vinay Kumar',
  couple_name_2 TEXT NOT NULL DEFAULT 'Sneha',
  wedding_date  TIMESTAMPTZ NOT NULL DEFAULT '2026-05-06T06:00:00Z',  -- Muhurtham: 6 May 2026
  tagline       TEXT DEFAULT 'Two souls. One journey. Forever together.',
  primary_color TEXT DEFAULT '#c41e3a',
  secondary_color TEXT DEFAULT '#d4af37',
  accent_color  TEXT DEFAULT '#f5d06a',
  background_dark  TEXT DEFAULT '#0f0a0a',
  background_light TEXT DEFAULT '#fdf8f2',
  surface_dark  TEXT DEFAULT '#1a1212',
  surface_light TEXT DEFAULT '#f5ede3',
  text_dark     TEXT DEFAULT '#f5f0e6',
  text_light    TEXT DEFAULT '#1a1212',
  theme         TEXT DEFAULT 'royal' CHECK (theme IN ('royal','modern','traditional','fusion')),
  logo_style    TEXT DEFAULT 'monogram' CHECK (logo_style IN ('monogram','crest','signature','wordmark','floral')),
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- EVENTS
-- ============================================================
CREATE TABLE events (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_config_id UUID REFERENCES wedding_config(id) ON DELETE CASCADE,
  slug             TEXT UNIQUE NOT NULL,
  name             TEXT NOT NULL,
  subtitle         TEXT,
  description      TEXT,
  event_type       TEXT NOT NULL CHECK (event_type IN (
    'reception','haldi','mehendi','sangeet','wedding','ceremony','engagement','pre-wedding','other')),
  start_time       TIMESTAMPTZ,
  end_time         TIMESTAMPTZ,
  venue_name       TEXT,
  venue_address    TEXT,
  venue_map_url    TEXT,
  venue_lat        DECIMAL(10,7),
  venue_lng        DECIMAL(10,7),
  cover_image_url  TEXT,
  cover_video_url  TEXT,
  sort_order       INT DEFAULT 0,
  is_published     BOOLEAN DEFAULT false,
  countdown_enabled BOOLEAN DEFAULT true,
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- MEDIA (photos)
-- ============================================================
CREATE TABLE media (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_config_id    UUID REFERENCES wedding_config(id) ON DELETE CASCADE,
  event_id            UUID REFERENCES events(id) ON DELETE SET NULL,

  -- Storage paths
  s3_key_original     TEXT,
  s3_key_thumbnail    TEXT,
  s3_key_optimized    TEXT,
  s3_key_placeholder TEXT,  -- tiny base64 / blurhash placeholder
  cdn_url             TEXT,
  thumbnail_cdn_url   TEXT,

  -- File metadata
  filename            TEXT,
  file_size_bytes     BIGINT,
  width               INT,
  height              INT,
  format              TEXT CHECK (format IN ('jpg','jpeg','png','webp','avif','gif','heic')),

  -- AI enrichment
  ai_category         TEXT CHECK (ai_category IN ('portrait','group','candid','detail','venue','decor','food','other')),
  ai_confidence       DECIMAL(3,2),
  ai_highlight_score  DECIMAL(3,2) DEFAULT 0,  -- 0-1; auto-flagged top picks
  ai_caption          TEXT,

  -- Manual metadata
  caption             TEXT,
  alt_text            TEXT,
  photographer_credit TEXT,
  is_watermarked      BOOLEAN DEFAULT false,
  is_public           BOOLEAN DEFAULT true,
  is_featured         BOOLEAN DEFAULT false,
  sort_order          INT DEFAULT 0,

  -- Access control
  access_token        TEXT,
  password_hash      TEXT,  -- bcrypt for password-protected galleries

  -- Stats
  view_count          INT DEFAULT 0,
  download_count      INT DEFAULT 0,

  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);

-- Blurhash cache
CREATE TABLE media_blurhash (
  media_id   UUID PRIMARY KEY REFERENCES media(id) ON DELETE CASCADE,
  blurhash   TEXT NOT NULL,
  width      INT NOT NULL,
  height     INT NOT NULL
);

-- ============================================================
-- VIDEOS
-- ============================================================
CREATE TABLE videos (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_config_id UUID REFERENCES wedding_config(id) ON DELETE CASCADE,
  event_id         UUID REFERENCES events(id) ON DELETE SET NULL,

  title            TEXT NOT NULL,
  description      TEXT,
  video_type       TEXT NOT NULL CHECK (video_type IN (
    'teaser','full_film','reel','drone','ceremony','sangeet','highlights','behind_scenes')),

  s3_key_original  TEXT,
  s3_key_hls       TEXT,   -- HLS playlist for adaptive streaming
  cdn_url          TEXT,
  hls_url          TEXT,
  thumbnail_url    TEXT,
  poster_url       TEXT,

  duration_seconds DECIMAL(8,2),
  file_size_bytes  BIGINT,
  resolution       TEXT CHECK (resolution IN ('720p','1080p','4k')),
  format           TEXT DEFAULT 'mp4',

  is_premium       BOOLEAN DEFAULT false,
  is_public        BOOLEAN DEFAULT true,
  sort_order       INT DEFAULT 0,
  is_published     BOOLEAN DEFAULT false,

  view_count       INT DEFAULT 0,

  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- COLLECTIONS (curated albums)
-- ============================================================
CREATE TABLE collections (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_config_id UUID REFERENCES wedding_config(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  slug             TEXT NOT NULL,
  description      TEXT,
  cover_media_id   UUID REFERENCES media(id) ON DELETE SET NULL,
  access_type      TEXT DEFAULT 'public' CHECK (access_type IN ('public','token','password')),
  access_token     TEXT,
  password_hash    TEXT,
  sort_order       INT DEFAULT 0,
  is_published     BOOLEAN DEFAULT true,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- Junction table
CREATE TABLE collection_media (
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  media_id      UUID REFERENCES media(id) ON DELETE CASCADE,
  sort_order    INT DEFAULT 0,
  PRIMARY KEY (collection_id, media_id)
);

-- ============================================================
-- BLESSINGS (guest wishes)
-- ============================================================
CREATE TABLE blessings (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_config_id UUID REFERENCES wedding_config(id) ON DELETE CASCADE,

  author_name      TEXT NOT NULL,
  author_email     TEXT,
  author_avatar    TEXT,

  message          TEXT NOT NULL,
  is_approved      BOOLEAN DEFAULT false,  -- moderation gate
  is_featured      BOOLEAN DEFAULT false,

  ip_hash          TEXT,   -- for deduplication, NOT stored as PII
  user_agent       TEXT,
  location         TEXT,

  reaction_counts  JSONB DEFAULT '{}',

  created_at       TIMESTAMPTZ DEFAULT now(),

  CONSTRAINT message_length CHECK (char_length(message) BETWEEN 1 AND 1000)
);

-- ============================================================
-- REACTIONS (emoji reactions on blessings)
-- ============================================================
CREATE TABLE reactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blessing_id UUID REFERENCES blessings(id) ON DELETE CASCADE,
  emoji       TEXT NOT NULL CHECK (emoji IN ('thumbs_up','heart','clapping','temple','fire','ring','couple')),
  visitor_id  TEXT NOT NULL,  -- anonymous cookie-based ID
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (blessing_id, visitor_id, emoji)
);

-- ============================================================
-- GUEST ACCESS TOKENS (QR codes)
-- ============================================================
CREATE TABLE guest_access (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_config_id UUID REFERENCES wedding_config(id) ON DELETE CASCADE,
  token            TEXT UNIQUE NOT NULL,
  guest_name       TEXT,
  guest_email      TEXT,
  access_type      TEXT DEFAULT 'read' CHECK (access_type IN ('read','comment','upload')),
  collection_ids   UUID[],
  event_ids        UUID[],
  expires_at       TIMESTAMPTZ,
  is_revoked       BOOLEAN DEFAULT false,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ADMIN USERS
-- ============================================================
CREATE TABLE admin_users (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email        TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name         TEXT,
  role         TEXT DEFAULT 'editor' CHECK (role IN ('owner','admin','editor','viewer')),
  avatar_url   TEXT,
  last_login_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ANALYTICS (no PII)
-- ============================================================
CREATE TABLE page_views (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_config_id UUID REFERENCES wedding_config(id) ON DELETE CASCADE,
  session_id       TEXT NOT NULL,  -- random UUID per browser session
  page_path        TEXT NOT NULL,
  referrer         TEXT,
  utm_source       TEXT,
  utm_medium       TEXT,
  utm_campaign     TEXT,
  device_type      TEXT CHECK (device_type IN ('mobile','tablet','desktop')),
  country_code     TEXT,
  city             TEXT,
  viewed_at        TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE media_views (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id  UUID REFERENCES media(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  viewed_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- AI PROCESSING JOBS
-- ============================================================
CREATE TABLE ai_jobs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id    UUID REFERENCES media(id) ON DELETE CASCADE,
  job_type    TEXT NOT NULL CHECK (job_type IN ('categorize','highlight','caption','faces','blurhash')),
  status      TEXT DEFAULT 'pending' CHECK (status IN ('pending','processing','done','failed')),
  result      JSONB,
  error       TEXT,
  attempts    INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now(),
  processed_at TIMESTAMPTZ
);

-- ============================================================
-- BRAND ASSETS (logos, monograms, crests)
-- ============================================================
CREATE TABLE brand_assets (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_config_id UUID REFERENCES wedding_config(id) ON DELETE CASCADE,
  asset_type       TEXT NOT NULL CHECK (asset_type IN ('monogram','crest','signature','wordmark','floral','favicon')),
  s3_key           TEXT,
  cdn_url          TEXT,
  primary_color    TEXT,
  secondary_color  TEXT,
  is_active        BOOLEAN DEFAULT true,
  variant          TEXT CHECK (variant IN ('gold','white','dark','minimal','outline')),
  sort_order       INT DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- LOVE STORY TIMELINE ENTRIES
-- ============================================================
CREATE TABLE love_story_entries (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_config_id UUID REFERENCES wedding_config(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  description      TEXT,
  story_date       DATE,
  media_id         UUID REFERENCES media(id) ON DELETE SET NULL,
  sort_order       INT DEFAULT 0,
  is_published     BOOLEAN DEFAULT true,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- TRIGGERS
-- ============================================================
CREATE TRIGGER tr_wedding_config_updated_at
  BEFORE UPDATE ON wedding_config FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_events_updated_at
  BEFORE UPDATE ON events FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_media_updated_at
  BEFORE UPDATE ON media FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_videos_updated_at
  BEFORE UPDATE ON videos FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_media_access_token
  BEFORE INSERT OR UPDATE ON media
  FOR EACH ROW EXECUTE FUNCTION generate_media_access_token();

CREATE TRIGGER tr_guest_access_token
  BEFORE INSERT ON guest_access
  FOR EACH ROW EXECUTE FUNCTION generate_guest_access_token();

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_media_event_id       ON media(event_id) WHERE is_public = true;
CREATE INDEX idx_media_wedding_id     ON media(wedding_config_id) WHERE is_public = true;
CREATE INDEX idx_media_highlight     ON media(ai_highlight_score DESC) WHERE ai_highlight_score > 0.7;
CREATE INDEX idx_media_created       ON media(wedding_config_id, created_at DESC);
CREATE INDEX idx_media_featured       ON media(wedding_config_id, is_featured) WHERE is_featured = true;

CREATE INDEX idx_videos_event_id      ON videos(event_id) WHERE is_public = true;
CREATE INDEX idx_videos_published     ON videos(wedding_config_id, is_published, sort_order) WHERE is_published = true;

CREATE INDEX idx_blessings_approved   ON blessings(wedding_config_id, is_approved, is_featured, created_at DESC) WHERE is_approved = true;
CREATE INDEX idx_blessings_created    ON blessings(wedding_config_id, created_at DESC);

CREATE INDEX idx_events_wedding       ON events(wedding_config_id, sort_order);
CREATE INDEX idx_events_published     ON events(wedding_config_id, is_published) WHERE is_published = true;
CREATE INDEX idx_events_upcoming     ON events(wedding_config_id, start_time DESC) WHERE is_published = true AND start_time IS NOT NULL;

CREATE INDEX idx_collections_wedding  ON collections(wedding_config_id, sort_order) WHERE is_published = true;

CREATE INDEX idx_page_views_date      ON page_views(wedding_config_id, viewed_at DESC);
CREATE INDEX idx_page_views_session  ON page_views(wedding_config_id, session_id);
CREATE INDEX idx_page_views_path      ON page_views(wedding_config_id, page_path);

CREATE INDEX idx_media_views_media    ON media_views(media_id);
CREATE INDEX idx_media_views_session  ON media_views(session_id);

CREATE INDEX idx_ai_jobs_pending     ON ai_jobs(status, created_at) WHERE status = 'pending';
CREATE INDEX idx_ai_jobs_media       ON ai_jobs(media_id);

CREATE INDEX idx_guest_access_token   ON guest_access(token) WHERE is_revoked = false;

CREATE INDEX idx_reactions_blessing  ON reactions(blessing_id);
CREATE INDEX idx_reactions_visitor    ON reactions(visitor_id);

CREATE INDEX idx_love_story_wedding   ON love_story_entries(wedding_config_id, sort_order) WHERE is_published = true;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE wedding_config    ENABLE ROW LEVEL SECURITY;
ALTER TABLE events            ENABLE ROW LEVEL SECURITY;
ALTER TABLE media             ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_blurhash    ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos            ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections       ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_media   ENABLE ROW LEVEL SECURITY;
ALTER TABLE blessings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_access      ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users       ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views        ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_views       ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_jobs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_assets      ENABLE ROW LEVEL SECURITY;
ALTER TABLE love_story_entries ENABLE ROW LEVEL SECURITY;

-- Public: wedding_config (read all)
CREATE POLICY "Public read wedding_config"
  ON wedding_config FOR SELECT USING (is_active = true);

-- Public: events (read published)
CREATE POLICY "Public read published events"
  ON events FOR SELECT USING (is_published = true);

-- Public: media (read public)
CREATE POLICY "Public read public media"
  ON media FOR SELECT USING (is_public = true);

-- Public: media_blurhash (read via media)
CREATE POLICY "Public read media_blurhash"
  ON media_blurhash FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM media WHERE id = media_blurhash.media_id AND is_public = true
  ));

-- Public: videos (read published public)
CREATE POLICY "Public read published public videos"
  ON videos FOR SELECT USING (is_public = true AND is_published = true);

-- Public: collections (read published)
CREATE POLICY "Public read published collections"
  ON collections FOR SELECT USING (is_published = true);

-- Public: blessings (read approved)
CREATE POLICY "Public read approved blessings"
  ON blessings FOR SELECT USING (is_approved = true);

-- Public: reactions (read all)
CREATE POLICY "Public read reactions"
  ON reactions FOR SELECT USING (true);

-- Public: love_story_entries (read published)
CREATE POLICY "Public read published love story entries"
  ON love_story_entries FOR SELECT USING (is_published = true);

-- Admin: full access via service role (bypasses RLS)
-- All INSERT/UPDATE/DELETE policies allow service role full access

-- ============================================================
-- SEED DATA: Vinay Kumar & Sneha
-- ============================================================

-- Insert wedding config (singleton)
INSERT INTO wedding_config (id, couple_name_1, couple_name_2, wedding_date, tagline, primary_color, secondary_color, theme)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Vinay Kumar',
  'Sneha',
  '2026-05-06T06:00:00Z',  -- Muhurtham: 6 May 2026, 11:30 AM IST
  'Two souls. One journey. Forever together.',
  '#c41e3a',
  '#d4af37',
  'royal'
);

-- Insert events
INSERT INTO events (wedding_config_id, slug, name, subtitle, event_type, start_time, end_time, venue_name, venue_address, sort_order, is_published, description) VALUES

('00000000-0000-0000-0000-000000000001',
 'reception-bengaluru',
 'Reception — Bengaluru',
 'Join us for an evening of celebration',
 'reception',
 '2026-05-05T18:00:00+05:30',  -- 5 May 2026, 6:00 PM IST
 '2026-05-05T23:00:00+05:30',
 'Gowramma Ramaiah Kalyana Mandira',
 'Bengaluru, Karnataka, India',
 1,
 true,
 'An elegant evening reception celebrating the union of Vinay and Sneha. Join us for dinner, dancing, and joyful celebrations with family and friends in the beautiful city of Bengaluru.'),

('00000000-0000-0000-0000-000000000001',
 'muhurtham',
 'Muhurtham Ceremony',
 'The sacred wedding ceremony',
 'wedding',
 '2026-05-06T11:30:00+05:30',  -- 6 May 2026, 11:30 AM IST
 '2026-05-06T14:00:00+05:30',
 'Gowramma Ramaiah Kalyana Mandira',
 'Bengaluru, Karnataka, India',
 2,
 true,
 'The sacred Muhurtham ceremony — the heart of our wedding celebration. Under the blessing of celestial alignments, two souls embark on their eternal journey together.'),

('00000000-0000-0000-0000-000000000001',
 'reception-bidar',
 'Reception — Bidar',
 'Celebrating with our hometown community',
 'reception',
 '2026-05-09T19:00:00+05:30',  -- 9 May 2026, 7:00 PM IST
 '2026-05-09T23:00:00+05:30',
 'Nandi Function Hall',
 'Bidar, Karnataka, India',
 3,
 true,
 'A warm reception in the heart of Bidar, celebrating with extended family, old friends, and our beloved community. A night of music, dance, and heartfelt blessings.');

-- Seed love story entries
INSERT INTO love_story_entries (wedding_config_id, title, description, story_date, sort_order) VALUES

('00000000-0000-0000-0000-000000000001',
 'The First Meeting',
 'Where it all began — a chance encounter that changed everything. Neither of us knew that this moment would be the first page of our forever story.',
 '2024-06-15',
 1),

('00000000-0000-0000-0000-000000000001',
 'The First Conversation',
 'What started as polite hellos soon turned into late-night conversations that never seemed to end. Every call felt like coming home.',
 '2024-07-01',
 2),

('00000000-0000-0000-0000-000000000001',
 'Falling In Love',
 'It wasn''t a single moment — it was a thousand little things. Shared laughter, quiet understanding, and a feeling that this was exactly where we were meant to be.',
 '2024-09-01',
 3),

('00000000-0000-0000-0000-000000000001',
 'The Proposal',
 'Under a sky full of stars, with trembling hands and a heart full of love, the most important question was asked — and the most beautiful answer was given.',
 '2025-12-24',
 4),

('00000000-0000-0000-0000-000000000001',
 'The Engagement',
 'Surrounded by our families'' blessings and love, we took our first step toward forever — two rings, infinite promises, and a joy that knows no bounds.',
 '2026-01-15',
 5),

('00000000-0000-0000-0000-000000000001',
 'The Wedding',
 'Two souls, one journey. The day we have dreamed of, planned for, and waited for — finally here. May 2026.',
 '2026-05-06',
 6);

-- Create default admin user (password: wedding2026)
-- bcrypt hash of 'wedding2026'
INSERT INTO admin_users (email, password_hash, name, role)
VALUES (
  'admin@vinaykumarandsneha.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.qUJl1H.5gxLxOa',  -- wedding2026
  'Vinay & Sneha',
  'owner'
);

-- Create default public collection
INSERT INTO collections (wedding_config_id, name, slug, description, is_published)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Our Favorite Moments',
  'favorite-moments',
  'A curated collection of our most cherished wedding memories.',
  true
);

COMMIT;
