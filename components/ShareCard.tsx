"use client";

import { useState } from "react";
import type { Question } from "@/types/question";

interface ShareCardProps {
  question: Question;
  slug: string | null;
  onBack: () => void;
}

export function ShareCard({ question, slug, onBack }: ShareCardProps) {
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);

  // Enquanto o slug real (gravado no banco) ainda não voltou da API, mostra
  // um placeholder — o link de verdade só existe depois que /api/shares
  // responde, então evita copiar/enviar algo que não resolve ainda.
  const path = slug ? `/q/${slug}` : null;
  const fullUrl = path && typeof window !== "undefined" ? `${window.location.origin}${path}` : null;
  const displayLink =
    path && typeof window !== "undefined" ? `${window.location.host}${path}` : "gerando link...";

  const copyLink = async () => {
    if (!fullUrl) return;
    try {
      await navigator.clipboard.writeText(fullUrl);
    } catch {
      // clipboard indisponível (ex.: contexto não seguro) — ignora silenciosamente
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const sendToFriend = async () => {
    if (!fullUrl) return;

    // Web Share API: abre o menu nativo de compartilhamento no celular
    // (WhatsApp, Mensagens, etc.) quando disponível.
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ text: question.text, url: fullUrl });
        return;
      } catch {
        // pessoa cancelou o share nativo — cai pro fallback de copiar
      }
    }

    await copyLink();
    setSent(true);
    setTimeout(() => setSent(false), 1800);
  };

  return (
    <div className="flex flex-col flex-1 pt-2 relative">
      <div className="text-text-faint text-[13px] font-bold tracking-wide mb-2.5">COMPARTILHAR</div>
      <p className="font-serif text-2xl font-medium leading-[1.3] mb-[22px]">
        Quero saber como você responderia.
      </p>

      <div className="relative overflow-hidden bg-gradient-to-br from-card-hi to-card border border-border-hi rounded-[28px] p-[26px] mb-[22px]">
        <div
          className="absolute -top-[40%] -right-[30%] w-[200px] h-[200px] unsay-gradient opacity-[0.18] blur-[40px] rounded-full"
          aria-hidden="true"
        />
        <p className="relative font-serif text-[19px] leading-[1.4] mb-5">{question.text}</p>
        <div className="flex items-center gap-2.5 bg-black/25 border border-border rounded-full py-1.5 pl-4 pr-1.5">
          <span className="flex-1 text-[13px] text-text-dim font-mono overflow-hidden text-ellipsis whitespace-nowrap">
            {displayLink}
          </span>
          <button
            type="button"
            onClick={copyLink}
            disabled={!fullUrl}
            className="shrink-0 bg-text text-bg text-[12.5px] font-extrabold px-4 py-2.5 rounded-full disabled:opacity-50"
          >
            Copiar
          </button>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2.5 pt-3.5">
        <button
          type="button"
          onClick={sendToFriend}
          disabled={!fullUrl}
          className="unsay-gradient text-bg font-bold text-[15px] tracking-wide rounded-full py-[17px] w-full shadow-[0_14px_30px_-8px_rgba(196,90,190,0.55)] active:scale-[0.97] transition-transform disabled:opacity-50"
        >
          ENVIAR PARA UM AMIGO
        </button>
        <button
          type="button"
          onClick={onBack}
          className="text-text-faint text-[13.5px] font-semibold py-2.5 bg-transparent border-none"
        >
          Voltar às perguntas
        </button>
      </div>

      <Toast show={copied} message="Link copiado" />
      <Toast show={sent} message="Convite enviado" />
    </div>
  );
}

function Toast({ show, message }: { show: boolean; message: string }) {
  return (
    <div
      className="absolute left-1/2 bottom-[26px] -translate-x-1/2 bg-text text-bg text-[13px] font-bold px-5 py-3 rounded-full whitespace-nowrap transition-all duration-300"
      style={{ opacity: show ? 1 : 0, transform: `translate(-50%, ${show ? 0 : 20}px)` }}
    >
      {message}
    </div>
  );
}
