"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";

function redirectUrl(): string {
  return typeof window !== "undefined" ? window.location.origin : "";
}

/**
 * Login/cadastro com Google. Se já existir uma sessão anônima (o caso
 * comum: a pessoa já respondeu perguntas sem conta), usa linkIdentity
 * para transformar essa mesma conta em permanente — sem perder nada do
 * histórico. Se por algum motivo não houver sessão, cai para um login
 * normal.
 */
export async function signInWithGoogle() {
  const supabase = await getSupabaseBrowserClient();
  if (!supabase) return { error: "supabase_not_configured" as const };

  const { data: session } = await supabase.auth.getSession();
  const options = { redirectTo: redirectUrl() };

  if (session.session?.user?.is_anonymous) {
    const { error } = await supabase.auth.linkIdentity({ provider: "google", options });
    return { error: error?.message ?? null };
  }

  const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options });
  return { error: error?.message ?? null };
}

/**
 * Login/cadastro por e-mail, sem senha (magic link). Escolha deliberada:
 * elimina a necessidade de um fluxo de "recuperação de senha" inteiro —
 * o próprio link por e-mail já cumpre esse papel sempre que a pessoa
 * precisar entrar de novo. Ver README (Etapa 3) para o racional.
 *
 * Assim como no Google, se já existir sessão anônima, o e-mail é ligado a
 * ela via updateUser (preserva o histórico); a pessoa confirma clicando
 * no link recebido.
 */
export async function sendMagicLink(email: string) {
  const supabase = await getSupabaseBrowserClient();
  if (!supabase) return { error: "supabase_not_configured" as const };

  const { data: session } = await supabase.auth.getSession();

  if (session.session?.user?.is_anonymous) {
    const { error } = await supabase.auth.updateUser({ email });
    return { error: error?.message ?? null };
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectUrl() },
  });
  return { error: error?.message ?? null };
}

/**
 * Encerra a sessão. Recarrega a página em seguida — a forma mais simples
 * e confiável de garantir que todo o estado da experiência (perguntas já
 * vistas, perfil, etc.) seja reiniciado junto com uma nova sessão anônima.
 */
export async function signOutAndReset() {
  const supabase = await getSupabaseBrowserClient();
  if (!supabase) return;
  await supabase.auth.signOut();
  if (typeof window !== "undefined") window.location.reload();
}
