import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/app/api/_lib/auth";
import { applyAnswerToProfile, checkForNewContradiction, INITIAL_PROFILE } from "@/lib/profile";
import type { ProfileDimension, Question, UserProfile } from "@/types/question";

interface AnswerRequestBody {
  question: Pick<Question, "id" | "dims" | "category" | "type" | "options">;
  optionIndex: number;
  answerText: string;
}

const PROFILE_COLUMNS: Record<ProfileDimension, string> = {
  freedom: "freedom_score",
  security: "security_score",
  money: "money_score",
  relationships: "relationship_score",
  status: "status_score",
  risk: "risk_score",
  moral: "moral_score",
};

function rowToProfile(row: Record<string, number> | null): UserProfile {
  if (!row) return { ...INITIAL_PROFILE };
  const profile = { ...INITIAL_PROFILE };
  for (const [dim, column] of Object.entries(PROFILE_COLUMNS) as [ProfileDimension, string][]) {
    if (typeof row[column] === "number") profile[dim] = row[column];
  }
  return profile;
}

function profileToRow(profile: UserProfile) {
  const row: Record<string, number> = {};
  for (const [dim, column] of Object.entries(PROFILE_COLUMNS) as [ProfileDimension, string][]) {
    row[column] = Math.round(profile[dim]);
  }
  return row;
}

export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }
  const { supabase, userId } = auth;

  const body = (await request.json()) as AnswerRequestBody;
  const { question, optionIndex, answerText } = body;

  if (!question?.id || typeof optionIndex !== "number") {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
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

  const currentProfile = rowToProfile(profileRow);
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
