import { getSupabaseAnonClient } from "@/lib/supabase/serverClient";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export interface ResolvedShare {
  question_id: number;
  question_text: string;
  question_type: string;
  question_options: string[];
  question_category: string;
  question_dims: string[];
  sender_option_index: number | null;
  sender_answer_text: string | null;
  sender_id: string;
}

/**
 * Resolve um slug de compartilhamento (server-side, sem autenticação —
 * `resolve_share` é security definer e devolve só o necessário pra tela
 * pública funcionar, nunca dados privados de quem enviou).
 */
export async function resolveShareServer(slug: string): Promise<ResolvedShare | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = getSupabaseAnonClient();
  const { data, error } = await supabase.rpc("resolve_share", { p_slug: slug }).maybeSingle();

  if (error || !data) return null;
  return data as ResolvedShare;
}
