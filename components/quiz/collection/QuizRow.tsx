"use client";

import { Button } from "@/components/ui/button";
import {
  Calculator,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Maximize2,
  Minimize2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { QuizItem } from "./types";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "next-themes";
import VideoPlayer from "@/components/pages/recordings/VideoPlayer";
import { DraggableModal } from "@/components/shared/modal/DraggableModal";
import AppCalculator from "@/components/AppCalculator";
import CopyLink from "@/components/CopyLink";
import { cn } from "@/lib/utils";

interface QuizRowProps {
  quizItem: QuizItem;
  collectionId?: string;
}

export const QuizRow = ({ quizItem, collectionId }: QuizRowProps) => {
  const { quiz } = quizItem;

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const attempts = quiz.attempts || [];
  const userAttempts = attempts.length;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (isSolutionModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isSolutionModalOpen]);

  const firstAttempt = attempts.find((attempt) => attempt.first === true);
  const lastAttempt =
    attempts.length > 0 ? attempts[attempts.length - 1] : null;

  const userFirstScore = firstAttempt
    ? (firstAttempt.normalized_score * 100).toFixed(2)
    : null;
  const userLastScore = lastAttempt
    ? (lastAttempt.normalized_score * 100).toFixed(2)
    : null;
  const classAverage =
    quiz.normalized_mean_score > 0
      ? (quiz.normalized_mean_score * 100).toFixed(2)
      : null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) +
      " at " +
      date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Main Quiz Row */}
      <div
        className="grid grid-cols-1 md:grid-cols-[3fr_1fr_1fr_1fr_1fr] gap-4 p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Title Column */}
        <div className="flex items-center gap-3">
          <button className="shrink-0 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            )}
          </button>

          <div className="flex items-center gap-2 min-w-0">
            {quiz.is_prepswift && (
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex cursor-help shrink-0">
                      <Image
                        src={isDark ? "/prep-dark.png" : "/prep-light.png"}
                        alt="PrepSwift"
                        width={18}
                        height={18}
                      />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-sm">
                      This content requires a <br />
                      PrepSwift subscription
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            <Link
              href={`/quizzes/${quiz.slug}${
                collectionId ? `?c=${collectionId}` : ""
              }`}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              className="text-blue-600 text-[16px] dark:text-blue-400 hover:underline font-medium line-clamp-2"
            >
              {quiz.title}
            </Link>
          </div>
        </div>

        {/* Score Columns - Hidden on mobile */}
        <div className="hidden md:flex flex-col items-center justify-center">
          {userFirstScore !== null ? (
            <>
              <span className="font-semibold text-gray-900 dark:text-white">
                {userFirstScore}%
              </span>
              <span className="test-sm text-gray-500 dark:text-gray-400">
                {firstAttempt?.score} of {quiz.max_score}
              </span>
            </>
          ) : (
            <span className="text-gray-400 dark:text-gray-500">-</span>
          )}
        </div>

        <div className="hidden md:flex flex-col items-center justify-center">
          {userLastScore !== null ? (
            <>
              <span className="font-semibold text-gray-900 dark:text-white">
                {userLastScore}%
              </span>
              <span className="test-sm text-gray-500 dark:text-gray-400">
                {lastAttempt?.score} of {quiz.max_score}
              </span>
            </>
          ) : (
            <span className="text-gray-400 dark:text-gray-500">-</span>
          )}
        </div>

        <div className="hidden md:flex flex-col items-center justify-center">
          {classAverage !== null ? (
            <>
              <span className="font-semibold text-gray-900 dark:text-white">
                {classAverage}%
              </span>
              <span className="test-sm text-gray-500 dark:text-gray-400">
                {quiz.mean_score.toFixed(1)} of {quiz.max_score}
              </span>
            </>
          ) : (
            <span className="text-gray-400 dark:text-gray-500">-</span>
          )}
        </div>

        <div className="hidden md:flex items-center justify-center">
          <span className="font-medium text-gray-900 dark:text-white">
            {userAttempts}
          </span>
        </div>

        {/* Mobile Stats Row */}
        <div className="md:hidden flex flex-wrap gap-3 text-sm ml-9">
          <div>
            <span className="text-gray-500 dark:text-gray-400">First: </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {userFirstScore ? `${userFirstScore}%` : "-"}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Latest: </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {userLastScore ? `${userLastScore}%` : "-"}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">
              Class Avg:{" "}
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {classAverage ? `${classAverage}%` : "-"}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Attempts: </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {userAttempts}
            </span>
          </div>
        </div>
      </div>

      {/* Expanded Section */}
      {isExpanded && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-t border-blue-100 dark:border-blue-800">
          <div className="p-4">
            {userAttempts > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="p-3 text-left font-semibold rounded-tl-lg">
                        Attempt Date
                      </th>
                      <th className="p-3 text-center font-semibold">
                        Raw Score
                      </th>
                      <th className="p-3 text-center font-semibold">% Score</th>
                      <th className="p-3 text-center font-semibold">
                        Highest Score
                      </th>
                      <th className="p-3 text-center font-semibold">
                        Lowest Score
                      </th>
                      <th className="p-3 text-center font-semibold rounded-tr-lg">
                        Attempts
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800">
                    {attempts.map((attempt, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="p-3 text-gray-700 dark:text-gray-300">
                          {formatDate(attempt.created_at)}
                        </td>
                        <td className="p-3 text-center font-medium text-gray-900 dark:text-white">
                          {attempt.score} of {quiz.max_score}
                        </td>
                        <td className="p-3 text-center font-semibold text-gray-900 dark:text-white">
                          {(attempt.normalized_score * 100).toFixed(2)}%
                        </td>
                        <td className="p-3 text-center text-gray-700 dark:text-gray-300">
                          {quiz.highest_score}
                        </td>
                        <td className="p-3 text-center text-gray-700 dark:text-gray-300">
                          {quiz.lowest_score}
                        </td>
                        <td className="p-3 text-center text-gray-700 dark:text-gray-300">
                          {quiz.number_of_attempts}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No attempts yet.
              </p>
            )}

            {/* Actions Section */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
              {userAttempts ? (
                <>
                  <a
                    href={`/quizzes/${quiz.slug}${
                      collectionId ? `?c=${collectionId}` : ""
                    }`}
                    target="_blank"
                  >
                    <Button variant="default" className="text-white">
                      Retake Quiz
                    </Button>
                  </a>
                  <Button
                    variant="outline"
                    onClick={() => setIsSolutionModalOpen(true)}
                  >
                    View Solutions
                  </Button>
                </>
              ) : (
                <a
                  href={`/quizzes/${quiz.slug}${
                    collectionId ? `?c=${collectionId}` : ""
                  }`}
                >
                  <Button variant="default" className="text-white">
                    Take Quiz
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Custom Solution Dialog */}
      {isSolutionModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsSolutionModalOpen(false)}
        >
          <div
            className={cn(
              "bg-white dark:bg-gray-900 shadow-2xl flex flex-col transition-all duration-300 overflow-hidden",
              isFullScreen
                ? "w-full h-full max-w-none max-h-none rounded-none"
                : "w-full max-w-4xl max-h-[90vh] rounded-xl",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 shrink-0 bg-white dark:bg-gray-900 sticky top-0 z-10">
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {quiz.title}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Solution walkthrough
                </p>
              </div>

              <div className="flex items-center gap-1 ml-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setIsCalculatorOpen(true)}
                  title="Calculator"
                >
                  <Calculator className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </Button>

                <CopyLink
                  link={`${window.location.origin}/quizzes/${quiz.slug}/solutions?v=${quiz?.solution}`}
                />

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => window.open(quiz.solution, "_blank")}
                  title="Open in new tab"
                >
                  <ExternalLink className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  title="Focus mode"
                >
                  {isFullScreen ? (
                    <Minimize2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Maximize2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setIsSolutionModalOpen(false)}
                  title="Close"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </Button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Video Section */}
              {quiz.solution && (
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-black aspect-video shadow-lg">
                  <VideoPlayer videoUrl={quiz.solution} />
                </div>
              )}

              {/* Quiz Links & Content */}
              <div className="space-y-4">
                {quiz.associated_content && (
                  <>
                    <div
                      className=""
                      dangerouslySetInnerHTML={{
                        __html: quiz.associated_content,
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <DraggableModal
        open={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        title="Calculator"
      >
        <AppCalculator />
      </DraggableModal>
    </div>
  );
};
