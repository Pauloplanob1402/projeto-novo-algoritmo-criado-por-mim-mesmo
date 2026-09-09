import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/app/api/_lib/auth";

interface ReferralRequestBody {
  slug: string;
}

/**
 * Registra que a pessoa autenticada (mesmo que anonimamente) chegou ao
 * UNSAY através de um link compartilhado. Toda a lógica (resolver o slug,
 * identificar o remetente, ignorar auto-referral, deduplicar) mora em
 * record_referral() no banco — o receptor não tem permissão de RLS para
 * inserir em nome do remetente, então a função roda com privilégio
 * elevado só para essa operação específica.
 */
export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }
  const { supabase } = auth;

  const body = (await request.json()) as ReferralRequestBody;
  if (!body?.slug) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { data, error } = await supabase
    .rpc("record_referral", { p_slug: body.slug })
    .maybeSingle<{ recorded: boolean }>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ recorded: data?.recorded ?? false });
}
