import React from "react";
import TopBar from "@/components/navbar/TopBar";
import PrepSwiftNavbar from "@/components/navbar/PrepSwiftNavbar";
import { getCurrentUser } from "@/actions/user";
import PrepSwiftFooter from "@/components/footer/PreSwiftFooter";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const currentUser = await getCurrentUser();

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar currentUser={currentUser} />
      <PrepSwiftNavbar />
      <main className="flex-1">{children}</main>
      <PrepSwiftFooter />
    </div>
  );
}
