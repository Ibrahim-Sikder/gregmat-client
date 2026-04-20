"use client";

import React from "react";
import {
  ThumbsUp,
  CheckCircle2,
  XCircle,
  Play,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Problem } from "@/types/problem.types";
import {
  QUESTION_TYPE_DISPLAY,
  DIFFICULTY_DISPLAY,
} from "@/types/problem.types";
import { Viewer } from "react-latex-editor";

interface ProblemTableNewProps {
  problems: Problem[];
  hideDifficulty?: boolean;
  sortField: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
  onProblemClick?: (problemId: string) => void;
}

// Colors for difficulty badges (using lowercase keys to match backend)
const difficultyColors: Record<
  string,
  { bg: string; bar: string; text: string }
> = {
  easy: {
    bg: "bg-teal-500",
    bar: "bg-teal-400",
    text: "text-white",
  },
  medium: {
    bg: "bg-blue-500",
    bar: "bg-blue-400",
    text: "text-white",
  },
  hard: {
    bg: "bg-gray-900",
    bar: "bg-gray-800",
    text: "text-white",
  },
  extreme: {
    bg: "bg-gray-900",
    bar: "bg-gray-800",
    text: "text-white",
  },
  tbd: {
    bg: "bg-gray-500",
    bar: "bg-gray-400",
    text: "text-white",
  },
};

export default function ProblemTable({
  problems,
  hideDifficulty = false,
  sortField,
  sortOrder,
  onSort,
  onProblemClick,
}: ProblemTableNewProps) {
  const getStatusIcon = (hasAttempts: boolean, isCorrect?: boolean) => {
    if (!hasAttempts) return <span className="text-muted-foreground">-</span>;

    return isCorrect ? (
      <CheckCircle2 className="h-5 w-5 text-green-600 fill-green-50" />
    ) : (
      <XCircle className="h-5 w-5 text-red-600 fill-red-50" />
    );
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    );
  };

  const getDifficultyColors = (difficulty: string) => {
    const lowerDifficulty = difficulty?.toLowerCase() || "tbd";
    return difficultyColors[lowerDifficulty] || difficultyColors.tbd;
  };

  // Get display name for difficulty
  const getDifficultyDisplay = (difficulty: string) => {
    return DIFFICULTY_DISPLAY[difficulty?.toLowerCase()] || difficulty;
  };

  // Get display name for question type
  const getTypeDisplay = (type: string) => {
    return QUESTION_TYPE_DISPLAY[type] || type?.replace(/_/g, " ") || "Unknown";
  };

  return (
    <div className="rounded border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[80px] text-center">Status</TableHead>
            <TableHead className="min-w-[300px]">Title</TableHead>
            <TableHead className="w-[100px] text-center">Solution</TableHead>
            <TableHead className="w-[200px]">Type</TableHead>
            {!hideDifficulty && (
              <TableHead className="w-[280px]">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-medium hover:bg-transparent flex items-center"
                  onClick={() => onSort("difficulty")}
                >
                  Difficulty
                  {getSortIcon("difficulty")}
                </Button>
              </TableHead>
            )}
            <TableHead className="w-[100px]">
              <Button
                variant="ghost"
                className="h-auto p-0 font-medium hover:bg-transparent flex items-center"
                onClick={() => onSort("likes")}
              >
                Likes
                {getSortIcon("likes")}
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {problems.map((problem) => {
            const typeTag = getTypeDisplay(problem.type);
            const percentage = problem.successRate || 0;
            const formattedPercentage = percentage.toFixed(2);
            const colors = getDifficultyColors(problem.difficulty);
            const difficultyDisplay = getDifficultyDisplay(problem.difficulty);

            const lastAttempt =
              problem.user_answer_attempts &&
              problem.user_answer_attempts.length > 0
                ? problem.user_answer_attempts.sort(
                    (a, b) =>
                      new Date(b.answered_at).getTime() -
                      new Date(a.answered_at).getTime(),
                  )[0]
                : null;

            const isLastCorrect = lastAttempt?.correct;
            const hasAttempts = !!lastAttempt;

            const rowClass = hasAttempts
              ? isLastCorrect
                ? "bg-green-50 hover:bg-green-100/80 dark:bg-green-950/20 dark:hover:bg-green-950/30"
                : "bg-red-50 hover:bg-red-100/80 dark:bg-red-950/20 dark:hover:bg-red-950/30"
              : "hover:bg-muted/50";

            return (
              <TableRow
                key={problem._id}
                className={cn(
                  "group cursor-pointer transition-colors ",
                  rowClass,
                  hasAttempts
                    ? isLastCorrect
                      ? "border-l-green-500"
                      : "border-l-red-500"
                    : "border-l-transparent",
                )}
                onClick={() => onProblemClick?.(problem._id)}
              >
                <TableCell className="text-center py-4">
                  {getStatusIcon(hasAttempts, isLastCorrect)}
                </TableCell>

                <TableCell className="py-4">
                  <span
                    className="text-base text-foreground hover:text-primary hover:underline font-medium truncate max-w-[300px] block"
                    title={problem.title}
                  >
                    {/* {problem.title} */}
                    <Viewer
                      content={
                        problem.browser_title
                          ? problem.browser_title
                          : problem.title
                      }
                    />
                  </span>
                </TableCell>

                <TableCell className="text-center py-4">
                  {problem.has_solution_video ? (
                    <div className="flex justify-center">
                      <div className="p-1.5  cursor-pointer">
                        <FileText className="h-4 w-4 " />
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>

                <TableCell className="py-4">
                  <Badge
                    variant="outline"
                    className="font-normal text-xs whitespace-nowrap"
                  >
                    {typeTag}
                  </Badge>
                </TableCell>

                {!hideDifficulty && (
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      {/* Progress bar */}
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden min-w-[80px]">
                        <div
                          className={cn("h-full rounded-full", colors.bar)}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      {/* Percentage */}
                      <span className="text-xs text-muted-foreground w-[50px]">
                        {formattedPercentage} %
                      </span>
                      {/* Difficulty badge */}
                      <Badge
                        className={cn(
                          "text-xs font-medium px-2.5 py-0.5",
                          colors.bg,
                          colors.text,
                        )}
                      >
                        {difficultyDisplay}
                      </Badge>
                    </div>
                  </TableCell>
                )}

                <TableCell className="py-4">
                  <div className="flex items-center gap-1.5">
                    <ThumbsUp
                      className={cn(
                        "h-4 w-4",
                        problem.liked
                          ? "text-primary fill-primary"
                          : "text-muted-foreground",
                      )}
                    />
                    <span className="text-sm text-muted-foreground">
                      {problem.likes}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}

          {problems.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={hideDifficulty ? 5 : 6}
                className="text-center py-12 text-muted-foreground"
              >
                No problems found. Try adjusting your filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
