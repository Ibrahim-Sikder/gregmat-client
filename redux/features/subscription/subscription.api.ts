import { baseApi } from "@/redux/api/baseApi";

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Subscription Prices (public)
    getSubscriptionPrices: builder.query({
      query: () => ({
        url: "/subscriptions/prices/map",
        method: "GET",
      }),
      providesTags: ["subscriptionPrice"],
    }),
    // Subscription Requests (User endpoints)
    createSubscriptionRequest: builder.mutation({
      query: (data) => ({
        url: "/subscriptions/requests",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["subscriptionRequest"],
    }),

    getMySubscriptionRequests: builder.query({
      query: () => ({
        url: "/subscriptions/my/requests",
        method: "GET",
      }),
      providesTags: ["subscriptionRequest"],
    }),

    // Subscriptions (User endpoints)
    getMyActiveSubscription: builder.query({
      query: () => ({
        url: "/subscriptions/my/active",
        method: "GET",
      }),
      providesTags: ["subscription"],
    }),

    getMySubscriptions: builder.query({
      query: () => ({
        url: "/subscriptions/my/all",
        method: "GET",
      }),
      providesTags: ["subscription"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSubscriptionPricesQuery,
  useCreateSubscriptionRequestMutation,
  useGetMySubscriptionRequestsQuery,
  useGetMyActiveSubscriptionQuery,
  useGetMySubscriptionsQuery,
} = subscriptionApi;
