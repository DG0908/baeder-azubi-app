import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ummqefvkrpzqdznvcnek.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtbXFlZnZrcnB6cWR6bnZjbmVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwOTUzODgsImV4cCI6MjA4MjY3MTM4OH0.vhThw3PSucXZf9JeqPTYXwAMRS0VKbeMdWgM1yyXJC4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
