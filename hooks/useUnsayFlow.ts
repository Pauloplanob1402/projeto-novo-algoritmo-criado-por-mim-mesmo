"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { QUESTIONS } from "@/data/questions";
import { pickNextQuestion, type QuestionStatsMap } from "@/lib/algorithm";
import { generateInsight, INSIGHT_MILESTONES } from "@/lib/insights";
import {
  DIMENSION_LABELS,
  INITIAL_PROFILE,
  applyAnswerToProfile,
  checkForNewContradiction,
  type Contradiction,
} from "@/lib/profile";
import { seededPercent } from "@/lib/stats";
import { createShareRemote, fetchQuestionStats, persistInsightRemote, submitAnswerRemote } from "@/lib/supabase/api";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { useUserSession } from "@/hooks/useUserSession";
import type { AnsweredQuestion, Category, Question, UserProfile } from "@/types/question";

export type Screen = "intro" | "question" | "result" | "discovery" | "signup" | "share";

const SIGNUP_AFTER = 7;

export interface ResultData {
  question: Question;
  optionIndex: number;
  answerText: string;
  percent: number;
  isOpenEnded: boolean;
  isMinority: boolean;
  isLandslide: boolean;
  offeredShare: boolean;
}

export interface DiscoveryData {
  kind: "pattern" | "contradiction";
  kicker: string;
  title: string;
  bodyHtml: string;
  detail: string;
}

