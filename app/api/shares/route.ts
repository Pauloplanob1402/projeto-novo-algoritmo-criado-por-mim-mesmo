import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/app/api/_lib/auth";

interface ShareRequestBody {
  questionId: number;
  optionIndex?: number;
  answerText?: string;
  platform?: string;
}

function generateSlug(): string {
  return Math.random().toString(36).slice(2, 8);
}

/**
 * Cria o registro do compartilhamento e devolve um slug único. Guarda um
 * retrato da resposta de quem está compartilhando (option_index/answer_text)
 * para a página pública /q/[slug] (Etapa 6) mostrar "seu amigo respondeu X"
 * sem precisar de acesso à tabela de respostas de ninguém.
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
    const { error } = await supabase.from("shares").insert({
      user_id: userId,
      question_id: body.questionId,
      slug,
      platform: body.platform ?? null,
      sender_option_index: body.optionIndex ?? null,
      sender_answer_text: body.answerText ?? null,
    });

    if (!error) {
      return NextResponse.json({ slug });
    }

    // colisão de slug (raríssima) — tenta outro
    slug = generateSlug();
  }

  return NextResponse.json({ error: "could_not_create_share" }, { status: 500 });
}
