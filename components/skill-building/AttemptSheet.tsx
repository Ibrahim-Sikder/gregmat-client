import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { IMainIdeaAttemptResponse, IParagraph } from "@/types/main-idea";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attempt: IMainIdeaAttemptResponse | null;
  paragraphs: IParagraph[];
  onReviewInEditor: (attempt: IMainIdeaAttemptResponse) => void;
}

export default function AttemptSheet({
  open,
  onOpenChange,
  attempt,
  paragraphs,
  onReviewInEditor,
}: Props) {
  if (!attempt) return null;

  const totalParagraphs = attempt.paragraph_attempts.length;
  const maxScore = totalParagraphs * 10;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / (total * 10)) * 100;
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getParagraph = (
    attemptPara: string | IParagraph,
  ): IParagraph | undefined => {
    if (typeof attemptPara === "string") {
      return paragraphs.find((p) => p._id === attemptPara);
    }
    return attemptPara as IParagraph;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Attempt Feedback</SheetTitle>
          <SheetDescription>
            Detailed feedback for your attempt on{" "}
            {formatDate(attempt.createdAt)}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">Overall Score</h3>
              <Badge
                className={`${getScoreColor(
                  attempt.score,
                  totalParagraphs,
                )} text-white text-lg`}
              >
                {attempt.score}/{maxScore}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              {((attempt.score / maxScore) * 100).toFixed(1)}% -{" "}
              {attempt.score / maxScore >= 0.8
                ? "Excellent!"
                : attempt.score / maxScore >= 0.6
                  ? "Good job!"
                  : "Keep practicing!"}
            </p>
            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full bg-white hover:bg-gray-50 text-blue-600 border-blue-200"
                onClick={() => {
                  onReviewInEditor(attempt);
                  onOpenChange(false);
                }}
              >
                Review in Context Editor
              </Button>
            </div>
          </div>

          {attempt.paragraph_attempts.map((paraAttempt, index) => {
            const paragraph = getParagraph(paraAttempt.paragraph);

            return (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Paragraph {index + 1}</h4>
                  <Badge
                    variant={
                      paraAttempt.gpt_score && paraAttempt.gpt_score >= 8
                        ? "default"
                        : "destructive"
                    }
                  >
                    Score: {paraAttempt.gpt_score || 0}/10
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Your Answer:
                    </p>
                    <p className="text-sm bg-gray-50 p-2 rounded">
                      {paraAttempt.given_main_idea || "No answer provided"}
                    </p>
                  </div>

                  {paragraph && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Correct Main Idea:
                      </p>
                      <p className="text-sm bg-green-50 p-2 rounded">
                        {paragraph.main_idea}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      GPT Feedback:
                    </p>
                    <p className="text-sm bg-blue-50 p-2 rounded">
                      {paraAttempt.gpt_comment || "No feedback available"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
