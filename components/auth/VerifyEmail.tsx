"use client";

import {
  useResendVerificationEmailMutation,
  useVerifyEmailQuery,
} from "@/redux/features/auth/auth.api";
import { useRouter } from "next/navigation";
import Container from "../shared/container/Container";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

import { Loader2, CheckCircle2, XCircle, Mail, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

interface Props {
  token: string;
  email?: string;
}

export default function VerifyEmail({ token, email }: Props) {
  const router = useRouter();
  const { data, isLoading, error } = useVerifyEmailQuery({ token });

  const [resendVerificationEmail, { isLoading: isResending }] =
    useResendVerificationEmailMutation();

  const [resendSuccess, setResendSuccess] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);

  // Auto-redirect on success
  useEffect(() => {
    if (data && !isLoading) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push("/auth");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [data, isLoading, router]);

  const handleResend = async () => {
    if (!email) return;

    setResendSuccess(null);
    setResendError(null);

    try {
      const res = await resendVerificationEmail({ email }).unwrap();
      setResendSuccess(res?.message || "Verification email sent successfully.");
    } catch (err: any) {
      setResendError(
        err?.data?.message || "Failed to resend verification email.",
      );
    }
  };

  return (
    <Container>
      <div className="flex items-center justify-center min-h-[70vh] px-4 py-12">
        <Card className="w-full max-w-md border shadow-none">
          {/* ---------------- Header ---------------- */}
          <CardHeader className="text-center space-y-6 pt-8 pb-4">
            {isLoading && (
              <div className="flex justify-center">
                <div className="relative">
                  <div className="rounded-full bg-gradient-to-br from-blue-500 to-blue-600 p-5 shadow-lg">
                    <Mail className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-1.5 shadow-md">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  </div>
                </div>
              </div>
            )}

            {!isLoading && data && (
              <div className="flex justify-center">
                <div className="relative animate-in zoom-in duration-500">
                  <div className="rounded-full bg-gradient-to-br from-green-500 to-emerald-600 p-5 shadow-lg">
                    <CheckCircle2 className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-green-400 opacity-30 animate-ping" />
                </div>
              </div>
            )}

            {!isLoading && error && (
              <div className="flex justify-center">
                <div className="relative animate-in zoom-in duration-500">
                  <div className="rounded-full bg-gradient-to-br from-red-500 to-rose-600 p-5 shadow-lg">
                    <XCircle className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {isLoading && "Verifying Your Email"}
                {!isLoading && data && "Email Verified!"}
                {!isLoading && error && "Verification Failed"}
              </CardTitle>

              <CardDescription className="text-base leading-relaxed text-gray-600">
                {isLoading &&
                  "Please wait while we confirm your email address..."}
                {!isLoading &&
                  data &&
                  "Your email has been successfully verified. Redirecting you now..."}
                {!isLoading &&
                  error &&
                  "The verification link is invalid or has expired."}
              </CardDescription>
            </div>
          </CardHeader>

          {/* ---------------- Content ---------------- */}
          <CardContent className="space-y-5 pb-8">
            {isLoading && (
              <div className="flex items-center justify-center gap-2 py-4">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                </div>
              </div>
            )}

            {!isLoading && data && (
              <div className="space-y-4">
                <Alert className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 text-green-800 ">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <AlertTitle className="font-semibold">Success!</AlertTitle>
                  <AlertDescription className="text-green-700">
                    {data.message || "You can now sign in to your account."}
                  </AlertDescription>
                </Alert>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-blue-900 font-medium">
                    Redirecting in{" "}
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-lg mx-1">
                      {countdown}
                    </span>{" "}
                    seconds...
                  </p>
                </div>
              </div>
            )}

            {!isLoading && error && (
              <Alert className="border-red-200 bg-gradient-to-br from-red-50 to-rose-50 text-red-800 ">
                <XCircle className="h-5 w-5 text-red-600" />
                <AlertTitle className="font-semibold">
                  Unable to Verify Email
                </AlertTitle>
                <AlertDescription className="text-red-700">
                  Please request a new verification link or try signing in
                  again.
                </AlertDescription>
              </Alert>
            )}

            {/* Resend Success */}
            {resendSuccess && (
              <Alert className="border-blue-200 bg-gradient-to-br from-blue-50 to-sky-50 text-blue-800 animate-in slide-in-from-top-2 duration-300">
                <Mail className="h-5 w-5 text-blue-600" />
                <AlertTitle className="font-semibold">Email Sent!</AlertTitle>
                <AlertDescription className="text-blue-700">
                  {resendSuccess}
                </AlertDescription>
              </Alert>
            )}

            {/* Resend Error */}
            {resendError && (
              <Alert className="border-red-200 bg-gradient-to-br from-red-50 to-rose-50  animate-in slide-in-from-top-2 duration-300">
                <XCircle className="h-5 w-5 text-red-600" />
                <AlertTitle className="font-semibold text-red-900">
                  Error
                </AlertTitle>
                <AlertDescription className="text-red-700">
                  {resendError}
                </AlertDescription>
              </Alert>
            )}

            {!isLoading && (
              <div className="flex flex-col gap-3 pt-2">
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200 group"
                  onClick={() => router.push("/auth")}
                >
                  {data ? "Continue to Sign In" : "Back to Sign In"}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>

                {!!error && email && (
                  <Button
                    variant="outline"
                    className="w-full border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 transition-all duration-200"
                    onClick={handleResend}
                    disabled={isResending}
                  >
                    {isResending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    <Mail className="mr-2 h-4 w-4" />
                    Resend Verification Email
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
