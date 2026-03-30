# TCM Self-Diagnosis Webapp (中医体质自诊系统)

A web application to help users self-diagnose health issues through Traditional Chinese Medicine (TCM) principles.

## MVP Features

1. **Constitution Assessment** - 9 TCM constitution types questionnaire with adaptive 2-phase flow
2. **Symptom Checker** - 3-step wizard with TCM pattern analysis
3. **Results Dashboard** - Constitution profile + comprehensive recommendations
4. **User Authentication** - Google OAuth + email/password login
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

Run the SQL migrations in your Supabase SQL Editor (Dashboard > SQL Editor) **in order**:

1. Execute `supabase/migrations/20260318000001_create_users_table.sql`
   - Creates users table with RLS policies
   - Automatically sets babylon8@gmail.com as admin
2. Execute `supabase/migrations/20260318000002_create_assessment_history_table.sql`
   - Creates assessment_history table with RLS policies
3. Execute `supabase/migrations/20260330000000_fix_users_insert_policy.sql`
   - Fixes INSERT policy for OAuth user creation (CRITICAL)

### 4. Configure OAuth Providers

In Supabase Dashboard > Authentication > Providers:

**Google OAuth:**
1. Enable Google provider
2. Create OAuth credentials at [Google Cloud Console](https://console.cloud.google.com/)
3. Add authorized redirect URI: `https://[your-project-ref].supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret to Supabase

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
- [**Deployment Checklist**](./DEPLOYMENT_CHECKLIST.md) - Complete guide for Vercel deployment
- [**Troubleshooting Flowchart**](./TROUBLESHOOTING_FLOWCHART.md) - Quick problem diagnosis and fixes
- [**Migration Quick Reference**](./MIGRATION_QUICK_REFERENCE.md) - Step-by-step migration execution with troubleshooting
- [**OAuth Troubleshooting**](./OAUTH_TROUBLESHOOTING.md) - Detailed "Database error saving new user" fix guide

## Deployment

**For complete deployment instructions, see [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)**

Quick overview:

1. Push code to GitHub
2. Run all three Supabase migrations (including the INSERT policy fix)
3. Import repository in Vercel dashboard
4. Add environment variables in Vercel
5. Deploy
6. Update Supabase Site URL to Vercel domain
7. Update OAuth redirect URLs for production
8. Test all authentication flows

## Troubleshooting

**Quick problem diagnosis**: See [TROUBLESHOOTING_FLOWCHART.md](./TROUBLESHOOTING_FLOWCHART.md) for decision tree

### OAuth redirects to localhost after Vercel deployment

**Cause**: Supabase Site URL still points to `http://localhost:3000` instead of your Vercel domain.

**Solution**:
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Set Site URL to `https://your-app-name.vercel.app`
3. Add redirect URL: `https://your-app-name.vercel.app/auth/callback`
4. Update Google OAuth app with Vercel callback URLs
5. Clear browser cookies and test again

### "Database error saving new user" during OAuth signup

**Cause**: Missing INSERT policy on users table.

**Solution**:
1. Verify you ran the third migration: `20260330000000_fix_users_insert_policy.sql`
2. Check Supabase Dashboard → Logs for detailed error
3. Verify RLS policy exists:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'users' AND policyname LIKE '%insert%';
   ```

**For complete step-by-step migration guide with all error scenarios, see:**
- [**MIGRATION_QUICK_REFERENCE.md**](./MIGRATION_QUICK_REFERENCE.md) - Execution steps with immediate fixes
- [**OAUTH_TROUBLESHOOTING.md**](./OAUTH_TROUBLESHOOTING.md) - Detailed debugging guide

For more troubleshooting scenarios, see [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md).

## Disclaimer

This application is for educational and self-awareness purposes only. It does not provide medical diagnosis. Always consult a licensed TCM practitioner for actual treatment.
