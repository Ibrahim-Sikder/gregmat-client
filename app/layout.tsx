import { Toaster } from "@/components/ui/sonner";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import React from "react";
import StoreProvider from "@/components/StoreProvider";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { ToastContainer } from "react-toastify";

// Google fallback font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Nexa fonts (local)
const nexaBold = localFont({
  src: "../public/fonts/NexaBold.otf",
  variable: "--font-nexa-bold",
  weight: "700",
  display: "swap",
});

const nexaLight = localFont({
  src: "../public/fonts/NexaLight.otf",
  variable: "--font-nexa-light",
  weight: "300",
  display: "swap",
});

const nexaRegular = localFont({
  src: "../public/fonts/NexaRegular.ttf",
  variable: "--font-nexa-regular",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Home - GregMat",
  description: "All series and courses available",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${nexaBold.variable}
          ${nexaLight.variable}
          ${inter.variable}
          ${nexaRegular.variable}
          font-sans antialiased
        `}
      >
        <ThemeProvider>
          <Toaster />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          <NextTopLoader showSpinner={false} color="#005B96" />
          <StoreProvider>{children}</StoreProvider>
        </ThemeProvider>
        <GoogleAnalytics
          gaId={(process.env.NEXT_PUBLIC_GA_ID as string) || ""}
        />
        <GoogleTagManager
          gtmId={(process.env.NEXT_PUBLIC_GTM_ID as string) || ""}
        />
      </body>
    </html>
  );
}
