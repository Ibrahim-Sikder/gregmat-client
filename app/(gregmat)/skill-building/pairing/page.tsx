import React from "react";
import Container from "@/components/shared/container/Container";
import PairingGame from "@/components/skill-building/pairing/PairingGame";
import { getAllPairings } from "@/actions/pairing";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pairing (SE) - Skill Building",
  description: "Pairing (SE) - Skill Building",
};

export default async function page() {
  const response = await getAllPairings(1, 100); // Fetch first 100 or so to start
  const data = response?.data || [];
  const total = response?.meta?.total || 0;

  return (
    <Container>
      <PairingGame initialData={data} meta={response?.meta} />
    </Container>
  );
}
