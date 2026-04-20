"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Calculator,
  ChevronDown,
  CircleUserRound,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import AppCalculator from "../AppCalculator";
import AppLink from "../AppLink";
import Container from "../shared/container/Container";
import { DraggableModal } from "../shared/modal/DraggableModal";
import { topLinks } from "./topBarLinks";
import { IUser } from "@/actions/user";
import ThemeToggle from "./ThemeToggle ";

interface TopBarProps {
  currentUser?: IUser | null;
}

export default function TopBar({ currentUser }: TopBarProps) {
  const [calculatorOpen, setCalculator] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <Container className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60 px-2">
        <div className="relative flex items-center justify-between py-3 lg:py-3.5">
          {/* Left Section: Mobile Menu */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden hover:bg-accent transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Center Navigation (Desktop) */}
          <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-1">
            {topLinks.map(({ link, title }, index) => {
              const isActive = pathname === link;
              return (
                <Link
                  key={index}
                  href={link}
                  className={cn(
                    "relative whitespace-nowrap px-4 py-2  text-sm font-medium transition-all duration-200 overflow-hidden group",
                    isActive
                      ? "border-b border-blue-500"
                      : "hover:bg-accent/80",
                  )}
                >
                  <span className="relative z-10">{title}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Optional Theme Toggle */}
            <ThemeToggle />

            {/* Calculator Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCalculator((prev) => !prev)}
              className={cn(
                "bg-primary/5 text-primary hover:bg-primary/10 transition-colors cursor-pointer",
              )}
              aria-label="Open calculator"
            >
              <Calculator className="h-5 w-5" />
            </Button>

            {/* Pricing Link */}
            <AppLink
              href="/pricing"
              className="hidden sm:inline-flex px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 hover:bg-primary/20 transition-all duration-200 ml-1"
            >
              Pricing
            </AppLink>

            {/* User Section */}
            {currentUser?._id ? (
              <Link
                href="/user"
                className="group relative inline-flex items-center justify-center"
              >
                <Avatar className="rounded-lg">
                  {currentUser?.profilePicture ? (
                    <AvatarImage
                      src={currentUser.profilePicture || "/placeholder.svg"}
                      alt={currentUser.username}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <AvatarFallback className="rounded-lg">
                      {currentUser.username?.charAt(0).toUpperCase() ?? (
                        <CircleUserRound className="h-6 w-6 text-primary" />
                      )}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Link>
            ) : (
              <AppLink
                href="/auth"
                className="hidden sm:inline-flex px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 hover:bg-primary/20 transition-all duration-200 ml-1"
              >
                Login
              </AppLink>
            )}
          </div>
        </div>
      </Container>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[57px] z-40 bg-background/95 backdrop-blur-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <Container>
            <nav className="flex flex-col py-4 space-y-1">
              {topLinks.map(({ link, title }, index) => {
                const isActive = pathname === link;
                return (
                  <AppLink
                    key={index}
                    href={link}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 border-l-2",
                      isActive
                        ? "bg-primary/10 text-primary border-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/80 border-transparent hover:border-primary",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      {title}
                      <ChevronDown className="h-4 w-4 -rotate-90" />
                    </div>
                  </AppLink>
                );
              })}

              {/* Mobile Pricing */}
              <AppLink
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="sm:hidden px-4 py-3 rounded-lg text-base font-medium bg-primary/5 text-primary hover:bg-primary/10 transition-all duration-200 mt-2"
              >
                <div className="flex items-center justify-between">
                  Pricing
                  <ChevronDown className="h-4 w-4 -rotate-90" />
                </div>
              </AppLink>
            </nav>
          </Container>
        </div>
      )}

      {/* Calculator Modal */}
      <DraggableModal
        title="Calculator"
        open={calculatorOpen}
        onClose={() => setCalculator(false)}
      >
        <AppCalculator />
      </DraggableModal>
    </>
  );
}
