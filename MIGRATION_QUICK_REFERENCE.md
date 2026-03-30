# Migration Quick Reference

This is a step-by-step guide for running the Supabase migrations with common failure scenarios and immediate fixes.

---

## Step-by-Step Execution

### Before You Start

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → Your project
2. Go to **SQL Editor** (left sidebar)
3. Click **New Query**

---

## Migration 1: Create Users Table

### Execute

```sql
-- Copy ENTIRE contents from:
-- supabase/migrations/20260318000001_create_users_table.sql
```

Click **Run** (or Ctrl+Enter).

### Expected Success Output

```
Success. No rows returned
```

### Common Errors

**Error: "relation 'users' already exists"**
- Migration already ran successfully
- Skip to Migration 2
- To verify: Run `SELECT * FROM public.users LIMIT 1;`

**Error: "permission denied"**
```sql
-- Grant yourself permissions first
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres;
GRANT ALL ON SCHEMA public TO postgres;
-- Then re-run migration 1
```

---

## Migration 2: Create Assessment History Table

### Execute

```sql
-- Copy ENTIRE contents from:
-- supabase/migrations/20260318000002_create_assessment_history_table.sql
```

Click **Run**.

### Expected Success Output

```
Success. No rows returned
```

### Common Errors

**Error: "relation 'assessment_history' already exists"**
- Migration already ran
- Skip to Migration 3

**Error: "foreign key constraint 'assessment_history_user_id_fkey' references nonexistent table"**
- You skipped Migration 1
- Go back and run Migration 1 first

---

## Migration 3: Fix INSERT Policy (CRITICAL)

⚠️ **This migration fixes the "Database error saving new user" error**

### Execute - Try Option A First

```sql
-- Add INSERT policy for authenticated users during signup
CREATE POLICY "Enable insert for authenticated users during signup"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Grant necessary permissions
GRANT INSERT ON public.users TO authenticated;
GRANT INSERT ON public.users TO service_role;
```

Click **Run**.

### Expected Success Output

```
Success. No rows returned
```

### Verify It Worked

```sql
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'users' AND cmd = 'INSERT';
```

Expected result:
```
policyname: "Enable insert for authenticated users during signup"
cmd: "INSERT"
```

### Common Errors

**Error: "policy already exists"**
- Migration 3 already ran successfully
- No action needed
- Proceed to testing OAuth

**Error: Policy created but OAuth still fails with "Database error"**

This means `auth.uid()` timing issue. Run **Option B** instead:

```sql
-- Remove the restrictive policy
DROP POLICY IF EXISTS "Enable insert for authenticated users during signup" ON public.users;

-- Create permissive policy (safe - see explanation below)
CREATE POLICY "Enable insert for service role"
  ON public.users
  FOR INSERT
  WITH CHECK (true);

-- Ensure permissions
GRANT INSERT ON public.users TO authenticated;
GRANT INSERT ON public.users TO service_role;
```

**Why Option B is safe:**
- Only the database trigger can INSERT (users cannot INSERT directly)
- Trigger runs as `SECURITY DEFINER` (elevated privileges)
- Foreign key constraint prevents invalid user IDs
- RLS still protects against direct user manipulation

---

## Verification Checklist

After running all 3 migrations:

### 1. Check Tables Exist

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Expected output:
- `assessment_history`
- `users`

### 2. Check Trigger Exists

```sql
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'users';
```

Expected output:
```
trigger_name: "on_auth_user_created"
event_object_table: "users"
```

### 3. Check All RLS Policies

```sql
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('users', 'assessment_history')
ORDER BY tablename, cmd;
```

Expected policies:

**users table:**
- INSERT: "Enable insert for authenticated users during signup" (or "Enable insert for service role")
- SELECT: "Users can view own profile"
- SELECT: "Admins can view all users"
- UPDATE: "Users can update own profile"

**assessment_history table:**
- SELECT: "Users can view own assessment history"
- SELECT: "Admins can view all assessment history"
- INSERT: "Users can insert own assessments"
- UPDATE: "Users can update own assessments"
- DELETE: "Users can delete own assessments"

### 4. Test Trigger Manually (Optional)

This verifies the trigger creates user profiles correctly:

```sql
-- Create test user
INSERT INTO auth.users (
  instance_id, id, aud, role, email, 
  encrypted_password, email_confirmed_at, 
  raw_user_meta_data, created_at, updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'test-trigger@example.com',
  crypt('test123', gen_salt('bf')),
  now(),
  '{"full_name": "Test Trigger User"}'::jsonb,
  now(),
  now()
);

-- Check trigger created profile
SELECT id, email, role, full_name 
FROM public.users 
WHERE email = 'test-trigger@example.com';

-- Should return one row with role 'user' (not 'admin')

-- Clean up
DELETE FROM public.users WHERE email = 'test-trigger@example.com';
DELETE FROM auth.users WHERE email = 'test-trigger@example.com';
```

