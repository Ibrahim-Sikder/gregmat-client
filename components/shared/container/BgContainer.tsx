import { cn } from "@/lib/utils";
import React, { JSX } from "react";

type BackgroundVariant =
  | "primary"
  | "secondary"
  | "hero"
  | "study"
  | "focus"
  | "library"
  | "notes"
  | "minimal"
  | "abstract";

type Props = {
  children: React.ReactNode;
  className?: string;
  variant?: BackgroundVariant;
  animated?: boolean;
};

const backgroundVariants = {
  primary: `
    bg-white dark:bg-slate-900
    relative overflow-hidden
  `,

  secondary: `
    bg-gradient-to-br from-blue-50 via-white to-cyan-50
    dark:from-slate-800 dark:via-blue-900/50 dark:to-slate-900
    relative overflow-hidden
    before:absolute before:top-0 before:left-0 before:w-3/4 before:aspect-square
    before:bg-gradient-to-br before:from-blue-400/20 before:via-cyan-400/15 before:to-transparent
    dark:before:from-blue-500/25 dark:before:via-cyan-400/20 dark:before:to-transparent
    before:rounded-[60%] before:-translate-x-1/2 before:-translate-y-1/2 before:pointer-events-none
    after:absolute after:bottom-0 after:right-0 after:w-2/3 after:aspect-square
    after:bg-gradient-to-tl after:from-blue-500/25 after:via-blue-600/15 after:to-transparent
    dark:after:from-blue-400/30 dark:after:via-indigo-500/20 dark:after:to-transparent
    after:rounded-[45%] after:translate-x-1/3 after:translate-y-1/3 after:pointer-events-none
  `,

  hero: `
    bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-100
    dark:from-slate-900 dark:via-blue-900/60 dark:to-slate-800
    relative overflow-hidden
    before:absolute before:top-0 before:left-0 before:w-full before:aspect-video
    before:bg-gradient-to-br before:from-blue-500/8 before:via-transparent before:to-cyan-500/12
    dark:before:from-blue-400/15 dark:before:via-transparent dark:before:to-cyan-400/10
    before:rounded-[40%] before:-translate-y-1/4 before:pointer-events-none
    after:absolute after:bottom-0 after:right-0 after:w-4/5 after:aspect-video
    after:bg-gradient-to-tl after:from-blue-600/10 after:via-transparent after:to-indigo-500/8
    dark:after:from-blue-500/20 dark:after:via-transparent dark:after:to-indigo-400/15
    after:rounded-[35%] after:translate-y-1/4 after:pointer-events-none
  `,

  study: `
    bg-gradient-to-br from-blue-100/60 via-white to-blue-50/80
    dark:from-slate-800 dark:via-blue-900/40 dark:to-slate-900
    relative overflow-hidden
    before:absolute before:inset-0
    before:bg-gradient-to-br before:from-blue-400/6 before:via-transparent before:to-cyan-400/8
    dark:before:from-blue-500/12 dark:before:via-transparent dark:before:to-cyan-400/10
    before:pointer-events-none
  `,

  focus: `
    bg-gradient-to-br from-slate-100 via-blue-100/80 to-white
    dark:from-slate-800 dark:via-blue-900 dark:to-blue-800
    relative overflow-hidden
    before:absolute before:inset-0
    before:bg-gradient-to-br before:from-blue-400/8 before:via-transparent before:to-indigo-400/10
    dark:before:from-blue-400/15 dark:before:via-transparent dark:before:to-indigo-500/12
    before:pointer-events-none
  `,

  library: `
    bg-gradient-to-br from-blue-50 via-cyan-50 to-white
    dark:from-slate-900 dark:via-blue-900/70 dark:to-slate-800
    relative overflow-hidden
    before:absolute before:inset-0
    before:bg-gradient-to-br before:from-cyan-400/8 before:via-transparent before:to-blue-400/6
    dark:before:from-cyan-400/12 dark:before:via-transparent dark:before:to-blue-500/10
    before:pointer-events-none
  `,

  notes: `
    bg-gradient-to-br from-white via-blue-50/50 to-cyan-50/70
    dark:from-slate-900 dark:via-blue-900/30 dark:to-slate-800
    relative overflow-hidden
    before:absolute before:inset-0
    before:bg-gradient-to-br before:from-blue-400/5 before:via-transparent before:to-cyan-400/7
    dark:before:from-blue-400/10 dark:before:via-transparent dark:before:to-cyan-500/8
    before:pointer-events-none
  `,

  minimal: `
    bg-white
    relative overflow-hidden
  `,

  abstract: `
    bg-gradient-to-br from-white via-blue-50 to-cyan-100/80
    dark:from-slate-900 dark:via-blue-900/80 dark:to-slate-800
    relative overflow-hidden
    before:absolute before:top-0 before:left-0 before:w-full before:aspect-square
    before:bg-gradient-to-br before:from-blue-500/10 before:via-cyan-400/8 before:to-transparent
    dark:before:from-blue-400/20 dark:before:via-cyan-400/15 dark:before:to-transparent
    before:rounded-[30%] before:-translate-x-1/3 before:-translate-y-1/3 before:pointer-events-none
    after:absolute after:bottom-0 after:right-0 after:w-5/6 after:aspect-square
    after:bg-gradient-to-tl after:from-indigo-500/8 after:via-blue-500/6 after:to-transparent
    dark:after:from-indigo-400/18 dark:after:via-blue-400/12 dark:after:to-transparent
    after:rounded-[25%] after:translate-x-1/4 after:translate-y-1/4 after:pointer-events-none
  `,
};

