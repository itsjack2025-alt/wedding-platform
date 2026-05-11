# Deployment Guide — Vinay Kumar & Sneha Wedding Platform

This guide walks you through deploying the entire wedding platform to free-tier services. Total monthly cost: **$0**.

---

## Architecture at a Glance

```
Browser ──→ Vercel (Next.js frontend)
                 ↓
          Supabase (PostgreSQL + Auth + Storage)
                 ↓
         AWS S3 (original media) → Processor (Render/Railway)
                                      ↓
                              AWS S3 (processed media) → Cloudflare CDN
```

---

## Free Tier Services Used

| Service | Purpose | Free Tier |
|---|---|---|
| **Vercel** | Next.js frontend hosting | 100GB bandwidth/mo |
| **Supabase** | PostgreSQL + Auth + Storage | 500MB DB, 1GB storage |
| **Render** | Express.js processor service | Free (sleeps after 15min) |
| **Upstash Redis** | BullMQ job queue | 10K commands/day |
| **Cloudflare** | CDN + domain + SSL | Always free |

---

## Step 1 — Supabase (Database + Auth + Storage)

### 1.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Choose the closest region (India: Mumbai `ap-south-1`)
3. Set a strong database password — **save it somewhere safe**
4. Wait 2 minutes for the project to provision

### 1.2 Get Your API Keys

In Supabase dashboard → **Project Settings** → **API**, copy:

```
Project URL:       https://xxxxxxxx.supabase.co
anon public key:   eyJhbGc... (use NEXT_PUBLIC_SUPABASE_ANON_KEY)
service role key:  eyJhbGc... (use SUPABASE_SERVICE_ROLE_KEY)
```

### 1.3 Run the Database Migration

1. In Supabase dashboard → **SQL Editor** → **New Query**
2. Paste the entire contents of `supabase/migrations/001_initial_schema.sql`
3. Click **Run** (this creates all 15 tables, triggers, RLS policies, and seed data)

The migration includes:
- 3 wedding events (Reception Bengaluru May 5, Muhurtham May 6, Reception Bidar May 9)
- 6 love story timeline entries
- Default admin: `admin@vinaykumarandsneha.com` / `wedding2026`

### 1.4 Configure Storage Buckets

1. **Supabase Dashboard** → **Storage** → **New Bucket**
2. Create two buckets:

| Bucket Name | Public? | Purpose |
|---|---|---|
| `wedding-raw` | **Private** | Original uploaded photos/videos |
| `wedding-processed` | **Public** | Resized, watermarked output |

3. Set up CORS on `wedding-raw` (allow your Vercel domain):
   ```
   Allowed origins: https://your-wedding.vercel.app
   Allowed methods: GET, POST, PUT, DELETE
   Allowed headers: Authorization, Content-Type, x-client-info
   ```

### 1.5 Enable Row Level Security (RLS)

The migration already sets up RLS policies. Verify in **Storage** → each bucket → **Policies**:
- `wedding-raw`: Only authenticated service role can read/write
- `wedding-processed`: Public read, authenticated write

---

## Step 2 — Upstash Redis (Job Queue)

### 2.1 Create a Redis Instance

