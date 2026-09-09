"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnswerOptions } from "@/components/AnswerOptions";
import { ComparisonBar } from "@/components/ComparisonBar";
import { Logo } from "@/components/Logo";
import { CATEGORY_LABELS } from "@/lib/labels";
import { seededPercent } from "@/lib/stats";
import { recordReferralRemote, submitAnswerRemote, type ResolvedShare } from "@/lib/supabase/api";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { useUserSession } from "@/hooks/useUserSession";
import type { Category, ProfileDimension, QuestionType } from "@/types/question";

interface SharedQuestionScreenProps {
  slug: string;
  share: ResolvedShare;
}

export function SharedQuestionScreen({ slug, share }: SharedQuestionScreenProps) {
  const session = useUserSession();
  const persistenceEnabled = isSupabaseConfigured;

  const [answered, setAnswered] = useState<{ optionIndex: number; answerText: string } | null>(null);
  const [percent, setPercent] = useState<number | null>(null);
  const referralSent = useRef(false);

  // Registra o referral assim que a sessão (mesmo anônima) estiver pronta —
  // é o que credita quem enviou o link por ter trazido uma pessoa nova.
  useEffect(() => {
    if (!persistenceEnabled || !session.accessToken || referralSent.current) return;
    referralSent.current = true;
    recordReferralRemote(session.accessToken, slug);
  }, [persistenceEnabled, session.accessToken, slug, referralSent]);

  const question = {
    type: share.question_type as QuestionType,
    options: share.question_options,
  };

  const handleAnswer = async (optionIndex: number, answerText: string) => {
    setAnswered({ optionIndex, answerText });

    let resolvedPercent = seededPercent(share.question_id, optionIndex, share.question_options.length || 2);

    if (persistenceEnabled && session.accessToken) {
      const remote = await submitAnswerRemote(
        session.accessToken,
        {
          id: share.question_id,
          dims: share.question_dims as ProfileDimension[],
          category: share.question_category as Category,
          type: share.question_type as QuestionType,
          options: share.question_options,
        },
        optionIndex,
        answerText
      );
      if (remote?.percent !== null && remote?.percent !== undefined) {
        resolvedPercent = remote.percent;
      }
    }

    setPercent(resolvedPercent);
  };

  const senderAnswered = share.sender_option_index !== null && share.sender_answer_text !== null;
  const sameAsFriend = answered && senderAnswered && answered.answerText === share.sender_answer_text;

  return (
    <div className="w-full max-w-[460px] min-h-dvh sm:min-h-0 sm:max-h-[900px] sm:h-[calc(100vh-64px)] bg-bg relative flex flex-col overflow-hidden sm:rounded-[36px] sm:border sm:border-border sm:shadow-[0_0_80px_rgba(139,107,255,0.18),0_40px_100px_rgba(0,0,0,0.55)]">
      <div className="flex items-center gap-2 px-[22px] pt-[calc(22px+env(safe-area-inset-top))] shrink-0 font-serif font-semibold text-[15px]">
        <Logo size={15} />
        unsay
      </div>

      <div className="relative flex-1 min-h-0 flex flex-col overflow-y-auto overscroll-contain px-[26px] pb-[calc(30px+env(safe-area-inset-bottom))]">
        {!answered ? (
          <div className="flex flex-col w-full my-auto pt-2">
            <div className="self-start inline-flex items-center gap-1.5 px-[13px] py-[7px] rounded-full bg-card border border-border text-text-dim text-xs font-bold tracking-wide mb-[26px]">
              <span className="w-1.5 h-1.5 rounded-full unsay-gradient" />
              {CATEGORY_LABELS[share.question_category as Category] ?? share.question_category}
            </div>

            <p className="text-text-dim text-[13.5px] font-semibold mb-3">
              Alguém quer saber como você responderia.
            </p>

            <p className="font-serif text-[clamp(23px,6.6vw,29px)] leading-[1.32] tracking-tight mb-9">
              {share.question_text}
            </p>

            <AnswerOptions question={question} onAnswer={handleAnswer} />
          </div>
        ) : (
          <div className="flex flex-col flex-1 pt-2">
            <div className="text-text-faint text-[13px] font-bold tracking-wide mb-2.5">SUA RESPOSTA</div>
            <p className="font-serif text-2xl font-medium leading-[1.3] mb-[28px]">
              Você escolheu <span className="unsay-gradient-text">{answered.answerText}</span>.
            </p>

            {senderAnswered && (
              <div className="bg-card border border-border rounded-[18px] p-[22px] mb-[18px]">
                <div className="text-text-dim text-sm mb-2">Seu amigo respondeu:</div>
                <div className="font-serif text-xl mb-3">{share.sender_answer_text}</div>
                <div
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-bold ${
                    sameAsFriend
                      ? "unsay-gradient-soft border border-pink/35 text-[#F3B8DA]"
                      : "bg-white/[0.06] border border-border text-text-dim"
                  }`}
                >
                  {sameAsFriend ? "Vocês responderam igual." : "Vocês responderam diferente."}
                </div>
              </div>
            )}

            {percent !== null && (
              <div className="bg-card border border-border rounded-[18px] p-[22px] mb-[22px]">
                <div className="font-serif text-[32px] font-medium leading-none mb-1.5">{percent}%</div>
                <div className="text-text-dim text-sm mb-[18px]">das pessoas escolheram como você.</div>
                <ComparisonBar percent={percent} leftLabel={answered.answerText} rightLabel="restante" />
              </div>
            )}

            <div className="mt-auto flex flex-col gap-2.5 pt-3.5">
              <Link
                href="/"
                className="unsay-gradient text-bg font-bold text-[15px] tracking-wide rounded-full py-[17px] w-full text-center shadow-[0_14px_30px_-8px_rgba(196,90,190,0.55)] active:scale-[0.97] transition-transform"
              >
                DESCOBRIR MAIS SOBRE MIM
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
