import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "@/lib/supabase/config";

/**
 * Cliente com a service role key — ignora RLS completamente. Só pode ser
 * importado por código server-only (Route Handlers), NUNCA por um
 * componente client. Usado hoje só para excluir a conta do próprio
 * usuário autenticado (nunca de terceiros — quem chama sempre valida o
 * token do usuário antes de usar isso, ver app/api/account/delete/route.ts).
 */
export function getSupabaseAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada");
  }
  return createClient(SUPABASE_URL!, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
