"use client";

import { useEffect, useState } from "react";

interface ComparisonBarProps {
  percent: number;
  leftLabel: string;
  rightLabel: string;
}

export function ComparisonBar({ percent, leftLabel, rightLabel }: ComparisonBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setWidth(percent));
    return () => cancelAnimationFrame(frame);
  }, [percent]);

  return (
    <div>
      <div className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden mb-2.5">
        <div
          className="h-full rounded-full unsay-gradient transition-[width] duration-1000 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
      <div className="flex justify-between text-[12.5px] text-text-faint">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}
