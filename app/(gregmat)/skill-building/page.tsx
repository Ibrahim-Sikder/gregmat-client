import Container from "@/components/shared/container/Container";
import SkillGroups from "@/components/skill-building/SkillGroups";
import React from "react";
import { getPracticeSummary } from "@/actions/practice";

export const dynamic = "force-dynamic";

export default async function page() {
  const summary = await getPracticeSummary();

  return (
    <Container className="px-2 lg:px-0">
      <SkillGroups summary={summary} />
    </Container>
  );
}
