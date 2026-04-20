"use server";

import fetchWrapper from "@/lib/fetchWrapper";
import { revalidateTag } from "next/cache";

export async function getVocabChecks(params?: any) {
  try {
    const response = await fetchWrapper(`/practice/vocab-check`, {
      params,
      cache: "no-store",
      tags: ["vocab-checks"],
    });
    return response.data;
  } catch (error) {
    console.error("getVocabChecks error:", error);
    return null;
  }
}

export async function createVocabCheck(data: any) {
  try {
    const response = await fetchWrapper(`/practice/vocab-check`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    revalidateTag("vocab-checks");
    return response.data;
  } catch (error) {
    console.error("createVocabCheck error:", error);
    return null;
  }
}

export async function getVocabCheckById(id: string) {
  try {
    const response = await fetchWrapper(`/practice/vocab-check/${id}`, {
      cache: "no-store",
      tags: [`vocab-check-${id}`],
    });
    return response.data;
  } catch (error) {
    console.error("getVocabCheckById error:", error);
    return null;
  }
}

export async function submitVocabCheckAttempt(id: string, wordAttempts: any[]) {
  try {
    const response = await fetchWrapper(
      `/practice/vocab-check/${id}/attempts`,
      {
        method: "POST",
        body: JSON.stringify({ word_attempts: wordAttempts }),
      },
    );
    revalidateTag(`vocab-check-${id}`);
    revalidateTag("vocab-checks");
    return response.data;
  } catch (error) {
    console.error("submitVocabCheckAttempt error:", error);
    return null;
  }
}
