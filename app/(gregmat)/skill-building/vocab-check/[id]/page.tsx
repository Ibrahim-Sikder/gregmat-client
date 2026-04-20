import VocabCheckAttempt from "@/components/skill-building/vocab-check/VocabCheckAttempt";
import React from "react";

export const metadata = {
  title: "Vocab Check Attempt | Skill Building",
  description: "Test your vocabulary skills.",
};

export default async function page({ params }: { params: { id: string } }) {
  const { id } = await params;
  return <VocabCheckAttempt id={id} />;
}
