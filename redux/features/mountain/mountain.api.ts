import { baseApi } from "@/redux/api/baseApi";

export const mountainApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    setContentColor: builder.mutation<any, { id: string; color: string }>({
      query: ({ id, color }) => ({
        url: `/mountain/content/${id}/colors`,
        method: "POST",
        body: { color },
      }),
    }),
    resetContentColor: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/mountain/content/${id}/colors/reset`,
        method: "POST",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useSetContentColorMutation, useResetContentColorMutation } =
  mountainApi;
