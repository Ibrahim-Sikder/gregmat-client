"use server";

import fetchWrapper from "@/lib/fetchWrapper";
import type {
  ISentenceFunction,
  ISentenceFunctionAttemptSubmission,
  ISentenceFunctionResponse,
} from "@/types/sentence-function";

export async function getAllSentenceFunctions(
  page = 1,
  limit = 50,
  sort = "default",
): Promise<ISentenceFunctionResponse | null> {
  try {
    const response = await fetchWrapper(
      `/practice/sentence-functions?page=${page}&limit=${limit}&sort=${sort}`,
      {
        next: { revalidate: 10 },
      },
    );
    return response;
  } catch (error) {
    console.error("Error fetching sentence functions:", error);
    return null;
  }
}

export async function getSentenceFunctionById(
  id: string,
): Promise<ISentenceFunction | null> {
  try {
    const response = await fetchWrapper(`/practice/sentence-functions/${id}`, {
      cache: "no-store",
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching sentence function by id:", error);
    return null;
  }
}

export async function submitSentenceFunctionAttempt(
  data: ISentenceFunctionAttemptSubmission,
): Promise<any> {
  try {
    const response = await fetchWrapper(
      "/practice/sentence-functions/attempt",
      {
        method: "POST",
        body: JSON.stringify(data),
        cache: "no-store",
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting sentence function attempt:", error);
    return null;
  }
}

export async function resetSentenceFunctionProgress(): Promise<boolean> {
  try {
    await fetchWrapper("/practice/sentence-functions/reset", {
      method: "DELETE",
      cache: "no-store",
    });
    return true;
  } catch (error) {
    console.error("Error resetting sentence function progress:", error);
    return false;
  }
}
