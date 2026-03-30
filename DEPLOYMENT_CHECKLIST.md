# Deployment Checklist for Vercel

This guide will help you deploy the TCM Self-Diagnosis app to Vercel with full authentication functionality.

---

## Prerequisites

- [ ] Supabase project created and configured
- [ ] GitHub repository with latest code pushed
- [ ] Vercel account created
- [ ] Google OAuth app created (Google Cloud Console)

---

## Part 1: Supabase Database Setup

### Step 1: Run Database Migrations

1. Open Supabase Dashboard → SQL Editor
2. Execute migrations **in order**:

**Migration 1** - Create users table:
```sql
-- Copy and paste contents of:
-- supabase/migrations/20260318000001_create_users_table.sql
```

**Migration 2** - Create assessment history table:
```sql
-- Copy and paste contents of:
-- supabase/migrations/20260318000002_create_assessment_history_table.sql
```

**Migration 3** - Fix INSERT policy (CRITICAL):
```sql
-- Copy and paste contents of:
-- supabase/migrations/20260330000000_fix_users_insert_policy.sql
```

3. Verify tables created:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Expected output: `assessment_history`, `users`

---

## Part 2: Supabase Authentication Configuration

### Step 2: Get Supabase Credentials

1. Go to Supabase Dashboard → Project Settings → API
2. Copy the following values:
   - **Project URL**: `https://[project-ref].supabase.co`
   - **Anon/Public Key**: Long JWT starting with `eyJhbGci...` (150+ characters)

⚠️ **IMPORTANT**: Do NOT use the `service_role` key (starts with `eyJhbGci...` but labeled "secret"). Use the **anon** key.

### Step 3: Configure Email Authentication

1. Go to Supabase Dashboard → Authentication → Providers
2. **Email** provider should be enabled by default
3. Configure email templates (optional):
   - Authentication → Email Templates
   - Customize "Confirm Signup" and "Reset Password" emails

### Step 4: Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Application type: **Web application**
6. Add **Authorized redirect URIs**:
   ```
   https://[your-supabase-project-ref].supabase.co/auth/v1/callback
   ```
7. Copy **Client ID** and **Client Secret**
8. In Supabase Dashboard → Authentication → Providers → Google:
   - Enable Google provider
   - Paste Client ID and Client Secret
   - Save

---

## Part 3: Vercel Deployment

### Step 6: Initial Deployment

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New...** → **Project**
3. Import your GitHub repository: `babylon8/tcm`
4. **Do NOT deploy yet** - click **Environment Variables** first

### Step 7: Add Environment Variables

Add the following environment variables in Vercel:

| Variable Name | Value | Source |
|---------------|-------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://[project-ref].supabase.co` | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` (long JWT) | Supabase Dashboard → Settings → API → anon public |

⚠️ **CRITICAL**: Make sure both variables are set for **Production**, **Preview**, and **Development** environments.

### Step 8: Deploy

1. Click **Deploy**
2. Wait for deployment to complete
3. Copy your Vercel deployment URL: `https://your-app-name.vercel.app`

---

## Part 4: Post-Deployment Configuration

### Step 9: Update Supabase Site URL

⚠️ **CRITICAL STEP** - Without this, OAuth will redirect to localhost instead of your Vercel domain.

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Set **Site URL** to your Vercel deployment URL:
   ```
   https://your-app-name.vercel.app
   ```
3. Add **Redirect URLs**:
   ```
   https://your-app-name.vercel.app/auth/callback
   http://localhost:3000/auth/callback  (for local development)
   ```
4. Click **Save**

### Step 10: Update OAuth Provider Redirect URIs

**Google Cloud Console:**
1. Go to your OAuth 2.0 Client ID
2. Add to **Authorized redirect URIs**:
   ```
   https://your-app-name.vercel.app/auth/callback
   ```
3. Save

---

## Part 5: Verification & Testing

### Step 11: Test Authentication Flow

Visit your Vercel deployment and test each authentication method:

**Email/Password Signup:**
- [ ] Go to `/auth/signup`
- [ ] Create account with new email
- [ ] Check email for verification link
- [ ] Verify email and login
- [ ] Check that user appears in Supabase Dashboard → Authentication → Users

**Google OAuth:**
- [ ] Go to `/auth/login`
- [ ] Click "Continue with Google"
- [ ] Should redirect to Google login (NOT localhost)
- [ ] After authorization, should redirect back to `/profile`
- [ ] Profile page should show user info

**Admin Access:**
- [ ] Login with `babylon8@gmail.com`
- [ ] Navigate to `/admin`
- [ ] Should see admin dashboard with user statistics
- [ ] Regular users should get "Access Denied" on `/admin`

### Step 12: Test Assessment Flow

