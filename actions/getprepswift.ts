"use server";

import fetchWrapper from "@/lib/fetchWrapper";

export async function getPrepSwift() {
  try {
    const response = await fetchWrapper(`/prepswift/courses/all`, {
      cache: "force-cache",
      next: {
        revalidate: 300,
      },
    });
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function getPrepSwiftCourses(
  slug: string,
  params?: Record<string, string | number | boolean | undefined | null>,
) {
  try {
    const response = await fetchWrapper(`/prepswift/courses/${slug}`, {
      cache: "no-store",
      params,
      tags: ["prepswift-course"],
    });
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function getPrepSwiftBookmarked() {
  try {
    const response = await fetchWrapper(`/prepswift/course/progress/saved`, {
      cache: "no-store",
    });
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function getAllPrepSwiftQuizzes(
  slug: string,
  params?: Record<string, string | number | boolean | undefined | null>,
) {
  try {
    const response = await fetchWrapper(`/quiz-collection/${slug}`, {
      cache: "no-store",
      params,
      tags: [`mountain-${slug}`],
    });
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function getPrepSwiftQuizzes() {
  try {
    const response = await fetchWrapper(`/quiz-collection/all?website=GMPS`, {
      next: {
        revalidate: 120,
      },
    });
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function getContentWithNavigation(contentId: string) {
  try {
    const response = await fetchWrapper(
      `/prepswift/contents/navigation/${contentId}`,
      {
        cache: "no-store",
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching navigation:", error);
    return null;
  }
}
