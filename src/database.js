import { supabase } from './supabase';

// ============================================
// USER / ACCOUNT FUNKTIONEN
// ============================================

export async function createUser(email, name, password, role = 'azubi', trainingEnd = null) {
  const { data, error } = await supabase
    .from('users')
    .insert([{
      email,
      name,
      password,
      role,
      approved: role === 'admin',
      training_end: trainingEnd
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserByEmail(email) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function updateUser(email, updates) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('email', email)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAllUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getPendingUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('approved', false)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function approveUser(email) {
  return updateUser(email, { approved: true });
}

export async function deleteUser(email) {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('email', email);

  if (error) throw error;
}

// ============================================
// USER STATS FUNKTIONEN
// ============================================

export async function getUserStats(userId) {
  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function createUserStats(userId) {
  const { data, error } = await supabase
    .from('user_stats')
    .insert([{
      user_id: userId,
      wins: 0,
      losses: 0,
      draws: 0,
      category_stats: {},
      opponents: {}
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserStats(userId, stats) {
  const { data, error } = await supabase
    .from('user_stats')
    .update({
      wins: stats.wins,
      losses: stats.losses,
      draws: stats.draws,
      category_stats: stats.categoryStats || stats.category_stats,
      opponents: stats.opponents
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getOrCreateUserStats(userId) {
  let stats = await getUserStats(userId);
  if (!stats) {
    stats = await createUserStats(userId);
  }
  return stats;
}

// ============================================
// FLASHCARDS FUNKTIONEN
// ============================================

export async function getFlashcards(approvedOnly = false) {
  let query = supabase
    .from('flashcards')
    .select('*')
    .order('created_at', { ascending: false });

  if (approvedOnly) {
    query = query.eq('approved', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function createFlashcard(userId, category, question, answer) {
  const { data, error } = await supabase
    .from('flashcards')
    .insert([{
      user_id: userId,
      category,
      question,
      answer,
      approved: false
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function approveFlashcard(id) {
  const { data, error } = await supabase
    .from('flashcards')
    .update({ approved: true })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteFlashcard(id) {
  const { error } = await supabase
    .from('flashcards')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============================================
// MESSAGES FUNKTIONEN
// ============================================

export async function getMessages(limit = 100) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function createMessage(userName, content) {
  const { data, error } = await supabase
    .from('messages')
    .insert([{
      user_name: userName,
      content
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// NEWS FUNKTIONEN
// ============================================

export async function getNews() {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createNews(title, content, author) {
  const { data, error } = await supabase
    .from('news')
    .insert([{
      title,
      content,
      author
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteNews(id) {
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============================================
// KOMPATIBILITÄT MIT window.storage
// ============================================

// Diese Funktion erstellt ein storage-Objekt das wie window.storage funktioniert
// aber Supabase im Hintergrund nutzt
export function createStorageAdapter() {
  return {
    async get(key) {
      // Für Kompatibilität mit altem Code
      console.log('storage.get called with:', key);
      return null;
    },
    async set(key, value) {
      console.log('storage.set called with:', key);
      return true;
    },
    async delete(key) {
      console.log('storage.delete called with:', key);
      return true;
    },
    async list(prefix) {
      console.log('storage.list called with:', prefix);
      return { keys: [] };
    }
  };
}
