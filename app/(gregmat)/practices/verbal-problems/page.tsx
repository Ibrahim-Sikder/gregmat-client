import { getProblems } from "@/actions/practice";
import Problems from "@/components/pages/problems/Problem";
import Container from "@/components/shared/container/Container";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "GRE Verbal Problems | GregMat+",
  description: "Practice GRE Verbal problems with solutions and explanations.",
};

export default async function VerbalProblemsPage() {
  const response = await getProblems("Verbal");

  return (
    <Container className="px-4">
      <Problems
        initialData={response}
        superCategory="Verbal"
        hideCategoryFilter={true}
        hideTagsFilter={true}
      />
    </Container>
  );
}
