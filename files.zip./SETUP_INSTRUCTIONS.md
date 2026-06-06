# Quick Setup: Elite Boys Tracker

## What You're Getting
✓ **Web app** – works on phone/tablet/iPad/desktop  
✓ **PWA** – installable like a native app  
✓ **Cloud sync** – optional shared parent dashboard  

---

## **BEFORE YOU DEPLOY**

### Files You Have
```
elite-boys-tracker/
├── package.json
├── vite.config.js
├── vercel.json
├── index.html
├── .env.example
├── .gitignore
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── Tracker.jsx
    ├── SupabaseSync.jsx
    └── supabaseClient.js
```

**All files are ready to go.** Nothing to edit yet.

---

## **DEPLOYMENT PATH**

### Path A: No Cloud Sync (Simplest)
- Web app only
- Data stored locally on each device
- **Takes 5 minutes**
- Share URL: `https://yourapp.vercel.app`

### Path B: With Cloud Sync (Recommended)
- Web app + cloud backup + parent dashboard
- **Takes 20 minutes**
- Family can see all progress in one place

---

## **DEPLOY OPTION A: Vercel Only (No Cloud)**

### 1. Create GitHub Repo
- Go to github.com → New repo → name it `elite-boys-tracker`
- Upload all these files
- Copy the repo URL

### 2. Connect to Vercel
- vercel.com → New Project → import your GitHub repo
- Click Deploy
- Get your live URL

### 3. Install on Devices
- Share the URL
- On iPhone: Safari → Share → Add to Home Screen
- On Android: Browser → Install App
- Done! Works offline too

---

## **DEPLOY OPTION B: Vercel + Supabase (Full Stack)**

### 1. Vercel (same as above)
- Create GitHub repo
- Deploy to Vercel
- Copy your live URL

### 2. Supabase Setup
- supabase.com → New Project → `elite-boys`
- Wait for setup
- Click **SQL Editor** → **New Query**
- Run this SQL:

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

### 3. Get Supabase Keys
- Supabase → Settings → API
- Copy:
  - `Project URL` = `VITE_SUPABASE_URL`
  - `anon public` key = `VITE_SUPABASE_KEY`

### 4. Add Keys to Vercel
- Vercel → Your Project → Settings → Environment Variables
- Add two variables:
  - `VITE_SUPABASE_URL` = (paste your URL)
  - `VITE_SUPABASE_KEY` = (paste your key)
- Click Redeploy

### 5. Test Cloud Sync
- Go to your tracker URL
- Click ⚙️ button (bottom right)
- Sign up with email
- Data now syncs to cloud ✓

---

## **WHAT EACH FILE DOES**

| File | Purpose |
|------|---------|
| `package.json` | Lists React, Vite, Supabase dependencies |
| `vite.config.js` | Builds app + enables PWA (offline, installable) |
| `index.html` | Entry HTML page + PWA manifest tags |
| `src/main.jsx` | Starts React app + service worker |
| `src/App.jsx` | Wrapper that manages auth |
| `src/Tracker.jsx` | **Main tracker** – boys, tasks, points, logs |
| `src/SupabaseSync.jsx` | Cloud sync panel (email login) |
| `src/supabaseClient.js` | Supabase API calls |
| `vercel.json` | Tells Vercel how to build & deploy |
| `.env.example` | Template for secret keys (copy to `.env.local`) |

---

## **COMMON QUESTIONS**

**Q: Do I need to edit any code?**  
A: No. Only if you want to customize (colors, add new boys, etc.)

**Q: How do kids use this?**  
A: Share the URL or install as app. Data saves locally on their device.

**Q: Can I see all 3 boys' progress?**  
A: Only with cloud sync (Supabase). Then you get a parent dashboard.

**Q: What if I want to add a 4th child?**  
A: Edit `src/Tracker.jsx` – duplicate a boy object in the `BOYS` array.

**Q: Is it secure?**  
A: Yes. Supabase uses row-level security. Only the logged-in parent can see their data.

**Q: Works offline?**  
A: Yes, if installed as PWA. Data syncs when online.

---

## **NEXT: Pick Your Path**

Read `DEPLOYMENT_GUIDE.md` for detailed step-by-step instructions.

**Option A (Simple):** 5 minutes to live  
**Option B (Full):** 20 minutes, but includes cloud backup + multi-device sync

---

**Ready? Start with DEPLOYMENT_GUIDE.md**
