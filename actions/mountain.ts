'use server';

import fetchWrapper from '@/lib/fetchWrapper';
import { revalidateTag } from 'next/cache';

export type IMountain = {
  title: string;
  slug: string;
  tagline: string;
};

export async function getMountains() {
  try {
    const response = await fetchWrapper(`/mountain/all`, {
      revalidate: 120,
    });
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function getMountainBySlug(
  slug: string,
  params?: Record<string, string | number | boolean | undefined | null>
) {
  try {
    const response = await fetchWrapper(`/mountain/${slug}/details`, {
      cache: 'no-store',
      params,
      tags: [`mountain-${slug}`],
    });
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function addColor(id: string, color: string, slug: string) {
  try {
    const response = await fetchWrapper(
      `/mountain/content/${id}/colors`,
      {
        method: 'POST',
        body: JSON.stringify({ color }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
      false,
      [`mountain-content-${id}`]
    );

    revalidateTag(`mountain-${slug}`);
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function resetColor(id: string, slug: string) {
  try {
    const response = await fetchWrapper(
      `/mountain/content/${id}/colors/reset`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      false,
      [`mountain-content-${id}`]
    );

    revalidateTag(`mountain-${slug}`);
    return response.data;
  } catch (error) {
    return null;
  }
}
export async function resetCategories(id: string, slug: string  ) {
  try {
    const response = await fetchWrapper(
      `/mountain/categories/${id}/colors/reset`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      false,
      [`mountain-content-${id}`]
    );

    revalidateTag(`mountain-${slug}`);
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function resetAll(id: string, slug: string  ) {
  try {
    const response = await fetchWrapper(
      `/mountain/${id}/colors/reset`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      false,
      [`mountain-content-${id}`]
    );

    revalidateTag(`mountain-${slug}`);
    return response.data;
  } catch (error) {
    return null;
  }
}
