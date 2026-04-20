'use server';
import fetchWrapper from '@/lib/fetchWrapper';

export async function getAllDefaultPrompt(searchParams: string) {
  try {
    const response = await fetchWrapper(`/practice/prompt/all?search=${searchParams}`, {
      revalidate: 120,
    });
    return response.data;
  } catch (error) {
    return [];
  }
}

export async function getAllUserPrompt() {
  try {
    const response = await fetchWrapper('/practice/prompt/user', {
      revalidate: 120,
    });
    return response.data;
  } catch (error) {
    return [];
  }
}

export async function getAllUserSaved() {
  try {
    const response = await fetchWrapper('/practice/essay/me', {
      revalidate: 120,
    });
    return response.data;
  } catch (error) {
    return [];
  }
}
