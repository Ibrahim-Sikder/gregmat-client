"use client";

import React, { useState, useEffect } from "react";
import { IPairing, IPairingAttemptSubmission } from "@/types/pairing";
import { submitPairingAttempt, getAllPairings } from "@/actions/pairing";
import { Button } from "@/components/ui/button";
import {
  Check,
  X,
  RotateCcw,
  Star,
  List,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { UserInfo } from "@/components/auth/UserInfo";
import { Skeleton } from "@/components/ui/skeleton";

interface PairingGameProps {
  initialData: IPairing[];
  meta: any;
}

export default function PairingGame({ initialData, meta }: PairingGameProps) {
  const [page, setPage] = useState(1);
  const [pairings, setPairings] = useState<IPairing[]>(initialData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("default");

  // Statistics
  const [sessionScore, setSessionScore] = useState(meta.userScore || 0);
  const [totalAttempted, setTotalAttempted] = useState(meta.userAttempted || 0);

  // Current Pairing State
  const currentPairing = pairings[currentIndex];

  // User selections
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [formedPairs, setFormedPairs] = useState<string[][]>([]); // Array of [word1, word2]

  // Attempt state
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<{
    correctPairs: string[][];
    incorrectPairs: string[][];
    missedPairs: string[][]; // Correct pairs that user didn't find
    score: number;
  } | null>(null);

  const { isSubscribed, user, loading: userLoading } = useCurrentUser();

  // Load initial attempts if any
  useEffect(() => {
    resetState();
  }, [currentIndex, currentPairing]);

  const resetState = () => {
    setSelectedWords([]);
    setFormedPairs([]);
    setHasSubmitted(false);
    setFeedback(null);
  };

  const handleWordClick = (word: string) => {
    if (hasSubmitted) return;
    if (isWordUsed(word)) return;
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
      return;
    }

    const newSelection = [...selectedWords, word];
    if (newSelection.length === 2) {
      setFormedPairs([...formedPairs, [newSelection[0], newSelection[1]]]);
      setSelectedWords([]);
    } else {
      setSelectedWords(newSelection);
    }
  };

  const removePair = (pairIndex: number) => {
    if (hasSubmitted) return;
    const newPairs = [...formedPairs];
    newPairs.splice(pairIndex, 1);
    setFormedPairs(newPairs);
  };

  const isWordUsed = (word: string) => {
    return formedPairs.some((pair) => pair.includes(word));
  };

  const correctDbPairs = currentPairing.pairs.filter((p) => p.second_word);

  const handleSubmit = async () => {
    setLoading(true);
    let score = 0;
    const correctUserPairs: string[][] = [];
    const incorrectUserPairs: string[][] = [];
    const missedDbPairs: string[][] = [];

    formedPairs.forEach((userPair) => {
      const [w1, w2] = userPair;
      const match = correctDbPairs.find(
        (p) =>
          (p.first_word === w1 && p.second_word === w2) ||
          (p.first_word === w2 && p.second_word === w1),
      );

      if (match) {
        correctUserPairs.push(userPair);
        score += 1;
      } else {
        incorrectUserPairs.push(userPair);
        score -= 1;
      }
    });

    correctDbPairs.forEach((p) => {
      const isFound = correctUserPairs.some(
        (up) => up.includes(p.first_word) && up.includes(p.second_word),
      );
      if (!isFound) {
        missedDbPairs.push([p.first_word, p.second_word]);
      }
    });

    const submission: IPairingAttemptSubmission = {
      pairingId: currentPairing._id,
      score: score,
      correct:
        score > 0 &&
        incorrectUserPairs.length === 0 &&
        missedDbPairs.length === 0,
      attempt: formedPairs.map((p) => ({
        first_word: p[0],
        second_word: p[1],
      })),
    };

    await submitPairingAttempt(submission);
    setSessionScore((prev: number) => prev + score);
    setTotalAttempted((prev: number) => prev + 1);

    setFeedback({
      correctPairs: correctUserPairs,
      incorrectPairs: incorrectUserPairs,
      missedPairs: missedDbPairs,
      score,
    });
    setHasSubmitted(true);
    setLoading(false);
  };

  const handleNext = async () => {
    if (currentIndex < pairings.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const nextPage = page + 1;
      const res = await getAllPairings(nextPage, 50, sortOrder);
      if (res && res.data && res.data.length > 0) {
        setPairings([...pairings, ...res.data]);
        setPage(nextPage);
        setCurrentIndex(currentIndex + 1);
      } else {
        toast.info("No more questions!");
      }
    }
  };

  const handleSortChange = async (newSort: string) => {
    setSortOrder(newSort);
    setLoading(true);
    const res = await getAllPairings(1, 50, newSort);
    if (res && res.data) {
      setPairings(res.data);
      setPage(1);
      setCurrentIndex(0);
      resetState();
    }
    setLoading(false);
  };

  const handleResetProgress = async () => {
    if (
      confirm(
        "Are you sure you want to reset ALL your pairing progress? This cannot be undone.",
      )
    ) {
      const success = await import("@/actions/pairing").then((m) =>
        m.resetPairingProgress(),
      );
      if (success) {
        toast.success("Progress reset successfully");
        // Reload current state to reflect no attempts
        handleSortChange(sortOrder);
        window.location.reload();
      } else {
        toast.error("Failed to reset progress");
      }
    }
  };

  const getChoices = () => {
    if (!currentPairing) return [];
    const words: string[] = [];
    currentPairing.pairs.forEach((p) => {
      words.push(p.first_word);
      if (p.second_word) words.push(p.second_word);
    });
    return words.sort();
  };

  const choices = React.useMemo(() => getChoices(), [currentPairing]);

  if (!currentPairing || userLoading) {
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
  }

  return (
    <div className=" max-w-7xl mx-auto py-8 ">
      <div className="flex items-center gap-2 text-sm text-gray-500 py-5">
        <Link
          href="/skill-building"
          className="font-medium text-gray-500 hover:text-blue-600 transition-colors"
        >
          Skill Building
        </Link>

        <ChevronRight className="h-4 w-4 text-gray-400" />

        <span className="font-semibold text-gray-900">Pairing (SE)</span>
      </div>

      {!isSubscribed && !userLoading ? (
        <>
          <UserInfo user={user} />
        </>
      ) : (
        <>
          {/* Header / Stats */}
          <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-100">
            <div></div>
            <div className="flex gap-3 items-center">
              <div className="flex items-center gap-2 bg-[#0ea5e9] text-white px-4 py-1.5 rounded-lg text-sm font-medium shadow-sm">
                <Star className="w-4 h-4 fill-white" />
                <span>Score: {sessionScore}</span>
              </div>
              <div className="flex items-center gap-2 bg-[#0ea5e9] text-white px-4 py-1.5 rounded-lg text-sm font-medium shadow-sm">
                <div className="w-4 h-4 flex items-center justify-center font-serif font-bold text-xs bg-white text-[#0ea5e9] rounded">
                  %
                </div>
                <span>
                  {((sessionScore / (totalAttempted * 2 || 1)) * 100).toFixed(
                    2,
                  )}
                  %
                </span>
              </div>
              <div className="flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded-lg text-sm font-medium shadow-sm">
                <List className="w-4 h-4" />
                <span>
                  {currentIndex + 1} of {meta.total || 0} Questions
                </span>
              </div>
            </div>
          </div>

          {/* Directions */}
          <div className="bg-white p-8 rounded-xl space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl text-gray-900 ">
                <span className="font-bold">Directions: </span>
                <span className="italic">
                  Find synonym pairs among the six choices. You get +1 for each
                  correct pair and -1 for each incorrect pair.
                </span>
              </h2>
              <p className="text-2xl">
                <span className="font-bold">NOTE: </span>
                <span className="italic">
                  The penalty for a wrong pair exists to discourage outright
                  guessing.
                </span>
              </p>
            </div>

            {/* Content Area */}
            <div className="flex flex-col items-center gap-6">
              {hasSubmitted && (
                <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-2 flex flex-col items-center">
                  {/* Your Answer Row */}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900 text-2xl">Your answer:</span>
                    <div className="flex flex-wrap gap-2">
                      {feedback?.correctPairs.map((pair, idx) => (
                        <div
                          key={`correct-${idx}`}
                          className="bg-green-600 text-white px-4 py-1 rounded-full flex items-center gap-2 text-xl font-medium"
                        >
                          {pair.join(", ")}
                          <Check size={14} strokeWidth={3} />
                        </div>
                      ))}
                      {feedback?.incorrectPairs.map((pair, idx) => (
                        <div
                          key={`incorrect-${idx}`}
                          className="bg-red-600 text-white px-4 py-1 rounded-full flex items-center gap-2 text-xl font-medium"
                        >
                          {pair.join(", ")}
                          <X size={14} strokeWidth={3} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Missed Pairs Row */}
                  {feedback && feedback.missedPairs.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 text-2xl whitespace-nowrap">
                        Correct pairs you missed:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {feedback.missedPairs.map((pair, idx) => (
                          <div
                            key={`missed-${idx}`}
                            className="bg-green-600 text-white px-4 py-1 rounded-full text-xl font-medium"
                          >
                            {pair.join(", ")}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!hasSubmitted && (
                /* Active View - Formed Pairs Display */
                <div className="w-full flex flex-wrap gap-3 justify-center items-center min-h-[40px]">
                  {formedPairs.map((pair, idx) => (
                    <div
                      key={idx}
                      className="bg-[#0f172a] text-white px-5 py-2 rounded-full flex items-center gap-3 cursor-pointer hover:bg-slate-800 transition shadow-sm text-xl font-medium group"
                      onClick={() => removePair(idx)}
                    >
                      {pair.join(", ")}
                      <div className="bg-sky-600 group-hover:bg-sky-800 rounded-full p-0.5 transition-colors">
                        <X size={12} strokeWidth={3} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Choices List */}
              <div
                className={`flex flex-col gap-1 w-full max-w-xs ${
                  hasSubmitted ? "opacity-60 pointer-events-none" : ""
                }`}
              >
                {choices.map((word, idx) => {
                  const used = isWordUsed(word);
                  const selected = selectedWords.includes(word);
                  return (
                    <div
                      key={idx}
                      className={`
                                flex items-center gap-3 p-1.5 rounded-lg transition-all select-none
                                ${
                                  used
                                    ? "text-gray-300"
                                    : "text-gray-700 hover:bg-gray-50 cursor-pointer"
                                }
                           `}
                      onClick={() => handleWordClick(word)}
                    >
                      <div
                        className={`
                                w-4 h-4 rounded-none flex items-center justify-center transition-colors border
                                ${
                                  used
                                    ? "bg-gray-50 border-gray-200 text-gray-300"
                                    : selected
                                      ? "bg-[#0ea5e9] border-[#0ea5e9] text-white"
                                      : "border-gray-300 text-transparent"
                                }
                            `}
                      >
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span
                        className={`text-2xl ${
                          selected ? "font-semibold text-gray-900" : ""
                        }`}
                      >
                        {word}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Controls Area (Check Answer / Score & Reset) */}
            {!hasSubmitted ? (
              <div className="flex justify-center mt-6">
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-white hover:bg-gray-50 text-gray-700 border-gray-400 border px-4 py-0.5 h-7 rounded-full font-bold text-xs active:translate-y-0.5 transition-all w-28"
                >
                  Check Answer
                </Button>
              </div>
            ) : (
              feedback && (
                <div className="flex justify-center mt-6 items-center gap-3">
                  <div className="px-4 py-0.5 rounded-full text-white text-sm bg-red-600 font-bold shadow-sm">
                    Score {feedback.score}/{correctDbPairs.length}
                  </div>
                  <button
                    onClick={resetState}
                    className="text-gray-700 border border-gray-300 px-3 py-0.5 rounded-full text-sm hover:bg-gray-50 transition-colors font-semibold cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              )
            )}

            {/* Footer Controls */}
            <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-100">
              <div className="flex gap-4 items-center">
                <Button
                  variant="outline"
                  className="text-red-500 border-red-400 hover:bg-red-50 hover:text-red-600 h-9 rounded-md px-4 font-semibold text-xs"
                  onClick={handleResetProgress}
                >
                  <RotateCcw className="mr-2 h-3.5 w-3.5" /> Reset My Pairing
                  (SE) Progress
                </Button>

                <div className="relative">
                  <select
                    value={sortOrder}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="appearance-none bg-white border border-gray-400 text-gray-700 text-xs font-semibold rounded-md pl-3 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-[#0ea5e9] cursor-pointer h-9"
                  >
                    <option value="default">Default Sort</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="hardest">Hardest First</option>
                    <option value="easiest">Easiest First</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <svg
                      className="fill-current h-3 w-3"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {hasSubmitted && (
                <Button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-[#1d4ed8] text-white px-8 py-2 h-9 rounded shadow-sm font-bold text-xs w-28 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowRight className="mr-2 h-3.5 w-3.5" />
                  Next
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
