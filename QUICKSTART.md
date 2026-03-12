# MeatTrace Pro — Quick Start Guide

**Get your system running in 30 minutes**

---

## ⚡ Step 1: Set Up Supabase (15 minutes)

### 1.1 Create Project
1. Go to https://app.supabase.com
2. Click **"New Project"**
3. Fill in:
   - Name: `meattrace-pro`
   - Database Password: **Create a strong password and save it**
   - Region: `Frankfurt` (closest to South Africa)
4. Click **"Create new project"**
5. Wait 2-3 minutes for provisioning

### 1.2 Run Database Schema
1. In your Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open `supabase-schema.sql` from your project folder
4. Copy ALL the SQL code
5. Paste into Supabase SQL Editor
6. Click **"Run"** (bottom right)
7. Wait for ✓ Success message

### 1.3 Run Seed Data
1. Click **"New query"** again
2. Open `supabase-seed-data.sql`
3. Copy and paste the code
4. Click **"Run"**
5. Verify: Go to **Table Editor** → check "suppliers" table has 8 rows

### 1.4 Create Demo Users
1. Go to **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Create these 4 users:

```
Email: admin@meattracepro.com
Password: Admin@123
```

```
Email: manager@meattracepro.com
Password: Manager@123
```

```
Email: operator@meattracepro.com
Password: Operator@123
```

```
Email: auditor@meattracepro.com
Password: Auditor@123
```

### 1.5 Create User Profiles
For **EACH** user you just created:

1. Go to **Table Editor** → **profiles**
2. Click **"Insert"** → **"Insert row"**
3. Fill in the row:
   - **id**: Go back to **Authentication** → **Users**, copy the UUID for the user
   - **email**: Same as auth user
   - **name**: e.g., "Sipho Ndlovu" (Admin), "Thandi Mkhize" (Manager), "Bongani Zulu" (Operator), "Fatima Patel" (Auditor)
   - **role**: Select from dropdown (SUPER_ADMIN, MANAGER, OPERATOR, AUDITOR)
4. Click **"Save"**
5. Repeat for all 4 users

### 1.6 Get API Credentials
1. Go to **Settings** → **API**
2. Copy these 2 values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (long JWT token starting with `eyJ...`)
3. Keep these handy for next step

---

## 🔧 Step 2: Configure Local Environment (2 minutes)

1. Open `.env` file in project root
2. Replace with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_KEY_HERE
VITE_APP_NAME=MeatTrace Pro
VITE_APP_VERSION=1.0.0
VITE_ENABLE_OFFLINE_MODE=true
VITE_ENABLE_BLE_SIMULATION=true
VITE_ENABLE_IOT_SIMULATION=true
```

3. Save the file

---

## 🚀 Step 3: Run Locally (3 minutes)

```bash
# Install dependencies (if you haven't already)
npm install

# Start development server
npm run dev
```

### Test Login
1. Open http://localhost:8080
2. Login with: `admin@meattracepro.com` / `Admin@123`
3. You should see the Dashboard!

### Verify Supabase Connection
1. Go to **Suppliers** page
2. You should see all 8 suppliers from the database
3. Try searching — it should work!

---

## 📦 Step 4: Deploy to Vercel (10 minutes)

### 4.1 Initialize Git
```bash
git init
git add .
git commit -m "feat: MeatTrace Pro with Supabase backend"
```

### 4.2 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `meattrace-pro`
3. Set to **Private**
4. Click **"Create repository"**

### 4.3 Push to GitHub
```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/meattrace-pro.git
git branch -M main
git push -u origin main
```

### 4.4 Deploy to Vercel
1. Go to https://vercel.com
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. **Framework Preset**: Vite (should auto-detect)
5. **Environment Variables**: Click "Add" and enter:

```
VITE_SUPABASE_URL = https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_KEY
VITE_APP_NAME = MeatTrace Pro
VITE_APP_VERSION = 1.0.0
VITE_ENABLE_OFFLINE_MODE = true
VITE_ENABLE_BLE_SIMULATION = true
VITE_ENABLE_IOT_SIMULATION = true
```

6. Click **"Deploy"**
7. Wait 2-3 minutes

### 4.5 Test Production
1. Click **"Visit"** when deployment completes
2. Login with admin credentials
3. Verify Suppliers page loads data

---

## ✅ YOU'RE DONE!

Your production system is now live at:
`https://meattrace-pro-YOUR_USERNAME.vercel.app`

---

## 🎯 What Works Now

- ✅ **Supabase Auth** — Real login with database users
- ✅ **Suppliers Page** — Connected to Supabase
- ✅ **Row Level Security** — Database-level access control
- ✅ **Auto-deployment** — Every Git push triggers new deployment

---

## 🚧 What's Next (Phase 2)

To complete the system, you need to:

1. **Connect Dashboard** to Supabase
2. **Connect Sessions page** to Supabase
3. **Connect HACCP page** to Supabase
4. **Update Cold Chain** to use real sensor data
5. **Build session creation** workflow

I can help you with these! Just ask.

---

## 🆘 Troubleshooting

### "Missing Supabase environment variables"
→ Make sure `.env` file exists and has correct values

### Login fails
→ Check that user exists in **Authentication** → **Users**
→ Verify profile exists in **Table Editor** → **profiles**

### Suppliers page shows "Failed to load"
→ Verify `supabase-schema.sql` and `supabase-seed-data.sql` ran successfully
→ Check Supabase credentials in `.env` are correct

### Deployment fails on Vercel
→ Verify environment variables are set in Vercel project settings
→ Check build logs for specific errors

---

**Need help?** Check the full [SETUP.md](./SETUP.md) guide or reach out for support.

**MeatTrace Pro** — From zero to production in 30 minutes.
