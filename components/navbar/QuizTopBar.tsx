"use client";
import {
  useCreateAttemptMutation,
  useGetQuizQuery,
} from "@/redux/features/quiz/quiz.api";
import {
  setReviewed,
  setSolutionAttempting,
  setSubmissionModal,
} from "@/redux/features/quiz/quizControlSlice";
import {
  nextQuestion,
  prevQuestion,
  saveAnswer,
  setCurrentQuestionId,
  setSelectedAttemptGroup,
  submitQuiz,
  toggleBookmark,
} from "@/redux/features/quiz/quizDataSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  Calculator,
  ChevronLeft,
  ChevronRight,
  Ghost,
  Search,
  Send,
  Square,
  SquareCheck,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AppCalculator from "../AppCalculator";
import AnswerReview from "../quiz/AnswerReview";
import AttemptsReview from "../quiz/AttemptsReview";
import Loader from "../shared/Loader";
import Container from "../shared/container/Container";
import { DraggableModal } from "../shared/modal/DraggableModal";
import ModalContainer from "../shared/modal/ModalContainer";
import { Button } from "../ui/button";

export default function QuizTopBar() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const [showCalculator, setShowCalculator] = useState(false);
  const [showAction, setShowAction] = useState(false);
  const { data, refetch, isFetching } = useGetQuizQuery(params.slug);
  const { data: quizData } = useAppSelector((state) => state.quizData);
  const { isSuperQuiz, timeLeft } = useAppSelector(
    (state) => state.quizControl,
  );
  const [createAttempt] = useCreateAttemptMutation();
  const {
    answers,
    currentQuestionIndex,
    bookmarkedQuestions,
    submitted,
    selectedAttemptGroup,
    userId,
  } = useAppSelector((state) => state.quizData);
  const {
    isBegin,
    isBeginSection,
    isReviewed,
    submissionModal,
    solutionAttempting,
  } = useAppSelector((state) => state.quizControl);

  const slug = Array.isArray(params?.slug)
    ? params.slug.join("-")
    : (params?.slug ?? "");
  const formattedSlug = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  const totalQuestions =
    data?.data?.questions?.length || quizData?.questions?.length || 0;
  const isBookmarked = bookmarkedQuestions.some(
    (b) => b.questionIndex === currentQuestionIndex,
  );
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const handleSubmit = async () => {
    if (submitted) return;

    if (!answers.length) {
      dispatch(
        saveAnswer({
          user: userId,
          question: quizData?.questions[currentQuestionIndex]._id || "",
          given_answer: "",
          seconds: 0,
          quiz: quizData?._id || "",
          collection: quizData?.collection || "",
          correct: false,
          score: 0,
          score_denom: 0,
        }),
      );
    }
    const payload = {
      attempts: answers,
    };
    const res = await createAttempt(payload).unwrap();

    if (res?.success) {
      const refreshed = await refetch().unwrap();

      const newAttemptGroup = refreshed?.data?.attempts?.find(
        (attempt: any) => attempt._id === res.data?._id,
      );

      dispatch(setSelectedAttemptGroup(newAttemptGroup));
      dispatch(setSubmissionModal(!submissionModal));
      dispatch(submitQuiz());
    }
  };

  useEffect(() => {
    setShowAction(true);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft]);

  if (!data?.data?.questions?.length && !quizData?.questions?.length)
    return null;

  const handleNext = () => {
    if (solutionAttempting) {
      const nextAttempt =
        selectedAttemptGroup?.attempts[currentQuestionIndex + 1];

      // if (answers) {
      //   dispatch(setIsCorrectAnswer(answers[currentQuestionIndex].correct));
      // }
      if (nextAttempt) {
        dispatch(setCurrentQuestionId(nextAttempt.question));
        dispatch(saveAnswer(nextAttempt));
      }
    }

    dispatch(nextQuestion());
  };

  const handlePrev = () => {
    if (solutionAttempting) {
      const prevAttempt =
        selectedAttemptGroup?.attempts[currentQuestionIndex - 1];
      // if (answers) {
      //   dispatch(setIsCorrectAnswer(answers[currentQuestionIndex].correct));
      // }
      if (prevAttempt) {
        dispatch(setCurrentQuestionId(prevAttempt.question));
        dispatch(saveAnswer(prevAttempt));
      }
    }

    dispatch(prevQuestion());
  };

  const handleAnswererReview = () => {
    if (solutionAttempting) {
      dispatch(setSubmissionModal(true));
    } else {
      dispatch(setReviewed(!isReviewed));
    }
  };

  if (isFetching) return <Loader />;

  return (
    <div className="bg-[#3A3736] text-white p-4">
      <Container>
        <div className="flex flex-col lg:flex-row gap-2 lg:justify-between items-center">
          <header>
            <h1 className="text-2xl font-bold">
              {formattedSlug || data?.title || quizData?.title}{" "}
            </h1>
          </header>
          {isBegin && showAction && isBeginSection && (
            <div className="flex items-center gap-2">
              {/* Calculator */}
              <Button
                onClick={() => setShowCalculator(true)}
                title="Open Calculator"
                className="h-10 w-10 bg-gray-600 hover:bg-gray-700 rounded-full"
              >
                <Calculator />
              </Button>

              {/* Answer Review */}
              <Button
                title="Answer Review"
                onClick={() => handleAnswererReview()}
                className="h-10 w-10 bg-gray-600 hover:bg-gray-700 rounded-full"
              >
                <Search />
              </Button>

              {/* Mark */}
              <Button
                title="Mark"
                onClick={() =>
                  dispatch(
                    toggleBookmark({
                      questionIndex: currentQuestionIndex,
                    }),
                  )
                }
                className={`h-10 w-10 bg-gray-600 hover:bg-gray-700 rounded-full`}
              >
                {isBookmarked ? <SquareCheck /> : <Square />}
              </Button>

              {/* Previous */}
              <Button
                onClick={() => handlePrev()}
                disabled={currentQuestionIndex === 0}
                className={`h-10 w-10 rounded-full transition-colors ${
                  currentQuestionIndex === 0
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-gray-600 hover:bg-gray-700"
                }`}
              >
                <ChevronLeft />
              </Button>

              {/* Next */}
              <Button
                onClick={() => handleNext()}
                disabled={isLastQuestion}
                className={`h-10 w-10 rounded-full transition-colors ${
                  isLastQuestion
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-gray-600 hover:bg-gray-700"
                }`}
              >
                <ChevronRight />
              </Button>

              {/* Submit */}
              {!solutionAttempting && !isSuperQuiz && (
                <Button
                  onClick={handleSubmit}
                  disabled={submitted || !isLastQuestion}
                  className={`h-10 w-10 rounded-full transition-colors bg-gray-500 hover:bg-gray-600 ${
                    submitted || !isLastQuestion
                      ? "cursor-not-allowed"
                      : "bg-gray-600 hover:bg-gray-700"
                  }`}
                >
                  <Send />
                </Button>
              )}

              {isSuperQuiz && (
                <Button
                  onClick={() =>
                    dispatch(setSolutionAttempting(!solutionAttempting))
                  }
                  className={`h-10 w-10 rounded-full transition-colors bg-gray-500 hover:bg-gray-600`}
                >
                  <Ghost />
                </Button>
              )}
            </div>
          )}
        </div>
      </Container>

      {/* Answer Review Modal */}
      <ModalContainer
        title="Review"
        open={isReviewed}
        onOpenChange={(open: boolean) => dispatch(setReviewed(open))}
      >
        <AnswerReview />
      </ModalContainer>

      {/* Submission Modal */}
      <ModalContainer
        title="Review"
        open={submissionModal}
        onOpenChange={(open: boolean) => dispatch(setSubmissionModal(open))}
      >
        <AttemptsReview />
      </ModalContainer>

      {/* Calculator Modal */}
      <DraggableModal
        title="Calculator"
        open={showCalculator}
        onClose={() => setShowCalculator(false)}
      >
        <AppCalculator />
      </DraggableModal>
    </div>
  );
}
