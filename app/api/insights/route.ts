import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/app/api/_lib/auth";

interface InsightRequestBody {
  type: "pattern" | "contradiction";
  content: string;
}

/**
 * Por enquanto o texto do insight ainda é gerado no cliente por
 * lib/insights.ts (templates locais). Esta rota só persiste o resultado,
 * para já termos histórico real no banco. Na Etapa 5, a geração do texto
 * migra para cá (chamando o Gemini com a service role key), mantendo a
 * mesma tabela e o mesmo formato de resposta.
 */
export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }
  const { supabase, userId } = auth;

  const body = (await request.json()) as InsightRequestBody;
  if (!body?.type || !body?.content) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("insights")
    .insert({ user_id: userId, type: body.type, content: body.content, shown_at: new Date().toISOString() })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
