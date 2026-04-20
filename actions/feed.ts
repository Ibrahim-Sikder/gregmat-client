"use server";

export type IFeed = {
  data: {
    title: string;
    img: string;
    slug: string;
    plusOnly: boolean;
    thumbnailSize: number;
    createdAt: string;
  }[];
};

export async function fetchFeeds(page: number) {
  const perPage = 21;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const url = new URL(`/api/v1/recordings/class/feed`, baseUrl).toString();

  const apiUrl = `${url}?page=${page}&limit=${perPage}`;

  try {
    const response = await fetch(apiUrl, {
      cache: "force-cache",
      next: { revalidate: 60 },
    });
    const data = await response.json();
    return data as IFeed;
  } catch (error) {
    return { data: [] };
  }
}
