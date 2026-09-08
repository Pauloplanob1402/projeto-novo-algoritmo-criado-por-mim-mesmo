"use client";

import { useState } from "react";
import { sendMagicLink, signInWithGoogle } from "@/lib/supabase/authActions";
import { isSupabaseConfigured } from "@/lib/supabase/config";

interface AccountActionsProps {
  variant?: "ghost" | "solid";
}

type EmailStep = "idle" | "form" | "sent";

export function AccountActions({ variant = "ghost" }: AccountActionsProps) {
  const [emailStep, setEmailStep] = useState<EmailStep>("idle");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buttonClass =
    variant === "solid"
      ? "unsay-gradient text-bg shadow-[0_14px_30px_-8px_rgba(196,90,190,0.55)]"
      : "border border-border-hi text-text-dim";

  const handleGoogle = async () => {
    setError(null);
    if (!isSupabaseConfigured) {
      setError("Configure o Supabase para habilitar o login (ver README).");
      return;
    }
    setLoading(true);
    const { error: err } = await signInWithGoogle();
    setLoading(false);
    if (err) setError(err);
    // em caso de sucesso, o navegador é redirecionado para o Google — não há mais o que fazer aqui.
  };

  const handleEmailSubmit = async () => {
    if (!email.trim()) return;
    setError(null);
    if (!isSupabaseConfigured) {
      setError("Configure o Supabase para habilitar o login (ver README).");
      return;
    }
    setLoading(true);
    const { error: err } = await sendMagicLink(email.trim());
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    setEmailStep("sent");
  };

  if (emailStep === "sent") {
    return (
      <div className="text-center text-[13.5px] text-text-dim leading-[1.6] py-2">
        Enviamos um link de confirmação para <strong className="text-text">{email}</strong>. Pode
        continuar respondendo — quando clicar no link, sua conta é ativada automaticamente.
      </div>
    );
  }

  if (emailStep === "form") {
    return (
      <div className="flex flex-col gap-2.5 w-full">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          autoFocus
          className="w-full bg-card border border-border rounded-full px-5 py-[15px] text-text text-[15px] text-center focus:outline-none focus:border-violet"
        />
        {error && <p className="text-[12.5px] text-pink text-center m-0">{error}</p>}
        <button
          type="button"
          onClick={handleEmailSubmit}
          disabled={loading}
          className={`${buttonClass} font-bold text-[15px] tracking-wide rounded-full py-[17px] w-full active:scale-[0.97] transition-transform disabled:opacity-60`}
        >
          {loading ? "Enviando..." : "Enviar link de acesso"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5 w-full">
      {error && <p className="text-[12.5px] text-pink text-center m-0">{error}</p>}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={loading}
        className={`${buttonClass} font-bold text-[15px] tracking-wide rounded-full py-[17px] w-full active:scale-[0.97] transition-transform disabled:opacity-60`}
      >
        Continuar com Google
      </button>
      <button
        type="button"
        onClick={() => setEmailStep("form")}
        className="border border-border-hi text-text-dim font-bold text-[15px] tracking-wide rounded-full py-[17px] w-full active:scale-[0.97] transition-transform"
      >
        Continuar com e-mail
      </button>
    </div>
  );
}
