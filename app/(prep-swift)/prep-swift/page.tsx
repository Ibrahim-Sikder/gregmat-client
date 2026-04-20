import { getPrepSwift } from "@/actions/getprepswift";
import Hero from "@/components/pre-swift/Hero";
import Container from "@/components/shared/container/Container";
import React from "react";

export default async function page() {
  const prepswift = await getPrepSwift();
  return (
    <>
      <>
        <Hero data={prepswift} />
      </>
    </>
  );
}
