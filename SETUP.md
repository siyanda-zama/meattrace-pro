# MeatTrace Pro — Setup Guide

## Prerequisites
- Node.js 18+ installed
- Supabase account ([supabase.com](https://supabase.com))
- Vercel account ([vercel.com](https://vercel.com))
- Git installed

---

## Step 1: Supabase Project Setup

### 1.1 Create Supabase Project
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Name: `meattrace-pro`
4. Database Password: **Save this securely**
5. Region: Choose closest to South Africa (e.g., Cape Town or Frankfurt)
6. Click "Create New Project"

### 1.2 Run Database Schema
1. Open your Supabase project
2. Go to **SQL Editor** (left sidebar)
3. Click "New Query"
4. Copy the entire contents of `supabase-schema.sql`
5. Paste and click "Run"
6. Wait for confirmation ✓

### 1.3 Run Seed Data
1. In SQL Editor, click "New Query" again
2. Copy the entire contents of `supabase-seed-data.sql`
3. Paste and click "Run"
4. Verify data in **Table Editor**

### 1.4 Set up Storage Buckets
1. Go to **Storage** (left sidebar)
2. Click "Create a new bucket"
3. Name: `documents`, Public: **OFF**
4. Click "Create bucket"
5. Repeat for bucket name: `photos`, Public: **OFF**

### 1.5 Configure Storage Policies
1. Click on `documents` bucket → **Policies** tab
2. Click "New Policy" → Custom
3. **Policy Name**: `Authenticated users can upload documents`
4. **Policy Definition**:
```sql
bucket_id = 'documents' AND auth.role() = 'authenticated'
```
5. Check **INSERT** and **SELECT**
6. Click "Save policy"
7. Repeat for `photos` bucket

### 1.6 Get API Credentials
1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

---

## Step 2: Local Development Setup

### 2.1 Install Dependencies
```bash
cd /path/to/meattrace-project
npm install
```

### 2.2 Configure Environment Variables
1. Open `.env` file in the project root
2. Replace placeholders with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2.3 Create Demo Users in Supabase Auth
1. Go to **Authentication** → **Users**
2. Click "Add user" → **Create new user**
3. Create these 4 test accounts:

| Email | Password | Role (set in profile after) |
|-------|----------|----------------------------|
| `admin@meattracepro.com` | `Admin@123` | SUPER_ADMIN |
| `manager@meattracepro.com` | `Manager@123` | MANAGER |
| `operator@meattracepro.com` | `Operator@123` | OPERATOR |
| `auditor@meattracepro.com` | `Auditor@123` | AUDITOR |

4. After creating each user, go to **Table Editor** → **profiles**
5. Click "+ Insert row"
6. Fill in:
   - `id`: Copy the UUID from auth.users table
   - `email`: Same as auth user
   - `name`: Full name (e.g., "Sipho Ndlovu")
   - `role`: Select from dropdown
7. Click "Save"

### 2.4 Start Development Server
```bash
npm run dev
```
Open [http://localhost:8080](http://localhost:8080)

---

## Step 3: Deploy to Vercel

### 3.1 Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: MeatTrace Pro enterprise system"
git branch -M main
git remote add origin https://github.com/your-username/meattrace-pro.git
git push -u origin main
```

### 3.2 Deploy to Vercel
1. Go to [https://vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. **Framework Preset**: Vite
5. **Environment Variables**: Add these:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI...
   VITE_APP_NAME=MeatTrace Pro
   VITE_APP_VERSION=1.0.0
   VITE_ENABLE_OFFLINE_MODE=true
   VITE_ENABLE_BLE_SIMULATION=true
   VITE_ENABLE_IOT_SIMULATION=true
   ```
6. Click "Deploy"
7. Wait 2-3 minutes for build to complete

### 3.3 Configure Custom Domain (Optional)
1. In Vercel project → **Settings** → **Domains**
2. Add your domain (e.g., `app.meattracepro.com`)
3. Follow DNS configuration instructions

---

## Step 4: Verify Production Deployment

### 4.1 Test Login
1. Visit your Vercel URL (e.g., `https://meattrace-pro.vercel.app`)
2. Click one of the demo credential buttons
3. Verify you're redirected to the dashboard

### 4.2 Test Data Flow
1. Navigate to **Suppliers** page
2. Verify all 8 suppliers load from Supabase
3. Navigate to **Cold Chain** page
4. Verify sensors are visible

### 4.3 Test Real-time Features
1. Open **Supabase** → **Table Editor** → **sensors**
2. Edit `current_temp` value for "Chiller A"
3. Verify the dashboard updates in real-time

---

## Troubleshooting

### Build fails with "Missing Supabase environment variables"
- Verify `.env` file exists and has correct values
- In Vercel, check **Settings** → **Environment Variables**

### "No users found" or login fails
- Verify users exist in **Authentication** → **Users**
- Verify matching profiles exist in **Table Editor** → **profiles**

### Cold Chain sensors not updating
- Check browser console for errors
- Verify Supabase Realtime is enabled (Project Settings → API → Realtime)

### 404 on deployment
- Verify `vercel.json` exists in project root
- Check Vercel deployment logs for errors

---

## Next Steps

1. **Add your facility data**: Replace demo suppliers with real operations
2. **Configure IoT sensors**: Integrate actual BLE scales and temperature sensors
3. **Customize compliance templates**: Adapt HACCP checks to your specific operation
4. **Train staff**: Run orientation sessions for operators and admin users
5. **Schedule auditor access**: Share read-only portal credentials with certification bodies

---

## Support

For technical issues or feature requests:
- Email: support@meattracepro.com
- GitHub Issues: [Create an issue](https://github.com/your-org/meattrace-pro/issues)

**MeatTrace Pro v1.0** — The Digital Backbone for Meat Operations
