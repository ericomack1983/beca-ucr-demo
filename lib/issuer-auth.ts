"use client";

import { supabase } from './supabase';

export interface IssuerSession {
  email: string;
  name: string;
  token: string;
}

export async function issuerLogin(email: string, password: string): Promise<IssuerSession | null> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user || !data.session) return null;
  return {
    email: data.user.email ?? email,
    name: data.user.user_metadata?.full_name ?? data.user.email?.split('@')[0] ?? 'Administrador',
    token: data.session.access_token,
  };
}

export async function issuerLogout(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getIssuerSession(): Promise<IssuerSession | null> {
  const { data } = await supabase.auth.getSession();
  if (!data.session) return null;
  const user = data.session.user;
  return {
    email: user.email ?? '',
    name: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Administrador',
    token: data.session.access_token,
  };
}

export async function isIssuerAuthenticated(): Promise<boolean> {
  return (await getIssuerSession()) !== null;
}
