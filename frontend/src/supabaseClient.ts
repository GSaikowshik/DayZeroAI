import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY as string || "";

// 1. Give ourselves a loud warning if Vercel fails us
if (!supabaseUrl || !supabaseKey) {
  console.error('🚨 CRITICAL: Supabase keys are missing! Check Vercel Environment Variables.');
}

// 2. ONLY create the client if the keys actually exist to prevent the White Screen crash
export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null as unknown as ReturnType<typeof createClient>;