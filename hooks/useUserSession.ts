"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export interface UserSessionState {
  ready: boolean;
  userId: string | null;
  accessToken: string | null;
  isAnonymous: boolean;
  email: string | null;
}

const EMPTY_SESSION: UserSessionState = {
  ready: false,
  userId: null,
  accessToken: null,
  isAnonymous: true,
  email: null,
};

/**
 * Fonte única da sessão do usuário. No primeiro acesso, garante uma sessão
 * anônima real (auth.signInAnonymously) para já ter um auth.uid() estável
 * e permitir responder sem cadastro. A partir daí, escuta onAuthStateChange
 * — assim, quando a pessoa faz login de verdade (Google ou e-mail, ver
 * lib/supabase/authActions.ts), o estado atualiza sozinho, com o MESMO
 * user_id (a conta anônima "vira" a conta permanente, sem perder histórico).
 *
 * Se o Supabase não estiver configurado, fica pronto (ready) mas sem
 * usuário — os componentes que dependem de persistência real caem no
 * fallback local (ver hooks/useUnsayFlow.ts).
 */
export function useUserSession(): UserSessionState {
  const [state, setState] = useState<UserSessionState>({
    ...EMPTY_SESSION,
    ready: !isSupabaseConfigured,
  });

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    let cancelled = false;

    function applySession(session: { access_token: string; user: { id: string; is_anonymous?: boolean; email?: string } } | null) {
      if (cancelled) return;
      if (!session) {
        setState({ ...EMPTY_SESSION, ready: true });
        return;
      }
      setState({
        ready: true,
        userId: session.user.id,
        accessToken: session.access_token,
        isAnonymous: Boolean(session.user.is_anonymous),
        email: session.user.email ?? null,
      });
    }

    async function bootstrap() {
      const { data: existing } = await supabase!.auth.getSession();
      if (existing.session) {
        applySession(existing.session);
        return;
      }

      const { data, error } = await supabase!.auth.signInAnonymously();
      if (error) {
        console.error("Não foi possível iniciar sessão anônima no Supabase:", error.message);
        if (!cancelled) setState({ ...EMPTY_SESSION, ready: true });
        return;
      }
      applySession(data.session);
    }

    bootstrap();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session);
    });

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return state;
}
