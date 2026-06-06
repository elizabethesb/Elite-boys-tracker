import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase credentials
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.VITE_SUPABASE_KEY || '';

let supabase = null;

function getClient() {
  if (!supabase && SUPABASE_URL && SUPABASE_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  return supabase;
}

export async function syncToSupabase(userId, data) {
  const client = getClient();
  if (!client) return;

  try {
    const { error } = await client
      .from('tracker_data')
      .upsert({
        user_id: userId,
        points: data.points,
        logs: data.logs,
        tasks: data.tasks,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (error) throw error;
  } catch (err) {
    console.error('Sync to Supabase failed:', err);
  }
}

export async function syncFromSupabase(userId) {
  const client = getClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('tracker_data')
      .select('points, logs, tasks')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (err) {
    console.error('Sync from Supabase failed:', err);
    return null;
  }
}

export async function signUpWithEmail(email, password) {
  const client = getClient();
  if (!client) throw new Error('Supabase not configured');

  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}`
    }
  });

  if (error) throw error;
  return data.user;
}

export async function signInWithEmail(email, password) {
  const client = getClient();
  if (!client) throw new Error('Supabase not configured');

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data.user;
}

export async function signOut() {
  const client = getClient();
  if (!client) return;

  await client.auth.signOut();
}

export function onAuthStateChange(callback) {
  const client = getClient();
  if (!client) return () => {};

  const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null);
  });

  return () => subscription?.unsubscribe();
}
