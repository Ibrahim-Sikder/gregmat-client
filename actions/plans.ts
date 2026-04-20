"use server";

import fetchWrapper from "@/lib/fetchWrapper";

export type IPlan = {
  title: string;
  slug: string;
  tagline: string;
};

export async function getStudyPlans() {
  try {
    const response = await fetchWrapper("/study-plan/plans/all", {
      revalidate: 120,
    });
    return response.data;
  } catch (error) {
    return [] as IPlan[];
  }
}
