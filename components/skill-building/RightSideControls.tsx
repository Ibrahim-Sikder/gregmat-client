import React from "react";
import { Button } from "@/components/ui/button";
import type { IMainIdeaAttemptResponse } from "@/types/main-idea";
import { format } from "date-fns";

interface Props {
  title: string;
  stats: {
    completed: number;
    skipped: number;
    correct: number;
    incorrect: number;
  };
  onAttemptAgain: () => void;
  onFeedback: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onContext: () => void;
  attempts: IMainIdeaAttemptResponse[];
  onViewAttempt: (attempt: IMainIdeaAttemptResponse) => void;
  isReviewMode: boolean;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export default function RightSideControls({
  title,
  stats,
  onAttemptAgain,
  onFeedback,
  onPrevious,
  onNext,
  onContext,
  attempts,
  onViewAttempt,
  isReviewMode,
  onSubmit,
  isSubmitting = false,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-6 text-gray-900">{title}</h3>

        <div className="grid grid-cols-4 gap-2 mb-8 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.completed}
            </div>
            <div className="text-xs text-gray-500 mt-1">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.skipped}
            </div>
            <div className="text-xs text-gray-500 mt-1">Skipped</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.correct}
            </div>
            <div className="text-xs text-gray-500 mt-1">Correct</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.incorrect}
            </div>
            <div className="text-xs text-gray-500 mt-1">Incorrect</div>
          </div>
        </div>

        <div className="space-y-3">
          {isReviewMode ? (
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={onAttemptAgain}
            >
              Attempt Again
            </Button>
          ) : (
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={onSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={onPrevious}
            >
              ← Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={onNext}
            >
              Next →
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={onContext}
            >
              Context
            </Button>
          </div>

          <Button variant="outline" className="w-full" onClick={onFeedback}>
            Feedback
          </Button>
        </div>
      </div>

      {attempts.length > 0 && (
        <div>
          <h4 className="font-semibold mb-3 text-gray-900">Attempts</h4>
          <div className="space-y-2">
            {attempts.map((attempt, index) => (
              <div
                key={attempt._id}
                className="bg-white p-3 rounded border hover:bg-gray-50 cursor-pointer flex justify-between items-center text-xs"
                onClick={() => onViewAttempt(attempt)}
              >
                <span className="font-medium text-gray-900">
                  Attempt {attempts.length - index}
                </span>
                <span className="text-gray-500">
                  {format(
                    new Date(attempt.createdAt),
                    "MMMM d, yyyy 'at' h:mm a",
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
