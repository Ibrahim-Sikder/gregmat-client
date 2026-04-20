"use server";

import fetchWrapper from "@/lib/fetchWrapper";
import { revalidatePath, revalidateTag } from "next/cache";

export async function getPracticeSummary() {
  try {
    const response = await fetchWrapper("/practice/summary", {
      cache: "no-store",
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching practice summary:", error);
    return null;
  }
}

export async function getProblems(superCategory: string, filters: any = {}) {
  try {
    const formattedFilters: any = {
      super_category: superCategory,
    };

    // Formatter for array filters (difficulty, type, status, tag, category)
    const arrayFilters = ["difficulty", "type", "status", "tag", "category"];

    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;

      if (arrayFilters.includes(key) && Array.isArray(value)) {
        formattedFilters[key] = value.join(",");
      } else if (key === "hasSolution") {
        formattedFilters["has_solution"] = value ? "true" : "false";
      } else {
        formattedFilters[key] = value;
      }
    });

    const queryParams = new URLSearchParams(formattedFilters);
    const response = await fetchWrapper(`/practice/problems?${queryParams}`, {
      cache: "no-store",
      tags: ["problems"],
    });
    return response;
  } catch (error) {
    console.error("Error fetching problems:", error);
    return null;
  }
}

export async function getProblemById(id: string) {
  try {
    const response = await fetchWrapper(`/practice/problems/${id}`, {
      cache: "no-store",
      tags: ["problems"],
    });
    return response;
  } catch (error) {
    console.error("Error fetching problem:", error);
    return { success: false, message: "Failed to fetch problem" };
  }
}

export async function submitProblemAttempt(
  problemId: string,
  answer: any,
  isCorrect: boolean,
) {
  try {
    const response = await fetchWrapper("/practice/problems/attempt", {
      method: "POST",
      body: JSON.stringify({ problemId, answer, isCorrect }),
      cache: "no-store",
    });
    revalidateTag("problems");
    return response;
  } catch (error) {
    console.error("Error submitting attempt:", error);
    return { success: false, message: "Failed to submit attempt" };
  }
}

export async function toggleLikeProblem(id: string) {
  try {
    const response = await fetchWrapper(`/practice/problems/${id}/like`, {
      method: "POST",
      cache: "no-store",
    });
    revalidateTag("problems");
    return response;
  } catch (error) {
    console.error("Error toggling like:", error);
    return { success: false, message: "Failed to toggle like" };
  }
}

export async function toggleBookmarkProblem(id: string) {
  try {
    const response = await fetchWrapper(`/practice/problems/${id}/bookmark`, {
      method: "POST",
      cache: "no-store",
    });
    revalidateTag("problems");
    return response;
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return { success: false, message: "Failed to toggle bookmark" };
  }
}

export async function resetProblemAttempts(id: string) {
  try {
    const response = await fetchWrapper(
      `/practice/problems/${id}/reset-attempts`,
      {
        method: "POST",
        cache: "no-store",
      },
    );
    revalidateTag("problems");
    return response;
  } catch (error) {
    console.error("Error resetting attempts:", error);
    return { success: false, message: "Failed to reset attempts" };
  }
}
