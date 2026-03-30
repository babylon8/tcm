# Troubleshooting Flowchart

Quick decision tree for diagnosing and fixing issues.

---

## 🚨 START HERE: What's Your Problem?

### 1. "Database error saving new user" during OAuth login

**Cause**: Missing INSERT policy on users table

**Fix**: Run Migration 3

👉 **Go to**: [MIGRATION_QUICK_REFERENCE.md](./MIGRATION_QUICK_REFERENCE.md) → Migration 3

**Detailed debugging**: [OAUTH_TROUBLESHOOTING.md](./OAUTH_TROUBLESHOOTING.md)

---

### 2. OAuth redirects to `localhost` instead of Vercel domain

**Cause**: Supabase Site URL still points to localhost

**Fix**: Update Supabase configuration

**Steps**:
1. Supabase Dashboard → Authentication → URL Configuration
2. Set **Site URL** to: `https://your-app.vercel.app`
3. Add **Redirect URLs**: `https://your-app.vercel.app/auth/callback`
4. Wait 5 minutes for DNS propagation
5. Clear browser cookies completely
6. Test again

👉 **Detailed guide**: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) → Part 4, Step 10

---

### 3. Google login just refreshes back to login page (infinite loop)

**Cause**: OAuth callback error not being handled

**Fix**: Already fixed in latest code (commit `9bafae9`)

**Steps**:
1. Push latest commits to GitHub: `git push`
2. Redeploy on Vercel
3. Clear browser cookies
4. Check for error message on login page (red alert box)
5. If error shows "Database error", see #1 above

**If still stuck**: Check browser DevTools console for errors

---

### 4. Build fails on Vercel with TypeScript or ESLint errors

**Cause**: Code errors or version mismatches

**Fix**: Test build locally first

**Steps**:
```bash
npm run build
```

If build fails locally:
1. Fix errors shown in terminal
2. Commit fixes
3. Push to GitHub
4. Redeploy

If build passes locally but fails on Vercel:
1. Check Node.js version in Vercel settings (should be 18.x or 20.x)
2. Clear Vercel build cache: Project Settings → Clear Cache
3. Redeploy

---

### 5. Profile page shows "Not authenticated" after login

**Cause**: Session not persisting or middleware blocking

**Fix**: Check cookies and session

**Steps**:
1. Check browser cookies for `sb-[project-ref]-auth-token`
   - Chrome/Edge: F12 → Application → Cookies
   - Firefox: F12 → Storage → Cookies
2. If cookie missing, clear all cookies and login again
3. Check browser console for Supabase client errors
4. Verify middleware.ts is not blocking `/profile` route

**Advanced debugging**:
```javascript
// Browser console
const { data } = await window.supabase.auth.getSession();
console.log(data.session);
```

If session is null, logout and login again.

---

### 6. Admin dashboard shows "Access denied" for babylon8@gmail.com

**Cause**: Role not set to 'admin' or trigger didn't run

**Fix**: Verify trigger and role assignment

**Steps**:
1. Open Supabase Dashboard → Table Editor → users
2. Find babylon8@gmail.com user
3. Check `role` column - should be `'admin'`

If role is `'user'` or `NULL`:

```sql
-- Manually set admin role
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'babylon8@gmail.com';
```

If user doesn't exist in `public.users` but exists in `auth.users`:
- Trigger didn't run or failed
- See #1 above (missing INSERT policy)

---

### 7. Email signup fails with "Invalid email or password"

**Cause**: Email verification required or weak password

**Fix**: Check email provider settings and password strength

**Steps**:
1. Supabase Dashboard → Authentication → Providers → Email
2. Check if "Confirm email" is enabled
   - If yes: User must verify email before login
   - Check user's inbox for confirmation email
3. Password requirements:
   - Minimum 6 characters
   - No special character requirements (by default)
4. If user already exists with OAuth, cannot sign up with email
   - Use Google OAuth instead

---

### 8. Assessment history not saving

**Cause**: API route error or authentication issue

**Fix**: Check authentication and API logs

**Steps**:
1. Open browser DevTools → Network tab
2. Try saving an assessment
3. Look for POST request to `/api/assessment/save`
4. Check response status:
   - **401 Unauthorized**: Not logged in → Login again
   - **400 Bad Request**: Invalid data → Check console for error
   - **500 Internal Server Error**: Server error → Check Vercel logs

**Verify database permissions**:
```sql
SELECT * FROM pg_policies WHERE tablename = 'assessment_history';
```

Should see INSERT policy: `"Users can insert own assessments"`

---

### 9. "Invalid API key" or 401 Unauthorized errors

**Cause**: Wrong Supabase anon key or URL

**Fix**: Verify environment variables

**Steps**:
1. Check `.env.local` (local) or Vercel Environment Variables (production)
2. Verify `NEXT_PUBLIC_SUPABASE_URL`:
   - Format: `https://[project-ref].supabase.co`
   - Get from: Supabase Dashboard → Settings → API → Project URL
3. Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY`:
   - **MUST be "anon public" key** (NOT service_role)
   - Format: Starts with `eyJhbGci...` (JWT, 150+ characters)
   - Get from: Supabase Dashboard → Settings → API → anon public
4. If changed in Vercel, redeploy

---

### 10. Google OAuth shows "Redirect URI mismatch" error

**Cause**: Callback URL not added to Google OAuth app

**Fix**: Update Google Cloud Console

**Steps**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to your OAuth credentials
3. Add **Authorized redirect URIs**:
   ```
   https://[your-project-ref].supabase.co/auth/v1/callback
   https://your-app.vercel.app/auth/callback
   ```
4. Save
5. Wait 5 minutes for Google to propagate changes
6. Clear cookies and try again

---

### 11. All migrations ran but OAuth still fails

**Cause**: `auth.uid()` timing issue with RLS policy

**Fix**: Use permissive INSERT policy (Option B)

**Steps**:
```sql
-- Remove restrictive policy
DROP POLICY IF EXISTS "Enable insert for authenticated users during signup" ON public.users;

-- Create permissive policy
CREATE POLICY "Enable insert for service role"
  ON public.users
  FOR INSERT
  WITH CHECK (true);

-- Ensure grants
GRANT INSERT ON public.users TO authenticated;
GRANT INSERT ON public.users TO service_role;
```

**Why this is safe**: See [OAUTH_TROUBLESHOOTING.md](./OAUTH_TROUBLESHOOTING.md) → Option B explanation

---

## 🔍 Advanced Diagnostics

### Check Supabase Logs

1. Supabase Dashboard → Logs → Postgres Logs
2. Filter by recent time (last 5-10 minutes)
3. Look for:
   - RLS policy violations
   - Permission denied errors
   - Trigger function failures

### Check Vercel Logs

1. Vercel Dashboard → Your project → Logs
2. Filter by "Error"
3. Look for:
   - 500 Internal Server Error
   - Supabase client initialization errors
   - API route failures

### Test Supabase Connection Locally

```bash
# In project root
node -e "
const { createClient } = require('@supabase/supabase-js');
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);
supabase.auth.getSession().then(console.log);
"
```

Should output session object (or null if not authenticated).

---

## 📚 Full Documentation References

| Issue Type | Primary Resource | Details |
|---|---|---|
| Migration execution | [MIGRATION_QUICK_REFERENCE.md](./MIGRATION_QUICK_REFERENCE.md) | Step-by-step with error fixes |
| OAuth database error | [OAUTH_TROUBLESHOOTING.md](./OAUTH_TROUBLESHOOTING.md) | Deep dive into INSERT policy |
| Full deployment | [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) | Complete Vercel setup |
| General setup | [README.md](./README.md) | Overview and quick troubleshooting |

---

## 🚑 Emergency Reset

If everything is broken and you need to start fresh:

### 1. Reset Supabase Database

⚠️ **WARNING: Deletes ALL user data**

```sql
DROP TABLE IF EXISTS public.assessment_history CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
```

Then re-run migrations 1, 2, 3 from [MIGRATION_QUICK_REFERENCE.md](./MIGRATION_QUICK_REFERENCE.md)

### 2. Reset Local Environment

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

### 3. Reset Vercel Deployment

1. Vercel Dashboard → Your project → Settings
2. **Clear Cache** → Clear Build Cache
3. Re-add environment variables (copy from `.env.local`)
4. Redeploy

---

## ✅ Success Checklist

Your deployment is fully working when:

- [ ] Google OAuth login → redirects to `/profile` (not localhost, not login loop)
- [ ] Profile page shows correct email and role
- [ ] babylon8@gmail.com has `'admin'` role, can access `/admin`
- [ ] Assessment results can be saved to history
- [ ] Assessment history displays on profile page
- [ ] Logout works and clears session
- [ ] Email signup works (if enabled)
- [ ] Protected routes redirect to login when not authenticated
- [ ] No console errors in browser DevTools
- [ ] No errors in Vercel deployment logs
- [ ] No errors in Supabase logs

---

## 🆘 Still Stuck?

1. **Check all three documentation files**:
   - [MIGRATION_QUICK_REFERENCE.md](./MIGRATION_QUICK_REFERENCE.md)
   - [OAUTH_TROUBLESHOOTING.md](./OAUTH_TROUBLESHOOTING.md)
   - [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

2. **Verify every step** in the deployment checklist

3. **Export diagnostics** and review:
   ```sql
   -- Run in Supabase SQL Editor
   SELECT 
     'Tables' as type, table_name as name, '' as details
   FROM information_schema.tables WHERE table_schema = 'public'
   
   UNION ALL
   
   SELECT 
     'Policies' as type, policyname as name, cmd as details
   FROM pg_policies WHERE schemaname = 'public'
   
   UNION ALL
   
   SELECT 
     'Triggers' as type, trigger_name as name, event_object_table as details
   FROM information_schema.triggers WHERE trigger_schema = 'public'
   
   ORDER BY type, name;
   ```

4. **Community resources**:
   - [Supabase Discord](https://discord.supabase.com)
   - [Next.js Discord](https://nextjs.org/discord)
   - [Vercel Support](https://vercel.com/help)
