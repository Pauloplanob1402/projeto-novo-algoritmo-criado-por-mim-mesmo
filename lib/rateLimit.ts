import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Limite simples baseado em contagem: "no máximo N linhas dessa tabela
 * criadas por esse usuário nos últimos X minutos". Não é um rate limiter
 * de propósito geral (não conta requisições que falham antes de gravar,
 * por exemplo) — é deliberadamente simples, o suficiente para proteger os
 * endpoints mais caros (Gemini) e mais fáceis de virar spam
 * (compartilhamentos) sem precisar adicionar Redis/KV como nova peça de
 * infraestrutura. Funciona corretamente em serverless porque a contagem
 * vem do banco, não de memória do processo.
 */
export async function isRateLimited(
  supabase: SupabaseClient,
  table: string,
  userIdColumn: string,
  userId: string,
  windowMinutes: number,
  maxCount: number
): Promise<boolean> {
  const since = new Date(Date.now() - windowMinutes * 60_000).toISOString();

  const { count, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true })
    .eq(userIdColumn, userId)
    .gte("created_at", since);

  if (error) {
    // se a checagem falhar, não bloqueia a pessoa por um problema nosso —
    // só loga, e deixa passar.
    console.error(`Falha ao checar rate limit em ${table}:`, error.message);
    return false;
  }

  return (count ?? 0) >= maxCount;
}
