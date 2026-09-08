"use client";

import { useState } from "react";
import { Logo } from "@/components/Logo";
import type { DiscoveryData } from "@/hooks/useUnsayFlow";

interface InsightCardProps {
  discovery: DiscoveryData;
  onContinue: () => void;
}

export function InsightCard({ discovery, onContinue }: InsightCardProps) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div className="flex flex-col justify-center flex-1 pt-2">
      <div className="mb-[22px]">
        <Logo size={30} gradientId="unsay-insight" />
      </div>

      <div className="text-text-faint text-[13px] font-bold tracking-wide mb-3.5">{discovery.kicker}</div>
      <p className="font-serif italic font-light text-[26px] leading-[1.34] mb-[22px]">{discovery.title}</p>

      <div
        className="bg-card border border-border rounded-[18px] p-[22px] text-[15px] leading-[1.6] text-text-dim mb-[18px] [&_strong]:text-text [&_strong]:font-bold"
        dangerouslySetInnerHTML={{ __html: discovery.bodyHtml }}
      />

      <div
        className="overflow-hidden text-[13.5px] text-text-faint leading-[1.6] transition-[max-height,opacity,margin] duration-300"
        style={{
          maxHeight: showDetail ? 200 : 0,
          opacity: showDetail ? 1 : 0,
          marginBottom: showDetail ? 18 : 0,
        }}
      >
        {discovery.detail}
      </div>

      <div className="mt-auto flex flex-col gap-2.5 pt-3.5">
        <button
          type="button"
          onClick={() => setShowDetail((v) => !v)}
          className="border border-border-hi text-text-dim font-bold text-[15px] tracking-wide rounded-full py-[17px] w-full active:scale-[0.97] transition-transform"
        >
          COMO VOCÊ DESCOBRIU ISSO?
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="unsay-gradient text-bg font-bold text-[15px] tracking-wide rounded-full py-[17px] w-full shadow-[0_14px_30px_-8px_rgba(196,90,190,0.55)] active:scale-[0.97] transition-transform"
        >
          CONTINUAR
        </button>
      </div>
    </div>
  );
}
