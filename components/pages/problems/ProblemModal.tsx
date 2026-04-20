"use client";

import {
  getProblemById,
  submitProblemAttempt,
  resetProblemAttempts,
  toggleBookmarkProblem,
  toggleLikeProblem,
} from "@/actions/practice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Problem, QuestionType } from "@/types/problem.types";
import {
  DIFFICULTY_DISPLAY,
  QUESTION_TYPE_DISPLAY,
} from "@/types/problem.types";
import {
  Bookmark,
  Calculator,
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  ThumbsUp,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Blank from "@/components/quiz/question-types/Blank";
import Matching from "@/components/quiz/question-types/Matching";
import MultipleChoice from "@/components/quiz/question-types/MultipleChoice";
import MultipleSelect from "@/components/quiz/question-types/MultipleSelect";
import NumericEntryFraction from "@/components/quiz/question-types/NumericEntryFraction";
import NumericEntryNotFraction from "@/components/quiz/question-types/NumericEntryNotFraction";
import Pairing from "@/components/quiz/question-types/Pairing";
import QuantitativeComparison from "@/components/quiz/question-types/QuantitativeComparison";
import ReadingLayout from "@/components/quiz/question-types/ReadingLayout";
import TextCompletion from "@/components/quiz/question-types/TextCompletion";
import { DraggableModal } from "@/components/shared/modal/DraggableModal";
import AppCalculator from "@/components/AppCalculator";
import { toast } from "react-toastify";
import { Viewer } from "react-latex-editor";
import VideoPlayer from "../recordings/VideoPlayer";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { UserInfo } from "@/components/auth/UserInfo";

interface ProblemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  problemId: string | null;
  problemIds: string[];
  onNavigate: (problemId: string) => void;
  onProblemUpdate?: (problem: Problem) => void;
}

const getDifficultyBadgeClass = (difficulty: string) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "bg-teal-500 hover:bg-teal-500 text-white";
    case "medium":
      return "bg-blue-500 hover:bg-blue-500 text-white";
    case "hard":
      return "bg-gray-900 hover:bg-gray-900 text-white";
    case "extreme":
      return "bg-gray-900 hover:bg-gray-900 text-white";
    default:
      return "bg-gray-500 hover:bg-gray-500 text-white";
  }
};

