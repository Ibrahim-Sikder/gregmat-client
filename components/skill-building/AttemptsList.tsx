"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import type { IMainIdeaAttemptResponse, IParagraph } from "@/types/main-idea";
import { FileText, Calendar, Award } from "lucide-react";
import { useState } from "react";

interface AttemptsListProps {
  attempts: IMainIdeaAttemptResponse[];
  onViewAttempt: (attempt: IMainIdeaAttemptResponse) => void;
}

export default function AttemptsList({
  attempts,
  onViewAttempt,
}: AttemptsListProps) {
  const [selectedAttempt, setSelectedAttempt] =
    useState<IMainIdeaAttemptResponse | null>(null);

  if (!attempts || attempts.length === 0) {
    return (
      <div className="mt-8 p-6 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-600">
          No previous attempts found. Complete the practice above to see your
          attempts here.
        </p>
      </div>
    );
  }

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

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Previous Attempts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {attempts.map((attempt) => {
          const totalParagraphs = attempt.paragraph_attempts.length;
          const maxScore = totalParagraphs * 10;

          return (
            <Card
              key={attempt._id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Attempt</CardTitle>
                  <Badge
                    className={`${getScoreColor(
                      attempt.score,
                      totalParagraphs,
                    )} text-white`}
                  >
                    {attempt.score}/{maxScore}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  {formatDate(attempt.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span>
                    {totalParagraphs} Paragraph
                    {totalParagraphs !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-gray-500" />
                  <span
                    className={
                      attempt.graded ? "text-green-600" : "text-yellow-600"
                    }
                  >
                    {attempt.graded ? "Graded" : "Grading..."}
                  </span>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onViewAttempt(attempt)}
                  >
                    View Answers
                  </Button>

                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1"
                        onClick={() => setSelectedAttempt(attempt)}
                        disabled={!attempt.graded}
                      >
                        GPT Feedback
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="overflow-y-auto w-full sm:max-w-2xl">
                      <SheetHeader>
                        <SheetTitle>GPT Feedback</SheetTitle>
                        <SheetDescription>
                          Detailed feedback for your attempt on{" "}
                          {formatDate(attempt.createdAt)}
                        </SheetDescription>
                      </SheetHeader>

                      <div className="mt-6 space-y-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg">
                              Overall Score
                            </h3>
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
                        </div>

                        {attempt.paragraph_attempts.map(
                          (paraAttempt, index) => {
                            const paragraph =
                              paraAttempt.paragraph as IParagraph;
                            return (
                              <div
                                key={index}
                                className="border rounded-lg p-4"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="font-semibold">
                                    Paragraph {index + 1}
                                  </h4>
                                  <Badge
                                    variant={
                                      paraAttempt.gpt_score &&
                                      paraAttempt.gpt_score >= 8
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
                                      {paraAttempt.given_main_idea}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-sm font-medium text-gray-700 mb-1">
                                      Correct Main Idea:
                                    </p>
                                    <p className="text-sm bg-green-50 p-2 rounded">
                                      {paragraph.main_idea}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-sm font-medium text-gray-700 mb-1">
                                      GPT Feedback:
                                    </p>
                                    <p className="text-sm bg-blue-50 p-2 rounded">
                                      {paraAttempt.gpt_comment}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          },
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
