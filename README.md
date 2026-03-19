# TCM Self-Diagnosis Webapp (中医体质自诊系统)

A web application to help users self-diagnose health issues through Traditional Chinese Medicine (TCM) principles.

## MVP Features

1. **Constitution Assessment** - 9 TCM constitution types questionnaire with adaptive 2-phase flow
2. **Symptom Checker** - 3-step wizard with TCM pattern analysis
3. **Results Dashboard** - Constitution profile + comprehensive recommendations
4. **User Authentication** - Google/Facebook OAuth + email/password login
5. **User Profiles** - Assessment history tracking
6. **Admin Dashboard** - User management for babylon8@gmail.com

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL + Auth)
- **Data Storage**: Static JSON files + Supabase
- **State Management**: React Context / Zustand
- **Deployment**: Vercel

## Project Structure

```
tcm/
├── data/                    # Static JSON data files
│   ├── constitutions.json   # 9 constitution types
│   ├── symptoms.json        # Symptom categories & items
│   ├── questions.json       # Assessment questions
│   └── recommendations.json # Health recommendations
├── docs/                    # Specification documents
│   ├── SPEC.md              # Full specification
│   ├── DATA_MODELS.md       # Data model documentation
│   └── QUESTIONNAIRE.md     # Questionnaire design
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # React components
│   ├── lib/                 # Utilities & helpers
│   ├── types/               # TypeScript type definitions
│   └── hooks/               # Custom React hooks
└── public/                  # Static assets
```

## Development

```bash
npm install
npm run dev
```

## Supabase Setup

This application uses Supabase for authentication and user data storage. Follow these steps to set up Supabase:

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Create a new project
3. Note down your project URL and anon key from Settings > API

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Database Migrations

Run the SQL migrations in your Supabase SQL Editor (Dashboard > SQL Editor):

1. Execute `supabase/migrations/20260318000001_create_users_table.sql`
   - Creates users table with RLS policies
   - Automatically sets babylon8@gmail.com as admin
2. Execute `supabase/migrations/20260318000002_create_assessment_history_table.sql`
   - Creates assessment_history table with RLS policies

### 4. Configure OAuth Providers

In Supabase Dashboard > Authentication > Providers:

**Google OAuth:**
1. Enable Google provider
2. Create OAuth credentials at [Google Cloud Console](https://console.cloud.google.com/)
3. Add authorized redirect URI: `https://[your-project-ref].supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret to Supabase

**Facebook OAuth:**
1. Enable Facebook provider
2. Create app at [Facebook Developers](https://developers.facebook.com/)
3. Add OAuth redirect URI: `https://[your-project-ref].supabase.co/auth/v1/callback`
4. Copy App ID and App Secret to Supabase

### 5. Configure Site URL (for Vercel deployment)

In Supabase Dashboard > Authentication > URL Configuration:

- **Site URL**: `https://your-vercel-domain.vercel.app`
- **Redirect URLs**: Add `https://your-vercel-domain.vercel.app/auth/callback`

### 6. Install Supabase Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
```

## Documentation

- [Full Specification](./docs/SPEC.md)
- [Data Models](./docs/DATA_MODELS.md)
- [Questionnaire Design](./docs/QUESTIONNAIRE.md)
- [Auth Implementation Status](./AUTH_IMPLEMENTATION_STATUS.md)

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import repository in Vercel dashboard
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

### Post-Deployment

1. Update Supabase Site URL to your Vercel domain
2. Add Vercel domain to OAuth redirect URLs
3. Test authentication flow (Google/Facebook/Email)
4. Verify admin access at `/admin` with babylon8@gmail.com

## Disclaimer

This application is for educational and self-awareness purposes only. It does not provide medical diagnosis. Always consult a licensed TCM practitioner for actual treatment.
