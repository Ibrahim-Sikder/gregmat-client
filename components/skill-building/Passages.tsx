import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useMemo,
} from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LeftSideParagraph from "./LeftSideParagraph";
import MiddleInputs from "./MiddleInputs";
import RightSideControls from "./RightSideControls";
import FeedbackSidebar from "./FeedbackSidebar";
import AttemptSheet from "./AttemptSheet";
import {
  initializeParagraphs,
  nextParagraph,
  prevParagraph,
  setCurrentParagraph,
  updateInput,
} from "@/redux/features/skills-building/passagesSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type {
  IMainIdeaPractice,
  IMainIdeaAttemptResponse,
} from "@/types/main-idea";
import { submitMainIdeaAttempt } from "@/actions/main-idea";

interface PassagesProps {
  practice: IMainIdeaPractice;
}

export interface PassagesRef {
  loadAttempt: (attempt: IMainIdeaAttemptResponse) => void;
}

const Passages = forwardRef<PassagesRef, PassagesProps>(({ practice }, ref) => {
  const dispatch = useAppDispatch();
  const { currentParagraph, userInputs } = useAppSelector(
    (state) => state.passage,
  );
  const textRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [attemptSheetOpen, setAttemptSheetOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"practice" | "review">("practice");
  const [reviewData, setReviewData] = useState<IMainIdeaAttemptResponse | null>(
    null,
  );
  const [currentSheetAttempt, setCurrentSheetAttempt] =
    useState<IMainIdeaAttemptResponse | null>(null);

  const paragraphs = practice.paragraphs || [];
  const attempts = practice.attempts || [];

  // Map IParagraph to Paragraph format for LeftSideParagraph component
  const mappedParagraphs = paragraphs.map((para, index) => ({
    id: index + 1,
    title: para.passage_source || `Paragraph ${index + 1}`,
    text: para.body,
  }));

  useEffect(() => {
    dispatch(initializeParagraphs(paragraphs.length));

    // Auto-load the latest attempt if exists and not yet loaded?
    // User requested "Show attempt" usually via list.
    // If we want to start in review mode if previously attempted:
    if (
      practice.attempts &&
      practice.attempts.length > 0 &&
      viewMode === "practice" &&
      !reviewData
    ) {
      // Optional: Auto-load latest attempt
      // const latest = practice.attempts[0];
      // setReviewData(latest);
      // setViewMode("review");
      // initialize inputs...
    }
  }, [dispatch, paragraphs.length]);

  useEffect(() => {
    const el = textRefs.current[currentParagraph];
    if (el) el.focus();
  }, [currentParagraph]);

  const loadAttemptMainView = (attempt: IMainIdeaAttemptResponse) => {
    setReviewData(attempt);
    setViewMode("review");
    attempt.paragraph_attempts.forEach((paraAttempt, index) => {
      dispatch(updateInput({ index, value: paraAttempt.given_main_idea }));
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAttemptClick = (attempt: IMainIdeaAttemptResponse) => {
    setCurrentSheetAttempt(attempt);
    setAttemptSheetOpen(true);
  };

  // Expose loadAttempt function to parent via ref
  useImperativeHandle(ref, () => ({
    loadAttempt: loadAttemptMainView,
  }));

  const handleAttemptAgain = () => {
    setViewMode("practice");
    setReviewData(null);
    dispatch(initializeParagraphs(paragraphs.length));
    setFeedbackOpen(false);
  };

  const handleSubmit = async () => {
    // Check if all paragraphs have been attempted
    const unanswered = userInputs.filter((x) => x.trim() === "").length;
    if (unanswered > 0) {
      alert(
        `Please complete all ${paragraphs.length} paragraphs before submitting. You have ${unanswered} unanswered.`,
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const paragraph_attempts = paragraphs.map((para, index) => ({
        paragraph: para._id,
        given_main_idea: userInputs[index] || "",
      }));

      const result = await submitMainIdeaAttempt({
        mainIdeaPractice: practice._id,
        paragraph_attempts,
      });

      if (result) {
        // Switch to review mode immediately with the result
        // We might need to refresh the page to get the updated 'attempts' list from server though.
        // For now, let's just show the result.
        // Ideally we should revalidate the page status.
        alert(
          "Submitted successfully! functionality to load new attempt result is pending page refresh.",
        );
        window.location.reload();
      } else {
        alert("Failed to submit your attempt. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting attempt:", error);
      alert("An error occurred while submitting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey && e.key === "Enter") {
      if (viewMode === "practice") handleSubmit();
    }
  };

  const stats = useMemo(() => {
    if (viewMode === "review" && reviewData) {
      const total = reviewData.paragraph_attempts.length;
      const skipped = reviewData.paragraph_attempts.filter(
        (p) => !p.given_main_idea || p.given_main_idea.trim() === "",
      ).length; // or based on logic
      const correct = reviewData.paragraph_attempts.filter(
        (p) => (p.gpt_score || 0) >= 8,
      ).length; // Assuming 8 is threshold
      const incorrect = total - correct; // simplified

      return {
        completed: total,
        skipped,
        correct,
        incorrect,
      };
    }

    // Practice Mode Stats
    const attempted = userInputs.filter((x) => x.trim() !== "").length;
    return {
      completed: attempted,
      skipped: 0,
      correct: 0,
      incorrect: 0,
    };
  }, [viewMode, reviewData, userInputs]);

  // Current paragraph result for FeedbackSidebar
  const currentResult = reviewData?.paragraph_attempts[currentParagraph];

  return (
    <div onKeyDown={handleKeyDown} tabIndex={0} className="relative">
      {/* --- Header --- */}
      <div className="max-w-7xl mx-auto mb-6">
        <Alert className="bg-yellow-50 border-yellow-200 mb-6">
          <AlertDescription className="text-yellow-800">
            This is a new feature currently being tested, and not yet a finished
            product.
          </AlertDescription>
        </Alert>

        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 mb-6 text-center">
          <p className="text-sm text-gray-700 font-medium">
            For each paragraph, try to summarize the main idea into a sentence.
            Use the paragraph's passage context to help you.
          </p>
        </div>
      </div>

      {/* --- 3-column layout --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        {/* Left */}
        <div className="lg:col-span-4">
          <div className="top-4 sticky">
            <LeftSideParagraph
              paragraph={mappedParagraphs[currentParagraph]}
              currentIndex={currentParagraph}
              totalParagraphs={mappedParagraphs.length}
              onPrevious={() => dispatch(prevParagraph())}
              onNext={() => dispatch(nextParagraph())}
              onTitleClick={() => setContextOpen(true)}
            />
          </div>
        </div>

        {/* Middle */}
        <div className="lg:col-span-5 space-y-4">
          {mappedParagraphs.map((_, idx) => (
            <MiddleInputs
              key={idx}
              idx={idx}
              currentParagraph={currentParagraph}
              value={userInputs[idx] || ""}
              onChange={(val) =>
                dispatch(updateInput({ index: idx, value: val }))
              }
              onFocus={() => dispatch(setCurrentParagraph(idx))}
              refCallback={(el) => (textRefs.current[idx] = el)}
              isGraded={viewMode === "review"}
              score={
                viewMode === "review"
                  ? reviewData?.paragraph_attempts[idx]?.gpt_score
                  : null
              }
            />
          ))}
        </div>

        {/* Right */}
        <div className="lg:col-span-3">
          <div className="top-4 sticky">
            <RightSideControls
              title={practice.title || "Big Book Short Passages"}
              stats={stats}
              onAttemptAgain={handleAttemptAgain}
              onFeedback={() => setFeedbackOpen(true)}
              onPrevious={() => dispatch(prevParagraph())}
              onNext={() => dispatch(nextParagraph())}
              onContext={() => setContextOpen(true)}
              attempts={attempts}
              onViewAttempt={handleAttemptClick}
              isReviewMode={viewMode === "review"}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>

      <Dialog open={contextOpen} onOpenChange={setContextOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Passage Context</DialogTitle>
            <DialogDescription>
              Additional context for the current paragraph.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-gray-700 leading-relaxed">
              {paragraphs[currentParagraph]?.context ||
                "No context available for this paragraph."}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <AttemptSheet
        open={attemptSheetOpen}
        onOpenChange={setAttemptSheetOpen}
        attempt={currentSheetAttempt}
        paragraphs={paragraphs}
        onReviewInEditor={loadAttemptMainView}
      />

      <FeedbackSidebar
        isOpen={feedbackOpen && viewMode === "review"}
        onClose={() => setFeedbackOpen(false)}
        userAnswer={userInputs[currentParagraph] || ""}
        solution={paragraphs[currentParagraph]?.main_idea || "Solution hidden"}
        feedback={currentResult?.gpt_comment || "No feedback available."}
        score={currentResult?.gpt_score ?? null}
      />
    </div>
  );
});

Passages.displayName = "Passages";

export default Passages;
