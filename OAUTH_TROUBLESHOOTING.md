# OAuth "Database Error Saving New User" Troubleshooting

This guide will help you fix the "Database error saving new user" error that occurs during Google OAuth login.

> **Quick Start**: For step-by-step migration execution, see [MIGRATION_QUICK_REFERENCE.md](./MIGRATION_QUICK_REFERENCE.md)

---

## Root Cause

The error occurs because:
1. ✅ OAuth callback successfully exchanges code for session
2. ✅ Supabase creates user in `auth.users` table
3. ❌ Database trigger `handle_new_user()` tries to INSERT into `public.users` table
4. ❌ RLS (Row Level Security) blocks the INSERT because no INSERT policy exists
5. ❌ OAuth fails, user sees "Database error saving new user"

---

## Solution: Run Migration 3

### Step 1: Open Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in left sidebar
4. Click **New Query**

### Step 2: Run the Fix (Try Option A First)

**Option A: Restrictive Policy (Recommended)**

This policy only allows INSERTs when the user ID matches the authenticated user:

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

Click **Run** (or Ctrl+Enter).

Expected result: `Success. No rows returned`

### Step 3: Verify the Policy Exists

```sql
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'users' AND cmd = 'INSERT';
```

Expected result:
```
policyname: "Enable insert for authenticated users during signup"
cmd: "INSERT"
```

### Step 4: Test Google Login Again

1. **Clear browser cookies** (important!)
   - Chrome/Edge: F12 → Application → Storage → Cookies → Delete all
   - Firefox: F12 → Storage → Cookies → Delete all
   
2. Go to your login page

3. Click "Continue with Google"

4. If successful:
   - You'll be redirected to `/profile`
   - Your user appears in Supabase Dashboard → Authentication → Users
   - Your profile appears in Table Editor → users

---

## If Option A Doesn't Work

**Option B: Permissive Policy (Fallback)**

If you still get the error, it means `auth.uid()` is not set when the trigger runs (timing issue).

### Run This Alternative:

```sql
-- Remove the restrictive policy
DROP POLICY IF EXISTS "Enable insert for authenticated users during signup" ON public.users;

-- Create more permissive policy
CREATE POLICY "Enable insert for service role"
  ON public.users
  FOR INSERT
  WITH CHECK (true);

-- Ensure permissions
GRANT INSERT ON public.users TO authenticated;
GRANT INSERT ON public.users TO service_role;
```

**Why this is safe:**
- Only the `handle_new_user()` trigger can INSERT into `public.users`
- The trigger runs as `SECURITY DEFINER` (elevated privileges)
- The table has `REFERENCES auth.users(id)` constraint, so invalid IDs fail
- Regular users cannot directly INSERT due to RLS

### Test Again

1. Clear cookies again
2. Try Google login
3. Should now work

---

## Verification Checklist

After running the migration, verify everything works:

### 1. Check RLS Policies

```sql
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  cmd,
  CASE WHEN qual IS NOT NULL THEN 'Has USING clause' ELSE 'No USING clause' END as using_clause,
  CASE WHEN with_check IS NOT NULL THEN 'Has WITH CHECK clause' ELSE 'No WITH CHECK clause' END as with_check_clause
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY cmd;
```

Expected policies:
- **SELECT**: "Users can view own profile" + "Admins can view all users"
- **UPDATE**: "Users can update own profile"
- **INSERT**: "Enable insert for authenticated users during signup" OR "Enable insert for service role"

### 2. Check Trigger Exists

```sql
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users';
```

Expected result:
```
trigger_name: "on_auth_user_created"
event_manipulation: "INSERT"
event_object_table: "users"
```

### 3. Check Grants

```sql
SELECT 
  grantee, 
  privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'users' AND privilege_type = 'INSERT';
```

Expected grantees: `authenticated`, `service_role`

---

## Still Having Issues?

### Check Supabase Logs

1. Go to Supabase Dashboard → Logs
2. Filter by "Error"
3. Look for detailed error messages

Common errors and fixes:

**Error: "policy already exists"**
```sql
-- Check existing policies
SELECT policyname FROM pg_policies WHERE tablename = 'users';

-- If INSERT policy exists, no need to create it again
```

**Error: "permission denied for table users"**
```sql
-- Ensure grants are set
GRANT INSERT ON public.users TO authenticated;
GRANT INSERT ON public.users TO service_role;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;
```

**Error: "duplicate key value violates unique constraint"**
- This means the user already exists in `public.users`
- You tried to sign up twice with the same email
- Solution: Delete the user from both tables:
```sql
-- First, find the user ID
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Delete from both tables
DELETE FROM public.users WHERE email = 'your-email@example.com';
DELETE FROM auth.users WHERE email = 'your-email@example.com';

-- Try signing up again
```

---

## Advanced Debugging

### Test the Trigger Manually

```sql
-- Create a test user in auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'test@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"full_name": "Test User"}'::jsonb,
  now(),
  now()
);

-- Check if trigger created the user profile
SELECT * FROM public.users WHERE email = 'test@example.com';

-- Clean up test user
DELETE FROM public.users WHERE email = 'test@example.com';
DELETE FROM auth.users WHERE email = 'test@example.com';
```

If the trigger test fails, the issue is with the trigger function itself, not just the RLS policy.

---

## Contact Points

If none of the above works:

1. **Check Migration Files**:
   - Verify you ran migration 1: `20260318000001_create_users_table.sql`
   - Verify you ran migration 2: `20260318000002_create_assessment_history_table.sql`
   - Verify you ran migration 3: `20260330000000_fix_users_insert_policy.sql`

2. **Supabase Support**:
   - Check Supabase Discord: https://discord.supabase.com
   - Search for "RLS INSERT policy trigger" issues

3. **Export Your Schema** (for debugging):
```sql
-- Get full schema
SELECT 
  'Policies:' as section,
  policyname as name,
  cmd as operation
FROM pg_policies 
WHERE tablename = 'users'

UNION ALL

SELECT 
  'Triggers:' as section,
  trigger_name as name,
  event_manipulation as operation
FROM information_schema.triggers
WHERE event_object_table = 'users'

UNION ALL

SELECT 
  'Grants:' as section,
  privilege_type as name,
  grantee as operation
FROM information_schema.role_table_grants 
WHERE table_name = 'users';
```

---

## Success Indicators

You'll know it's working when:

1. ✅ Google login redirects to `/profile` (not back to login)
2. ✅ No error message displayed
3. ✅ User appears in Supabase Dashboard → Authentication → Users
4. ✅ User profile appears in Table Editor → public.users with correct role
5. ✅ If you used babylon8@gmail.com, role should be 'admin'
6. ✅ Admin dashboard at `/admin` is accessible (for babylon8@gmail.com only)

---

## Prevention

To avoid this issue in future projects:

1. **Always create INSERT policies** when using triggers with RLS-enabled tables
2. **Use `SECURITY DEFINER`** for trigger functions that need elevated privileges
3. **Test triggers manually** before deploying to production
4. **Grant necessary permissions** to `authenticated` and `service_role` roles