**Constitution Assessment:**
- [ ] Complete the adaptive questionnaire
- [ ] Click "Save to History" on results page
- [ ] Go to `/profile`
- [ ] Assessment should appear in history
- [ ] Click "View Details" to see full results

**Symptom Checker:**
- [ ] Complete the 3-step wizard
- [ ] Click "Save to History" on results page
- [ ] Verify it appears in profile history

---

## Troubleshooting

### Issue: OAuth redirects to localhost

**Symptoms:**
- After OAuth login, browser shows `http://localhost:3000/?error=server_error`

**Solution:**
1. Verify Supabase Site URL is set to your Vercel domain (Step 9)
2. Verify OAuth redirect URLs include Vercel domain (Step 10)
3. Wait 5 minutes for DNS/cache to propagate
4. Clear browser cookies and try again

### Issue: "Database error saving new user"

**Symptoms:**
- OAuth login fails with database error
- User not created in Supabase auth.users table

**Solution:**
1. Verify you ran **all three** migrations (especially migration 3: `20260330000000_fix_users_insert_policy.sql`)
2. Check Supabase Dashboard → Logs for detailed error
3. Verify RLS policies in SQL Editor:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'users';
   ```
4. Should see INSERT policy: `"Enable insert for authenticated users during signup"`

### Issue: "Invalid API key" or 401 Unauthorized

**Symptoms:**
- Auth functions fail with 401 error
- Supabase client cannot connect

**Solution:**
1. Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the **anon/public** key (starts with `eyJhbGci...`, 150+ chars)
2. NOT the service_role key (also starts with `eyJhbGci...` but labeled "secret" or "service_role")
3. Re-copy from Supabase Dashboard → Settings → API → anon public
4. Update Vercel environment variables
5. Redeploy

### Issue: Build fails on Vercel

**Symptoms:**
- Deployment fails with TypeScript errors or ESLint errors

**Solution:**
1. Test build locally first:
   ```bash
   npm run build
   ```
2. Fix any errors shown
3. Commit and push fixes to GitHub
4. Redeploy on Vercel

### Issue: Profile page shows "Not authenticated"

**Symptoms:**
- After successful login, profile page shows "Not authenticated"
- User is logged in but middleware redirects

**Solution:**
1. Check browser cookies - should see `sb-[project-ref]-auth-token`
2. Verify middleware.ts is not blocking authenticated routes
3. Check Supabase session in browser DevTools:
   ```javascript
   // In browser console
   const { data } = await window.supabase.auth.getSession();
   console.log(data.session);
   ```
4. If session is null, clear cookies and login again

---

## Post-Deployment Checklist

After successful deployment, verify:

- [ ] All authentication methods work (email, Google OAuth)
- [ ] Admin dashboard accessible to babylon8@gmail.com only
- [ ] Assessment history saves and displays correctly
- [ ] No localhost redirects during OAuth flow
- [ ] User profiles persist across sessions
- [ ] Logout functionality works
- [ ] Protected routes redirect unauthenticated users to login

---

## Production Readiness

### Security Checklist

- [ ] Supabase RLS policies enabled on all tables
- [ ] Service role key NOT exposed in environment variables
- [ ] OAuth apps restricted to production domains only
- [ ] Email verification enabled for email/password signups
- [ ] HTTPS enforced on all routes

### Performance Checklist

- [ ] Images optimized (Next.js Image component used)
- [ ] No console.log statements in production code
- [ ] Build size under Vercel limits (check deployment logs)
- [ ] Lighthouse score > 90 (run in Chrome DevTools)

### Monitoring

Set up monitoring in:
- **Vercel Dashboard**: Check deployment logs, function logs, analytics
- **Supabase Dashboard**: Monitor auth events, database queries, RLS policy violations

---

## Support

If issues persist after following this checklist:

1. Check Supabase Logs: Dashboard → Logs → Filter by error
2. Check Vercel Function Logs: Vercel Dashboard → Functions → Select your function
3. Check browser console for client-side errors (F12 → Console)
4. Verify all environment variables are set correctly (Vercel Dashboard → Settings → Environment Variables)

---

## Next Steps

After successful deployment:

1. **Custom Domain** (optional):
   - Add custom domain in Vercel Dashboard → Settings → Domains
   - Update Supabase Site URL and OAuth redirect URIs to use custom domain

2. **Email Customization**:
   - Brand email templates in Supabase Dashboard → Authentication → Email Templates
   - Set up custom SMTP (optional) for email delivery

3. **Analytics**:
   - Enable Vercel Analytics: Dashboard → Analytics
   - Track user signups and assessment completions

4. **Monitoring**:
   - Set up Sentry or LogRocket for error tracking
   - Monitor Supabase quota usage (Dashboard → Settings → Usage)
