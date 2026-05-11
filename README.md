# Vinay Kumar & Sneha — Premium Wedding Memory Platform

A cinematic, emotionally immersive wedding memory platform built for Vinay Kumar & Sneha's special day.

> **Two souls. One journey. Forever together.**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS, Framer Motion, GSAP |
| Database | PostgreSQL via Supabase |
| Auth | NextAuth.js v5 (Credentials) |
| Storage | AWS S3 + Cloudflare CDN |
| Media Processing | Express.js (Railway) + Sharp + BullMQ |
| AI | OpenAI GPT-4 Vision |
| Deployment | Vercel (frontend) + Railway (processor) |

---

## Wedding Dates

| Event | Date | Venue |
|---|---|---|
| Reception — Bengaluru | **May 5, 2026** | Gowramma Ramaiah Kalyana Mandira |
| Muhurtham Ceremony | **May 6, 2026** | Gowramma Ramaiah Kalyana Mandira |
| Reception — Bidar | **May 9, 2026** | Nandi Function Hall, Bidar |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+ (or bun/pnpm)
- Supabase account
- AWS S3 bucket
- Cloudflare account

### 1. Clone & Install

```bash
git clone <repo-url> wedding-platform
cd wedding-platform
npm install
```

### 2. Environment Variables

```bash
cp .env.example apps/web/.env.local
# Fill in all required variables
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXTAUTH_SECRET` (generate with: openssl rand -base64 32)
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`

### 3. Database Setup

```bash
# Run migrations in Supabase SQL editor
cat supabase/migrations/001_initial_schema.sql | pbcopy
# Paste into Supabase SQL Editor and execute
```

Default admin credentials:
- Email: `admin@vinaykumarandsneha.com`
- Password: `wedding2026`

### 4. Run Development

```bash
# Start all apps (web + processor)
npm run dev

# Or start just the web app
cd apps/web && npm run dev
```

---

## Project Structure

```
wedding-platform/
├── apps/
│   ├── web/                  # Next.js 15 app
│   │   ├── src/
│   │   │   ├── app/         # App Router pages & layouts
│   │   │   │   ├── (public)/ # Guest-facing pages
│   │   │   │   ├── (admin)/  # Admin dashboard
│   │   │   │   ├── api/      # Route Handlers (BFF)
│   │   │   │   └── login/    # Admin login
│   │   │   ├── components/
│   │   │   │   ├── branding/  # Logo system, theme
│   │   │   │   ├── navigation/
│   │   │   │   ├── sections/  # Hero, Timeline, etc.
│   │   │   │   ├── media/     # Gallery, Lightbox
│   │   │   │   ├── admin/     # Dashboard components
│   │   │   │   └── ui/        # shadcn-style primitives
│   │   │   └── lib/
│   │   └── public/
│   └── processor/            # Express.js media processor
│       └── src/routes/       # image, video, ai routes
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── constants/            # Shared types & theme
│   └── tsconfig/            # Shared tsconfig bases
└── supabase/
    └── migrations/           # SQL migrations
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

### Admin Dashboard
- KPI analytics (views, visitors, blessings)
- Drag-drop media uploader with progress
- Event CRUD management
- Blessing moderation queue
- Collection/album builder
- Branding panel (logo, colors)
- SEO & settings

### Branding System
- 5 logo variants: Monogram, Crest, Signature, Wordmark, Floral
- Gold/White/Dark/Outline/Minimal variants
- CSS custom properties for theme tokens
- Dynamic color theming per couple

---

## Deployment

### Vercel (Frontend)

1. Connect GitHub repo to Vercel
2. Set environment variables
3. Deploy — ISR enabled automatically

### Railway (Processor)

1. Create new Railway project
2. Connect GitHub repo
3. Set environment variables
4. Deploy — `npm start` command

### Supabase

1. Create project at supabase.com
2. Run migrations in SQL Editor
3. Enable Row Level Security

### AWS S3

1. Create two buckets (private + public)
2. Configure CORS on public bucket
3. Set up IAM credentials

### Cloudflare CDN

1. Add custom domain
2. Configure cache rules
3. Set up R2 for media delivery

---

## API Routes

| Endpoint | Method | Description |
|---|---|---|
| `/api/media` | GET | List media (paginated, filterable) |
| `/api/media` | POST | Initiate media upload |
| `/api/media` | PATCH | Update media metadata |
| `/api/blessings` | GET | List approved blessings |
| `/api/blessings` | POST | Submit a blessing |
| `/api/analytics` | GET | Get analytics summary |
| `/api/analytics` | POST | Track page/media view |
| `/api/auth/[...nextauth]` | GET/POST | NextAuth handlers |

---

## Customization

### Change Couple Names

Update `wedding_config` table in Supabase, or use the admin branding panel.

### Change Wedding Dates

Update `wedding_config.wedding_date` or the `events` table.

### Add Events

Insert into `events` table with the appropriate `event_type`.

### Customize Theme

Edit `packages/constants/src/theme.ts` for preset themes, or use the admin branding panel for live customization.

---

## License

Private — for Vinay Kumar & Sneha only.
