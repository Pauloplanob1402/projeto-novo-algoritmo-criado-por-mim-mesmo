import type { Contradiction } from "@/lib/profile";
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
