"use client";

import React from "react";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type AppLinkProps = LinkProps & {
  children: React.ReactNode;
  className?: string;
  target?: string;
  activeClassName?: string;
};

export default function AppLink({
  href,
  children,
  target,
  className,
  activeClassName = "text-blue-600 dark:text-yellow-400 font-semibold",
  ...props
}: AppLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      target={target}
      className={cn(
        "transition-colors hover:text-blue-500 dark:hover:text-yellow-300",
        className,
        isActive && activeClassName,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
