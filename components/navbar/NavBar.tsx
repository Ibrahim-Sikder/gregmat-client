"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // ✅ To detect active route
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Search, GraduationCap } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

import { getIcon } from "@/lib/icon";
import { TNavLinks } from "./types";
import AppLink from "../AppLink";
import SearchModal from "./SearchModal";
import Container from "../shared/container/Container";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function Navbar({ navLinks }: { navLinks: TNavLinks }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const handleLinkClick = () => {
    setTimeout(() => {
      const closeButton = document.querySelector('[data-state="open"]');
      if (closeButton) (closeButton as HTMLElement).click();
    }, 100);
  };

  const isDark = resolvedTheme === "dark";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <Container className="h-16 px-2">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={"/"} className="flex items-center gap-2.5 group">
            {!isDark ? (
              <Image
                src="/gregmat-light.png"
                alt="gregmat Logo"
                width={150}
                height={60}
              />
            ) : (
              <Image
                src="/gregmat-dark.png"
                alt="gregmat Logo"
                width={150}
                height={60}
              />
            )}
          </Link>

          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="flex items-center gap-1">
              {navLinks.map((category, categoryIndex) => (
                <NavigationMenuItem key={categoryIndex}>
                  {category.children && category.children.length > 0 ? (
                    <>
                      <NavigationMenuTrigger
                        className={cn(
                          "bg-transparent h-10 px-4 py-2 text-sm font-medium transition-colors rounded-md",
                          "hover:bg-accent hover:text-accent-foreground",
                          "data-[state=open]:bg-accent/80",
                        )}
                      >
                        {category?.categoryname}
                      </NavigationMenuTrigger>

                      <NavigationMenuContent>
                        <div className="grid grid-cols-2 gap-2 p-4 w-[600px]">
                          {category.children.map((item, itemIndex) => {
                            const IconComponent = getIcon(item.iconName);
                            const isActive = pathname === item.href;

                            return (
                              <div
                                key={itemIndex}
                                className={cn(
                                  "group rounded-xl transition-all duration-200",
                                )}
                              >
                                <AppLink
                                  target={item?.target}
                                  href={item?.href || ""}
                                  onClick={handleLinkClick}
                                >
                                  <div className="flex items-start gap-3 p-2">
                                    <div
                                      className={cn(
                                        "p-2 rounded-xl flex-shrink-0 shadow-sm transition-all duration-200",
                                        isActive
                                          ? "bg-primary text-white"
                                          : "bg-blue-600 text-white group-hover:scale-105",
                                      )}
                                    >
                                      <IconComponent className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h3
                                        className={cn(
                                          "font-semibold mb-1 leading-tight",
                                          isActive
                                            ? "text-primary"
                                            : "text-foreground group-hover:text-blue-600",
                                        )}
                                      >
                                        {item?.subCategoryname}
                                      </h3>
                                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                        {item?.subTitle}
                                      </p>
                                    </div>
                                  </div>
                                </AppLink>
                              </div>
                            );
                          })}
                        </div>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink
                      asChild
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent h-10 px-4 py-2 text-sm font-medium transition-colors rounded-md",
                        "hover:bg-accent hover:text-accent-foreground",
                        pathname === category.href
                          ? "bg-primary text-white shadow-sm"
                          : "",
                      )}
                    >
                      <Link href={category?.href || "#"}>
                        {category?.categoryname}
                      </Link>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
            <NavigationMenuViewport className="shadow-lg" />
          </NavigationMenu>

          {/* ================= Right Side (Search) ================= */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              onClick={() => setIsOpenSearch((prev) => !prev)}
              variant="ghost"
              size="icon"
              className="bg-accent cursor-pointer"
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </div>

          {/* ================= Mobile Menu ================= */}
          <div className="lg:hidden flex items-center">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-accent">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-80 sm:w-96 overflow-y-auto p-0"
              >
                <div className="sticky top-0 bg-background border-b border-border z-10 px-6 py-4">
                  <SheetTitle className="text-left">
                    <Link
                      href="/"
                      className="flex items-center gap-2.5"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
                        <GraduationCap className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xl font-bold text-foreground">
                        GREGmat
                      </span>
                    </Link>
                  </SheetTitle>
                </div>

                <Accordion type="single" collapsible className="px-4 py-2">
                  {navLinks.map((category) => (
                    <AccordionItem
                      key={category.categoryname}
                      value={category.categoryname}
                      className="border-b border-border/50"
                    >
                      <AccordionTrigger className="text-sm font-semibold hover:no-underline py-4">
                        {category.categoryname}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-1 pb-4">
                          {category.children?.map((subCategory) => {
                            const IconComponent = getIcon(subCategory.iconName);
                            const isActive = pathname === subCategory.href;

                            return (
                              <Link
                                key={subCategory.subCategoryname}
                                href={subCategory.href}
                                className={cn(
                                  "flex items-start gap-3 p-3 rounded-lg transition-colors group",
                                  isActive
                                    ? "text-blue-500 "
                                    : "hover:bg-accent",
                                )}
                                onClick={() => setIsOpen(false)}
                              >
                                <div
                                  className={cn(
                                    "p-2 rounded-lg flex-shrink-0 transition-transform",
                                    isActive
                                      ? "bg-primary text-white"
                                      : "bg-blue-600 text-white group-hover:scale-105",
                                  )}
                                >
                                  <IconComponent className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={cn(
                                      "text-sm font-semibold mb-1 leading-tight",
                                      isActive
                                        ? "text-primary"
                                        : "text-foreground group-hover:text-blue-600",
                                    )}
                                  >
                                    {subCategory.subCategoryname}
                                  </p>
                                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                    {subCategory.subTitle}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
      <SearchModal open={isOpenSearch} onOpenChange={setIsOpenSearch} />
    </nav>
  );
}
