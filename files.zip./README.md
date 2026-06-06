# Elite Boys Reward Tracker

A modern, fully-featured reward points tracker for managing family incentives across multiple children. Track achievements, earn points, redeem rewards, and manage tasks—with optional cloud sync and offline-first PWA capabilities.

## 🎯 Features

### Core Tracking
- **Real-time points tallying** for up to 3 children
- **Custom earn/lose task lists** — add, edit, remove tasks anytime
- **Manual point adjuster** — fine-grained +/− control for any situation
- **Activity logging** — full history of every point transaction
- **Automatic reward suggestions** — shows which tier is unlocked

### User Experience
- **Dark, modern UI** — optimized for long viewing sessions
- **Mobile-first design** — beautiful on phone, tablet, iPad, desktop
- **Offline-ready** — works without internet (when installed as app)
- **No login required** (local mode) — data stored in browser

### Advanced Features (Optional)
- **PWA (Progressive Web App)** — installable like a native app
- **Cloud sync** — sync across devices with Supabase
- **Parent dashboard** — see all children's progress in one place
- **Row-level security** — only you can see your family's data

## 🚀 Quick Start

### Option 1: Simple (Local Only)
```bash
# 1. Create GitHub repo with these files
# 2. Deploy to Vercel (1 click)
# 3. Share the URL
# 4. Done! Data stored locally on each device
```

### Option 2: Full Stack (With Cloud)
```bash
# 1-2. Same as above
# 3. Create Supabase account
# 4. Run SQL to create tracker_data table
# 5. Add Supabase keys to Vercel env vars
# 6. Enable cloud sync from the app (⚙️ button)
```

**👉 See `SETUP_INSTRUCTIONS.md` for detailed steps**

## 📱 Device Support

| Device | Method | Works | Offline |
|--------|--------|-------|---------|
| iPhone/iPad | Safari → Add to Home | ✓ | ✓ |
| Android | Browser → Install | ✓ | ✓ |
| Desktop | Browser | ✓ | ✓ |
| Tablet | Any browser | ✓ | ✓ |

## 🏗️ Architecture

```
elite-boys-tracker/
├── Frontend (React + Vite)
│   ├── Tracker UI (earn/lose/log tabs)
│   ├── Task management (add/edit/delete)
│   └── Manual point adjuster
├── PWA (Vite PWA Plugin)
│   ├── Service worker (offline caching)
│   ├── App manifest (installable)
│   └── Icons & splash screens
└── Cloud Sync (Optional)
    ├── Supabase Auth (email login)
    ├── Tracker Data Table
    └── Row-level security policies
```

## 📦 Tech Stack

- **React 18** – Component framework
- **Vite** – Fast build tool
- **Vite PWA** – Offline + installable
- **Supabase** – Optional cloud backend
- **localStorage** – Local data persistence

## 🎮 Usage

### For Kids
1. Open the tracker (URL or home screen app)
2. Tap a task to earn points
3. Track progress toward rewards
4. Redeem when tier is reached

### For Parents
1. Manage task lists (add/edit/remove)
2. Award points (tap task or manual adjust)
3. Deduct points for rule breaks
4. Monitor activity log
5. Reset quarterly

## 🔧 Customization

### Add/Remove Children
Edit `src/Tracker.jsx` → `BOYS` array

### Change Colors
Edit `src/Tracker.jsx` → `BOYS` color values (`#RRGGBB`)

### Modify Rewards
Edit `src/Tracker.jsx` → `REWARDS` array

### Add New Tasks
Click "+ Add Earn Task" or "+ Add Lose Task" in the UI

## 🔐 Data & Privacy

- **Local mode**: Data stored in browser only (localStorage)
- **Cloud mode**: Data encrypted on Supabase servers
- **Row-level security**: Only logged-in parent can access their data
- **No tracking**: No analytics, no ads, no third-party data sharing

## 📚 Files

| File | Purpose |
|------|---------|
| `src/Tracker.jsx` | Main tracker component |
| `src/SupabaseSync.jsx` | Cloud sync auth panel |
| `src/supabaseClient.js` | Supabase API client |
| `vite.config.js` | Build & PWA config |
| `index.html` | HTML entry point |
| `.env.example` | Environment template |

## 🚀 Deployment

### Vercel (Recommended)
```bash
1. Create GitHub repo
2. Import to vercel.com
3. Add env vars (if using cloud)
4. Deploy (automatic on push)
```

### Other Platforms
Works anywhere that supports static hosting + serverless functions:
- Netlify
- GitHub Pages
- AWS Amplify
- Firebase Hosting

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm run build

# Preview build
npm run preview
```

## 📖 Documentation

- **`SETUP_INSTRUCTIONS.md`** – Quick start guide
- **`DEPLOYMENT_GUIDE.md`** – Detailed deployment steps
- **`README.md`** – This file

## ✨ Future Enhancements

- [ ] Parent dashboard (see all kids in one view)
- [ ] Photo/video evidence for achievements
- [ ] SMS notifications
- [ ] Family group chat integration
- [ ] Mobile app (React Native)
- [ ] Recurring tasks (weekly/monthly)
- [ ] Goal milestones
- [ ] Social sharing (achievements)

## 💡 Tips

- **Install as app** for best experience (offline + faster)
- **Use cloud sync** if tracking across multiple parent devices
- **Add custom tasks** for specific behaviors (e.g., "Practice violin 20 min")
- **Review log regularly** to spot patterns
- **Reset quarterly** to keep momentum

## 📞 Support

For issues or questions:
1. Check the guides in this folder
2. Verify Supabase credentials (if using cloud)
3. Check browser console (F12 → Console) for errors
4. Clear cache & reload if UI seems broken

## 📄 License

This tracker is yours to use, modify, and share with your family. No restrictions.

---

**Made for families. Built to last. Designed to scale.**
