import type { ProfileDimension, Question, UserProfile } from "@/types/question";

export const INITIAL_PROFILE: UserProfile = {
  freedom: 50,
  security: 50,
  money: 50,
  relationships: 50,
  status: 50,
  risk: 50,
  moral: 50,
};

export const DIMENSION_LABELS: Record<ProfileDimension, string> = {
  freedom: "liberdade",
  security: "segurança",
  money: "dinheiro",
  relationships: "relações",
  status: "status",
  risk: "risco",
  moral: "princípios",
};

const MIN_VALUE = 4;
const MAX_VALUE = 96;

/**
 * Mapeamento entre as dimensões do perfil (usadas no código) e as colunas
 * reais da tabela user_profiles no Supabase. Compartilhado entre as rotas
 * que leem/gravam o perfil (answers, session/resume).
 */
export const PROFILE_COLUMNS: Record<ProfileDimension, string> = {
  freedom: "freedom_score",
  security: "security_score",
  money: "money_score",
  relationships: "relationship_score",
  status: "status_score",
  risk: "risk_score",
  moral: "moral_score",
};

export function profileRowToProfile(row: Record<string, number> | null): UserProfile {
  if (!row) return { ...INITIAL_PROFILE };
  const profile = { ...INITIAL_PROFILE };
  for (const [dim, column] of Object.entries(PROFILE_COLUMNS) as [ProfileDimension, string][]) {
    if (typeof row[column] === "number") profile[dim] = row[column];
  }
  return profile;
}

export function profileToRow(profile: UserProfile): Record<string, number> {
  const row: Record<string, number> = {};
  for (const [dim, column] of Object.entries(PROFILE_COLUMNS) as [ProfileDimension, string][]) {
    row[column] = Math.round(profile[dim]);
  }
  return row;
}

/**
 * Atualiza o vetor de perfil do usuário a partir de uma resposta.
 * Isso é calculado por regra simples (sem IA) a cada resposta, como
 * previsto na ETAPA 4 — a IA (Gemini) só interpreta o resultado agregado,
 * nos momentos de alto valor definidos em lib/insights.ts.
 */
export function applyAnswerToProfile(
  profile: UserProfile,
  question: Pick<Question, "dims">,
  optionIndex: number,
  jitter: () => number = Math.random
): UserProfile {
  const isStrongerPolarity = optionIndex === 0;
  const delta = isStrongerPolarity ? 7 : -5;

  const next = { ...profile };
  for (const dim of question.dims) {
    const noise = jitter() * 4 - 2;
    next[dim] = clamp(next[dim] + delta + noise, MIN_VALUE, MAX_VALUE);
  }
  return next;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function topDimensions(profile: UserProfile, count: number) {
  return Object.entries(profile).sort((a, b) => b[1] - a[1]).slice(0, count) as [
    ProfileDimension,
    number
  ][];
}

export function bottomDimension(profile: UserProfile) {
  return Object.entries(profile).sort((a, b) => a[1] - b[1])[0] as [ProfileDimension, number];
}

/** Pares de dimensões que, quando ambas altas, sugerem uma tensão interna interessante. */
const OPPOSED_PAIRS: [ProfileDimension, ProfileDimension][] = [
  ["freedom", "security"],
  ["money", "relationships"],
  ["status", "moral"],
];

const CONTRADICTION_THRESHOLD = 66;

export interface Contradiction {
  a: ProfileDimension;
  b: ProfileDimension;
  key: string;
}

/**
 * Verifica se surgiu uma nova possível contradição no perfil atual, ignorando
 * pares já sinalizados anteriormente (para não repetir a mesma descoberta).
 */
export function checkForNewContradiction(
  profile: UserProfile,
  alreadyFound: string[]
): Contradiction | null {
  for (const [a, b] of OPPOSED_PAIRS) {
    const key = `${a}-${b}`;
    if (profile[a] > CONTRADICTION_THRESHOLD && profile[b] > CONTRADICTION_THRESHOLD) {
      if (!alreadyFound.includes(key)) {
        return { a, b, key };
      }
    }
  }
  return null;
}
