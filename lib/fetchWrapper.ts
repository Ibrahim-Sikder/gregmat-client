"use server";

import { cookies } from "next/headers";

export type FetchWrapperOptions = RequestInit & {
  cache?: "force-cache" | "no-store" | "default";
  revalidate?: number | false;
  skipAuth?: boolean;
  params?: Record<string, string | number | boolean | undefined | null>;
  tags?: string[];
};

async function fetchWrapper<T = any>(
  endpoint: string,
  options: FetchWrapperOptions = {},
  skipAuth?: boolean,
  tags?: string[],
): Promise<T> {
  const {
    cache = "force-cache",
    headers: customHeaders,
    revalidate,
    params,
    ...rest
  } = options;

  let allCookies = [] as any[];
  if (!skipAuth) {
    try {
      const cookieStore = await cookies();
      allCookies = cookieStore.getAll();
    } catch (e) {}
  }

  const cookieHeader = allCookies
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const url = new URL(`/api/v1${endpoint}`, baseUrl);

  // Add query parameters if provided
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  // Make the fetch request
  const res = await fetch(url.toString(), {
    ...rest,
    cache,
    next: { revalidate, tags },
    headers: {
      "Content-Type": "application/json",
      ...customHeaders,
      ...(!skipAuth && cookieHeader && { Cookie: cookieHeader }),
    },
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));

    const error = new Error(
      errorData.message || `Error ${res.status}: ${res.statusText}`,
    );
    throw error;
  }
  const data = await res.json().catch(() => null);
  return data;
}

export default fetchWrapper;
