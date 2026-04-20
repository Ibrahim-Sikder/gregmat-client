import Container from "@/components/shared/container/Container";
import MainIdea from "@/components/skill-building/MainIdea";
import { getAllMainIdeas } from "@/actions/main-idea";
import React from "react";

export default async function page() {
  const response = await getAllMainIdeas();
  const data = response?.results || [];

  return (
    <Container>
      <MainIdea data={data} />
    </Container>
  );
}
