"use client";

import { Logo } from "@/components/Logo";

interface HeaderProps {
  visible: boolean;
  onOpenProfile: () => void;
  profileEnabled: boolean;
}

export function Header({ visible, onOpenProfile, profileEnabled }: HeaderProps) {
  return (
    <div className="flex items-center justify-between px-[22px] pt-[calc(22px+env(safe-area-inset-top))] shrink-0">
      <div
        className="flex items-center gap-2 font-serif font-semibold text-[15px] tracking-wide transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <Logo size={15} />
        unsay
      </div>
      <button
        type="button"
        onClick={onOpenProfile}
        disabled={!profileEnabled}
        aria-label="Seus padrões"
        className="w-[34px] h-[34px] rounded-full border border-border bg-card flex items-center justify-center transition-opacity duration-300 active:scale-90"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#ADA3C9" strokeWidth="1.8">
          <path d="M3 17l6-6 4 4 8-9" />
          <path d="M15 6h6v6" />
        </svg>
      </button>
    </div>
  );
}
