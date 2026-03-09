import { createClient } from '@supabase/supabase-js';

// Hardcoding for the hackathon bypass! 
const supabaseUrl = "https://xtagjkctbyxdmesbfkcx.supabase.co"; // Replace with your actual URL
const supabaseKey = "sb_publishable_aMXeO6DWHxgGbTb1g6zrXQ_cZi8xjS5"; // Replace with your actual long Anon key

export const supabase = createClient(supabaseUrl, supabaseKey);