import { ChevronDown, ChevronRight } from "lucide-react";
import { QuizRow } from "./QuizRow";
import { QuizGroup } from "./types";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface QuizGroupAccordionProps {
  group: QuizGroup;
  isExpanded: boolean;
  onToggle: () => void;
  collectionId?: string;
  collectionSlug?: string;
}

export const QuizGroupAccordion = ({
  group,
  isExpanded,
  onToggle,
  collectionId,
  collectionSlug,
}: QuizGroupAccordionProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const completedQuizzes = group.statistics?.completed_quizzes || 0;
  const totalQuizzes = group.statistics?.total_quizzes || group.quizzes.length;

  // Format averages as percentages
  const firstAttemptAvg =
    group.statistics?.first_attempt_average > 0
      ? `${(group.statistics?.normalized_first_attempt_average * 100).toFixed(
          2,
        )}%`
      : "-";

  const lastAttemptAvg =
    group.statistics?.latest_attempt_average > 0
      ? `${(group.statistics?.normalized_latest_attempt_average * 100).toFixed(
          2,
        )}%`
      : "-";

  // Get class average for the group
  const classAvg =
    group.quizzes.length > 0
      ? (() => {
          const validQuizzes = group.quizzes.filter(
            (q) => q.quiz.normalized_mean_score > 0,
          );
          if (validQuizzes.length === 0) return "-";
          const avg =
            validQuizzes.reduce(
              (sum, q) => sum + q.quiz.normalized_mean_score,
              0,
            ) / validQuizzes.length;
          return `${(avg * 100).toFixed(2)}%`;
        })()
      : "-";

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Accordion Header - Quiz Group Row */}
      <div
        className="grid grid-cols-1 md:grid-cols-[4fr_1fr_1fr_1fr_1fr] gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer bg-white dark:bg-gray-900"
        onClick={onToggle}
      >
        {/* Title Column */}
        <div className="flex items-center gap-3">
          <button
            className="shrink-0 p-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>

          <div className="flex items-center gap-2 min-w-0">
            {group.website === "GMPS" && (
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex cursor-help shrink-0">
                      <Image
                        src={isDark ? "/prep-dark.png" : "/prep-light.png"}
                        alt="PrepSwift"
                        width={20}
                        height={20}
                      />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-sm text-center">
                      This content requires a <br />
                      PrepSwift subscription
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            <Link
              href={`/quizzes/collection/${collectionSlug}/${group.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate text-xl"
            >
              {group.title}
            </Link>
          </div>
        </div>

        {/* Stats Columns - Hidden on mobile */}
        <div className="hidden md:flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800/30 rounded-md px-3 py-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 md:hidden">
            Completed
          </span>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Completed
            </span>
            <span className="font-semibold text-xs text-gray-900 dark:text-white">
              {completedQuizzes} out of {totalQuizzes}
            </span>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800/30 rounded-md px-3 py-2">
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate">
              My First Attempt Aver...
            </span>
            <span className="font-semibold text-xs text-gray-900 dark:text-white">
              {firstAttemptAvg}
            </span>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800/30 rounded-md px-3 py-2">
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate">
              My Latest Attempt Ave...
            </span>
            <span className="font-semibold text-xs text-gray-900 dark:text-white">
              {lastAttemptAvg}
            </span>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800/30 rounded-md px-3 py-2">
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate">
              Class Avg. (First Attem...
            </span>
            <span className="font-semibold text-xs text-gray-900 dark:text-white">
              {classAvg}
            </span>
          </div>
        </div>

        {/* Mobile Stats Row */}
        <div className="md:hidden flex flex-wrap gap-4 text-sm ml-9 mt-2">
          <div>
            <span className="text-gray-500 dark:text-gray-400">
              Completed:{" "}
            </span>
            <span className="font-semibold text-xs text-gray-900 dark:text-white">
              {completedQuizzes}/{totalQuizzes}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">First: </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {firstAttemptAvg}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Latest: </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {lastAttemptAvg}
            </span>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
          {group.quizzes.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-base">
                No quizzes available in this section yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {group.quizzes.map((quizItem: any) => (
                <QuizRow
                  key={quizItem.quiz._id}
                  quizItem={quizItem}
                  collectionId={collectionId}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
