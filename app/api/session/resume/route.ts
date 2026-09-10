import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/app/api/_lib/auth";
import { profileRowToProfile } from "@/lib/profile";
import type { AnsweredQuestion, Category, ProfileDimension, QuestionType } from "@/types/question";

interface AnswerJoinRow {
  question_id: number;
  option_index: number;
  answer_text: string;
  created_at: string;
  questions: {
    category: Category;
    type: QuestionType;
    dims: ProfileDimension[];
  } | null;
}

/**
 * Devolve o perfil e o histórico de respostas do usuário autenticado, na
 * ordem em que foram dadas. Usado no carregamento do app para decidir se
 * a pessoa deve ver a tela de intro (primeira vez) ou continuar
 * diretamente de onde parou (já respondeu algo antes — típico depois de
 * um login que recarrega a página, ver hooks/useUnsayFlow.ts).
 */
export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }
  const { supabase, userId } = auth;

  const [{ data: profileRow }, { data: answerRows }] = await Promise.all([
    supabase.from("user_profiles").select("*").eq("user_id", userId).maybeSingle(),
    supabase
      .from("answers")
      .select("question_id, option_index, answer_text, created_at, questions(category, type, dims)")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .returns<AnswerJoinRow[]>(),
  ]);

  const profile = profileRowToProfile(profileRow);

  const answered: AnsweredQuestion[] = (answerRows ?? [])
    .filter((row) => row.questions !== null)
    .map((row) => ({
      id: row.question_id,
      category: row.questions!.category,
      type: row.questions!.type,
      optionIndex: row.option_index,
      answerText: row.answer_text,
      dims: row.questions!.dims,
      answeredAt: new Date(row.created_at).getTime(),
    }));

  return NextResponse.json({ profile, answered });
}