export function useUnsayFlow() {
  const session = useUserSession();
  const persistenceEnabled = isSupabaseConfigured;

  const [screen, setScreen] = useState<Screen>("intro");
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [answered, setAnswered] = useState<AnsweredQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [result, setResult] = useState<ResultData | null>(null);
  const [discovery, setDiscovery] = useState<DiscoveryData | null>(null);
  const [shareQuestion, setShareQuestion] = useState<Question | null>(null);
  const [shareSlug, setShareSlug] = useState<string | null>(null);

  const seenIds = useRef<Set<number>>(new Set());
  const recentCategories = useRef<Category[]>([]);
  const contradictionsFound = useRef<string[]>([]);
  const insightsShown = useRef<number>(0);
  const shownMilestones = useRef<Set<number>>(new Set());
  const signupShown = useRef<boolean>(false);
  const pendingShareQuestion = useRef<Question | null>(null);
  const pendingContradiction = useRef<Contradiction | null>(null);
  const questionStats = useRef<QuestionStatsMap>(new Map());

  // Carrega as estatísticas reais de uso uma vez por sessão — o algoritmo
  // de seleção passa a considerar performance histórica (Etapa 4) assim
  // que os dados chegam; antes disso, opera de forma neutra (ver
  // lib/algorithm.ts).
  useEffect(() => {
    if (!persistenceEnabled) return;
    let cancelled = false;
    fetchQuestionStats().then((stats) => {
      if (!cancelled) questionStats.current = stats;
    });
    return () => {
      cancelled = true;
    };
  }, [persistenceEnabled]);

  const goToNextQuestion = useCallback(() => {
    const question = pickNextQuestion({
      pool: QUESTIONS,
      seenIds: seenIds.current,
      recentCategories: recentCategories.current,
      stats: questionStats.current,
    });
    setCurrentQuestion(question);
    setScreen("question");
  }, []);

  const renderContradiction = useCallback((contradiction: Contradiction) => {
    setDiscovery({
      kind: "contradiction",
      kicker: "POSSÍVEL CONTRADIÇÃO",
      title: "Encontramos uma possível contradição.",
      bodyHtml: `Você parece valorizar <strong>${DIMENSION_LABELS[contradiction.a]}</strong> e <strong>${
        DIMENSION_LABELS[contradiction.b]
      }</strong> ao mesmo tempo — duas coisas que, nas suas próprias respostas, geralmente pedem escolhas opostas.`,
      detail:
        "Não significa que você está errado. Só que, em momentos diferentes, suas respostas pedem coisas diferentes de você — e isso é mais comum do que parece.",
    });
    setScreen("discovery");
  }, []);

  const renderDiscovery = useCallback(
    (nextProfile: UserProfile, answeredCount: number) => {
      const bodyHtml = generateInsight(nextProfile, insightsShown.current);
      insightsShown.current += 1;
      setDiscovery({
        kind: "pattern",
        kicker: "ENCONTRAMOS UM PADRÃO",
        title: "Suas respostas começam a formar um padrão.",
        bodyHtml,
        detail: `Isso é calculado a partir de ${answeredCount} respostas, comparando as categorias que mexem mais com você (ego, comparação e potencial de contradição) com as que você evita.`,
      });
      setScreen("discovery");

      if (persistenceEnabled && session.accessToken) {
        persistInsightRemote(session.accessToken, "pattern", bodyHtml);
      }
    },
    [persistenceEnabled, session.accessToken]
  );

  const advanceFlow = useCallback(
    (nextProfile: UserProfile, answeredCount: number) => {
      if (!signupShown.current && answeredCount >= SIGNUP_AFTER) {
        signupShown.current = true;
        setScreen("signup");
        return;
      }

      if (pendingContradiction.current) {
        const contradiction = pendingContradiction.current;
        pendingContradiction.current = null;
        contradictionsFound.current.push(contradiction.key);
        renderContradiction(contradiction);
        return;
      }

      if (INSIGHT_MILESTONES.includes(answeredCount) && !shownMilestones.current.has(answeredCount)) {
        shownMilestones.current.add(answeredCount);
        renderDiscovery(nextProfile, answeredCount);
        return;
      }

      goToNextQuestion();
    },
    [goToNextQuestion, renderContradiction, renderDiscovery]
  );

  const submitAnswer = useCallback(
    async (optionIndex: number, answerText: string) => {
      const question = currentQuestion;
      if (!question) return;

      seenIds.current.add(question.id);
      recentCategories.current.push(question.category);

      const nextAnswered: AnsweredQuestion[] = [
        ...answered,
        {
          id: question.id,
          category: question.category,
          type: question.type,
          optionIndex,
          answerText,
          dims: question.dims,
          answeredAt: Date.now(),
        },
      ];

      // 1) resultado local imediato — garante resposta instantânea mesmo
      //    se a rede estiver lenta, e serve de fallback se o Supabase
      //    ainda não estiver configurado.
      let nextProfile = applyAnswerToProfile(profile, question, optionIndex);
      const optionsCount = question.options.length || 2;
      let percent = seededPercent(question.id, optionIndex, optionsCount);
      let contradiction = checkForNewContradiction(nextProfile, contradictionsFound.current);

      // 2) se o Supabase estiver configurado e a sessão pronta, tenta
      //    substituir pelos dados reais (percentual real, perfil
      //    persistido, contradição deduplicada no banco).
      if (persistenceEnabled && session.accessToken) {
        const remote = await submitAnswerRemote(
          session.accessToken,
          { id: question.id, dims: question.dims, category: question.category, type: question.type, options: question.options },
          optionIndex,
          answerText
        );

        if (remote) {
          nextProfile = remote.profile;
          contradiction = remote.contradiction;
          if (remote.percent !== null) {
            percent = remote.percent;
          }
        }
      }

      pendingContradiction.current = contradiction;

      setAnswered(nextAnswered);
      setProfile(nextProfile);

      const isOpenEnded = question.type === "open";

      pendingShareQuestion.current = question.shareability >= 7 ? question : null;

      setResult({
        question,
        optionIndex,
        answerText,
        percent: isOpenEnded ? 100 - percent : percent,
        isOpenEnded,
        isMinority: !isOpenEnded && percent < 40,
        isLandslide: !isOpenEnded && percent > 78,
        offeredShare: question.shareability >= 7,
      });
      setScreen("result");
    },
    [answered, currentQuestion, persistenceEnabled, profile, session.accessToken]
  );

  const continueFromResult = useCallback(() => {
    advanceFlow(profile, answered.length);
  }, [advanceFlow, profile, answered.length]);

  const start = useCallback(() => {
    goToNextQuestion();
  }, [goToNextQuestion]);

  const skipSignup = useCallback(() => {
    advanceFlow(profile, answered.length);
  }, [advanceFlow, profile, answered.length]);

  const dismissDiscovery = useCallback(() => {
    goToNextQuestion();
  }, [goToNextQuestion]);

  const openShare = useCallback(() => {
    const question = pendingShareQuestion.current;
    if (!question) return;
    setShareQuestion(question);
    setShareSlug(null);
    setScreen("share");

    if (persistenceEnabled && session.accessToken) {
      createShareRemote(session.accessToken, question.id).then((remote) => {
        if (remote) setShareSlug(remote.slug);
      });
    }
  }, [persistenceEnabled, session.accessToken]);

  const backFromShare = useCallback(() => {
    advanceFlow(profile, answered.length);
  }, [advanceFlow, profile, answered.length]);

  const answeredCount = answered.length;

  return useMemo(
    () => ({
      screen,
      profile,
      answeredCount,
      currentQuestion,
      result,
      discovery,
      shareQuestion,
      shareSlug,
      isAnonymous: session.isAnonymous,
      email: session.email,
      start,
      submitAnswer,
      continueFromResult,
      skipSignup,
      dismissDiscovery,
      openShare,
      backFromShare,
    }),
    [
      screen,
      profile,
      answeredCount,
      currentQuestion,
      result,
      discovery,
      shareQuestion,
      shareSlug,
      session.isAnonymous,
      session.email,
      start,
      submitAnswer,
      continueFromResult,
      skipSignup,
      dismissDiscovery,
      openShare,
      backFromShare,
    ]
  );
}
