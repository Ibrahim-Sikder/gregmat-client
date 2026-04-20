import React from "react";
import Container from "@/components/shared/container/Container";
import SentenceFunctionGame from "@/components/skill-building/sentence-function/SentenceFunctionGame";
import { getAllSentenceFunctions } from "@/actions/sentence-function";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sentence Function - Skill Building",
  description: "Identify the function of sentences within a passage.",
};

export default async function SentenceFunctionPage() {
  const response = await getAllSentenceFunctions(1, 50);
  const data = response?.data || [];
  const total = response?.meta?.total || 0;

  return (
    <Container>
      <SentenceFunctionGame initialData={data} meta={response?.meta} />
    </Container>
  );
}
