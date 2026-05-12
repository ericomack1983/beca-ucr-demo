"use client";

import { supabase } from './supabase';

export interface Session {
  studentId: string;
  email: string;
  name: string;
  token: string;
}

export async function login(email: string, password: string): Promise<Session | null> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user || !data.session) return null;
  return {
    studentId: data.user.id,
    email: data.user.email ?? email,
    name: data.user.user_metadata?.full_name ?? data.user.email?.split('@')[0] ?? 'Estudiante',
    token: data.session.access_token,
  };
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  if (!data.session) return null;
  const user = data.session.user;
  return {
    studentId: user.id,
    email: user.email ?? '',
    name: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Estudiante',
    token: data.session.access_token,
  };
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getSession()) !== null;
}
