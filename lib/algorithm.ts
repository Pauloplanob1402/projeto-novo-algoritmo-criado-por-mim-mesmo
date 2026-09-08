import type { Category, Question } from "@/types/question";

/**
 * Pesos do algoritmo de seleção da próxima pergunta.
 * Projetados para serem recalibrados sem alterar a lógica de pontuação
 * (ex.: via experimento A/B ou aprendizado a partir de métricas reais,
 * na ETAPA 4 com dados de produção).
 */
export const QUESTION_WEIGHTS = {
  curiosity: 0.15,
  comparison: 0.15,
  contradiction: 0.2,
  friendShare: 0.1,
  depth: 0.15,
  novelty: 0.1,
  categoryRelevance: 0.15,
} as const;

const MAX_TOP_CANDIDATES = 6;

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

function scoreQuestion(question: Question, recentCategories: Category[]): number {
  const novelty = 10; // perguntas já vistas são filtradas antes de pontuar
  const relevance = categoryRelevance(question.category, recentCategories);

  return (
    question.curiosity * QUESTION_WEIGHTS.curiosity +
    question.comparison * QUESTION_WEIGHTS.comparison +
    question.contradiction * QUESTION_WEIGHTS.contradiction +
    question.friendShare * QUESTION_WEIGHTS.friendShare +
    question.depth * QUESTION_WEIGHTS.depth +
    novelty * QUESTION_WEIGHTS.novelty +
    relevance * QUESTION_WEIGHTS.categoryRelevance
  );
}

interface PickNextQuestionParams {
  pool: Question[];
  seenIds: Set<number>;
  recentCategories: Category[];
  random?: () => number;
}

/**
 * Escolhe a próxima pergunta considerando: respostas/categorias anteriores,
 * diversidade, curiosidade, potencial de comparação/contradição/compartilhamento
 * e novidade. Nunca puramente aleatória, mas com uma leve amostragem entre as
 * melhores candidatas para não parecer determinística.
 */
export function pickNextQuestion({
  pool,
  seenIds,
  recentCategories,
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
    .map((question) => ({ question, score: scoreQuestion(question, recentCategories) }))
    .sort((a, b) => b.score - a.score);

  const top = scored.slice(0, Math.min(MAX_TOP_CANDIDATES, scored.length));
  const choice = top[Math.floor(random() * top.length)];
  return choice.question;
}
