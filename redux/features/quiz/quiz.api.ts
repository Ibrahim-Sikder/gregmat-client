import { baseApi } from '@/redux/api/baseApi';

export const quizApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuiz: builder.query({
      query: (query) => ({
        url: `/quiz/${query}`,
        method: 'GET',
      }),
    }),
    createAttempt: builder.mutation({
      query: (body) => ({
        url: '/attempt/create',
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useCreateAttemptMutation, useGetQuizQuery } = quizApi;
