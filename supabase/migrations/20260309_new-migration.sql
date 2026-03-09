-- Migration: Create startup_ideas table
-- Project: xtagjkctbyxdmesbfkcx
-- Run this via: supabase db push  OR paste directly into the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS startup_ideas (
  id             BIGSERIAL PRIMARY KEY,
  original_idea  TEXT        NOT NULL,
  viability_score INT        NOT NULL,
  analysis_json  JSONB       NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index on viability_score for fast sorting/filtering
CREATE INDEX IF NOT EXISTS idx_startup_ideas_score ON startup_ideas (viability_score DESC);

-- Optional: Enable Row Level Security (RLS) — recommended for Supabase
ALTER TABLE startup_ideas ENABLE ROW LEVEL SECURITY;
