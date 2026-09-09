"use client";

import { useEffect } from "react";
import { Logo } from "@/components/Logo";

export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Erro na experiência UNSAY:", error);
  }, [error]);

  return (
    <div className="w-full max-w-[460px] min-h-dvh sm:min-h-0 sm:max-h-[900px] sm:h-[calc(100vh-64px)] bg-bg relative flex flex-col overflow-hidden sm:rounded-[36px] sm:border sm:border-border sm:shadow-[0_0_80px_rgba(139,107,255,0.18),0_40px_100px_rgba(0,0,0,0.55)]">
      <div className="flex-1 flex flex-col items-center justify-center text-center px-[26px]">
        <div className="mb-6 opacity-60">
          <Logo size={44} gradientId="unsay-error" />
        </div>
        <p className="font-serif text-2xl mb-3">Algo não saiu como esperado.</p>
        <p className="text-text-dim text-[15px] leading-[1.55] max-w-[280px] mb-8">
          Não é você — é a gente. Tenta de novo em alguns segundos.
        </p>
        <button
          type="button"
          onClick={reset}
          className="unsay-gradient text-bg font-bold text-[15px] tracking-wide rounded-full py-[17px] px-8 shadow-[0_14px_30px_-8px_rgba(196,90,190,0.55)] active:scale-[0.97] transition-transform"
        >
          TENTAR DE NOVO
        </button>
      </div>
    </div>
  );
}
