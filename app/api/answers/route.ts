import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/app/api/_lib/auth";
import { isRateLimited } from "@/lib/rateLimit";
import {
  applyAnswerToProfile,
  checkForNewContradiction,
  profileRowToProfile,
  profileToRow,
} from "@/lib/profile";
import { sanitizeUserText } from "@/lib/sanitize";
import type { Question } from "@/types/question";

interface AnswerRequestBody {
  question: Pick<Question, "id" | "dims" | "category" | "type" | "options">;
  optionIndex: number;
  answerText: string;
}


export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }
  const { supabase, userId } = auth;

  const body = (await request.json()) as AnswerRequestBody;
  const { question, optionIndex } = body;
  const answerText = sanitizeUserText(body.answerText ?? "", 200);

  if (!question?.id || typeof optionIndex !== "number" || !answerText) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  // no máximo 300 respostas por hora por pessoa — bem acima de qualquer
  // uso real (o banco tem só 100 perguntas), só pra travar automação/abuso
  if (await isRateLimited(supabase, "answers", "user_id", userId, 60, 300)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  // 1) grava a resposta (upsert: responder de novo a mesma pergunta atualiza)
  const { error: answerError } = await supabase
    .from("answers")
    .upsert(
      { user_id: userId, question_id: question.id, option_index: optionIndex, answer_text: answerText },
      { onConflict: "user_id,question_id" }
    );

  if (answerError) {
    return NextResponse.json({ error: answerError.message }, { status: 500 });
  }

  // 2) atualiza o vetor de perfil (leitura + escrita — sem overengineering
  //    com função atômica no banco por enquanto, ver README da Etapa 2)
  const { data: profileRow } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  const currentProfile = profileRowToProfile(profileRow);
  const nextProfile = applyAnswerToProfile(currentProfile, { dims: question.dims }, optionIndex);

  const { error: profileError } = await supabase
    .from("user_profiles")
    .upsert({ user_id: userId, ...profileToRow(nextProfile) }, { onConflict: "user_id" });

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  // 3) checa contradição nova e já registra (idempotente via unique constraint)
  const { data: existingContradictions } = await supabase
    .from("contradictions")
    .select("dimension_a, dimension_b")
    .eq("user_id", userId);

  const alreadyFound = (existingContradictions ?? []).map((c) => `${c.dimension_a}-${c.dimension_b}`);
  const contradiction = checkForNewContradiction(nextProfile, alreadyFound);

  if (contradiction) {
    await supabase.from("contradictions").insert({
      user_id: userId,
      dimension_a: contradiction.a,
      dimension_b: contradiction.b,
      description: `Tensão entre ${contradiction.a} e ${contradiction.b} detectada após ${answerText}.`,
    });
  }

  // 4) percentual real de comparação social (função agregada, sem
  //    expor respostas individuais de outros usuários)
  const optionsCount = question.options?.length || 2;
  const { data: percentData } = await supabase.rpc("get_answer_percent", {
    p_question_id: question.id,
    p_option_index: optionIndex,
  });

  const percentRow = Array.isArray(percentData) ? percentData[0] : percentData;
  const realPercent: number | null = percentRow?.percent ?? null;
  const totalAnswers: number = percentRow?.total_answers ?? 0;

  return NextResponse.json({
    profile: nextProfile,
    contradiction,
    percent: realPercent,
    totalAnswers,
    optionsCount,
  });
}
