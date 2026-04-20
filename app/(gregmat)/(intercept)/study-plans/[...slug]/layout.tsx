import StudyPlanTabs from "@/components/pages/study-plan/StudyPlanTabs";
import Container from "@/components/shared/container/Container";
import fetchWrapper from "@/lib/fetchWrapper";
import React from "react";

export const dynamicParams = false;

type tParams = Promise<{ slug: string[] }>;

// Metadata for page
export async function generateMetadata({
  params,
}: {
  params: tParams;
}): Promise<{ title: string }> {
  const { slug } = await params;

  try {
    const res = await fetchWrapper(`/study-plan/plans/${slug[0]}`, {
      revalidate: 60,
    });
    if (!res.success || !res.data)
      return { title: "Study Plan Not Found - GregMat" };
    return { title: `${res.data.title} - GregMat` };
  } catch {
    return { title: "Study Plan Not Found - GregMat" };
  }
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

// Layout component
export default async function StudyPlanLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: tParams;
}) {
  const { slug } = await params;

  let apiData: { success: boolean; data: any | null } = {
    success: false,
    data: null,
  };
  try {
    apiData = await fetchWrapper(`/study-plan/plans/${slug[0]}`, {
      revalidate: 60,
    });
  } catch (err) {
    console.error("Error fetching study plan in layout:", err);
  }

  const data = apiData.data;

  if (!apiData.success || !data) {
    return (
      <Container className="py-8 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-red-600">
          Study Plan Not Found
        </h1>
      </Container>
    );
  }

  return (
    <Container className="py-8 px-2">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold">{data.title} (Version 2.0)</h1>
        </div>
        {data.tagline && (
          <p className="text-lg text-blue-600 mb-4">{data.tagline}</p>
        )}
      </div>

      {/* Navigation Tabs */}
      <StudyPlanTabs data={data} />

      {/* Page Content */}
      {children}
    </Container>
  );
}
