"use server";

import fetchWrapper from "@/lib/fetchWrapper";
import type {
  IMainIdeaPractice,
  IMainIdeaAttemptSubmission,
  IMainIdeaAttemptResponse,
} from "@/types/main-idea";

export async function getAllMainIdeas() {
  try {
    const response = await fetchWrapper("/practice/main-idea/all", {
      next: { revalidate: 10 },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching main ideas:", error);
    return null;
  }
}

export async function getMainIdeaBySlug(
  slug: string,
): Promise<IMainIdeaPractice | null> {
  try {
    const response = await fetchWrapper(`/practice/main-idea/${slug}`, {
      cache: "no-store",
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching main idea by slug:", error);
    return null;
  }
}

export async function submitMainIdeaAttempt(
  data: IMainIdeaAttemptSubmission,
): Promise<IMainIdeaAttemptResponse | null> {
  try {
    const response = await fetchWrapper("/practice/main-idea/attempt/submit", {
      method: "POST",
      body: JSON.stringify(data),
      cache: "no-store",
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting main idea attempt:", error);
    return null;
  }
}
