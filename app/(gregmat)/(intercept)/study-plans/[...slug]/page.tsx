import React from "react";
import PlanDescription from "@/components/pages/study-plan/PlanDescription";
import PlanSections from "@/components/pages/study-plan/PlanSections";
import SectionUnits from "@/components/pages/study-plan/SectionUnits";
import fetchWrapper from "@/lib/fetchWrapper";

export const dynamicParams = false;

async function fetchStudyPlanData(slug: string[]) {
  const planSlug = slug[0];
  const sectionSlug = slug[1] || null;

  const planData = await fetchWrapper(`/study-plan/plans/${planSlug}`, {
    revalidate: 60,
  });
  let sectionData = { success: false, data: null as any | null };

  if (sectionSlug) {
    sectionData = await fetchWrapper(`/study-plan/sections/${sectionSlug}`, {
      revalidate: 60,
    });
  }

  return { planData, sectionData };
}

export async function generateStaticParams() {
  try {
    const plans = await fetchWrapper("/study-plan/plans/all", {
      revalidate: 3600,
    });

    if (!plans.success || !plans.data) return [];

    const params: { slug: string[] }[] = [];

    for (const plan of plans.data) {
      params.push({ slug: [plan.slug] });

      try {
        const sections = await fetchWrapper(
          `/study-plan/sections/plan/${plan.slug}`,
          {
            revalidate: 3600,
          },
        );

        if (sections.success && sections.data) {
          sections.data.forEach((section: { slug: string }) => {
            params.push({ slug: [plan.slug, section.slug] });
          });
        }
      } catch (sectionError) {
        return [];
      }
    }
    return params;
  } catch (error) {
    return [];
  }
}

export default async function StudyPlanPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const { planData, sectionData } = await fetchStudyPlanData(slug);
  if (!planData.success || !planData.data) {
    return <div>Plan not found</div>;
  }

  const data = planData.data;
  const sec = sectionData.data;

  return (
    <div className="border p-3 rounded">
      <PlanDescription data={data} showDescription={!sec} />
      <SectionUnits sectionData={sec} />
      <PlanSections data={data} showSections={!sec} />
    </div>
  );
}
