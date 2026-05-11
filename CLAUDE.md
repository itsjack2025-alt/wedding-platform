# Wedding Platform — Developer Context

## Project Overview

This is a monorepo for Vinay Kumar & Sneha's personalized wedding memory platform. The platform is a cinematic, emotionally immersive experience for showcasing wedding photos, videos, and memories.

## Key Decisions

### Why Monorepo (Turborepo)?
- Shared TypeScript types between `apps/web` and `apps/processor`
- Shared UI components in `packages/ui`
- Single CI/CD pipeline, atomic deploys

### Why Next.js App Router?
- Server Components for fast initial load (ISR for public pages)
- Route Handlers as BFF (Backend for Frontend) pattern
- Server Actions for form submissions
- Built-in image optimization

### Why Supabase?
- PostgreSQL with Row Level Security (RLS)
- Built-in auth helpers
- Real-time subscriptions for live blessing updates
- Storage bucket for media

## Architecture

```
Browser → Vercel (Next.js) → Supabase (DB + Auth)
                    ↓
            S3 (originals) → Processor (Railway) → S3 (processed) → Cloudflare CDN
```

## Key Files

| File | Purpose |
|---|---|
| `supabase/migrations/001_initial_schema.sql` | Full DB schema — start here to understand the data model |
| `apps/web/src/components/branding/WeddingLogos.tsx` | All 5 logo variants — modify this to change branding |
| `apps/web/src/components/branding/ThemeProvider.tsx` | Theme context — injects CSS custom properties |
| `apps/web/src/app/(public)/page.tsx` | Homepage — assembles all public sections |
| `apps/web/src/components/sections/HeroSection.tsx` | Cinematic hero — video background, GSAP scroll |
| `apps/web/src/middleware.ts` | Edge middleware — admin auth + guest token verification |
| `apps/web/src/lib/auth.ts` | NextAuth.js configuration |

## Database Design

Key tables:
- `wedding_config` — singleton config (names, date, colors, theme)
- `events` — 3 events for this wedding (hardcoded in migration)
- `media` — all photos with S3 keys, CDN URLs, AI metadata
- `videos` — video content (teaser, full film, reels, drone)
- `blessings` — guest wishes with `is_approved` moderation gate
- `collections` — curated albums with access control
- `admin_users` — admin auth with RBAC

## Adding New Features

1. **New public page**: Add to `apps/web/src/app/(public)/`
2. **New admin page**: Add to `apps/web/src/app/(admin)/dashboard/`
3. **New API route**: Add to `apps/web/src/app/api/`
4. **New DB table**: Add migration to `supabase/migrations/`

## Testing

```bash
# Run type checking
npm run typecheck

# Run linting
npm run lint

# Run builds
npm run build
```

## Environment Variables

See `.env.example` at root and `apps/web/.env.local` after setup.

Critical variables:
- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase client
- `SUPABASE_SERVICE_ROLE_KEY` — Server-side DB access (never expose to client)
- `NEXTAUTH_SECRET` — JWT signing key

## Deployment

- **Vercel**: Connect `apps/web` — auto-deploys on push to main
- **Railway**: Connect `apps/processor` — deploys Express processor service
- **Supabase**: Run migrations manually via SQL Editor
- **Cloudflare**: Configure CDN for `*.r2.cloudflarestorage.com`

## Common Tasks

### Add a new event
```sql
INSERT INTO events (wedding_config_id, slug, name, event_type, start_time, venue_name)
VALUES ('00000000-0000-0000-0000-000000000001', 'my-event', 'My Event', 'other', '2026-05-10T10:00:00+05:30', 'Venue Name');
```

### Reset admin password
```sql
UPDATE admin_users SET password_hash = '$2a$12$...' WHERE email = 'admin@vinaykumarandsneha.com';
-- Generate new bcrypt hash with: node -e "console.log(require('bcryptjs').hashSync('newpassword', 12))"
```

### Add sample media
Use the admin dashboard at `/dashboard/media` to upload photos and videos.

## Known Issues

- Processor service needs real AWS credentials for S3 image processing
- AI categorization requires OpenAI API key
- Video transcode needs ffmpeg installed on Railway
