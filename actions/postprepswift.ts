"use server";

import { postWrapper } from "@/lib/PostWrapper";
import { revalidateTag } from "next/cache";

export async function bookMark(data: any) {
  try {
    const response = await postWrapper(
      "/prepswift/course/progress/mark-saved",
      data,
      {
        cache: "no-store",
      },
    );
    revalidateTag("prepswift-course");
    return response?.data ?? response;
  } catch (error) {
    console.error("Bookmark failed:", error);
    return null;
  }
}

export async function watched(data: any) {
  try {
    const response = await postWrapper(
      "/prepswift/course/progress/mark-watched",
      data,
      {
        cache: "no-store",
      },
    );
    revalidateTag("prepswift-course");
    return response?.data ?? response;
  } catch (error) {
    console.error("Watched update failed:", error);
    return null;
  }
}
