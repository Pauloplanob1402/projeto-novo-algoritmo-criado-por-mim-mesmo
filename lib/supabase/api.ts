import type { Contradiction } from "@/lib/profile";
import type { QuestionStats, QuestionStatsMap } from "@/lib/algorithm";
import type { ResolvedShare } from "@/lib/supabase/shareResolver";
import type { Question, UserProfile } from "@/types/question";

export type { ResolvedShare };

interface SubmitAnswerResult {
  profile: UserProfile;
  contradiction: Contradiction | null;
  percent: number | null;
  totalAnswers: number;
  optionsCount: number;
}

async function postJson<T>(path: string, accessToken: string, body: unknown): Promise<T | null> {
  try {
    const res = await fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export function submitAnswerRemote(
  accessToken: string,
  question: Pick<Question, "id" | "dims" | "category" | "type" | "options">,
  optionIndex: number,
  answerText: string
) {
  return postJson<SubmitAnswerResult>("/api/answers", accessToken, { question, optionIndex, answerText });
}

export function generateInsightRemote(
  accessToken: string,
  payload: {
    kind: "pattern" | "contradiction";
    profileSummary: string;
    dimensionsToMention: string[];
    recentAnswers: string[];
    fallback: string;
  }
) {
  return postJson<{ content: string; source: "gemini" | "fallback" }>(
    "/api/ai/insight",
    accessToken,
    payload
  );
}

export function createShareRemote(
  accessToken: string,
  questionId: number,
  answer: { optionIndex: number; answerText: string },
  platform?: string
) {
  return postJson<{ slug: string }>("/api/shares", accessToken, {
    questionId,
    optionIndex: answer.optionIndex,
    answerText: answer.answerText,
    platform,
  });
}

/** Resolve publicamente um link /q/[slug] — sem autenticação. */
export async function resolveShareRemote(slug: string): Promise<ResolvedShare | null> {
  try {
    const res = await fetch(`/api/shares/${slug}`);
    if (!res.ok) return null;
    const body = (await res.json()) as { share: ResolvedShare };
    return body.share;
  } catch {
    return null;
  }
}

/** Registra que a sessão atual chegou via um link compartilhado. */
export function recordReferralRemote(accessToken: string, slug: string) {
  return postJson<{ recorded: boolean }>("/api/referrals", accessToken, { slug });
}

interface RawQuestionStatsRow {
  question_id: number;
  times_answered: number;
  times_shared: number;
  share_rate: number;
}

/**
 * Busca as estatísticas agregadas de uso das perguntas (Etapa 4). Rota
 * pública, sem token — retorna vazio silenciosamente se algo falhar, e o
 * algoritmo simplesmente opera sem esse reforço (ver lib/algorithm.ts).
 */
export async function fetchQuestionStats(): Promise<QuestionStatsMap> {
  try {
    const res = await fetch("/api/questions/stats");
    if (!res.ok) return new Map();
    const body = (await res.json()) as { stats: RawQuestionStatsRow[] };
    const map: QuestionStatsMap = new Map();
    for (const row of body.stats ?? []) {
      const stats: QuestionStats = {
        timesAnswered: row.times_answered,
        timesShared: row.times_shared,
        shareRate: row.share_rate,
      };
      map.set(row.question_id, stats);
    }
    return map;
  } catch {
    return new Map();
  }
}

