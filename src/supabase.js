import { createClient } from '@supabase/supabase-js';

// Environment Variables mit Fallback für Produktion
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ummqefvkrpzqdznvcnek.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtbXFlZnZrcnB6cWR6bnZjbmVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwOTUzODgsImV4cCI6MjA4MjY3MTM4OH0.vhThw3PSucXZf9JeqPTYXwAMRS0VKbeMdWgM1yyXJC4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
