import { postWrapper } from "@/lib/PostWrapper";

export async function essaySubmit(data: any) {
  try {
    const response = await postWrapper(`/practice/essay/submit`, data, {
      next: { revalidate: 120, tags: [`essay-${data._id || data?.body}`] },
    });
    return response;
  } catch (error) {
    return null;
  }
}
