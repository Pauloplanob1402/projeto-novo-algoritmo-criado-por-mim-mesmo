"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "@/lib/supabase/config";

let browserClient: SupabaseClient | null = null;

/**
 * Retorna o client singleton do Supabase para uso no navegador, ou `null`
 * se o projeto ainda não foi configurado (ver isSupabaseConfigured). Nunca
 * usa a service role key aqui — só a anon key, protegida por RLS.
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (browserClient) return browserClient;

  browserClient = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
  return browserClient;
}
