"use client";

import { useEffect } from "react";
import Container from "@/components/shared/container/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error details for debugging
    console.error("Mountain page error:", error);
  }, [error]);

  const isNetworkError =
    error.message.includes("fetch") || error.message.includes("network");
  const is404Error =
    error.message.includes("404") || error.message.includes("not found");

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Container>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {is404Error ? "Mountain Not Found" : "Something Went Wrong"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {is404Error
                    ? "The mountain you're looking for doesn't exist or has been moved."
                    : isNetworkError
                    ? "We're having trouble connecting to our servers. Please check your internet connection and try again."
                    : "An unexpected error occurred while loading this mountain."}
                </p>

                {process.env.NODE_ENV === "development" && (
                  <details className="text-left mt-4">
                    <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700">
                      Technical Details
                    </summary>
                    <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-700 dark:text-gray-300 overflow-auto">
                      {error.message}
                      {error.digest && `\nDigest: ${error.digest}`}
                    </pre>
                  </details>
                )}
              </div>

              <div className="space-y-4">
                <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                  <p className="font-medium">What you can try:</p>
                  <ul className="text-left space-y-1 pl-4">
                    <li>• Refresh the page</li>
                    <li>• Check your internet connection</li>
                    <li>• Go back to the mountains list</li>
                    {isNetworkError && <li>• Try again in a few moments</li>}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    onClick={reset}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Link href="/mountains">Browse Mountains</Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Link href="/">
                      <Home className="h-4 w-4" />
                      Go Home
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </main>
  );
}
