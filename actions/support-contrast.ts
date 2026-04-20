"use server";

import fetchWrapper from "@/lib/fetchWrapper";
import {
  ISupportContrastResponse,
  ISupportContrastAttemptSubmission,
  ISupportContrast,
} from "@/types/support-contrast";

export async function getAllSupportContrasts(
  page = 1,
  limit = 50,
  sort = "default",
): Promise<ISupportContrastResponse | null> {
  try {
    const res = await fetchWrapper(
      `/practice/support-contrast?page=${page}&limit=${limit}&sort=${sort}`,
      {
        next: { revalidate: 10 },
      },
    );
    return res;
  } catch (error) {
    console.error("Failed to fetch support contrasts:", error);
    return null;
  }
}

export async function getSupportContrastById(
  id: string,
): Promise<{ data: ISupportContrast } | null> {
  try {
    const res = await fetchWrapper(`/practice/support-contrast/${id}`, {
      cache: "no-store",
    });
    return res;
  } catch (error) {
    console.error("Failed to fetch support contrast by id:", error);
    return null;
  }
}

export async function submitSupportContrastAttempt(
  data: ISupportContrastAttemptSubmission,
): Promise<any> {
  try {
    const res = await fetchWrapper("/practice/support-contrast/attempt", {
      method: "POST",
      body: JSON.stringify(data),
      cache: "no-store",
    });
    return res.data;
  } catch (error) {
    console.error("Failed to submit support contrast attempt:", error);
    throw error;
  }
}

export async function resetSupportContrastProgress(): Promise<boolean> {
  try {
    await fetchWrapper("/practice/support-contrast/reset", {
      method: "POST", // My server used POST for reset in routes
      cache: "no-store",
    });
    return true;
  } catch (error) {
    console.error("Failed to reset support contrast progress:", error);
    return false;
  }
}

export async function resetSupportContrastAttempt(
  supportContrastId: string,
  blank_index: number,
): Promise<boolean> {
  try {
    await fetchWrapper("/practice/support-contrast/reset-attempt", {
      method: "POST",
      body: JSON.stringify({ supportContrastId, blank_index }),
      cache: "no-store",
    });
    return true;
  } catch (error) {
    console.error("Failed to reset support contrast attempt:", error);
    return false;
  }
}
