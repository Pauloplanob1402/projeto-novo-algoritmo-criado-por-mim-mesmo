import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/app/api/_lib/auth";

interface ShareRequestBody {
  questionId: number;
  platform?: string;
}

function generateSlug(): string {
  return Math.random().toString(36).slice(2, 8);
}

/**
 * Cria o registro do compartilhamento e devolve um slug único. A página
 * pública /q/[slug] que resolve esse link para quem recebe (Tela 7 do
 * briefing, fluxo "responda primeiro, cadastre-se depois") é escopo da
 * Etapa 6 — aqui só garantimos que o convite já fica registrado de
 * verdade no banco desde já.
 */
export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }
  const { supabase, userId } = auth;

  const body = (await request.json()) as ShareRequestBody;
  if (!body?.questionId) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  let slug = generateSlug();
  for (let attempt = 0; attempt < 3; attempt++) {
    const { error } = await supabase
      .from("shares")
      .insert({ user_id: userId, question_id: body.questionId, slug, platform: body.platform ?? null });

    if (!error) {
      return NextResponse.json({ slug });
    }

    // colisão de slug (raríssima) — tenta outro
    slug = generateSlug();
  }

  return NextResponse.json({ error: "could_not_create_share" }, { status: 500 });
}
