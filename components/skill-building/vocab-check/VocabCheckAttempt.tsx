"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getVocabCheckById,
  submitVocabCheckAttempt,
} from "@/actions/vocab-check";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import parse from "html-react-parser";

export default function VocabCheckAttempt({ id }: { id: string }) {
  const [check, setCheck] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getVocabCheckById(id);
      if (data) {
        setCheck(data);
        if (data.attempts?.length > 0) {
          const lastAttempt = data.attempts[data.attempts.length - 1];
          if (lastAttempt.graded) {
            setFeedback(lastAttempt);
            const lastAnswers: Record<string, string> = {};
            lastAttempt.word_attempts.forEach((wa: any) => {
              lastAnswers[wa.word] = wa.given_definition;
            });
            setAnswers(lastAnswers);
          }
        }
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleInputChange = (wordId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [wordId]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const wordAttempts = check.words.map((w: any) => ({
      wordId: w.id,
      given_definition: answers[w.id] || "",
    }));
    const result = await submitVocabCheckAttempt(id, wordAttempts);
    if (result) {
      setFeedback(result);
      setCurrentIndex(0);
      setIsSheetOpen(true);
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-4 w-48" />
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="flex-grow h-[500px] rounded-xl" />
          <Skeleton className="w-full md:w-80 h-[400px] rounded-xl" />
        </div>
      </div>
    );
  }

  if (!check)
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Vocab check not found.
        </h2>
        <Link href="/skill-building/vocab-check">
          <Button className="mt-4 bg-blue-600">Back to List</Button>
        </Link>
      </div>
    );

  const completedCount = Object.keys(answers).filter((k) =>
    answers[k].trim(),
  ).length;
  const skippedCount = check.words.length - completedCount;
  const correctCount = feedback
    ? feedback.word_attempts.filter((a: any) => a.gpt_score >= 0.8).length
    : 0;
  const incorrectCount = feedback
    ? feedback.word_attempts.filter((a: any) => a.gpt_score < 0.5).length
    : 0;

  const currentWord = check.words[currentIndex];
  const currentWA = feedback?.word_attempts?.find(
    (wa: any) => wa.word === currentWord.id,
  );
  const currentScore = currentWA ? Math.round(currentWA.gpt_score * 10) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-2 text-[15px] text-[#6b7280]">
        <Link
          href="/skill-building"
          className="hover:text-blue-600 transition-colors font-semibold"
        >
          Skill Building
        </Link>
        <span className="text-gray-300">&gt;</span>
        <span className="font-semibold text-gray-900">Vocab Check</span>
      </div>

      <div className="flex flex-col xl:flex-row gap-12 items-start">
        <div className="flex-grow space-y-6 w-full">
          <div className="bg-[#f9fafb] p-4 rounded-md border border-[#f3f4f6]">
            <p className="text-[14px] text-[#4b5563] text-center">
              For each word, write a simple definition that best conveys its
              meaning.
            </p>
          </div>

          <div className="bg-white rounded-sm border border-[#e5e7eb]  overflow-hidden">
            <table className="w-full text-left table-fixed border-collapse border-hidden">
              <tbody>
                {check.words.map((word: any, index: number) => {
                  const isSelected = index === currentIndex;
                  const wordFeedback = feedback?.word_attempts?.find(
                    (wa: any) => wa.word === word.id,
                  );
                  const score = wordFeedback
                    ? Math.round(wordFeedback.gpt_score * 10)
                    : null;

                  return (
                    <tr
                      key={word.id}
                      className={cn(
                        "transition-all duration-150 cursor-pointer h-[50px]",
                        feedback
                          ? wordFeedback
                            ? !wordFeedback.given_definition?.trim()
                              ? "bg-[#fffff]" // Not attempted
                              : wordFeedback.gpt_score >= 0.8
                              ? "bg-[#eafaf1]" // Correct
                              : wordFeedback.gpt_score < 0.5
                              ? "bg-[#fef2f2]" // Incorrect
                              : "bg-[#fefce8]" // Partial
                            : "bg-[#f3f4f6]" // Should not happen based on current submit logic but safe fallback
                          : "bg-white",
                      )}
                      onClick={() => {
                        setCurrentIndex(index);
                        if (feedback) setIsSheetOpen(true);
                      }}
                    >
                      <td className="px-6 py-4 border border-[#e5e7eb] relative">
                        <div className="flex items-center justify-between">
                          <span
                            className={cn(
                              "text-[15px] font-medium transition-colors",
                              isSelected ? "text-[#2563eb]" : "text-[#1f2937]",
                            )}
                          >
                            {word.word}
                          </span>
                          {score !== null && (
                            <span className="text-[#2563eb] font-bold text-[13px] absolute right-4">
                              {score}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-0 py-0 border border-[#e5e7eb] relative h-full">
                        <input
                          value={answers[word.id] || ""}
                          onChange={(e) =>
                            handleInputChange(word.id, e.target.value)
                          }
                          onFocus={() => {
                            setCurrentIndex(index);
                          }}
                          className={cn(
                            "w-full h-full px-6 py-4 text-[15px] font-medium outline-none transition-all",
                            isSelected
                              ? "ring-2 ring-inset ring-[#2563eb] z-10 relative"
                              : "bg-transparent",
                            feedback && "pointer-events-none",
                          )}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full xl:w-[320px] shrink-0 space-y-8 sticky top-8">
          <div className="bg-white border border-[#e5e7eb] rounded-sm p-8 space-y-8 ">
            <div className="text-center">
              <h3 className="font-bold text-[#1f2937] text-[15px]">
                Vocab Mountain - Groups{" "}
                {check.groups.map((g: any) => g.number).join(" to ")}
              </h3>
            </div>

            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-[20px] font-black text-[#111827]">
                  {completedCount}
                </div>
                <div className="text-[11px] text-[#6b7280] font-bold uppercase tracking-tight">
                  Completed
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[20px] font-black text-[#111827]">
                  {skippedCount}
                </div>
                <div className="text-[11px] text-[#6b7280] font-bold uppercase tracking-tight">
                  Skipped
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[20px] font-black text-[#111827]">
                  {correctCount}
                </div>
                <div className="text-[11px] text-[#6b7280] font-bold uppercase tracking-tight">
                  Correct
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[20px] font-black text-[#111827]">
                  {incorrectCount}
                </div>
                <div className="text-[11px] text-[#6b7280] font-bold uppercase tracking-tight">
                  Incorrect
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-4">
              {feedback ? (
                <Button
                  className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-[5px] h-[45px] text-[14px] font-bold "
                  onClick={() => {
                    setFeedback(null);
                    setAnswers({});
                    setCurrentIndex(0);
                  }}
                >
                  Attempt Again
                </Button>
              ) : (
                <Button
                  className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-[5px] h-[45px] text-[14px] font-bold "
                  onClick={handleSubmit}
                  disabled={isSubmitting || completedCount === 0}
                >
                  {isSubmitting ? "Submitting..." : "Submit Progress"}
                </Button>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-[4px] border-[#e5e7eb] text-[11px] font-bold h-10 text-[#6b7280] hover:bg-gray-50 flex items-center justify-center gap-1"
                  onClick={() =>
                    setCurrentIndex((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 rounded-[4px] border-[#e5e7eb] text-[11px] font-bold h-10 text-[#6b7280] hover:bg-gray-50 flex items-center justify-center gap-1"
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      Math.min(check.words.length - 1, prev + 1),
                    )
                  }
                  disabled={currentIndex === check.words.length - 1}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 rounded-[4px] border-[#e5e7eb] text-[11px] font-bold h-10 text-[#6b7280] hover:bg-gray-50 disabled:opacity-50"
                  disabled={!feedback}
                  onClick={() => setIsSheetOpen(true)}
                >
                  Feedback
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h4 className="font-bold text-[#111827] text-[17px]">Attempts</h4>
            <div className="space-y-2">
              {check.attempts?.map((attempt: any, idx: number) => (
                <div
                  key={attempt.id}
                  className="flex items-center justify-between p-4 bg-white rounded-sm text-[13px] font-medium border border-[#f3f4f6] text-[#4b5563]"
                >
                  <span>Attempt {idx + 1}</span>
                  <span className="text-[#9ca3af] font-normal">
                    {new Date(attempt.created_at).toLocaleDateString(
                      undefined,
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}{" "}
                    at{" "}
                    {new Date(attempt.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-y-auto w-full sm:max-w-[420px] p-0 flex flex-col border-none shadow-2xl">
          <SheetHeader className="px-8 py-6">
            <SheetTitle className="text-[17px] font-bold flex items-center justify-between text-[#1f2937]">
              Feedback
              <div className="flex items-center gap-4">
                <span className="text-[12px] text-[#9ca3af] font-bold uppercase tracking-widest">
                  r
                </span>
                <button
                  onClick={() => setIsSheetOpen(false)}
                  className="text-[#9ca3af] hover:text-[#1f2937] transition-colors"
                >
                  <span className="text-[20px] font-light">×</span>
                </button>
              </div>
            </SheetTitle>
          </SheetHeader>

          <div className="px-8 py-4 space-y-10 flex-grow">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h5 className="text-[12px] font-bold text-[#1f2937] uppercase tracking-wider">
                  Your Submission:
                </h5>
                {currentScore !== null && (
                  <div className="w-10 h-10 bg-[#f0f9ff] text-[#2563eb] rounded-md font-bold text-[18px] flex items-center justify-center border border-[#e0f2fe]">
                    {currentScore}
                  </div>
                )}
              </div>
              <p className="text-[15px] text-[#4b5563] font-medium leading-relaxed">
                {answers[currentWord.id] || "No submission text"}
              </p>
            </div>

            <div className="space-y-4">
              <h5 className="text-[12px] font-bold text-[#1f2937] uppercase tracking-wider">
                Solution:
              </h5>
              <p className="text-[15px] text-[#6b7280] leading-relaxed font-medium">
                {parse(currentWord.definition)}
              </p>
            </div>

            <div className="space-y-6 relative pb-16">
              <div className="flex items-center justify-between">
                <h5 className="text-[12px] font-bold text-[#1f2937] uppercase tracking-wider">
                  Feedback:
                </h5>
                <div className="w-5 h-5 rounded-full border border-[#d1d5db] flex items-center justify-center text-[#9ca3af] text-[11px] font-bold cursor-help">
                  ?
                </div>
              </div>
              <p className="text-[15px] text-[#6b7280] leading-relaxed font-medium">
                {parse(
                  currentWA?.gpt_comment || "No specific feedback available.",
                )}
              </p>

              {currentWA && (
                <div className="absolute right-0 bottom-4">
                  <span className="text-[12px] font-bold text-[#ef4444] italic cursor-pointer hover:underline underline-offset-4 decoration-1 decoration-[#ef4444]/30">
                    That doesn't seem right.
                  </span>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
