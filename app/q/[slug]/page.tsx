import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SharedQuestionScreen } from "@/components/SharedQuestionScreen";
import { resolveShareServer } from "@/lib/supabase/shareResolver";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const share = await resolveShareServer(slug);

  if (!share) {
    return { title: "UNSAY" };
  }

  return {
    title: `"${share.question_text}" — UNSAY`,
    description: "Você não sabe tudo sobre você. Responda e descubra.",
  };
}

export default async function SharedQuestionPage({ params }: PageProps) {
  const { slug } = await params;
  const share = await resolveShareServer(slug);

  if (!share) notFound();

  return <SharedQuestionScreen slug={slug} share={share} />;
}
