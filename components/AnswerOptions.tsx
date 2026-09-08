"use client";

import { useState } from "react";
import type { Question } from "@/types/question";

interface AnswerOptionsProps {
  question: Question;
  onAnswer: (optionIndex: number, answerText: string) => void;
}

export function AnswerOptions({ question, onAnswer }: AnswerOptionsProps) {
  if (question.type === "open") {
    return <OpenAnswerInput onAnswer={onAnswer} />;
  }

  return (
    <div className="flex flex-col gap-[11px]">
      {question.options.map((option, index) => (
        <button
          key={option}
          type="button"
          onClick={() => onAnswer(index, option)}
          className="group text-left w-full bg-card border border-border text-text font-semibold text-[15.5px] px-5 py-[18px] rounded-xl flex items-center justify-between transition-[border-color,background,transform] duration-150 hover:border-border-hi hover:bg-card-hi active:scale-[0.985]"
        >
          <span>{option}</span>
          <span className="text-violet opacity-0 -translate-x-1 transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0">
            →
          </span>
        </button>
      ))}
    </div>
  );
}

function OpenAnswerInput({ onAnswer }: Pick<AnswerOptionsProps, "onAnswer">) {
  const [value, setValue] = useState("");

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAnswer(0, trimmed.length > 40 ? `${trimmed.slice(0, 40)}…` : trimmed);
  };

  return (
    <div className="flex flex-col gap-3.5">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Escreva sua resposta..."
        className="w-full bg-card border border-border rounded-xl px-[18px] py-4 text-text text-[15.5px] min-h-[96px] resize-none focus:outline-none focus:border-violet"
      />
      <button
        type="button"
        onClick={submit}
        className="unsay-gradient text-bg font-bold text-[15px] tracking-wide rounded-full py-[17px] w-full shadow-[0_14px_30px_-8px_rgba(196,90,190,0.55)] active:scale-[0.97] transition-transform"
      >
        RESPONDER
      </button>
    </div>
  );
}
