/**
 * Popula a tabela public.questions com o banco de 100 perguntas de
 * data/questions.ts. Idempotente (upsert por id) — pode rodar de novo
 * sem duplicar nada.
 *
 * Uso:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed
 *
 * Exige a service role key (não a anon key) porque grava direto na
 * tabela ignorando RLS — nunca rode isso no cliente/navegador.
 */
import { createClient } from "@supabase/supabase-js";
import { QUESTIONS } from "../data/questions";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Faltam variáveis de ambiente. Defina SUPABASE_URL (ou NEXT_PUBLIC_SUPABASE_URL) e SUPABASE_SERVICE_ROLE_KEY antes de rodar o seed."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function main() {
  const rows = QUESTIONS.map((q) => ({
    id: q.id,
    text: q.text,
    category: q.category,
    type: q.type,
    options: q.options,
    dims: q.dims,
    curiosity: q.curiosity,
    ego: q.ego,
    comparison: q.comparison,
    shareability: q.shareability,
    depth: q.depth,
    contradiction: q.contradiction,
    friend_share: q.friendShare,
    difficulty: q.difficulty,
    active: true,
  }));

  console.log(`Enviando ${rows.length} perguntas para o Supabase...`);

  const { error, count } = await supabase
    .from("questions")
    .upsert(rows, { onConflict: "id", count: "exact" });

  if (error) {
    console.error("Erro ao popular as perguntas:", error.message);
    process.exit(1);
  }

  console.log(`OK — ${count ?? rows.length} perguntas gravadas/atualizadas.`);
}

main();
