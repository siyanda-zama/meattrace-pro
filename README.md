# MeatTrace Pro

**The Digital Backbone for Meat Operations**

Enterprise-grade food safety and yield management platform built for South African mobile abattoirs and meat processing facilities.

---

## 🚀 Features

### **Phase 1: Biosecurity & Intake**
- ✅ Digital Birth Certificate for livestock traceability
- ✅ GPS-tagged origin verification with FMD zone detection
- ✅ CIPC compliance validation
- ✅ Section 8 permit management
- ✅ Ante-mortem photo documentation

### **Phase 2: HACCP Compliance Engine**
- ✅ Real-time Critical Control Point (CCP) monitoring
- ✅ Automated deviation logging and corrective action tracking
- ✅ Knife sterilizer temperature validation (≥82°C)
- ✅ Carcass pH monitoring
- ✅ Compliance score calculation

### **Phase 3: Yield Analytics**
- ✅ Automatic dressing percentage calculation (CDM vs Live Weight)
- ✅ By-product revenue tracking (hides, heads, offal)
- ✅ Underperformance flagging
- ✅ Benchmark comparisons

### **Cold Chain Monitoring**
- ✅ IoT sensor integration (chillers, sterilizers, blast freezers)
- ✅ Real-time temperature breach detection
- ✅ 24-hour historical trend charts
- ✅ Automated alert generation

### **Auditor Portal**
- ✅ Read-only encrypted access for certification bodies
- ✅ Complete Chain of Custody records
- ✅ Immutable audit trail
- ✅ Remote document review

---

## 🏗️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth with Row Level Security
- **Real-time**: Supabase Realtime subscriptions
- **Storage**: Supabase Storage (documents, photos)
- **State**: TanStack React Query + Zustand
- **Animation**: Framer Motion
- **Charts**: Recharts
- **Deployment**: Vercel

---

## 📦 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- Vercel account (for deployment)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema:
   - Open **SQL Editor** in Supabase dashboard
   - Copy and run `supabase-schema.sql`
   - Then run `supabase-seed-data.sql`

### 3. Configure Environment
1. Copy `.env.example` to `.env`
2. Add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080)

### 5. Login
Use demo credentials:
- **Admin**: `admin@meattracepro.com` / `Admin@123`
- **Manager**: `manager@meattracepro.com` / `Manager@123`
- **Operator**: `operator@meattracepro.com` / `Operator@123`
- **Auditor**: `auditor@meattracepro.com` / `Auditor@123`

---

## 🚢 Deployment

### Deploy to Vercel

```bash
# Initialize Git
git init
git add .
git commit -m "Initial commit: MeatTrace Pro"

# Push to GitHub
git remote add origin https://github.com/your-username/meattrace-pro.git
git push -u origin main
```

Then:
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables (same as `.env`)
4. Deploy

See [SETUP.md](./SETUP.md) for detailed deployment instructions.

---

## 📁 Project Structure

```
meattrace-project/
├── public/              # Static assets
│   ├── icons/          # PWA icons
│   └── manifest.json   # PWA manifest
├── src/
│   ├── components/     # React components
│   │   ├── dashboard/  # Admin dashboard components
│   │   ├── mobile/     # Mobile PWA components
│   │   └── ui/         # shadcn/ui components
│   ├── hooks/          # Custom React hooks
│   │   ├── use-suppliers.ts
│   │   ├── use-sessions.ts
│   │   ├── use-ccps.ts
│   │   └── ...
│   ├── lib/            # Core utilities
│   │   ├── api/        # Supabase API functions
│   │   ├── stores/     # Zustand stores
│   │   ├── supabase.ts # Supabase client
│   │   └── database.types.ts
│   ├── pages/          # Route components
│   │   ├── Dashboard.tsx
│   │   ├── Sessions.tsx
│   │   ├── Intake.tsx
│   │   ├── HACCP.tsx
│   │   └── ...
│   ├── App.tsx         # Root component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── supabase-schema.sql  # Database schema
├── supabase-seed-data.sql # Seed data
├── SETUP.md            # Detailed setup guide
└── package.json
```

---

## 🎯 Business Value

### Certification Pathway
- **Pre-packaged HACCP compliance** — reduces consulting fees by R200k–R500k
- **ISO 22000/FSSC 22000 alignment** — audit-ready records
- **GFSI recognized** — meets Woolworths, Shoprite, Pick n Pay requirements

### Liability Defense
- **Immutable Chain of Custody** — protection against food-borne illness claims
- **GPS-tagged biosecurity** — FMD zone compliance
- **Audit trail** — every CCP check, temperature reading, and corrective action logged

### Operational ROI
- **Eliminate shrinkage** — precise by-product tracking (hides, offal)
- **Yield optimization** — real-time dressing % alerts
- **Automated alerts** — proactive issue detection before audits

---

## 📊 Database Schema

### Core Tables
- `profiles` — User accounts (linked to Supabase Auth)
- `suppliers` — Supplier registry with GPS verification
- `sessions` — Processing sessions (batch records)
- `intake_records` — Digital Birth Certificates
- `ccp_records` — HACCP Critical Control Points
- `sensors` — IoT device registry
- `sensor_readings` — Temperature history
- `alerts` — Real-time alert system
- `by_products` — Revenue tracking
- `audit_logs` — Immutable change log

All tables protected by Row Level Security (RLS) policies.

---

## 🔒 Security Features

- ✅ **Row Level Security (RLS)** — Database-level access control
- ✅ **Encrypted auth tokens** — Supabase JWT
- ✅ **Role-based permissions** — SUPER_ADMIN, MANAGER, OPERATOR, AUDITOR
- ✅ **Audit trail** — Immutable change tracking
- ✅ **HTTPS only** — All data in transit encrypted
- ✅ **Daily backups** — Supabase automated backups

---

## 📱 Mobile PWA

Offline-capable Progressive Web App for on-floor operators:

- ✅ Works offline with local data storage
- ✅ Auto-sync when connectivity restored
- ✅ Native app-like experience
- ✅ Bluetooth scale integration
- ✅ Camera for ante-mortem photos

Install: Visit `/app` route on mobile and "Add to Home Screen"

---

## 🛠️ Development

### Available Scripts
```bash
npm run dev         # Start development server
npm run build       # Production build
npm run preview     # Preview production build
npm run lint        # Run ESLint
npm run test        # Run tests (Vitest)
```

### Code Style
- TypeScript (lenient mode for rapid development)
- ESLint + React Hooks rules
- Prettier (via editor)

---

## 📝 License

Copyright © 2026 Siyanda & Azanda Zama
All rights reserved. Confidential and proprietary.

---

## 🤝 Support

For technical issues, deployment assistance, or feature requests:

- **Email**: [support@meattracepro.com](mailto:support@meattracepro.com)
- **Documentation**: [SETUP.md](./SETUP.md)
- **Proposal**: [MeatTrace_Pro_Proposal.pdf](../Downloads/MeatTrace_Pro_Proposal.pdf)

---

## 🎖️ Compliance Standards

MeatTrace Pro is designed to align with:
- ✅ **HACCP** (Hazard Analysis Critical Control Points)
- ✅ **ISO 22000:2018** (Food Safety Management Systems)
- ✅ **FSSC 22000** (Food Safety System Certification)
- ✅ **GFSI** (Global Food Safety Initiative)
- ✅ **South African Meat Safety Act, 2000**

---

**Built with precision. Designed for compliance. Engineered for growth.**

MeatTrace Pro — Where Data Integrity Meets Operational Excellence.
