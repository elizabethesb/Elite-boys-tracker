# Elite Boys Tracker - Deployment Guide

## 3-Step Setup: Vercel + PWA + Cloud Sync

---

## **STEP 1: Deploy to Vercel (5 minutes)**

### 1a. Create GitHub Repository
1. Go to **github.com** and sign in
2. Click **+ New repository**
3. Name it `elite-boys-tracker`
4. Choose **Public** (free option)
5. Click **Create repository**

### 1b. Upload Files to GitHub
1. Click **uploading an existing file**
2. Drag & drop all the files from this folder
3. Commit message: `Initial commit`
4. Click **Commit changes**

### 1c. Deploy with Vercel
1. Go to **vercel.com** and sign in with GitHub
2. Click **New Project**
3. Select your `elite-boys-tracker` repo
4. Click **Import**
5. **Environment Variables** (if using cloud sync):
   - Name: `VITE_SUPABASE_URL`
   - Value: *(from Supabase setup below)*
   - Name: `VITE_SUPABASE_KEY`
   - Value: *(from Supabase setup below)*
6. Click **Deploy**
7. Done! You'll get a URL like `https://elite-boys-tracker.vercel.app`

**Share this URL with family** → Works on phone, tablet, iPad, desktop

---

## **STEP 2: Enable PWA (Installable App)**

The PWA is already configured in `vite.config.js`. Once deployed:

### On iPhone/iPad
1. Open the tracker URL in Safari
2. Tap **Share** (bottom center)
3. Tap **Add to Home Screen**
4. Name it "Elite Boys"
5. Tap **Add**
6. App now appears like a native app ✓

### On Android/Chrome
1. Open the tracker URL
2. Menu (⋮) → **Install app** (or tap install banner if shown)
3. Tap **Install**
4. App now appears in home screen ✓

### Features
- ✓ Works offline
- ✓ Fast loading (cached)
- ✓ Full screen, no browser UI
- ✓ Home screen icon
- ✓ Data persists locally

---

## **STEP 3: Cloud Sync with Supabase (Optional but Recommended)**

### Why Cloud Sync?
- See all 3 boys' progress in one parent dashboard
- Sync across multiple devices (your phone, iPad, parent portal)
- Backup data (never lost)
- Real-time updates if multiple parents tracking

### Setup

#### 3a. Create Supabase Project
1. Go to **supabase.com**
2. Click **Start Your Project** (free tier)
3. Sign in with GitHub
4. Create project named `elite-boys` (UK region)
5. Wait for project to be ready (2 min)

#### 3b. Create Database Table
1. Click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Paste this:
```sql
create table tracker_data (
  id bigint primary key generated always as identity,
  user_id uuid not null references auth.users(id) on delete cascade,
  points jsonb not null default '{"eli":0,"zachary":0,"caleb":0}',
  logs jsonb not null default '{"eli":[],"zachary":[],"caleb":[]}',
  tasks jsonb not null,
  updated_at timestamp with time zone default now(),
  unique(user_id)
);

alter table tracker_data enable row level security;

create policy "Users can read/write own data"
  on tracker_data for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```
4. Click **Run**

#### 3c. Get Credentials
1. Click **Settings** (left sidebar)
2. Click **API**
3. Copy `Project URL` (that's your `VITE_SUPABASE_URL`)
4. Copy `anon public` key (that's your `VITE_SUPABASE_KEY`)
5. Add these to Vercel (see Step 1c)

#### 3d. Use Cloud Sync
On the tracker:
1. Click the **⚙️** button (bottom right)
2. Click **Sign Up** or **Sign In**
3. Create parent account (email + password)
4. ✓ Cloud sync now enabled (☁️ icon shows)
5. All data automatically syncs

---

## **Parent Dashboard (Optional Next Step)**

If you want to see all 3 boys on ONE screen:
- We can add a parent dashboard that pulls from Supabase
- Shows total points, recent activity, upcoming rewards
- View across all devices

**Message me if you want this added.**

---

## **Troubleshooting**

**"Won't install as app?"**
- Make sure using HTTPS URL (Vercel provides this)
- Try Chrome/Safari, not Gmail/Facebook browsers
- Wait 30 sec after first visit

**"Cloud sync not working?"**
- Check Supabase credentials in Vercel env vars
- Make sure table exists in Supabase
- Check browser console for errors (F12 → Console)

**"Can't sign up?"**
- Confirm email is valid
- Password must be 6+ chars
- Check spam folder for confirmation email

**"Data not syncing between devices?"**
- Must be signed in with same email
- Check internet connection
- Try refresh (browser or app)

---

## **File Structure**
```
elite-boys-tracker/
├── package.json              (dependencies)
├── vite.config.js            (build + PWA config)
├── vercel.json               (deployment config)
├── .env.example              (environment template)
├── index.html                (main HTML)
└── src/
    ├── main.jsx              (entry point)
    ├── App.jsx               (app wrapper)
    ├── Tracker.jsx           (main tracker)
    ├── SupabaseSync.jsx      (auth panel)
    └── supabaseClient.js     (Supabase API)
```

---

## **Next Steps**

1. ✓ Deploy to Vercel
2. ✓ Test on mobile (install as app)
3. ✓ Set up Supabase for cloud sync
4. Share tracker URL with family
5. (Optional) Add parent dashboard

---

**Questions?** The code is modular and well-commented. Each component is self-contained.
