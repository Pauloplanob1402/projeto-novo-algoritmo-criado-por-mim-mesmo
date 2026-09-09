import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/app/api/_lib/auth";
import { generateInsightText, isGeminiConfigured } from "@/lib/gemini";
import { isRateLimited } from "@/lib/rateLimit";

interface InsightRequestBody {
  kind: "pattern" | "contradiction";
  profileSummary: string;
  dimensionsToMention: string[];
  recentAnswers: string[];
  fallback: string; // texto gerado localmente por lib/insights.ts, usado se o Gemini falhar
}

/**
 * Gera o texto da descoberta/contradição. Tenta o Gemini primeiro (server
 * side, chave nunca exposta); se não estiver configurado ou a chamada
 * falhar, usa o fallback local enviado pelo cliente — a pessoa nunca fica
 * sem descoberta nenhuma só porque o Gemini está fora do ar.
 *
 * Chamado só nos marcos definidos em lib/insights.ts (INSIGHT_MILESTONES)
 * ou quando uma contradição nova é detectada — nunca a cada resposta, ver
 * "controle de custo" no briefing do produto. O rate limit abaixo é a
 * segunda camada dessa mesma regra: protege contra alguém chamando essa
 * rota diretamente (sem passar pela UI), já que é a única do produto que
 * custa dinheiro de verdade por chamada.
 */
export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }
  const { supabase, userId } = auth;

  const body = (await request.json()) as InsightRequestBody;
  if (!body?.kind || !body?.fallback) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  // no máximo 20 chamadas ao Gemini por hora por pessoa — bem acima do
  // uso orgânico (os marcos naturais do produto geram bem menos que isso)
  if (await isRateLimited(supabase, "insights", "user_id", userId, 60, 20)) {
    return NextResponse.json({ content: body.fallback, source: "fallback" as const });
  }

  let content = body.fallback;
  let source: "gemini" | "fallback" = "fallback";

  if (isGeminiConfigured) {
    const result = await generateInsightText({
      kind: body.kind,
      profileSummary: body.profileSummary,
      dimensionsToMention: body.dimensionsToMention,
      recentAnswers: body.recentAnswers,
    });

    if (result.text) {
      content = result.text;
      source = "gemini";
    } else {
      console.error("Gemini indisponível, usando fallback local:", result.error);
    }
  }

  await supabase.from("insights").insert({
    user_id: userId,
    type: body.kind,
    content,
    shown_at: new Date().toISOString(),
  });

  return NextResponse.json({ content, source });
}
