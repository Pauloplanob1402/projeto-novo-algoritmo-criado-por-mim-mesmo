import { NextResponse } from "next/server";
import { resolveShareServer } from "@/lib/supabase/shareResolver";

/**
 * Resolve publicamente um link /q/[slug]: devolve a pergunta e a resposta
 * de quem compartilhou. Não exige autenticação — é a porta de entrada para
 * quem nunca usou o UNSAY (fluxo "responda primeiro, cadastre-se depois").
 */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const share = await resolveShareServer(slug);

  if (!share) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ share });
}
