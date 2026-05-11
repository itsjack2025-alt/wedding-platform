# Vinay Kumar & Sneha — Premium Wedding Memory Platform

A cinematic, emotionally immersive wedding memory platform built for Vinay Kumar & Sneha's special day.

> **Two souls. One journey. Forever together.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/itsjack2025-alt/wedding-platform&root-directory=apps/web)

---

## Wedding Dates

| Event | Date | Venue |
|---|---|---|
| Reception — Bengaluru | **May 5, 2026** | Gowramma Ramaiah Kalyana Mandira |
| Muhurtham Ceremony | **May 6, 2026** | Gowramma Ramaiah Kalyana Mandira |
| Reception — Bidar | **May 9, 2026** | Nandi Function Hall, Bidar |

---

## One-Click Deployment

### Step 1 — Supabase Database (5 minutes)

1. Create a free Supabase project at [supabase.com](https://supabase.com)
   - Region: Singapore (`ap-southeast-1`) or Mumbai
2. Go to **Project Settings → API** → copy:
   - `Project URL`
   - `anon public` key
   - `service_role` secret
3. Go to **SQL Editor** → run the migration from `supabase/migrations/001_initial_schema.sql`

**Default admin login:** `admin@vinaykumarandsneha.com` / `wedding2026`

### Step 2 — Deploy Frontend to Vercel (2 minutes)

1. Go to: [vercel.com/new/clone](https://vercel.com/new/clone?repository-url=https://github.com/itsjack2025-alt/wedding-platform&root-directory=apps/web)
2. Select `wedding-platform` repo, set root directory to `apps/web`
3. Add these **Environment Variables** in Vercel:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service_role key |
| `NEXTAUTH_SECRET` | Run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `NEXTAUTH_URL` | Your Vercel deployment URL (after deploy) |
| `NEXT_PUBLIC_APP_URL` | Same as NEXTAUTH_URL |

4. Click **Deploy** — your site is live in ~2 minutes

### Step 3 — Deploy Processor to Render (2 minutes)

1. Go to [render.com](https://render.com) → Sign in with GitHub
2. Click **New → Blueprint** → connect `wedding-platform` repo
3. Select `render.yaml` from the root
4. Add the same Supabase + AWS environment variables
5. Click **Apply** — processor auto-deploys

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS, Framer Motion, GSAP |
| Database | PostgreSQL via Supabase |
| Auth | NextAuth.js v5 (Credentials) |
| Storage | AWS S3 + Cloudflare CDN |
| Media Processing | Express.js (Render) + Sharp + BullMQ |
| AI | OpenAI GPT-4 Vision |
| Deployment | Vercel (frontend) + Render (processor) |

---

## Local Development

```bash
git clone https://github.com/itsjack2025-alt/wedding-platform.git
cd wedding-platform
npm install --legacy-peer-deps

# Copy and fill env vars
cp .env.example apps/web/.env.local
# Edit apps/web/.env.local with your Supabase credentials

npm run dev
# Frontend: http://localhost:3000
# Processor: http://localhost:3001
```

---

## Project Structure

```
wedding-platform/
├── apps/
│   ├── web/                  # Next.js 15 app
│   │   └── src/
│   │       ├── app/         # App Router pages & layouts
│   │       ├── components/  # UI components
│   │       └── lib/        # Supabase, auth, utils
│   └── processor/           # Express.js media processor
│       └── src/routes/      # image, video, ai routes
├── packages/
│   ├── ui/                 # Shared UI components
│   └── constants/          # Shared types & theme
└── supabase/
    └── migrations/         # SQL migrations (run in Supabase)
```

---

## Key Features

### Guest Experience
- Cinematic hero with autoplay video background
- Animated love story timeline (GSAP ScrollTrigger)
- Event countdown timers with real-time updates
- Masonry photo gallery with lightbox
- Video sections (teaser, full film, reels)
- Guest blessing form with emoji reactions
- QR code access for private galleries
- Dark/light mode

### Admin Dashboard (`/dashboard`)
- KPI analytics (views, visitors, blessings)
- Drag-drop media uploader with progress
- Event CRUD management
- Blessing moderation queue
- Collection/album builder
- Branding panel (logo, colors)

**Admin login:** `admin@vinaykumarandsneha.com` / `wedding2026`

---

## Branding System

- 5 logo variants: Monogram (VS), Crest, Signature, Wordmark, Floral
- Gold/White/Dark/Outline/Minimal variants
- CSS custom properties for theme tokens
- Royal dark theme: Crimson (#c41e3a) + Gold (#d4af37)

---

## Customization

### Change Couple Names
Update `wedding_config` table in Supabase.

### Change Wedding Dates
Update the `events` table in Supabase with your dates.

### Add Events
```sql
INSERT INTO events (wedding_config_id, slug, name, event_type, start_time, venue_name)
VALUES ('00000000-0000-0000-0000-000000000001', 'my-event', 'My Event', 'other', '2026-05-10T10:00:00+05:30', 'Venue Name');
```

### Customize Theme
Edit `packages/constants/src/theme.ts` for preset themes, or use the admin branding panel.

---

## API Routes

| Endpoint | Method | Description |
|---|---|---|
| `/api/media` | GET | List media (paginated, filterable) |
| `/api/media` | POST | Initiate media upload |
| `/api/blessings` | GET | List approved blessings |
| `/api/blessings` | POST | Submit a blessing |
| `/api/analytics` | GET | Analytics summary (admin) |
| `/api/analytics` | POST | Track page/media view |
| `/api/auth/[...nextauth]` | GET/POST | NextAuth handlers |

---

## License

Private — for Vinay Kumar & Sneha only.
