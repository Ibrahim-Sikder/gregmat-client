'use server';

import fetchWrapper from '@/lib/fetchWrapper';

export type IQuizzes = {
  title: string;
  slug: string;
  tagline: string;
  quiz: any;
};

export async function getPracticeQuizzes() {
  try {
    const response = await fetchWrapper('/practice/test/all', {
      revalidate: 120,
    });
    return response.data;
  } catch (error) {
    return [];
  }
}

export async function getQuizCollections() {
  try {
    const response = await fetchWrapper('/quiz-collection/all?website=GM', {
      revalidate: 120,
    });
    return response.data;
  } catch (error) {
    return [];
  }
}
