import { baseApi } from "@/redux/api/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation({
      query: (credentials) => ({
        url: "/signin",
        method: "POST",
        body: credentials,
      }),
    }),

    signUp: builder.mutation({
      query: (userData) => ({
        url: "/signup",
        method: "POST",
        body: userData,
      }),
    }),

    signOut: builder.mutation({
      query: () => ({
        url: "/signout",
        method: "POST",
      }),
    }),

    verifyEmail: builder.query<any, { token: string }>({
      query: ({ token }) => ({
        url: `/verify-email?token=${token}`,
        method: "GET",
      }),
    }),

    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ token, password, confirmPassword }) => ({
        url: `/reset-password/${token}`,
        method: "POST",
        body: { password, confirmPassword },
      }),
    }),

    currentUser: builder.query({
      query: () => ({
        url: `/user/profile`,
        method: "GET",
      }),
    }),

    resendVerificationEmail: builder.mutation({
      query: (data) => ({
        url: "/resend-verification",
        method: "POST",
        body: data,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useSignInMutation,
  useSignUpMutation,
  useSignOutMutation,
  useVerifyEmailQuery,
  useCurrentUserQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useResendVerificationEmailMutation,
} = authApi;
