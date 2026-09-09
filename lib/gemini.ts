const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const REQUEST_TIMEOUT_MS = 6000;

export const isGeminiConfigured = Boolean(process.env.GEMINI_API_KEY);

/**
 * Regras de produto (ver briefing, seção "Gemini não deve diagnosticar"):
 * nunca apresentar diagnóstico, transtorno, avaliação clínica ou
 * afirmação absoluta de personalidade — só linguagem probabilística.
 */
const SYSTEM_PROMPT = `Você é o "espelho inteligente" do UNSAY, um app de perguntas e autodescoberta.
Sua única tarefa: escrever UMA frase curta (máx. 30 palavras), em português do Brasil,
comentando um padrão ou contradição nas respostas de uma pessoa a perguntas de autoconhecimento.

Regras obrigatórias:
- Linguagem sempre probabilística: "suas respostas sugerem", "parece existir um padrão",
  "pode haver uma contradição" — nunca afirmações absolutas.
- NUNCA diagnostique: proibido mencionar transtorno, doença, condição clínica, ou qualquer
  termo psiquiátrico/psicológico formal. Proibido dizer "você é [traço de personalidade]".
- Tom curioso e observador, nunca acusatório ou julgador.
- Envolva os nomes das dimensões fornecidas (ex.: liberdade, dinheiro) em tags <strong></strong>.
- Responda em texto simples, sem markdown, sem aspas ao redor da frase, sem preâmbulo.
- Nunca invente fatos que não estejam nos dados fornecidos.`;

interface GenerateInsightParams {
  kind: "pattern" | "contradiction";
  profileSummary: string; // ex.: "liberdade: 78, segurança: 42, dinheiro: 65..."
  dimensionsToMention: string[]; // ex.: ["liberdade", "segurança"]
  recentAnswers: string[]; // ex.: ["amor: SIM", "dinheiro: NÃO"]
}

export interface GeminiResult {
  text: string | null;
  error: string | null;
}

/**
 * Chama o Gemini para gerar o texto de uma descoberta/contradição. Nunca
 * lança — sempre devolve { text: null, error } em caso de falha, pra quem
 * chamou decidir o fallback (ver app/api/ai/insight/route.ts).
 */
export async function generateInsightText(params: GenerateInsightParams): Promise<GeminiResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { text: null, error: "gemini_not_configured" };
  }

  const intent =
    params.kind === "pattern"
      ? "Aponte um padrão de preferência nas respostas dela."
      : "Aponte uma possível contradição entre duas dimensões que apareceram fortes ao mesmo tempo.";

  const userPrompt = `${intent}

Perfil calculado (0–100 por dimensão): ${params.profileSummary}
Dimensões a mencionar na frase: ${params.dimensionsToMention.join(", ")}
Últimas respostas da pessoa (contexto, não cite literalmente): ${params.recentAnswers.join("; ") || "nenhuma disponível"}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        generationConfig: { temperature: 0.9, maxOutputTokens: 120 },
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => "");
      return { text: null, error: `gemini_http_${res.status}: ${errorBody.slice(0, 200)}` };
    }

    const data = await res.json();
    const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return { text: null, error: "gemini_empty_response" };
    }

    return { text: text.trim(), error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown_error";
    return { text: null, error: `gemini_request_failed: ${message}` };
  } finally {
    clearTimeout(timeout);
  }
}
