"use server";

import fetchWrapper from "@/lib/fetchWrapper";
import type { IPairing, IPairingAttemptSubmission } from "@/types/pairing";

export async function getAllPairings(page = 1, limit = 1000, sort = "default") {
  try {
    const response = await fetchWrapper(
      `/practice/pairings?page=${page}&limit=${limit}&sort=${sort}`,
      {
        next: { revalidate: 10 },
      },
    );
    return response;
  } catch (error) {
    console.error("Error fetching pairings:", error);
    return null;
  }
}

export async function getPairingById(id: string): Promise<IPairing | null> {
  try {
    const response = await fetchWrapper(`/practice/pairings/${id}`, {
      cache: "no-store",
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching pairing by id:", error);
    return null;
  }
}

export async function submitPairingAttempt(
  data: IPairingAttemptSubmission,
): Promise<any> {
  try {
    const response = await fetchWrapper("/practice/pairings/attempt", {
      method: "POST",
      body: JSON.stringify(data),
      cache: "no-store",
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting pairing attempt:", error);
    return null;
  }
}

export async function resetPairingProgress(): Promise<boolean> {
  try {
    await fetchWrapper("/practice/pairings/reset", {
      method: "DELETE",
      cache: "no-store",
    });
    return true;
  } catch (error) {
    console.error("Error resetting pairing progress:", error);
    return false;
  }
}
