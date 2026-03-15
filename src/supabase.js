import { createClient } from '@supabase/supabase-js';

// Environment Variables mit Fallback für Produktion
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://db.smartbaden.de';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJyb2xlIjogImFub24iLCAiaXNzIjogInN1cGFiYXNlIiwgImlhdCI6IDE3MDAwMDAwMDAsICJleHAiOiAyMjAwMDAwMDAwfQ.Ln6kjS3VxpyhSMMQQv_GmSRrTHXGPHasjdoAUlSLeJk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
