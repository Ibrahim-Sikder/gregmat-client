"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ISentenceFunction,
  ISentenceFunctionAttemptSubmission,
} from "@/types/sentence-function";
import {
  submitSentenceFunctionAttempt,
  getAllSentenceFunctions,
  resetSentenceFunctionProgress,
} from "@/actions/sentence-function";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Star,
  List,
  ArrowRight,
  RotateCcw,
  Info,
  Check,
  X,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Link from "next/link";
import { UserInfo } from "@/components/auth/UserInfo";

interface SentenceFunctionGameProps {
  initialData: ISentenceFunction[];
  meta: any;
}

export default function SentenceFunctionGame({
  initialData,
  meta,
}: SentenceFunctionGameProps) {
  const [page, setPage] = useState(1);
  const [questions, setQuestions] = useState<ISentenceFunction[]>(initialData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("default");

  // Current Question State
  const currentQuestion = questions[currentIndex];

  // Selection state
  const [selectedPartId, setSelectedPartId] = useState<number | null>(null);
  const [selectionCount, setSelectionCount] = useState(0); // For identifying second click

  // Attempt state
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showSource, setShowSource] = useState(false);

  // Statistics
  const [sessionScore, setSessionScore] = useState(meta.userScore || 0);
  const [totalAttempted, setTotalAttempted] = useState(meta.userAttempted || 0);
  const { isSubscribed, user, loading: userLoading } = useCurrentUser();

  useEffect(() => {
    resetLevelState();
  }, [currentIndex, currentQuestion]);

  const resetLevelState = () => {
    setSelectedPartId(null);
    setSelectionCount(0);
    setHasSubmitted(false);
    setIsCorrect(null);
    setShowSource(false);
  };

  const handlePartClick = (partId: number) => {
    // We allow clicking even if hasSubmitted is true to make it flexible
    if (selectedPartId === partId) {
      // Second click on the same part - Submit
      setSelectionCount((prev) => prev + 1);
      if (selectionCount >= 1) {
        handleSubmit(partId);
      }
    } else {
      // First click or click on a different part
      setSelectedPartId(partId);
      setSelectionCount(1);
    }
  };

  const handleSubmit = async (partId: number) => {
    if (loading) return;

    const selectedPart = currentQuestion.sentence_parts.find(
      (p) => p.id === partId,
    );
    if (!selectedPart) return;

    setLoading(true);
    const correct = selectedPart.is_answer;

    try {
      const submission: ISentenceFunctionAttemptSubmission = {
        sentenceFunctionId: currentQuestion._id,
        selected_sentence_part: partId,
        correct,
      };

      await submitSentenceFunctionAttempt(submission);

      setIsCorrect(correct);
      // Only increment score if this is the first correct submission for this question
      if (correct && !hasSubmitted) {
        setSessionScore((prev: number) => prev + 1);
        setTotalAttempted((prev: number) => prev + 1);
        toast.success("Correct!", { toastId: "correct-first-time" });
      } else if (correct) {
        toast.success("Correct!", { toastId: "correct-again" });
      } else {
        if (!hasSubmitted) {
          setTotalAttempted((prev: number) => prev + 1);
        }
        toast.error("Incorrect", { toastId: "incorrect" });
      }
      setHasSubmitted(true);
    } catch (error) {
      toast.error("Failed to submit attempt", { toastId: "submit-error" });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setLoading(true);
      const nextPage = page + 1;
      const res = await getAllSentenceFunctions(nextPage, 50, sortOrder);
      if (res && res.data && res.data.length > 0) {
        setQuestions([...questions, ...res.data]);
        setPage(nextPage);
        setCurrentIndex(currentIndex + 1);
      } else {
        toast.info("No more questions!");
      }
      setLoading(false);
    }
  };

  const handleResetProgress = async () => {
    if (
      confirm(
        "Are you sure you want to reset ALL your Sentence Function progress? This cannot be undone.",
      )
    ) {
      const success = await resetSentenceFunctionProgress();
      if (success) {
        toast.success("Progress reset successfully");
        window.location.reload();
      } else {
        toast.error("Failed to reset progress");
      }
    }
  };

  const handleSortChange = async (sort: string) => {
    setSortOrder(sort);
    setLoading(true);
    const res = await getAllSentenceFunctions(1, 50, sort);
    if (res && res.data) {
      setQuestions(res.data);
      setPage(1);
      setCurrentIndex(0);
      resetLevelState();
    }
    setLoading(false);
  };

  if (!currentQuestion || userLoading)
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-10 bg-gray-200 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4  select-none">
      <div className="flex items-center gap-2 text-sm text-gray-500 py-5">
        <Link
          href="/skill-building"
          className="font-medium text-gray-500 hover:text-blue-600 transition-colors"
        >
          Skill Building
        </Link>

        <ChevronRight className="h-4 w-4 text-gray-400" />

        <span className="font-semibold text-gray-900">
          Sentence Function (Reading)
        </span>
      </div>

      {!isSubscribed && !userLoading ? (
        <>
          <UserInfo user={user} />
        </>
      ) : (
        <>
          {/* Header / Stats */}
          <div className="flex justify-between items-end">
            <div></div>
            <div className="flex gap-1.5 translate-y-1">
              <div className="flex items-center gap-2 bg-[#0ea5e9] text-white px-3 py-1 rounded-md text-sm font-medium shadow-sm">
                <Star className="w-3.5 h-3.5 fill-white" />
                <span>Score: {sessionScore}</span>
              </div>
              <div className="flex items-center gap-2 bg-[#0ea5e9] text-white px-3 py-1 rounded-md text-sm font-medium shadow-sm">
                <span>
                  {((sessionScore / (totalAttempted || 1)) * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1 rounded-md text-sm font-medium shadow-sm">
                <List className="w-3.5 h-3.5" />
                <span>
                  {currentIndex + 1} of {meta.total || 0} Questions
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl space-y-8 mt-4">
            {/* Directions */}
            <div className="space-y-4">
              <h2 className="text-[23px] leading-snug text-slate-800 font-medium">
                <span className="font-bold">Directions: </span>
                <span className="italic">
                  {currentQuestion.body} Double click the selected sentence to
                  confirm your answer.
                </span>
              </h2>
            </div>

            {/* Passage Area - Full Paragraph Style */}
            <div className="relative pt-2">
              <div className="text-[21px] leading-[1.8] text-slate-900 font-normal">
                {currentQuestion.sentence_parts.map((part) => {
                  const isSelected = selectedPartId === part.id;
                  const isCorrectAnswer = part.is_answer;

                  let feedbackClass = "";
                  let hoverClass = "hover:bg-[#0ea5e9] hover:text-white";

                  if (isSelected) {
                    if (hasSubmitted) {
                      if (isCorrect) {
                        feedbackClass = "bg-[#22c55e] text-white";
                        hoverClass = "hover:bg-[#22c55e] hover:text-white";
                      } else {
                        feedbackClass = "bg-[#EF4444] text-white";
                        hoverClass = "hover:bg-[#EF4444] hover:text-white";
                      }
                    } else {
                      feedbackClass = "bg-[#0ea5e9] text-white";
                    }
                  }

                  return (
                    <span
                      key={part.id}
                      className={cn(
                        "cursor-pointer transition-all duration-150 rounded-[4px] px-1.5 py-1 inline box-decoration-clone",
                        hoverClass,
                        feedbackClass,
                      )}
                      onClick={() => handlePartClick(part.id)}
                      dangerouslySetInnerHTML={{
                        __html: part.content.replace(/<\/?[^>]+(>|$)/g, ""), // Strip all HTML
                      }}
                    />
                  );
                })}
              </div>

              {/* Source Tooltip */}
              {currentQuestion.source && (
                <div className="flex justify-end mt-4">
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="bg-slate-100 hover:bg-slate-200 text-slate-400 text-[10px] font-bold px-3 py-1 rounded-full transition-colors uppercase tracking-widest cursor-default">
                          SOURCE
                        </button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        align="end"
                        className="max-w-[300px] bg-slate-800 text-white border-none p-3 text-xs leading-relaxed shadow-xl rounded-lg"
                      >
                        <p className="font-medium text-[11px] opacity-90">
                          {currentQuestion.source}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>

            {/* Footer Area */}
            <div className="flex justify-between items-center pt-10 mt-10">
              <div className="flex gap-4 items-center">
                <button
                  onClick={handleResetProgress}
                  className="text-red-500 hover:text-red-600 font-bold text-[10px] flex items-center gap-1.5 border border-red-100 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors uppercase tracking-tight"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  RESET MY SENTENCE FUNCTION (READING) PROGRESS
                </button>

                <div className="relative">
                  <select
                    value={sortOrder}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:border-[#0ea5e9] cursor-pointer transition-all shadow-sm h-full"
                  >
                    <option value="default">Default Sort</option>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="hardest">Hardest</option>
                    <option value="easiest">Easiest</option>
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <Button
                  onClick={handleNext}
                  disabled={!hasSubmitted || loading}
                  className={cn(
                    "bg-slate-200 text-slate-400 hover:bg-slate-300 px-6 h-10 rounded shadow-sm font-bold text-sm transition-all flex items-center gap-2 border-none",
                    hasSubmitted &&
                      "bg-[#0ea5e9] text-white hover:bg-[#0284c7]",
                  )}
                >
                  <ArrowRight className="h-4 w-4" />
                  Next
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
