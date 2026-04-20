import VocabCheckHome from "@/components/skill-building/vocab-check/VocabCheckHome";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Vocab Check | Skill Building",
  description:
    "Check your knowledge of GRE/TOEFL vocabulary with the vocab mountain check.",
};

export default function page() {
  return <VocabCheckHome />;
}
