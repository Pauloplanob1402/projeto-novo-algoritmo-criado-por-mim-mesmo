"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";
import { isSupabaseConfigured } from "@/lib/supabase/config";

interface SessionState {
  ready: boolean;
  userId: string | null;
  accessToken: string | null;
}

/**
 * Garante que exista uma sessão no Supabase Auth antes de gravar qualquer
 * coisa no banco — usando login anônimo (auth.signInAnonymously), que já
 * dá um auth.uid() real e estável por visitante sem pedir e-mail/senha.
 * A Etapa 3 troca esse anônimo por uma conta de verdade (mesmo user_id,
 * via supabase.auth.linkIdentity).
 *
 * Se o Supabase ainda não estiver configurado (Etapa 1 rodando sozinha,
 * sem env vars), `ready` fica true e os ids ficam null — os componentes
 * que dependem de persistência real devem cair no fallback local.
 */
export function useAnonymousSession(): SessionState {
  const [state, setState] = useState<SessionState>({
    ready: !isSupabaseConfigured,
    userId: null,
    accessToken: null,
  });

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    let cancelled = false;

    async function ensureSession() {
      const { data: existing } = await supabase!.auth.getSession();

      if (existing.session) {
        if (!cancelled) {
          setState({
            ready: true,
            userId: existing.session.user.id,
            accessToken: existing.session.access_token,
          });
        }
        return;
      }

      const { data, error } = await supabase!.auth.signInAnonymously();
      if (cancelled) return;

      if (error || !data.session) {
        console.error("Não foi possível iniciar sessão anônima no Supabase:", error?.message);
        setState({ ready: true, userId: null, accessToken: null });
        return;
      }

      setState({
        ready: true,
        userId: data.session.user.id,
        accessToken: data.session.access_token,
      });
    }

    ensureSession();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
