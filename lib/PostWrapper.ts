"use server";
import { cookies } from "next/headers";

export type PostWrapperOptions = RequestInit & {
  cache?: "force-cache" | "no-store" | "default";
  revalidate?: number | false;
  skipAuth?: boolean;
  params?: Record<string, string | number | boolean | undefined | null>;
  tags?: string[];
};

export async function postWrapper<T = any>(
  endpoint: string,
  data?: any,
  options: PostWrapperOptions = {},
): Promise<T> {
  const {
    cache = "force-cache",
    headers: customHeaders,
    revalidate,
    params,
    skipAuth,
    tags,
    ...rest
  } = options;

  // Get cookies (server-side only)
  let cookieHeader = "";
  if (!skipAuth) {
    try {
      const cookieStore = await cookies();
      cookieHeader = cookieStore
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");
    } catch {
      // ignore (e.g. edge/client usage)
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const url = new URL(`/api/v1${endpoint}`, baseUrl);

  // Add query params
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const res = await fetch(url.toString(), {
    method: "POST",
    cache,
    next: { revalidate, tags },
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...customHeaders,
      ...(!skipAuth && cookieHeader && { Cookie: cookieHeader }),
    },
    body: data ? JSON.stringify(data) : undefined,
    ...rest,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData?.message || `Error ${res.status}: ${res.statusText}`,
    );
  }

  return (await res.json().catch(() => null)) as T;
}