1. Go to [upstash.com](https://upstash.com) → **Create a Redis database**
2. Region: **Singapore** (closest to India)
3. Choose **Free Tier**
4. Copy the connection URL: `redis://default:xxxx@xxx.upstash.io:6379`

This replaces BullMQ's Redis requirement for the free tier.

---

## Step 3 — AWS S3 (Media Storage)

### 3.1 Create Two S3 Buckets

1. Log into AWS Console → **S3** → **Create bucket**
2. Create **two** buckets:

| Bucket Name | Region | Public Access | Purpose |
|---|---|---|---|
| `wedding-raw-production` | us-east-1 | **Block all public** | Original uploads |
| `wedding-processed-production` | us-east-1 | **Enable public** | CDN source |

3. For `wedding-processed-production` → **Permissions** → **Bucket Policy**:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::wedding-processed-production/*"
       }
     ]
   }
   ```

### 3.2 Create an IAM User

1. **IAM** → **Users** → **Create User** → username: `wedding-platform`
2. Attach policy directly → **Create policy**:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": ["s3:*"],
         "Resource": "arn:aws:s3:::wedding-raw-production/*"
       },
       {
         "Effect": "Allow",
         "Action": ["s3:*"],
         "Resource": "arn:aws:s3:::wedding-processed-production/*"
       },
       {
         "Effect": "Allow",
         "Action": ["s3:ListBucket"],
         "Resource": "arn:aws:s3:::wedding-raw-production"
       },
       {
         "Effect": "Allow",
         "Action": ["s3:ListBucket"],
         "Resource": "arn:aws:s3:::wedding-processed-production"
       }
     ]
   }
   ```
3. Create access key → download `.csv` with `Access Key ID` and `Secret Access Key`

---

## Step 4 — Deploy the Frontend to Vercel

### 4.1 Push Your Code to GitHub

```bash
cd C:/Users/DELL/wedding-platform
git init
git add .
git commit -m "Initial wedding platform deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/wedding-platform.git
git push -u origin main
```

### 4.2 Connect to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**
2. Import your GitHub repo: `wedding-platform`
3. **Framework Preset**: Next.js (auto-detected)
4. **Root Directory**: `./apps/web`
5. **Build Command**: `npm run build`
6. **Environment Variables** — add these:

| Name | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | From Step 1.2 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...` | From Step 1.2 |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` | From Step 1.2 |
| `NEXTAUTH_SECRET` | `openssl rand -hex 32` output | Run once locally |
| `NEXTAUTH_URL` | `https://your-wedding.vercel.app` | After first deploy |
| `NEXT_PUBLIC_PROCESSOR_URL` | `https://wedding-processor.onrender.com` | After Step 5 |
| `NEXT_PUBLIC_APP_URL` | `https://your-wedding.vercel.app` | Same as NEXTAUTH_URL |

7. Click **Deploy**

### 4.3 Configure Custom Domain (Optional)

1. Vercel → your project → **Settings** → **Domains**
2. Add your domain (e.g., `vinaykumarandsneha.com`)
3. Add the DNS records Vercel provides (CNAME or A record)
4. Wait 24-48 hours for SSL certificate provisioning

---

## Step 5 — Deploy the Processor to Render

### 5.1 Fork/Upload Processor to GitHub

Ensure `apps/processor/` is in your repo.

### 5.2 Create a Render Account

1. Go to [render.com](https://render.com) → **Sign Up** with GitHub
2. Go to **Blueprint** → **Create Blueprint** → connect your GitHub repo
3. Select `render.yaml` from the root of the repo

### 5.3 Configure Environment Variables in Render

In your Render dashboard → the `wedding-processor` service → **Environment**:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `3001` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` |
| `AWS_ACCESS_KEY_ID` | From Step 3.2 |
| `AWS_SECRET_ACCESS_KEY` | From Step 3.2 |
| `AWS_REGION` | `us-east-1` |
| `AWS_S3_BUCKET_PRIVATE` | `wedding-raw-production` |
| `AWS_S3_BUCKET_PUBLIC` | `wedding-processed-production` |
| `REDIS_URL` | From Step 2.1 |
| `OPENAI_API_KEY` | (optional) From platform.openai.com |

### 5.4 Update Vercel Environment Variable

After getting the Render URL (e.g., `https://wedding-processor.onrender.com`):
- Add to Vercel: `NEXT_PUBLIC_PROCESSOR_URL` = `https://wedding-processor.onrender.com`

---

## Step 6 — Cloudflare CDN Setup (Optional)

### 6.1 Create a Cloudflare Account

1. Go to [cloudflare.com](https://cloudflare.com) → **Sign Up**
2. Add your domain (or use a free `workers.dev` subdomain)

### 6.2 Configure Cache Rules

For `wedding-processed-production` bucket:
1. **Caching** → **Cache Rules** → **Create rule**:
   ```
   If: Host equals wedding-processed-production.s3.us-east-1.amazonaws.com
   Then: Cache level = Standard, Edge cache TTL = 7 days, Browser cache TTL = 24 hours
   ```

---

## Step 7 — Verify the Deployment

### 7.1 Test Public Pages

| URL | Expected |
|---|---|
| `https://your-wedding.vercel.app` | Cinematic hero with video background |
| `https://your-wedding.vercel.app/our-story` | Love story timeline |
| `https://your-wedding.vercel.app/events` | 3 event cards with countdown timers |
| `https://your-wedding.vercel.app/blessings` | Blessing form and live feed |

### 7.2 Test Admin Dashboard

1. Go to `/login`
2. Sign in with: `admin@vinaykumarandsneha.com` / `wedding2026`
3. Verify `/dashboard` shows KPI cards and analytics

### 7.3 Test Media Upload

1. In admin dashboard → **Upload Photos**
2. Upload a test image (max 50MB)
3. Verify it appears in the gallery

### 7.4 Test Blessing Submission

1. Go to `/blessings`
2. Submit a test blessing
3. In admin dashboard → **Blessings** → approve it
4. Verify it appears in the public feed

---

## Step 8 — Post-Deployment Checklist

- [ ] Change the admin password (`admin@vinaykumarandsneha.com`)
- [ ] Set `NEXTAUTH_URL` to your production URL
- [ ] Upload real wedding photos and videos
- [ ] Update the hero video (replace `public/hero.mp4`)
- [ ] Configure Google Analytics or Vercel Analytics
- [ ] Set up sitemap.xml generation
- [ ] Test mobile responsiveness on all pages
- [ ] Enable Vercel Speed Insights (free)

---

## Troubleshooting

### "Module not found" errors on deploy
```bash
npm install --legacy-peer-deps
npm run build
```
Vercel should auto-detect and install with `--legacy-peer-deps`.

### Supabase connection refused
Check `NEXT_PUBLIC_SUPABASE_URL` — it must be the **Project URL**, not the API URL.

### Processor service returning 503
Render's free tier spins down after 15 minutes of inactivity. First request after sleep takes ~30 seconds (cold start). This is expected on free tier — upgrade to a paid plan for always-on.

### Images not loading
Check Supabase Storage bucket policies. The `wedding-processed` bucket must be **Public**.

### Auth not working in production
Set `NEXTAUTH_URL` to your exact production URL (including `https://`). No trailing slash.

---

## Performance Targets

| Metric | Target | How to achieve |
|---|---|---|
| LCP | < 2.5s | ISR for hero page, image optimization |
| CLS | < 0.1 | Reserved image dimensions, font-display: swap |
| Lighthouse | > 90 | Lazy load images, minimal JS, CDN |
| TTI | < 3.5s | Code splitting, dynamic imports for admin |

---

## Monthly Cost Summary

| Service | Tier | Monthly Cost |
|---|---|---|
| Vercel | Hobby | $0 |
| Supabase | Free | $0 |
| Render | Free | $0 |
| Upstash Redis | Free | $0 |
| Cloudflare | Free | $0 |
| AWS S3 (first 5GB) | Free | $0 |
| **Total** | | **$0/month** |

Upgrade when traffic exceeds free tier limits.
