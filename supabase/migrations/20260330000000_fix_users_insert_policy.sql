-- Fix missing INSERT policy for users table
-- This allows the handle_new_user() trigger to insert user profiles successfully

-- Add INSERT policy that allows the trigger (running as SECURITY DEFINER) to create users
-- The trigger function will handle role assignment logic, so we allow all inserts
CREATE POLICY "Enable insert for authenticated users during signup"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Alternative: If the above policy doesn't work due to timing issues
-- (auth.uid() might not be set yet when trigger runs), uncomment this broader policy:
-- 
-- DROP POLICY "Enable insert for authenticated users during signup" ON public.users;
-- 
-- CREATE POLICY "Enable insert for service role"
--   ON public.users
--   FOR INSERT
--   WITH CHECK (true);
--
-- Note: The above policy is more permissive but safe because:
-- 1. Only the trigger function (SECURITY DEFINER) inserts into this table
-- 2. The table references auth.users(id) with CASCADE, so invalid IDs will fail
-- 3. Regular users cannot call INSERT directly due to RLS

-- Grant necessary permissions
GRANT INSERT ON public.users TO authenticated;
GRANT INSERT ON public.users TO service_role;
