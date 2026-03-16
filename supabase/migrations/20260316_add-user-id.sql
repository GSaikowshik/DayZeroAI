-- Migration: Add user_id column for Search History feature
-- Run via: supabase db push  OR paste directly into the Supabase SQL Editor

-- 1. Add user_id column (nullable so existing rows aren't broken)
ALTER TABLE startup_ideas
  ADD COLUMN IF NOT EXISTS user_id UUID;

-- 2. Index on user_id + created_at for fast history lookups
CREATE INDEX IF NOT EXISTS idx_startup_ideas_user_history
  ON startup_ideas (user_id, created_at DESC);

-- 3. RLS policy: users can only read their own rows
CREATE POLICY "Users can read own ideas"
  ON startup_ideas
  FOR SELECT
  USING (auth.uid() = user_id);