const FloatingElements = ({
  variant,
  animated,
}: {
  variant: BackgroundVariant;
  animated?: boolean;
}) => {
  const animationClass = animated ? "animate-pulse duration-[4000ms]" : "";

  const shapeElements: Record<BackgroundVariant, JSX.Element | null> = {
    primary: null,
    minimal: null,

    hero: (
      <>
        {/* Large organic blob - top left */}
        <div
          className={`absolute -top-10 -left-10 w-1/3 aspect-[4/3] ${animationClass} overflow-hidden`}
        >
          <div className="w-full aspect-[4/3] bg-gradient-to-br from-blue-500/15 to-cyan-500/10 dark:from-blue-400/25 dark:to-cyan-400/20 rounded-[60%] transform rotate-12 blur-xl" />
        </div>

        {/* Flowing wave shape - top right */}
        <div className="absolute top-0 right-0 w-1/2 aspect-[3/2] transform rotate-45 translate-x-1/4 -translate-y-1/4 overflow-hidden">
          <div className="w-full aspect-[3/2] bg-gradient-to-bl from-blue-400/12 to-transparent dark:from-blue-500/20 dark:to-transparent rounded-[40%] blur-lg" />
        </div>

        {/* Bottom flowing element */}
        <div
          className={`absolute -bottom-10 -right-10 w-2/5 aspect-square ${animationClass} overflow-hidden`}
          style={{ animationDelay: "1s" }}
        >
          <div className="w-full aspect-square bg-gradient-to-tl from-blue-600/12 to-indigo-400/8 dark:from-blue-500/22 dark:to-indigo-400/15 rounded-[50%] transform -rotate-12 blur-2xl" />
        </div>
      </>
    ),

    study: (
      <>
        {/* Large abstract shape */}
        <div
          className={`absolute top-0 right-0 w-1/3 aspect-[3/2] ${animationClass} overflow-hidden`}
        >
          <div className="w-full aspect-[3/2] bg-gradient-to-br from-blue-400/10 to-blue-600/8 dark:from-blue-400/18 dark:to-blue-500/15 rounded-[65%] transform rotate-45 blur-xl" />
        </div>

        {/* Organic flowing element */}
        <div className="absolute bottom-0 left-0 w-2/5 aspect-[4/3] transform -rotate-12 -translate-x-1/6 translate-y-1/6 overflow-hidden">
          <div className="w-full aspect-[4/3] bg-gradient-to-tr from-cyan-400/8 to-blue-500/6 dark:from-cyan-400/15 dark:to-blue-400/12 rounded-[55%] blur-lg" />
        </div>
      </>
    ),

    focus: (
      <>
        {/* Large dark mode blob */}
        <div
          className={`absolute top-0 left-0 w-2/5 aspect-[5/3] ${animationClass} overflow-hidden`}
        >
          <div className="w-full aspect-[5/3] bg-gradient-to-br from-blue-400/20 to-indigo-500/15 dark:from-blue-400/30 dark:to-indigo-400/25 rounded-[45%] transform -rotate-12 blur-2xl" />
        </div>

        {/* Corner accent shape */}
        <div className="absolute bottom-0 right-0 w-1/3 aspect-square transform rotate-6 translate-x-1/6 translate-y-1/6 overflow-hidden">
          <div className="w-full aspect-square bg-gradient-to-tl from-cyan-400/15 to-blue-500/10 dark:from-cyan-400/25 dark:to-blue-400/20 rounded-[70%] blur-xl" />
        </div>
      </>
    ),

    library: (
      <>
        <div
          className={`absolute top-0 left-0 w-1/3 aspect-[4/3] ${animationClass} overflow-hidden`}
        >
          <div className="w-full aspect-[4/3] bg-gradient-to-br from-cyan-400/12 to-blue-500/8 dark:from-cyan-400/20 dark:to-blue-400/15 rounded-[55%] transform rotate-12 blur-lg" />
        </div>
      </>
    ),

    notes: (
      <>
        <div
          className={`absolute top-0 right-0 w-1/4 aspect-[3/2] ${animationClass} overflow-hidden`}
        >
          <div className="w-full aspect-[3/2] bg-gradient-to-br from-blue-400/8 to-cyan-500/6 dark:from-blue-400/15 dark:to-cyan-400/12 rounded-[50%] blur-xl" />
        </div>
      </>
    ),

    abstract: (
      <>
        {/* Multiple layered abstract shapes */}
        <div
          className={`absolute -top-16 -left-16 w-1/2 aspect-[3/2] ${animationClass} overflow-hidden`}
        >
          <div className="w-full aspect-[3/2] bg-gradient-to-br from-blue-500/15 to-cyan-500/10 dark:from-blue-400/25 dark:to-cyan-400/20 rounded-[70%] transform rotate-12 blur-2xl" />
        </div>

        <div className="absolute top-1/4 right-0 w-1/3 aspect-square transform rotate-45 translate-x-1/3 overflow-hidden">
          <div className="w-full aspect-square bg-gradient-to-bl from-blue-400/12 to-transparent dark:from-blue-500/20 dark:to-transparent rounded-[40%] blur-xl" />
        </div>

        <div
          className={`absolute -bottom-20 -right-20 w-3/5 aspect-[4/3] ${animationClass} overflow-hidden`}
          style={{ animationDelay: "2s" }}
        >
          <div className="w-full aspect-[4/3] bg-gradient-to-tl from-blue-600/12 to-indigo-400/8 dark:from-blue-500/22 dark:to-indigo-400/18 rounded-[55%] transform -rotate-6 blur-3xl" />
        </div>
      </>
    ),

    secondary: (
      <>
        <div
          className={`absolute top-0 right-0 w-2/5 aspect-[3/2] ${animationClass} overflow-hidden`}
        >
          <div className="w-full aspect-[3/2] bg-gradient-to-br from-blue-400/15 to-cyan-500/10 dark:from-blue-400/25 dark:to-cyan-400/20 rounded-[50%] transform rotate-6 blur-xl" />
        </div>
      </>
    ),
  };

  return shapeElements[variant] || null;
};

export default function BgContainer({
  children,
  className = "",
  variant = "primary",
  animated = false,
}: Props) {
  const baseClasses = "relative w-full isolate";
  const variantClasses = backgroundVariants[variant];

  return (
    <div className={cn(baseClasses, variantClasses, className)}>
      <FloatingElements variant={variant} animated={animated} />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}

export type { BackgroundVariant };
