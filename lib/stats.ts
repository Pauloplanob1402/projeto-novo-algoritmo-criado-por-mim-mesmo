/**
 * Percentual de comparação social simulado. Determinístico por
 * pergunta+opção (mesma resposta sempre retorna o mesmo número, como um
 * "banco de dados" faria), sem depender de um backend real ainda.
 *
 * Na ETAPA 2 (Supabase), isso é substituído por uma contagem real:
 *   select count(*) from answers where question_id = ? and answer = ?
 */
export function seededPercent(questionId: number, optionIndex: number, optionsCount: number): number {
  const seed = questionId * 97 + optionIndex * 13;
  const pseudo = Math.sin(seed) * 10000;
  const fraction = pseudo - Math.floor(pseudo);

  if (optionsCount === 2) {
    return Math.round(12 + fraction * 76); // mantém entre 12% e 88%
  }
  return Math.round(8 + fraction * 60);
}
