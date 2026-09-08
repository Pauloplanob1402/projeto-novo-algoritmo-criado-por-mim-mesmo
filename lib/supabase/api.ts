import type { Contradiction } from "@/lib/profile";
import type { QuestionStats, QuestionStatsMap } from "@/lib/algorithm";
import type { Question, UserProfile } from "@/types/question";

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

export function persistInsightRemote(
  accessToken: string,
  type: "pattern" | "contradiction",
  content: string
) {
  return postJson<{ id: string }>("/api/insights", accessToken, { type, content });
}

export function createShareRemote(accessToken: string, questionId: number, platform?: string) {
  return postJson<{ slug: string }>("/api/shares", accessToken, { questionId, platform });
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

