import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/app/api/_lib/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";

/**
 * Exclui a conta e todos os dados do usuário AUTENTICADO — nunca de um id
 * arbitrário vindo do corpo da requisição. O id sempre vem da validação do
 * próprio token (authenticateRequest), então só é possível excluir a
 * própria conta.
 *
 * Exclui de auth.users, que em cascata (on delete cascade, ver
 * supabase/migrations/0001_init.sql) apaga também answers, user_profiles,
 * insights, contradictions, shares e referrals dessa pessoa.
 */
export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }
  const { userId } = auth;

  try {
    const admin = getSupabaseAdminClient();
    const { error } = await admin.auth.admin.deleteUser(userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ deleted: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown_error";
    console.error("Falha ao excluir conta:", message);
    return NextResponse.json({ error: "delete_failed" }, { status: 500 });
  }
}
