import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/config";

/**
 * Cliente server-side que age "como o usuário": recebe o access token
 * enviado pelo navegador (Authorization: Bearer <token>) e usa a anon key,
 * então RLS continua valendo normalmente (auth.uid() = o usuário do token).
 *
 * Isso é diferente de uma service role key: aqui o servidor nunca tem mais
 * acesso do que o próprio usuário teria.
 */
export function getSupabaseServerClient(accessToken: string) {
  return createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  });
}

/**
 * Cliente server-side sem usuário — para dados públicos/agregados que não
 * dependem de RLS por usuário (ex.: estatísticas de perguntas).
 */
export function getSupabaseAnonClient() {
  return createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });
}
