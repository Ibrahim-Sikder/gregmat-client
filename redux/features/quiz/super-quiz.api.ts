import { baseApi } from "@/redux/api/baseApi";

const superQuizApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSuperQuizQuestion: builder.mutation({
      query: (data) => ({
        url: `/super-quiz/add-question`,
        method: "POST",
        body: data,
      }),
    }),
    removeSuperQuizQuestion: builder.mutation({
      query: (questionId) => ({
        url: `/super-quiz/remove-question/${questionId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useCreateSuperQuizQuestionMutation, useRemoveSuperQuizQuestionMutation } = superQuizApi;
