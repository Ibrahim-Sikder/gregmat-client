"use server";

import fetchWrapper from "@/lib/fetchWrapper";

export async function getFlashcards() {
  try {
    const response = await fetchWrapper(`/flashcards/course-groups/all`, {
      revalidate: 120,
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching flashcards:", error);
    return null;
  }
}

export async function getCourseGroups(
  slug: string,
  params?: Record<string, string | number | boolean | undefined | null>,
) {
  try {
    const response = await fetchWrapper(
      `/flashcards/course-groups/${slug}/courses`,
      {
        cache: "no-store",
        params,
        tags: [`flashcards-${slug}`],
      },
    );
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function getCourses(
  slug: string,
  params?: Record<string, string | number | boolean | undefined | null>,
) {
  try {
    const response = await fetchWrapper(`/flashcards/courses/${slug}`, {
      cache: "no-store",
      params,
      tags: [`flashcards-${slug}`],
    });
    return response.data;
  } catch (error) {
    return null;
  }
}