If the profile wasn't created, the trigger or INSERT policy has an issue.

---

## Test OAuth Flow

After migrations are complete:

1. **Clear browser cookies completely**
   - Chrome: F12 → Application → Cookies → Delete all
   - Firefox: F12 → Storage → Cookies → Delete all

2. **Go to login page**: `https://your-app.vercel.app/auth/login`

3. **Click "Continue with Google"**

4. **Expected flow:**
   - Redirects to Google login
   - Select Google account
   - Redirects back to your app at `/profile`
   - Profile shows your email and "user" role
   - If email is babylon8@gmail.com, role should be "admin"

5. **Verify in Supabase**:
   - Dashboard → Authentication → Users (should see your user)
   - Dashboard → Table Editor → users (should see your profile)

---

## Troubleshooting Post-Migration

### Still Getting "Database error saving new user"

**Step 1: Check Supabase Logs**

1. Supabase Dashboard → Logs → Postgres Logs
2. Filter by time of last OAuth attempt
3. Look for RLS policy violation or permission denied

**Step 2: Verify Grants**

```sql
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'users' AND privilege_type = 'INSERT';
```

Expected grantees: `authenticated`, `service_role`

If missing:
```sql
GRANT INSERT ON public.users TO authenticated;
GRANT INSERT ON public.users TO service_role;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;
```

**Step 3: Use Permissive Policy**

If Option A (restrictive policy) doesn't work, use Option B (permissive policy) from Migration 3 section above.

### OAuth Redirects to Localhost

**Not a migration issue** - This is configuration:

1. Supabase Dashboard → Authentication → URL Configuration
2. Set **Site URL** to: `https://your-app.vercel.app`
3. Add **Redirect URL**: `https://your-app.vercel.app/auth/callback`
4. Update Google OAuth app with Vercel callback URLs
5. Wait 5 minutes for DNS propagation
6. Clear cookies and test again

### User Created But Role is NULL

**Check the trigger function:**

```sql
SELECT routine_name, routine_definition 
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';
```

The function should assign `'admin'` to babylon8@gmail.com and `'user'` to everyone else.

If trigger is missing or broken, re-run Migration 1.

---

## Rollback Instructions

### To Completely Reset Database

⚠️ **WARNING: This deletes ALL user data**

```sql
-- Drop all tables
DROP TABLE IF EXISTS public.assessment_history CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop trigger function
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Now re-run migrations 1, 2, 3 in order
```

### To Reset Only Migration 3 (INSERT Policy)

```sql
-- Remove INSERT policy
DROP POLICY IF EXISTS "Enable insert for authenticated users during signup" ON public.users;
DROP POLICY IF EXISTS "Enable insert for service role" ON public.users;

-- Revoke grants
REVOKE INSERT ON public.users FROM authenticated;
REVOKE INSERT ON public.users FROM service_role;

-- Now re-run Migration 3 (try Option A or B)
```

---

## Success Indicators

✅ All migrations successful when:

1. No errors during SQL execution
2. All verification queries return expected results
3. Google OAuth flow completes without database errors
4. User appears in both `auth.users` and `public.users` tables
5. babylon8@gmail.com gets `'admin'` role automatically
6. Regular users get `'user'` role automatically

---

## Next Steps After Successful Migrations

1. Deploy to Vercel (see `DEPLOYMENT_CHECKLIST.md`)
2. Update Supabase Site URL to Vercel domain
3. Update Google OAuth redirect URIs
4. Test all auth flows in production
5. Test admin dashboard access
6. Test assessment save/load functionality

---

## Quick Command Reference

```sql
-- List all tables
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- List all policies
SELECT tablename, policyname, cmd FROM pg_policies WHERE schemaname = 'public';

-- List all triggers
SELECT trigger_name, event_object_table FROM information_schema.triggers WHERE trigger_schema = 'public';

-- Check grants
SELECT grantee, table_name, privilege_type FROM information_schema.role_table_grants WHERE table_schema = 'public';

-- View trigger function
SELECT routine_name, routine_definition FROM information_schema.routines WHERE routine_schema = 'public';

-- Check if user exists in auth
SELECT id, email, created_at FROM auth.users WHERE email = 'your-email@example.com';

-- Check if user profile exists
SELECT id, email, role, full_name FROM public.users WHERE email = 'your-email@example.com';
```
