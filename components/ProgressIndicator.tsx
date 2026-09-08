interface ProgressIndicatorProps {
  answeredCount: number;
  cycleLength?: number;
}

/** Mostra o progresso dentro do "ciclo" atual de perguntas, não um total fixo. */
export function ProgressIndicator({ answeredCount, cycleLength = 6 }: ProgressIndicatorProps) {
  const filled = answeredCount % cycleLength;

  return (
    <div className="flex gap-[5px] px-[22px] pt-4 shrink-0">
      {Array.from({ length: cycleLength }).map((_, i) => (
        <div key={i} className="h-[3px] flex-1 rounded-full bg-border overflow-hidden relative">
          {i < filled && <div className="absolute inset-0 unsay-gradient" />}
          {i === filled && answeredCount > 0 && (
            <div
              className="absolute inset-0 unsay-gradient origin-left"
              style={{ animation: "fillDot .25s ease forwards" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
