# Authentication System - Setup & Implementation Guide

## ✅ Completed

### Code Files Created:
1. **Supabase Utilities** (`src/lib/supabase/`)
   - `client.ts` - Browser client
   - `server.ts` - Server-side client
   - `middleware.ts` - Auth middleware helper

2. **Database Migrations** (`supabase/migrations/`)
   - `20260318000001_create_users_table.sql` - Users table with RLS
   - `20260318000002_create_assessment_history_table.sql` - Assessment history with RLS

3. **Auth Pages** (`src/app/auth/`)
   - `login/page.tsx` - Login with Google/Facebook/Email
   - `signup/page.tsx` - Registration with email verification
   - `callback/route.ts` - OAuth callback handler

4. **Core Infrastructure**
   - `src/middleware.ts` - Route protection & session refresh
   - `src/contexts/AuthContext.tsx` - Auth state management

---

## 🚧 Remaining Tasks

### 1. Install Dependencies

**Network issues prevented automatic installation. Run manually:**

```bash
cd /home/law/projects/tcm
npm install @supabase/supabase-js@^2.39.0 @supabase/ssr@^0.1.0
```

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → Sign up/Login
2. Click "New Project"
3. Fill in:
   - **Name**: tcm-webapp
   - **Database Password**: (generate strong password)
   - **Region**: Choose closest to Singapore
4. Wait 2-3 minutes for provisioning

### 3. Configure OAuth Providers

#### Google OAuth:
1. In Supabase Dashboard → Authentication → Providers
2. Enable "Google"
3. Get credentials from [Google Cloud Console](https://console.cloud.google.com/):
   - Create OAuth 2.0 Client ID
   - Authorized redirect URI: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
4. Copy Client ID & Secret to Supabase

#### Facebook OAuth:
1. In Supabase Dashboard → Authentication → Providers
2. Enable "Facebook"
3. Get credentials from [Facebook Developers](https://developers.facebook.com/):
   - Create App → Add Facebook Login
   - Valid OAuth Redirect URI: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
4. Copy App ID & Secret to Supabase

### 4. Run Database Migrations

In Supabase Dashboard → SQL Editor, run both migration files:
1. Copy content from `supabase/migrations/20260318000001_create_users_table.sql`
2. Execute
3. Copy content from `supabase/migrations/20260318000002_create_assessment_history_table.sql`
4. Execute

### 5. Set Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
```

Get values from Supabase Dashboard → Project Settings → API

### 6. Create Missing Pages

**Still need to implement:**

#### A. Profile Page (`src/app/profile/page.tsx`)
- Show user info
- Display assessment history (list of past results)
- "Delete account" option

#### B. Admin Dashboard (`src/app/admin/page.tsx`)
- Check if user.email === 'babylon8@gmail.com'
- Show metrics: Total users, Total assessments, Recent signups
- List all users with roles

#### C. API Route (`src/app/api/assessment/save/route.ts`)
- POST endpoint to save assessment results
- Insert into `assessment_history` table
- Return success/error

#### D. Update Navbar
- Add login/logout button
- Show user avatar when logged in
- Conditional rendering based on auth state

#### E. Integrate Auth Context
Update `src/app/layout.tsx` to wrap with `<AuthProvider>`

#### F. Update Results Page
Add "Save to History" button that calls `/api/assessment/save`

---

## 🔧 Implementation Steps (After Setup)

### Step 1: Wrap App with AuthProvider

Edit `src/app/layout.tsx`:

```typescript
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### Step 2: Test Authentication

1. Run `npm run dev`
2. Visit `/auth/signup` → Create account
3. Check email for verification link
4. Visit `/auth/login` → Sign in
5. Should redirect to `/profile` (will show error until profile page is created)

### Step 3: Create Profile Page

See `PROFILE_PAGE_TEMPLATE.md` (to be created)

### Step 4: Create Admin Dashboard

See `ADMIN_PAGE_TEMPLATE.md` (to be created)

---

## 🎯 Success Criteria

- ✅ Users can sign up with Google/Facebook/Email
- ✅ Email verification works
- ✅ Login redirects to profile
- ✅ babylon8@gmail.com has admin access
- ✅ Users can save assessment history
- ✅ Admin can view user statistics

---

## 📝 Notes

- **LSP Errors**: TypeScript errors about missing `@supabase/*` modules will resolve after npm install
- **RLS Security**: Database policies ensure users can only access their own data
- **Admin Detection**: Automatic via trigger on user creation (babylon8@gmail.com → admin role)
- **Free Tier**: Supabase + Vercel = $0/month for moderate usage

---

## 🚨 Next Action Required

**You need to:**
1. Run `npm install @supabase/supabase-js @supabase/ssr`
2. Create Supabase project
3. Configure OAuth providers
4. Run database migrations
5. Set `.env.local` variables

**Then I can continue** implementing the remaining pages (profile, admin, navbar updates).

Would you like me to continue now or wait until you've completed the Supabase setup?
