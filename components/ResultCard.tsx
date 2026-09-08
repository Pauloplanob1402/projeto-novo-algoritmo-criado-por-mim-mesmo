import { ComparisonBar } from "@/components/ComparisonBar";
import type { ResultData } from "@/hooks/useUnsayFlow";

interface ResultCardProps {
  result: ResultData;
  onShare: () => void;
  onContinue: () => void;
}

export function ResultCard({ result, onShare, onContinue }: ResultCardProps) {
  const { question, answerText, percent, isOpenEnded, isMinority, isLandslide, offeredShare } = result;
  const optionsCount = question.options.length || 2;

  const statLabel = isOpenEnded
    ? "das respostas para essa pergunta são únicas como a sua."
    : "das pessoas escolheram como você.";

  const rightLabel = isOpenEnded
    ? "Repetidas"
    : optionsCount === 2
    ? question.options[1 - result.optionIndex] || "restante"
    : "restante";

  const leftLabel = isOpenEnded ? "Únicas" : answerText;

  return (
    <div className="flex flex-col justify-center flex-1 pt-2">
      <div className="text-text-faint text-[13px] font-bold tracking-wide mb-2.5">SUA RESPOSTA</div>
      <p className="font-serif text-2xl font-medium leading-[1.3] mb-[34px]">
        Você escolheu <span className="unsay-gradient-text">{answerText}</span>.
      </p>

      <div className="bg-card border border-border rounded-[18px] p-[22px] mb-[18px]">
        <div className="font-serif text-[38px] font-medium leading-none mb-1.5">{percent}%</div>
        <div className="text-text-dim text-sm mb-[18px]">{statLabel}</div>
        <ComparisonBar
          key={`${question.id}-${result.optionIndex}`}
          percent={percent}
          leftLabel={leftLabel}
          rightLabel={rightLabel}
        />

        {!isOpenEnded && (isMinority || isLandslide) && (
          <div className="inline-flex items-center gap-1.5 mt-4 px-3.5 py-2 rounded-full unsay-gradient-soft border border-pink/35 text-[13px] font-bold text-[#F3B8DA]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F3B8DA" strokeWidth="2.4">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v5M12 16h.01" />
            </svg>
            {isMinority ? "Você está entre a minoria." : "Você está com a maioria absoluta."}
          </div>
        )}
      </div>

      {offeredShare && (
        <div className="flex items-center justify-between gap-3 bg-card border border-dashed border-border-hi rounded-[18px] px-[18px] py-4 mb-[22px]">
          <p className="text-[13.5px] text-text-dim leading-snug m-0">
            Essa pergunta divide opiniões. Vale mandar pra alguém.
          </p>
          <button
            type="button"
            onClick={onShare}
            className="shrink-0 border border-border-hi text-text text-[12.5px] font-bold px-3.5 py-2.5 rounded-full"
          >
            Enviar
          </button>
        </div>
      )}

      <div className="mt-auto flex flex-col gap-2.5 pt-3.5">
        <button
          type="button"
          onClick={onContinue}
          className="unsay-gradient text-bg font-bold text-[15px] tracking-wide rounded-full py-[17px] w-full shadow-[0_14px_30px_-8px_rgba(196,90,190,0.55)] active:scale-[0.97] transition-transform"
        >
          PRÓXIMA
        </button>
      </div>
    </div>
  );
}
