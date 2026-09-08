import { AnswerOptions } from "@/components/AnswerOptions";
import { CATEGORY_LABELS } from "@/lib/labels";
import type { Question } from "@/types/question";

interface QuestionCardProps {
  question: Question;
  onAnswer: (optionIndex: number, answerText: string) => void;
}

export function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  return (
    <div className="flex flex-col justify-center flex-1 pt-2">
      <div className="self-start inline-flex items-center gap-1.5 px-[13px] py-[7px] rounded-full bg-card border border-border text-text-dim text-xs font-bold tracking-wide mb-[26px]">
        <span className="w-1.5 h-1.5 rounded-full unsay-gradient" />
        {CATEGORY_LABELS[question.category]}
      </div>

      <p className="font-serif text-[clamp(23px,6.6vw,29px)] leading-[1.32] tracking-tight mb-9">
        {question.text}
      </p>

      <AnswerOptions question={question} onAnswer={onAnswer} />
    </div>
  );
}
