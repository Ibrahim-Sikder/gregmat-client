"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function PrepSwiftNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/prep-swift" className="flex items-center gap-2">
            <Image
              src="/prepswift.png"
              alt="Prep Swift Logo"
              width={160}
              height={60}
              priority
              className="object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-10 md:flex">
            <NavLink href="/prep-swift/quizzes">Quizzes</NavLink>

            <NavLink
              href="/quizzes/super-quiz"
              target="_blank"
              rel="noopener noreferrer"
            >
              Super Quiz
            </NavLink>

            <NavLink href="/prep-swift/bookmarked">Bookmarked</NavLink>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden rounded-lg p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-0 focus:ring-gray-300"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav */}
        {open && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-4">
            <MobileNavLink href="/prep-swift/quizzes/all?website=GMPS">
              Quizzes
            </MobileNavLink>
            <MobileNavLink
              href="/quizzes/super-quiz"
              target="_blank"
              rel="noopener noreferrer"
            >
              Super Quiz
            </MobileNavLink>
            <MobileNavLink href="/prep-swift/bookmarked">
              Bookmarked
            </MobileNavLink>
          </div>
        )}
      </div>
    </header>
  );
}

/* ---------- Reusable Components ---------- */

function NavLink({ href, children, ...props }: any) {
  return (
    <Link
      href={href}
      {...props}
      className="relative text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-gray-900 after:transition-all hover:after:w-full"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, ...props }: any) {
  return (
    <Link
      href={href}
      {...props}
      className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    >
      {children}
    </Link>
  );
}
