import type { Category, Question } from "@/types/question";

/**
 * Pesos do algoritmo de seleção da próxima pergunta.
 * Projetados para serem recalibrados sem alterar a lógica de pontuação.
 */
export const QUESTION_WEIGHTS = {
  curiosity: 0.13,
  comparison: 0.13,
  contradiction: 0.18,
  friendShare: 0.09,
  depth: 0.13,
  novelty: 0.09,
  categoryRelevance: 0.13,
  performance: 0.12, // uso real (Etapa 4) — só entra em jogo quando há dados
} as const;

const MAX_TOP_CANDIDATES = 6;

/** Estatísticas de uso real de uma pergunta, vindas de get_question_stats(). */
export interface QuestionStats {
  timesAnswered: number;
  timesShared: number;
  shareRate: number;
}

export type QuestionStatsMap = Map<number, QuestionStats>;

/**
 * Penaliza repetir a mesma categoria da(s) última(s) pergunta(s) respondida(s),
 * para forçar diversidade temática (amor -> dinheiro -> identidade -> ...)
 * em vez de agrupar perguntas parecidas em sequência.
 */
function categoryRelevance(category: Category, recentCategories: Category[]): number {
  const recent = recentCategories.slice(-2);
  if (recent.length === 0) return 8;
  if (recent[recent.length - 1] === category) return 1.5;
  if (recent.includes(category)) return 4;
  return 9;
}

/**
 * Pontuação de "performance histórica" (0–10) a partir do uso real:
 * combina a taxa de compartilhamento observada (o que a galera realmente
 * manda pra frente, não só o que a gente *acha* que é compartilhável) com
 * um bônus de exploração para perguntas ainda pouco respondidas — assim
 * o banco inteiro de 100 perguntas continua circulando, em vez de
 * convergir sempre para as mesmas favoritas.
 */
function performanceScore(questionId: number, stats: QuestionStatsMap | undefined): number {
  if (!stats || stats.size === 0) return 5; // sem dados ainda: neutro

  const entry = stats.get(questionId);
  const answeredCounts = Array.from(stats.values()).map((s) => s.timesAnswered);
  const maxAnswered = Math.max(1, ...answeredCounts);

  if (!entry || entry.timesAnswered === 0) {
    return 8; // pergunta nunca (ou quase nunca) respondida: prioriza exploração
  }

  const exploitation = Math.min(10, entry.shareRate * 10); // taxa de compartilhamento observada
  const exposure = entry.timesAnswered / maxAnswered; // 0–1: quão "batida" já está
  const explorationBonus = (1 - exposure) * 4; // perguntas menos vistas ganham empurrão

  return Math.max(0, Math.min(10, exploitation * 0.6 + explorationBonus));
}

function scoreQuestion(
  question: Question,
  recentCategories: Category[],
  stats: QuestionStatsMap | undefined
): number {
  const novelty = 10; // perguntas já vistas nesta sessão são filtradas antes
  const relevance = categoryRelevance(question.category, recentCategories);
  const performance = performanceScore(question.id, stats);

  return (
    question.curiosity * QUESTION_WEIGHTS.curiosity +
    question.comparison * QUESTION_WEIGHTS.comparison +
    question.contradiction * QUESTION_WEIGHTS.contradiction +
    question.friendShare * QUESTION_WEIGHTS.friendShare +
    question.depth * QUESTION_WEIGHTS.depth +
    novelty * QUESTION_WEIGHTS.novelty +
    relevance * QUESTION_WEIGHTS.categoryRelevance +
    performance * QUESTION_WEIGHTS.performance
  );
}

interface PickNextQuestionParams {
  pool: Question[];
  seenIds: Set<number>;
  recentCategories: Category[];
  stats?: QuestionStatsMap;
  random?: () => number;
}

/**
 * Escolhe a próxima pergunta considerando: respostas/categorias anteriores,
 * diversidade, curiosidade, potencial de comparação/contradição/compartilhamento,
 * novidade e — a partir da Etapa 4 — desempenho real de uso quando disponível
 * (`stats`). Nunca puramente aleatória, mas com uma leve amostragem entre as
 * melhores candidatas para não parecer determinística.
 */
export function pickNextQuestion({
  pool,
  seenIds,
  recentCategories,
  stats,
  random = Math.random,
}: PickNextQuestionParams): Question {
  let unseen = pool.filter((q) => !seenIds.has(q.id));

  // Banco esgotado (demo/uso muito longo): recomeça o ciclo.
  if (unseen.length === 0) {
    unseen = pool.slice();
  }

  const lastCategory = recentCategories[recentCategories.length - 1];
  const diversePool = unseen.filter((q) => q.category !== lastCategory);
  const candidates = diversePool.length >= 4 ? diversePool : unseen;

  const scored = candidates
    .map((question) => ({ question, score: scoreQuestion(question, recentCategories, stats) }))
    .sort((a, b) => b.score - a.score);

  const top = scored.slice(0, Math.min(MAX_TOP_CANDIDATES, scored.length));
  const choice = top[Math.floor(random() * top.length)];
  return choice.question;
}
