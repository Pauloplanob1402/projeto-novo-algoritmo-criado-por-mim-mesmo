export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Enquanto o projeto Supabase não é criado/configurado no Vercel, o app
 * continua funcionando 100% em memória (comportamento da Etapa 1) em vez
 * de quebrar. Assim que as env vars entrarem, a persistência real liga
 * sozinha, sem precisar trocar código.
 */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
