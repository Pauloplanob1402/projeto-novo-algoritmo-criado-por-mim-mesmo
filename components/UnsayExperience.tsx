"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { IntroScreen } from "@/components/IntroScreen";
import { InsightCard } from "@/components/InsightCard";
import { ProfileDrawer } from "@/components/ProfileDrawer";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { QuestionCard } from "@/components/QuestionCard";
import { ResultCard } from "@/components/ResultCard";
import { ShareCard } from "@/components/ShareCard";
import { SignupPrompt } from "@/components/SignupPrompt";
import { useUnsayFlow } from "@/hooks/useUnsayFlow";

export function UnsayExperience() {
  const flow = useUnsayFlow();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const headerVisible = flow.screen !== "intro";
  const showProgress = flow.screen === "question";

  return (
    <div className="w-full max-w-[460px] min-h-dvh sm:min-h-0 sm:max-h-[900px] sm:h-[calc(100vh-64px)] bg-bg relative flex flex-col overflow-hidden sm:rounded-[36px] sm:border sm:border-border sm:shadow-[0_0_80px_rgba(139,107,255,0.18),0_40px_100px_rgba(0,0,0,0.55)]">
      <Header
        visible={headerVisible}
        profileEnabled={headerVisible}
        onOpenProfile={() => setDrawerOpen(true)}
      />

      {showProgress && <ProgressIndicator answeredCount={flow.answeredCount} />}

      <div className="relative flex-1 flex px-[26px] pb-[calc(30px+env(safe-area-inset-bottom))]">
        {flow.screen === "intro" && <IntroScreen onStart={flow.start} />}

        {flow.screen === "question" && flow.currentQuestion && (
          <QuestionCard question={flow.currentQuestion} onAnswer={flow.submitAnswer} />
        )}

        {flow.screen === "result" && flow.result && (
          <ResultCard result={flow.result} onShare={flow.openShare} onContinue={flow.continueFromResult} />
        )}

        {flow.screen === "discovery" && flow.discovery && (
          <InsightCard discovery={flow.discovery} onContinue={flow.dismissDiscovery} />
        )}

        {flow.screen === "signup" && <SignupPrompt onSkip={flow.skipSignup} />}

        {flow.screen === "share" && flow.shareQuestion && (
          <ShareCard question={flow.shareQuestion} slug={flow.shareSlug} onBack={flow.backFromShare} />
        )}
      </div>

      <ProfileDrawer
        open={drawerOpen}
        profile={flow.profile}
        answeredCount={flow.answeredCount}
        isAnonymous={flow.isAnonymous}
        email={flow.email}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
