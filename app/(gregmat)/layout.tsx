import React from "react";
import TopBar from "@/components/navbar/TopBar";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/NavBar";
import { buildNavLinks } from "@/components/navbar/navLinks";
import { getCurrentUser } from "@/actions/user";

export default async function Layout({
  children,
  authSlot,
  userSlot,
}: Readonly<{
  children: React.ReactNode;
  authSlot: React.ReactNode;
  userSlot: React.ReactNode;
}>) {
  const [navLinks, currentUser] = await Promise.all([
    buildNavLinks(),
    getCurrentUser(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <TopBar currentUser={currentUser} />
      <Navbar navLinks={navLinks} />
      <main className="grow">
        {authSlot}
        {userSlot}
        {children}
      </main>
      <Footer navLinks={navLinks} />
    </div>
  );
}
