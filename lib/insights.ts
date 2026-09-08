import { DIMENSION_LABELS, bottomDimension, topDimensions } from "@/lib/profile";
import type { UserProfile } from "@/types/question";

/**
 * Marcos de respostas em que vale a pena gerar uma descoberta. Espaçados
 * para não chamar IA a cada resposta — ver seção "controle de custo" do
 * briefing do produto. Em produção, esses marcos disparam uma chamada a
 * /api/ai/insight (server-side, chave do Gemini nunca no cliente).
 */
export const INSIGHT_MILESTONES = [4, 8, 13, 20, 30, 45, 62, 82];

type InsightTemplate = (top: [string, number][], bottomLabel: string) => string;

const TEMPLATES: InsightTemplate[] = [
  (top, bottomLabel) =>
    `Suas respostas sugerem que você valoriza <strong>${top[0][0]}</strong> mais do que a maioria das pessoas que já passaram por aqui — e bem mais do que <strong>${bottomLabel}</strong>.`,
  (top, bottomLabel) =>
    `Parece existir um padrão: quando o assunto é <strong>${top[0][0]}</strong>, suas respostas quase nunca vacilam. Já em <strong>${bottomLabel}</strong>, elas mudam bastante.`,
  (top, bottomLabel) =>
    `Você tende a priorizar <strong>${top[0][0]}</strong> e <strong>${top[1][0]}</strong> nas suas escolhas — mesmo quando isso custa algo em <strong>${bottomLabel}</strong>.`,
  (top) =>
    `Suas últimas respostas desenham um perfil mais voltado a <strong>${top[0][0]}</strong> do que você talvez admita em voz alta.`,
];

/**
 * Simula o papel do Gemini: recebe o perfil calculado por regras e devolve
 * uma descoberta em linguagem probabilística (nunca diagnóstica — ver
 * "Gemini não deve diagnosticar" no briefing). Isso será substituído por
 * uma chamada real de servidor na ETAPA 5, mantendo a mesma assinatura.
 */
export function generateInsight(profile: UserProfile, callIndex: number): string {
  const top = topDimensions(profile, 2).map(
    ([dim, value]) => [DIMENSION_LABELS[dim], value] as [string, number]
  );
  const bottomLabel = DIMENSION_LABELS[bottomDimension(profile)[0]];
  const template = TEMPLATES[callIndex % TEMPLATES.length];
  return template(top, bottomLabel);
}
