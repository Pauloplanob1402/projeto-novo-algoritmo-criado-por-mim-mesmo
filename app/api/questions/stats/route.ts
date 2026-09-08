import { NextResponse } from "next/server";
import { getSupabaseAnonClient } from "@/lib/supabase/serverClient";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const revalidate = 60; // dado agregado, cache de 1 minuto já é suficiente

/**
 * Estatísticas agregadas por pergunta (quantas respostas, quantos
 * compartilhamentos). Não expõe respostas individuais — não precisa de
 * autenticação, usa a anon key sem token de usuário.
 */
export async function GET() {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ stats: [] });
  }

  const supabase = getSupabaseAnonClient();
  const { data, error } = await supabase.rpc("get_question_stats");

  if (error) {
    return NextResponse.json({ stats: [], error: error.message }, { status: 200 });
  }

  return NextResponse.json({ stats: data ?? [] });
}
