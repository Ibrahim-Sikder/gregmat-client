"use client";

import React from "react";
import { ThumbsUp, CheckCircle2, XCircle, Play, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Problem } from "@/types/problem.types";
import {
  QUESTION_TYPE_DISPLAY,
  DIFFICULTY_DISPLAY,
} from "@/types/problem.types";
import { Viewer } from "react-latex-editor";

interface ProblemGridNewProps {
  problems: Problem[];
  hideDifficulty?: boolean;
  onProblemClick?: (problemId: string) => void;
}

// Colors for difficulty badges (using lowercase keys)
const difficultyColors: Record<string, { bg: string; text: string }> = {
  easy: {
    bg: "bg-emerald-500",
    text: "text-white",
  },
  medium: {
    bg: "bg-amber-500",
    text: "text-white",
  },
  hard: {
    bg: "bg-red-500",
    text: "text-white",
  },
  extreme: {
    bg: "bg-purple-600",
    text: "text-white",
  },
  tbd: {
    bg: "bg-gray-500",
    text: "text-white",
  },
};

export default function ProblemGrid({
  problems,
  hideDifficulty = false,
  onProblemClick,
}: ProblemGridNewProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Solved":
        return (
          <div className="flex items-center gap-1 text-emerald-500">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-xs font-medium">Solved</span>
          </div>
        );
      case "Attempted":
        return (
          <div className="flex items-center gap-1 text-amber-500">
            <XCircle className="h-4 w-4" />
            <span className="text-xs font-medium">Attempted</span>
          </div>
        );
      default:
        return (
          <span className="text-xs text-muted-foreground">Not started</span>
        );
    }
  };

  const getDifficultyColors = (difficulty: string) => {
    const lowerDifficulty = difficulty?.toLowerCase() || "tbd";
    return difficultyColors[lowerDifficulty] || difficultyColors.tbd;
  };

  const getDifficultyDisplay = (difficulty: string) => {
    return DIFFICULTY_DISPLAY[difficulty?.toLowerCase()] || difficulty;
  };

  const getTypeDisplay = (type: string) => {
    return QUESTION_TYPE_DISPLAY[type] || type?.replace(/_/g, " ") || "Unknown";
  };

  if (problems.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No problems found. Try adjusting your filters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {problems.map((problem) => {
        const typeTag = getTypeDisplay(problem.type);
        const percentage = problem.successRate || 0;
        const formattedPercentage = percentage.toFixed(1);
        const colors = getDifficultyColors(problem.difficulty);
        const difficultyDisplay = getDifficultyDisplay(problem.difficulty);

        return (
          <Card
            key={problem._id}
            className="group hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onProblemClick?.(problem._id)}
          >
            <CardContent className="p-4 space-y-3">
              {/* Header with difficulty and status */}
              <div className="flex items-center justify-between">
                {!hideDifficulty && (
                  <Badge
                    className={cn(
                      "text-xs font-medium px-2 py-0.5",
                      colors.bg,
                      colors.text,
                    )}
                  >
                    {difficultyDisplay}
                  </Badge>
                )}
                {getStatusIcon(problem.status)}
              </div>

              {/* Title */}
              <div className="block">
                <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                  <Viewer
                    content={
                      problem.browser_title
                        ? problem.browser_title
                        : problem.title
                    }
                  />
                </h3>
              </div>

              {/* Type badge */}
              <Badge variant="outline" className="text-xs font-normal">
                {typeTag}
              </Badge>

              {/* Success rate bar */}
              {!hideDifficulty && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Success Rate</span>
                    <span>{formattedPercentage}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full", colors.bg)}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="px-4 py-3 border-t bg-muted/30 flex items-center justify-between">
              {/* Likes */}
              <div className="flex items-center gap-1.5">
                <ThumbsUp
                  className={cn(
                    "h-4 w-4",
                    problem.liked
                      ? "text-primary fill-primary"
                      : "text-muted-foreground",
                  )}
                />
                <span className="text-xs text-muted-foreground">
                  {problem.likes}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {problem.has_solution_video && (
                  <div className="p-1 rounded hover:bg-muted cursor-pointer">
                    <Play className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
                <div className="p-1 rounded hover:bg-muted cursor-pointer">
                  <Bookmark
                    className={cn(
                      "h-4 w-4",
                      problem.bookmarked
                        ? "text-primary fill-primary"
                        : "text-muted-foreground",
                    )}
                  />
                </div>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
