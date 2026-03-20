import { createClient } from '@supabase/supabase-js';

// Secure-Backend-Flag (gleiche Logik wie in secureApiClient.js)
const ENABLE_SECURE_BACKEND_API = String(import.meta.env.VITE_ENABLE_SECURE_BACKEND_API || '')
  .trim()
  .toLowerCase() === 'true';

// Environment Variables mit Fallback für Produktion
const supabaseUrl = String(import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = String(import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

// Wenn Secure-Backend aktiv UND keine Supabase-Credentials → kein Client nötig
// Wenn Supabase-Credentials fehlen aber Flag aus → Fallback auf Produktion
let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else if (!ENABLE_SECURE_BACKEND_API) {
  // Legacy-Fallback: Produktions-Supabase direkt
  supabase = createClient(
    'https://db.smartbaden.de',
    'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJyb2xlIjogImFub24iLCAiaXNzIjogInN1cGFiYXNlIiwgImlhdCI6IDE3MDAwMDAwMDAsICJleHAiOiAyMjAwMDAwMDAwfQ.Ln6kjS3VxpyhSMMQQv_GmSRrTHXGPHasjdoAUlSLeJk'
  );
} else {
  if (import.meta.env.DEV) {
    console.info('[supabase] Secure backend API enabled — Supabase client disabled.');
  }
}

export { supabase };
