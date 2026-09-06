import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('[SHOS Backend] Connected to Supabase successfully at:', supabaseUrl);
  } catch (error) {
    console.warn('[SHOS Backend] Supabase init failed, using local operational store:', error.message);
  }
} else {
  console.warn('[SHOS Backend] Supabase credentials missing, running in local store mode.');
}

export { supabase };