export default function ProblemModal({
  open,
  onOpenChange,
  problemId,
  problemIds,
  onNavigate,
  onProblemUpdate,
}: ProblemModalProps) {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[]>("");
  const [numericState, setNumericState] = useState<{
    numerator: string;
    denominator: string;
    value: string;
  }>({ numerator: "", denominator: "", value: "" });
  const [pairingAnswer, setPairingAnswer] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isSolutionFullscreen, setIsSolutionFullscreen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const { isSubscribed, user, loading: userLoading } = useCurrentUser();
  // Handle browser fullscreen API
  // Handle focus mode (not browser fullscreen)
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  // Listen for fullscreen change events (e.g., user presses Escape)
  // No longer rely on browser fullscreen change events
  useEffect(() => {
    // setIsFullscreen state handles the UI now
  }, []);

  // Exit fullscreen when modal closes
  // No need to exit browser fullscreen on close
  useEffect(() => {
    if (!open) {
      setIsFullscreen(false);
    }
  }, [open]);

  // Fetch problem data when problemId changes
  const fetchProblem = useCallback(async () => {
    if (!problemId) return;

    setLoading(true);
    setSubmitted(false);
    setSelectedAnswer("");
    setNumericState({ numerator: "", denominator: "", value: "" });
    setPairingAnswer("");
    setTimeElapsed(0);
    setTimerRunning(false);
    setShowSolution(false);
    setIsSolutionFullscreen(false);

    try {
      const response = await getProblemById(problemId);
      if (response.success && response.data) {
        setProblem(response.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [problemId]);

  useEffect(() => {
    if (open && problemId) {
      fetchProblem();
    }
  }, [open, problemId, fetchProblem]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && !submitted) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, submitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Navigation
  const currentIndex = problemIds.findIndex((id) => id === problemId);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < problemIds.length - 1;

  const handlePrev = () => {
    if (hasPrev) {
      onNavigate(problemIds[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onNavigate(problemIds[currentIndex + 1]);
    }
  };

  const getChoiceId = useCallback(
    (choice: any) => choice.title || choice.order?.toString() || "",
    [],
  );

  const isSelected = useCallback(
    (choiceId: string, groupIndex: number = 0) => {
      if (
        [
          "sentence_equivalence",
          "multiple_select",
          "reading_select_all",
        ].includes(problem?.question_type || problem?.type || "")
      ) {
        return (
          Array.isArray(selectedAnswer) && selectedAnswer.includes(choiceId)
        );
      } else if ((problem?.question_type || problem?.type)?.startsWith("tc_")) {
        return (
          Array.isArray(selectedAnswer) &&
          selectedAnswer[groupIndex] === choiceId
        );
      } else {
        return selectedAnswer === choiceId;
      }
    },
    [selectedAnswer, problem?.question_type, problem?.type],
  );

  const handleSelect = useCallback(
    (choiceId: string, groupIndex: number = 0) => {
      if (!problem?._id) return;

      if (submitted) {
        setSubmitted(false);
      }

      let updated: string | string[] = [];
      const qType = problem.question_type || problem.type;

      switch (qType) {
        case "multiple_select":
        case "sentence_equivalence":
        case "reading_select_all":
          const current = Array.isArray(selectedAnswer) ? selectedAnswer : [];
          if (current.includes(choiceId)) {
            updated = current.filter((v) => v !== choiceId);
          } else {
            updated = [...current, choiceId];
          }
          break;

        case "tc_1_blank":
        case "tc_2_blank":
        case "tc_3_blank":
          updated = Array.isArray(selectedAnswer) ? [...selectedAnswer] : [];
          // Ensure array is big enough
          const blankCount = parseInt(qType.split("_")[1]);
          if (updated.length < blankCount) {
            updated = Array(blankCount)
              .fill("")
              .map((_, i) => updated[i] || "");
          }
          updated[groupIndex] = choiceId;
          break;

        default:
          updated = choiceId;
      }

      setSelectedAnswer(updated);
    },
    [selectedAnswer, submitted, problem],
  );

  const handleNumericNotFraction = useCallback(
    (value: string) => {
      if (!problem?._id) return;
      if (submitted) setSubmitted(false);
      setNumericState((prev) => ({ ...prev, value }));
      setSelectedAnswer(value);
    },
    [submitted, problem],
  );

  const handleNumericFraction = useCallback(
    (key: "numerator" | "denominator", value: string) => {
      if (!problem?._id) return;
      if (submitted) setSubmitted(false);
      const updated = { ...numericState, [key]: value };
      setNumericState(updated);
      if (updated.numerator && updated.denominator) {
        setSelectedAnswer(`${updated.numerator},${updated.denominator}`);
      }
    },
    [numericState, submitted, problem],
  );

  const handlePairingChange = useCallback(
    (answer: string) => {
      if (!problem?._id) return;
      if (submitted) setSubmitted(false);
      setPairingAnswer(answer);
      setSelectedAnswer(answer);
    },
    [submitted, problem],
  );

  const handleBlankChange = useCallback(
    (answers: string[]) => {
      if (!problem?._id) return;
      if (submitted) setSubmitted(false);
      setSelectedAnswer(answers); // Storing as array for Blank
    },
    [submitted, problem],
  );

  // Format answer for submission/checking
  const formatAnswer = () => {
    if (!problem?._id) return "";

    const qType = problem.question_type || problem.type;

    switch (qType) {
      case "numeric_entry_fraction":
        return `${numericState.numerator},${numericState.denominator}`;

      case "numeric_entry_not_fraction":
        return numericState.value;

      case "pairing":
      case "matching":
        return pairingAnswer;

      case "fill_in_the_blank":
        return Array.isArray(selectedAnswer)
          ? selectedAnswer.join("&&&")
          : selectedAnswer || "";

      case "multiple_select":
      case "sentence_equivalence":
      case "reading_select_all":
      case "tc_1_blank":
      case "tc_2_blank":
      case "tc_3_blank":
        return Array.isArray(selectedAnswer)
          ? selectedAnswer.join(",")
          : selectedAnswer || "";

      default:
        return typeof selectedAnswer === "string" ? selectedAnswer : "";
    }
  };

  // Check if answer is correct
  const checkAnswer = (formattedAnswer: string) => {
    const correctAnswer = problem?.answer || problem?.correct_answer;
    if (!correctAnswer) return false;

    const qType = problem.question_type || problem.type;

    switch (qType) {
      case "multiple_select":
      case "sentence_equivalence":
      case "reading_select_all":
        const userArr = formattedAnswer.split(",").filter(Boolean).sort();
        const correctArr = (correctAnswer as string)
          .split(",")
          .filter(Boolean)
          .sort();
        return JSON.stringify(userArr) === JSON.stringify(correctArr);

      case "tc_1_blank":
      case "tc_2_blank":
      case "tc_3_blank":
        // Using comma separation for TC based on handleSelect logic, although Question.tsx has conflicting logic
        // We stick to what we generate: comma-separated
        const userTC = formattedAnswer.split(",").filter(Boolean);
        // Assuming correct_answer for TC from server is also comma-separated or compatible array
        const corrTC = Array.isArray(correctAnswer)
          ? correctAnswer
          : (correctAnswer as string).split(",").filter(Boolean);

        return JSON.stringify(userTC) === JSON.stringify(corrTC);

      case "numeric_entry_not_fraction":
        return (
          parseFloat(formattedAnswer) === parseFloat(correctAnswer as string)
        );

      case "numeric_entry_fraction":
        return formattedAnswer === correctAnswer;

      case "pairing":
      case "matching":
        const givenPairs = formattedAnswer.split("___").filter(Boolean).sort();
        const correctPairs = (correctAnswer as string)
          .split("___")
          .filter(Boolean)
          .sort();
        return JSON.stringify(givenPairs) === JSON.stringify(correctPairs);

      case "fill_in_the_blank": {
        const given = formattedAnswer.split("&&&");
        const correct = (correctAnswer as string).split("&&&");
        return (
          given.length === correct.length &&
          given.every((v, i) => v === correct[i])
        );
      }

      default:
        return formattedAnswer === correctAnswer;
    }
  };

  // Submit answer
  const handleSubmit = async () => {
    if (!problem) return;

    const formattedAns = formatAnswer();
    // Basic validation
    if (
      !formattedAns ||
      (Array.isArray(selectedAnswer) && selectedAnswer.length === 0)
    ) {
      return;
    }

    const correct = checkAnswer(formattedAns);
    setIsCorrect(correct);
    setSubmitted(true);
    setTimerRunning(false);
    setTimeElapsed(0);

    // Update local problem state with new attempt
    const newAttempt = {
      answered_at: new Date().toISOString(),
      correct,
      first: false, // We don't know if it's first from here easily, but usually backend handles it. For UI display it matters less instantly, date matters more.
    };

    const updatedProblem = {
      ...problem,
      user_answer_attempts: [
        ...(problem.user_answer_attempts || []),
        newAttempt,
      ],
      status: correct ? "Solved" : "Attempted", // Optimistic status update
    } as Problem;

    setProblem(updatedProblem);
    onProblemUpdate?.(updatedProblem);

    try {
      await submitProblemAttempt(problem._id, formattedAns, correct);
      if (correct) {
        toast.success("Correct Answer!");
      } else {
        toast.error("Incorrect Answer. Try again.");
      }
    } catch (error) {
      console.error("Error submitting attempt:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Reset problem
  // Reset problem
  const handleReset = async () => {
    if (!problem?._id) return;

    // Clear local state immediately
    setSelectedAnswer("");
    setSubmitted(false);
    setIsCorrect(false);
    setTimeElapsed(0);
    setTimerRunning(false);
    setNumericState({ numerator: "", denominator: "", value: "" }); // Reset numeric input
    setPairingAnswer(""); // Reset pairing input

    // Clear server state
    try {
      await resetProblemAttempts(problem._id);
      // Update local problem object to remove attempts and reset status
      const updatedProblem = {
        ...problem,
        user_answer_attempts: [],
        status: "ToDo",
      } as Problem;
      setProblem(updatedProblem);
      onProblemUpdate?.(updatedProblem);
      toast.success("Attempts reset successfully");
    } catch (error) {
      console.error("Error resetting attempts:", error);
      toast.error("Failed to reset attempts");
    }
  };

  // Toggle like - optimistic update with rollback
  const handleLike = async () => {
    if (!problem || actionLoading) return;

    const prevLiked = problem.liked;
    const prevLikes = problem.likes;

    // Optimistic update
    setProblem((prev) =>
      prev
        ? {
            ...prev,
            liked: !prev.liked,
            likes: prev.liked ? prev.likes - 1 : prev.likes + 1,
          }
        : null,
    );

    setActionLoading("like");
    try {
      const response = await toggleLikeProblem(problem._id);
      if (response.success && response.data) {
        // Update with actual server data
        const updatedProblem = {
          ...problem,
          liked: response.data!.liked,
          likes: response.data!.likes,
        };
        setProblem(updatedProblem);
        onProblemUpdate?.(updatedProblem);
      } else {
        // Rollback on failure
        setProblem((prev) =>
          prev
            ? {
                ...prev,
                liked: prevLiked,
                likes: prevLikes,
              }
            : null,
        );
      }
    } catch {
      // Rollback on error
      setProblem((prev) =>
        prev
          ? {
              ...prev,
              liked: prevLiked,
              likes: prevLikes,
            }
          : null,
      );
    } finally {
      setActionLoading(null);
    }
  };

  // Toggle bookmark - optimistic update with rollback
  const handleBookmark = async () => {
    if (!problem || actionLoading) return;

    const prevBookmarked = problem.bookmarked;

    // Optimistic update
    setProblem((prev) =>
      prev
        ? {
            ...prev,
            bookmarked: !prev.bookmarked,
          }
        : null,
    );

    setActionLoading("bookmark");
    try {
      const response = await toggleBookmarkProblem(problem._id);
      if (response.success && response.data) {
        // Update with actual server data
        const updatedProblem = {
          ...problem,
          bookmarked: response.data!.bookmarked,
        };
        setProblem(updatedProblem);
        onProblemUpdate?.(updatedProblem);
      } else {
        // Rollback on failure
        setProblem((prev) =>
          prev
            ? {
                ...prev,
                bookmarked: prevBookmarked,
              }
            : null,
        );
      }
    } catch {
      // Rollback on error
      setProblem((prev) =>
        prev
          ? {
              ...prev,
              bookmarked: prevBookmarked,
            }
          : null,
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        ref={dialogRef}
        onInteractOutside={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest(".draggable-modal-content")) {
            e.preventDefault();
          }
        }}
        className={cn(
          "flex flex-col p-0 gap-0 overflow-hidden [&>button]:hidden transition-all duration-200",
          isFullscreen
            ? "fixed inset-0 !max-w-[100vw] !w-screen !h-screen !max-h-screen !rounded-none !translate-x-0 !translate-y-0 !top-0 !left-0 z-[60]"
            : "w-full md:max-w-4xl max-h-[90vh]",
        )}
      >
        {!isSubscribed && !userLoading ? (
          <div className="p-8">
            <UserInfo user={user} />
          </div>
        ) : (
          <>
            <DialogTitle className="sr-only">Problem Details</DialogTitle>

            {/* Header - matches reference exactly */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b bg-background shrink-0">
              <div className="flex items-center gap-3 overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-foreground shrink-0"
                  onClick={() => setIsCalculatorOpen(true)}
                >
                  <Calculator className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 px-3 text-sm font-normal"
                  onClick={handleReset}
                >
                  <span>Reset</span>
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium">Timer</span>
                  <span className="font-mono tabular-nums">
                    {formatTime(timeElapsed)}
                  </span>
                </div>

                <Button
                  size="sm"
                  className={cn(
                    "h-8 gap-1.5 px-4",
                    timerRunning
                      ? "bg-gray-600 hover:bg-gray-700"
                      : "bg-blue-600 hover:bg-blue-700",
                  )}
                  onClick={() => setTimerRunning(!timerRunning)}
                >
                  {timerRunning ? "Pause" : "Start"}
                  {!timerRunning && <Play className="h-3 w-3 fill-current" />}
                </Button>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-foreground"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-5 w-5" />
                  ) : (
                    <Maximize2 className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-foreground"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : problem ? (
                <div className="p-6 md:p-8 space-y-6">
                  {/* Question Render */}
                  <div className="flex flex-col items-center px-4">
                    {(() => {
                      const hasLeftText = (problem as any).left_side_text?.body;
                      const qType = problem.question_type || problem.type;

                      if (
                        hasLeftText &&
                        [
                          "reading_multiple_choice",
                          "reading_select_all",
                        ].includes(qType || "")
                      ) {
                        return (
                          <ReadingLayout
                            question={problem}
                            questionType={qType!}
                            isSelected={isSelected}
                            handleSelect={handleSelect}
                            getChoiceId={getChoiceId}
                            isCorrectAnswer={false} // Show correct answer state if submitted
                          />
                        );
                      }

                      switch (qType) {
                        case "multiple_choice":
                          return (
                            <MultipleChoice
                              question={problem}
                              isSelected={isSelected}
                              handleSelect={handleSelect}
                              getChoiceId={getChoiceId}
                              isCorrectAnswer={false}
                            />
                          );

                        case "multiple_select":
                        case "sentence_equivalence":
                        case "reading_select_all":
                          return (
                            <MultipleSelect
                              question={problem}
                              isSelected={isSelected}
                              handleSelect={handleSelect}
                              getChoiceId={getChoiceId}
                              isCorrectAnswer={false}
                              questionType={qType}
                            />
                          );

                        case "quantitative_comparison":
                          return (
                            <QuantitativeComparison
                              question={problem}
                              isSelected={isSelected}
                              handleSelect={handleSelect}
                            />
                          );

                        case "tc_1_blank":
                        case "tc_2_blank":
                        case "tc_3_blank":
                          return (
                            <TextCompletion
                              question={problem}
                              isSelected={isSelected}
                              handleSelect={handleSelect}
                              getChoiceId={getChoiceId}
                              isCorrectAnswer={false}
                              questionType={qType}
                            />
                          );

                        case "numeric_entry_not_fraction":
                          return (
                            <NumericEntryNotFraction
                              question={problem}
                              numericValue={numericState}
                              handleNumericNotFraction={
                                handleNumericNotFraction
                              }
                              isCorrectAnswer={false}
                            />
                          );

                        case "numeric_entry_fraction":
                          return (
                            <NumericEntryFraction
                              question={problem}
                              numericValue={numericState}
                              handleNumericFraction={handleNumericFraction}
                              isCorrectAnswer={false}
                            />
                          );

                        case "pairing":
                          return (
                            <Pairing
                              question={problem}
                              value={pairingAnswer}
                              disabled={false}
                              onChange={handlePairingChange}
                              isCorrectAnswer={false}
                            />
                          );

                        case "matching":
                          return (
                            <Matching
                              question={problem}
                              value={pairingAnswer}
                              disabled={false}
                              onChange={handlePairingChange}
                              isCorrectAnswer={false}
                            />
                          );

                        case "fill_in_the_blank":
                          return (
                            <Blank
                              question={problem}
                              value={
                                Array.isArray(selectedAnswer)
                                  ? selectedAnswer.join("&&&")
                                  : ""
                              }
                              disabled={false}
                              onChange={handleBlankChange}
                            />
                          );

                        default:
                          return (
                            <div className="text-center py-10">
                              Unsupported question type: {qType}
                            </div>
                          );
                      }
                    })()}
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col items-center justify-center pt-6 gap-4">
                    <Button
                      onClick={handleSubmit}
                      className="w-full sm:w-auto px-8 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                      size="lg"
                      disabled={
                        !selectedAnswer ||
                        (Array.isArray(selectedAnswer) &&
                          selectedAnswer.length === 0)
                      }
                    >
                      {problem?.status === "Attempted" ||
                      problem?.status === "Solved"
                        ? "Try Again"
                        : "Submit Answer"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  Problem not found
                </div>
              )}
            </div>

            {/* Footer - matches reference exactly */}
            {problem && (
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t bg-background shrink-0">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Like button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-7 gap-1.5 px-2 rounded-full",
                      problem.liked &&
                        "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/30 dark:border-blue-800",
                    )}
                    onClick={handleLike}
                    disabled={actionLoading === "like"}
                  >
                    {actionLoading === "like" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ThumbsUp
                        className={cn(
                          "h-4 w-4",
                          problem.liked && "fill-blue-600 text-blue-600",
                        )}
                      />
                    )}
                    <span className="font-medium">{problem.likes || 0}</span>
                  </Button>

                  {/* Bookmark button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-7 gap-1.5 px-2 rounded-full",
                      problem.bookmarked &&
                        "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/30 dark:border-blue-800",
                    )}
                    onClick={handleBookmark}
                    disabled={actionLoading === "bookmark"}
                  >
                    {actionLoading === "bookmark" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Bookmark
                        className={cn(
                          "h-4 w-4",
                          problem.bookmarked && "fill-blue-600 text-blue-600",
                        )}
                      />
                    )}
                    <span className="font-medium">Bookmark</span>
                  </Button>

                  {/* Question Type Badge */}
                  <Badge
                    variant="outline"
                    className="h-7 px-2 rounded-full font-normal text-sm"
                  >
                    {QUESTION_TYPE_DISPLAY[problem.type as QuestionType] ||
                      problem.question_type?.replace(/_/g, " ") ||
                      "Unknown"}
                  </Badge>

                  {/* Difficulty Badge */}
                  <Badge
                    className={cn(
                      " rounded-full font-medium text-sm border-0",
                      getDifficultyBadgeClass(problem.difficulty),
                    )}
                  >
                    {DIFFICULTY_DISPLAY[problem.difficulty?.toLowerCase()] ||
                      problem.difficulty ||
                      "TBD"}
                  </Badge>

                  {/* Success Rate */}
                  {problem.successRate !== undefined && (
                    <span className="text-sm text-muted-foreground ml-1">
                      {problem.successRate.toFixed(2)}% Correct
                    </span>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-2">
                  {(problem.status === "Attempted" ||
                    problem.status === "Solved") &&
                    (problem.note ||
                      problem.solution_video ||
                      problem.has_solution_video) && (
                      <Button
                        size="sm"
                        className="h-9 gap-1.5 px-4 bg-sky-500 hover:bg-sky-600 text-white"
                        onClick={() => setShowSolution(true)}
                      >
                        {problem.solution_video ||
                        problem.has_solution_video ? (
                          <Play className="h-4 w-4 mr-2" />
                        ) : (
                          <FileText className="h-4 w-4 mr-2" />
                        )}
                        View Solution
                      </Button>
                    )}
                  <Button
                    size="sm"
                    className="h-9 gap-1.5 px-4 bg-blue-600 hover:bg-blue-700"
                    onClick={handlePrev}
                    disabled={!hasPrev}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </Button>

                  <Button
                    size="sm"
                    className="h-9 gap-1.5 px-4 bg-blue-600 hover:bg-blue-700"
                    onClick={handleNext}
                    disabled={!hasNext}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </DialogContent>

      <Dialog open={showSolution} onOpenChange={setShowSolution}>
        <DialogContent
          className={cn(
            "overflow-y-auto block transition-all duration-200",
            isSolutionFullscreen
              ? "fixed inset-0 !max-w-[100vw] !w-screen !h-screen !max-h-screen !rounded-none !translate-x-0 !translate-y-0 !top-0 !left-0 z-[70]"
              : "w-xl md:max-w-3xl max-h-[80vh]",
          )}
        >
          {/* Header with toggle */}
          <div className="flex items-center justify-between mb-4 sticky top-0 bg-background z-10 py-2 border-b">
            <DialogTitle>Solution</DialogTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsSolutionFullscreen(!isSolutionFullscreen)}
              >
                {isSolutionFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="px-1 text-center space-y-6">
            {/* Solution Video */}
            {problem?.solution_video && (
              <div className="w-full aspect-video">
                <VideoPlayer videoUrl={problem.solution_video} />
              </div>
            )}

            {/* Solution Note */}
            {problem?.note && <Viewer content={problem.note} />}

            {/* Fallback */}
            {!problem?.solution_video && !problem?.note && (
              <div className="text-center py-8 text-muted-foreground">
                No solution available.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <DraggableModal
        open={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        title="Calculator"
      >
        <AppCalculator />
      </DraggableModal>
    </Dialog>
  );
}
