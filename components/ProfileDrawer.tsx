"use client";

import { useEffect, useState } from "react";
import { AccountActions } from "@/components/AccountActions";
import { DIMENSION_LABELS } from "@/lib/profile";
import { signOutAndReset } from "@/lib/supabase/authActions";
import type { ProfileDimension, UserProfile } from "@/types/question";

const DIMENSION_ORDER: ProfileDimension[] = [
  "freedom",
  "security",
  "money",
  "relationships",
  "status",
  "risk",
];

interface ProfileDrawerProps {
  open: boolean;
  profile: UserProfile;
  answeredCount: number;
  isAnonymous: boolean;
  email: string | null;
  onClose: () => void;
}

export function ProfileDrawer({
  open,
  profile,
  answeredCount,
  isAnonymous,
  email,
  onClose,
}: ProfileDrawerProps) {
  return (
    <>
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 z-20"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
        onClick={onClose}
      />
      <div
        className="absolute top-0 right-0 bottom-0 w-[82%] max-w-[340px] bg-bg-1 border-l border-border p-[26px] overflow-y-auto z-30 transition-transform duration-300"
        style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-[22px] -left-[18px] w-9 h-9 rounded-full bg-bg-1 border border-border flex items-center justify-center"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ADA3C9" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <h3 className="font-serif font-medium text-[19px] mb-1">Seus padrões</h3>
        <div className="text-text-faint text-[13px] mb-[26px]">{answeredCount} respostas até agora.</div>

        {DIMENSION_ORDER.map((dim) => (
          <DimensionRow key={dim} label={DIMENSION_LABELS[dim]} value={Math.round(profile[dim])} open={open} />
        ))}

        <div className="mt-[30px] pt-5 border-t border-border">
          {isAnonymous ? (
            <>
              <div className="text-text-dim text-[13.5px] font-semibold mb-3.5">
                Sessão anônima — crie uma conta para não perder essas descobertas.
              </div>
              <AccountActions variant="ghost" />
            </>
          ) : (
            <>
              <div className="text-text-dim text-[13.5px] font-semibold mb-3.5">
                Conectado como <span className="text-text">{email}</span>
              </div>
              <button
                type="button"
                onClick={signOutAndReset}
                className="border border-border-hi text-text-faint font-bold text-[13.5px] tracking-wide rounded-full py-3 px-5 w-full"
              >
                Sair
              </button>
            </>
          )}
        </div>

        <div className="mt-5 pt-5 border-t border-border text-[12.5px] text-text-faint leading-[1.6]">
          Isso é um retrato provisório, não um diagnóstico. Ele muda conforme você responde mais
          perguntas.
        </div>
      </div>
    </>
  );
}

function DimensionRow({ label, value, open }: { label: string; value: number; open: boolean }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => setWidth(value));
    return () => cancelAnimationFrame(frame);
  }, [open, value]);

  return (
    <div className="mb-[18px]">
      <div className="flex justify-between text-[13.5px] mb-2">
        <span className="text-text-dim font-semibold capitalize">{label}</span>
        <span className="text-text-faint">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full unsay-gradient transition-[width] duration-700 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
