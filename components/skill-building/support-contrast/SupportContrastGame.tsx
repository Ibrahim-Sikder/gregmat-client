"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ISupportContrast,
  ISupportContrastAttemptSubmission,
} from "@/types/support-contrast";
import {
  getAllSupportContrasts,
  submitSupportContrastAttempt,
  resetSupportContrastProgress,
  resetSupportContrastAttempt,
} from "@/actions/support-contrast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Star,
  ArrowRight,
  RotateCcw,
  Check,
  X,
  BarChart2,
  Layers,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { UserInfo } from "@/components/auth/UserInfo";

interface SupportContrastGameProps {
  initialData: ISupportContrast[];
  meta: any;
}

export default function SupportContrastGame({
  initialData,
  meta,
}: SupportContrastGameProps) {
  const [page, setPage] = useState(1);
  const [questions, setQuestions] = useState<ISupportContrast[]>(initialData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("default");
  const { isSubscribed, user, loading: userLoading } = useCurrentUser();

  const currentQuestion = questions[currentIndex];

  // State for each blank in current question
  const [blankStates, setBlankStates] = useState<
    Record<
      number,
      {
        reasoning_type: "support" | "contrast" | null;
        associated_token: string;
        hasSubmitted: boolean;
        isCorrect: boolean | null;
      }
    >
  >({});

  // Statistics
  const [sessionScore, setSessionScore] = useState(meta.userScore || 0);
  const [totalBlanksAttempted, setTotalBlanksAttempted] = useState(
    meta.userAttempted || 0,
  );

  const allBlanksSubmitted = useMemo(() => {
    if (!currentQuestion) return false;
    return currentQuestion.blanks.every(
      (blank) => blankStates[blank.blank_index]?.hasSubmitted,
    );
  }, [currentQuestion, blankStates]);

  useEffect(() => {
    if (currentQuestion) {
      const initialStates: any = {};
      currentQuestion.blanks.forEach((blank) => {
        // Find if there's already an attempt
        const myAttempt = currentQuestion.my_attempts?.find(
          (a) => a.blank_index === blank.blank_index,
        );
        initialStates[blank.blank_index] = {
          reasoning_type: myAttempt?.reasoning_type || null,
          associated_token: myAttempt?.associated_token || "",
          hasSubmitted: !!myAttempt,
          isCorrect: myAttempt?.correct ?? null,
        };
      });
      setBlankStates(initialStates);
    }
  }, [currentIndex, currentQuestion]);

  const handleReasoningChange = (
    blankIndex: number,
    type: "support" | "contrast",
  ) => {
    if (blankStates[blankIndex]?.hasSubmitted) return;
    setBlankStates((prev) => ({
      ...prev,
      [blankIndex]: { ...prev[blankIndex], reasoning_type: type },
    }));
  };

  const handleTokenChange = (blankIndex: number, token: string) => {
    if (blankStates[blankIndex]?.hasSubmitted) return;
    setBlankStates((prev) => ({
      ...prev,
      [blankIndex]: { ...prev[blankIndex], associated_token: token },
    }));
  };

  const checkAnswer = async (blankIndex: number) => {
    const state = blankStates[blankIndex];
    if (!state.reasoning_type || !state.associated_token.trim() || loading)
      return;

    const blankDef = currentQuestion.blanks.find(
      (b) => b.blank_index === blankIndex,
    );
    if (!blankDef) return;

    setLoading(true);

    const isReasoningCorrect = state.reasoning_type === blankDef.reasoning_type;
    const acceptableTokens = blankDef.acceptable_tokens
      .split("|")
      .map((t) => t.trim().toLowerCase());
    const isTokenCorrect = acceptableTokens.includes(
      state.associated_token.trim().toLowerCase(),
    );
    const correct = isReasoningCorrect && isTokenCorrect;

    try {
      const submission: ISupportContrastAttemptSubmission = {
        supportContrastId: currentQuestion._id,
        blank_index: blankIndex,
        reasoning_type: state.reasoning_type,
        associated_token: state.associated_token,
        correct,
      };

      await submitSupportContrastAttempt(submission);

      setBlankStates((prev) => ({
        ...prev,
        [blankIndex]: {
          ...prev[blankIndex],
          hasSubmitted: true,
          isCorrect: correct,
        },
      }));

      if (correct) {
        setSessionScore((prev: number) => prev + 1);
        toast.success("Correct!", { toastId: "correct" });
      } else {
        toast.error("Incorrect", { toastId: "incorrect" });
      }
      setTotalBlanksAttempted((prev: number) => prev + 1);
    } catch (error) {
      toast.error("Failed to submit attempt");
    } finally {
      setLoading(false);
    }
  };

  const handleResetBlank = async (blankIndex: number) => {
    try {
      await resetSupportContrastAttempt(currentQuestion._id, blankIndex);
      setBlankStates((prev) => ({
        ...prev,
        [blankIndex]: {
          reasoning_type: null,
          associated_token: "",
          hasSubmitted: false,
          isCorrect: null,
        },
      }));
    } catch (error) {
      toast.error("Failed to reset attempt on server");
    }
  };

  const handleNext = async () => {
    if (!allBlanksSubmitted) {
      toast.error(
        "Please attempt all blanks before moving to the next question",
      );
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setLoading(true);
      const nextPage = page + 1;
      const res = await getAllSupportContrasts(nextPage, 50, sortOrder);
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
    if (confirm("Reset ALL Support/Contrast progress?")) {
      const success = await resetSupportContrastProgress();
      if (success) {
        toast.success("Progress reset");
        window.location.reload();
      }
    }
  };

  const handleSortChange = async (sort: string) => {
    setSortOrder(sort);
    setLoading(true);
    const res = await getAllSupportContrasts(1, 50, sort);
    if (res && res.data) {
      setQuestions(res.data);
      setPage(1);
      setCurrentIndex(0);
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
    <div className=" max-w-7xl mx-auto py-8 px-4  select-none">
      <div className="flex items-center gap-2 text-sm text-gray-500 py-5">
        <Link
          href="/skill-building"
          className="font-medium text-gray-500 hover:text-blue-600 transition-colors"
        >
          Skill Building
        </Link>

        <ChevronRight className="h-4 w-4 text-gray-400" />

        <span className="font-semibold text-gray-900">
          Support vs. Contrast
        </span>
      </div>
      {/* Header / Stats */}
      {!isSubscribed && !userLoading ? (
        <>
          <UserInfo user={user} />
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-8">
            <div></div>
            <div className="flex gap-1.5">
              <div className="flex items-center gap-2 bg-[#0ea5e9] text-white px-4 py-1.5 rounded-[4px] text-sm font-medium shadow-sm">
                <Star className="w-4 h-4 fill-white text-white" />
                <span>Score: {sessionScore}</span>
              </div>
              <div className="flex items-center gap-2 bg-[#0ea5e9] text-white px-4 py-1.5 rounded-[4px] text-sm font-medium shadow-sm">
                <BarChart2 className="w-4 h-4" />
                <span>
                  {((sessionScore / (totalBlanksAttempted || 1)) * 100).toFixed(
                    2,
                  )}
                  %
                </span>
              </div>
              <div className="flex items-center gap-2 bg-[#1e293b] text-white px-4 py-1.5 rounded-[4px] text-sm font-medium shadow-sm">
                <Layers className="w-4 h-4" />
                <span>
                  {totalBlanksAttempted + 1} of {meta.totalBlanks || 0} Blanks
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            {/* Directions */}
            <div className="text-[23px] leading-[1.8] text-slate-800 font-medium px-4 py-2 text-center max-w-[1100px] mx-auto">
              <h2 className="leading-relaxed text-slate-800">
                <span className="font-bold">Directions: </span>
                <span className="italic">
                  For each blank, consider whether the blank is part of an idea
                  being supported or contrasted. Then identify the word, phrase,
                  or punctuation mark that indicates whether it is a support or
                  contrast. The word, phrase, or punctuation mark must be copied
                  exactly from the sentence.
                </span>
              </h2>
            </div>

            {/* Text Area */}
            <div className="text-[23px] leading-[1.8] text-slate-800 font-medium px-4 py-2 text-center max-w-[1100px] mx-auto">
              {currentQuestion.text}
            </div>

            {/* Blanks Interaction Area */}
            <div className="flex flex-wrap justify-center gap-16 pt-4">
              {currentQuestion.blanks.map((blank) => {
                const state = blankStates[blank.blank_index] || {
                  reasoning_type: null,
                  associated_token: "",
                  hasSubmitted: false,
                  isCorrect: null,
                };

                return (
                  <div
                    key={blank.id}
                    className="flex flex-col gap-3 w-[280px] items-center"
                  >
                    <div className="text-center text-[16px] font-medium text-slate-500 mb-1">
                      Blank {blank.blank_index + 1}
                    </div>

                    {/* Reasoning Type Toggle */}
                    <div className="flex gap-2 w-full">
                      <button
                        onClick={() =>
                          handleReasoningChange(blank.blank_index, "support")
                        }
                        disabled={state.hasSubmitted}
                        className={cn(
                          "flex-1 py-1.5 px-4 rounded-lg text-[15px] font-semibold border transition-all h-[36px]",
                          state.reasoning_type === "support"
                            ? "bg-[#0ea5e9] text-white border-[#0ea5e9]"
                            : "bg-white border-[#0ea5e9] text-dark hover:border-[#0ea5e9]",
                        )}
                      >
                        Support
                      </button>
                      <button
                        onClick={() =>
                          handleReasoningChange(blank.blank_index, "contrast")
                        }
                        disabled={state.hasSubmitted}
                        className={cn(
                          "flex-1 py-1.5 px-4 rounded-lg text-[15px] font-semibold border transition-all h-[36px]",
                          state.reasoning_type === "contrast"
                            ? "bg-[#0ea5e9] text-white border-[#0ea5e9]"
                            : "bg-white border-[#0ea5e9] text-dark hover:border-[#0ea5e9]",
                        )}
                      >
                        Contrast
                      </button>
                    </div>

                    {/* Token Input */}
                    <div className="relative w-full">
                      <Input
                        type="text"
                        value={state.associated_token}
                        onChange={(e) =>
                          handleTokenChange(blank.blank_index, e.target.value)
                        }
                        disabled={state.hasSubmitted}
                        placeholder="Type here..."
                        className={cn(
                          "w-full h-[40px] px-4 rounded-md border text-[15px] font-medium placeholder:text-slate-300 focus-visible:ring-0 focus-visible:border-[#0ea5e9]",
                          state.hasSubmitted
                            ? state.isCorrect
                              ? "border-green-500 bg-green-50 text-green-700 disabled:opacity-100"
                              : "border-red-500 bg-red-50 text-red-700 disabled:opacity-100"
                            : "border-[#0ea5e9] bg-white shadow-none",
                        )}
                      />
                      {state.hasSubmitted && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {state.isCorrect ? (
                            <Check className="w-5 h-5 text-green-500" />
                          ) : (
                            <X className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Blank Buttons */}
                    <div className="flex flex-col items-center gap-2 mt-1">
                      <div className="flex gap-4 justify-center">
                        <button
                          onClick={() => handleResetBlank(blank.blank_index)}
                          className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-600 p-2 transition-colors border border-slate-400 rounded-lg"
                        >
                          Reset
                        </button>
                        <button
                          onClick={() => checkAnswer(blank.blank_index)}
                          disabled={
                            state.hasSubmitted ||
                            !state.reasoning_type ||
                            !state.associated_token.trim() ||
                            loading
                          }
                          className={cn(
                            "text-xs font-bold uppercase tracking-wider border border-slate-400 px-2 py-1 transition-colors rounded-lg ",
                            state.hasSubmitted ||
                              !state.reasoning_type ||
                              !state.associated_token.trim()
                              ? "text-slate-400 cursor-not-allowed"
                              : "text-slate-600 hover:text-slate-600",
                          )}
                        >
                          Check Answer
                        </button>
                      </div>
                      {state.hasSubmitted && state.isCorrect === false && (
                        <div className="text-[#ef4444] text-[13px] font-medium animate-in fade-in slide-in-from-top-1 duration-300">
                          That's not quite right, try again!
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Area */}
            <div className="flex justify-between items-end pt-12 mt-12 pb-8">
              <div className="flex gap-6 items-center">
                <button
                  onClick={handleResetProgress}
                  className="text-[#ef4444] border border-[#ef4444] rounded-md px-6 py-2.5 text-xs font-bold flex items-center gap-2 hover:bg-red-50 transition-colors uppercase tracking-tight"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset My Support / Contrast (TC) Progress
                </button>

                <div className="relative">
                  <select
                    value={sortOrder}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="appearance-none bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-md pl-4 pr-10 py-2.5 focus:outline-none focus:border-[#0ea5e9] cursor-pointer transition-all shadow-sm"
                  >
                    <option value="default">Default Sort</option>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="hardest">Hardest</option>
                    <option value="easiest">Easiest</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <Button
                  onClick={handleNext}
                  disabled={!allBlanksSubmitted || loading}
                  className={cn(
                    "bg-[#0ea5e9]/90 hover:bg-[#0ea5e9] text-white px-10 h-[44px] rounded-md shadow-sm font-bold text-xs transition-all flex items-center gap-2 group",
                    (!allBlanksSubmitted || loading) &&
                      "opacity-50 cursor-not-allowed",
                  )}
                >
                  Next
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
