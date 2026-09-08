"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "@/lib/supabase/config";

let browserClient: SupabaseClient | null = null;
let clientPromise: Promise<SupabaseClient | null> | null = null;

/**
 * Retorna o client singleton do Supabase para uso no navegador, ou `null`
 * se o projeto ainda não foi configurado (ver isSupabaseConfigured).
 *
 * `@supabase/supabase-js` é uma biblioteca relativamente pesada — em vez
 * de deixá-la no bundle inicial (bloqueando o parse/hydration na primeira
 * carga em celulares mais fracos), ela é importada dinamicamente aqui, e o
 * Next.js a separa num chunk próprio, carregado em paralelo assim que
 * alguma ação de sessão/autenticação realmente precisa dela.
 */
export function getSupabaseBrowserClient(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured) return Promise.resolve(null);
  if (browserClient) return Promise.resolve(browserClient);
  if (clientPromise) return clientPromise;

  clientPromise = import("@supabase/supabase-js").then(({ createClient }) => {
    browserClient = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    return browserClient;
  });

  return clientPromise;
}
