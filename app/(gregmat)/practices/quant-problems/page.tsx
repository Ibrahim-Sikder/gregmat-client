import { getProblems } from "@/actions/practice";
import Problems from "@/components/pages/problems/Problem";
import Container from "@/components/shared/container/Container";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "GRE Quant Problems | GregMat+",
  description:
    "Practice GRE Quantitative problems with solutions and explanations.",
};

export default async function QuantProblemsPage() {
  const response = await getProblems("Quant");
  return (
    <Container className="px-4">
      <Problems initialData={response} superCategory="Quant" />
    </Container>
  );
}
