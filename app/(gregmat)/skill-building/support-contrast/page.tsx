import { getAllSupportContrasts } from "@/actions/support-contrast";
import SupportContrastGame from "@/components/skill-building/support-contrast/SupportContrastGame";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Support / Contrast (TC) - Skill Building | GregMat",
  description:
    "Practice identifying support and contrast clues in typical Text Completion sentences.",
};

export default async function SupportContrastPage() {
  const result = await getAllSupportContrasts(1, 50, "default");

  if (!result || !result.data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-500 font-medium">
          Failed to load Support / Contrast data. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <SupportContrastGame initialData={result.data} meta={result.meta} />
    </main>
  );
}
