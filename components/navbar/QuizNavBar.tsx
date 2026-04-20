"use client";
import { formatTime, startCountdown } from "@/lib/timeControl";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Container from "../shared/container/Container";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import {
  setBeginSection,
  setTimeLeft,
} from "@/redux/features/quiz/quizControlSlice";
import { formatDuration } from "@/lib/utils";

export default function QuizNavBar() {
  const dispatch = useAppDispatch();
  const { data, currentQuestionIndex, answers } = useAppSelector(
    (state) => state.quizData,
  );
  const { timeLeft, isBeginSection, solutionAttempting, isSuperQuiz } = useAppSelector(
    (state) => state.quizControl,
  );
  const [isTimerVisible, setIsTimerVisible] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isBeginSection && timeLeft > 0 && timeLeft !== Infinity) {
      timer = startCountdown(
        timeLeft,
        (remaining) => dispatch(setTimeLeft(remaining)),
        () => {
          alert("⏰ Time is up for this section!");
          dispatch(setBeginSection(false));
        },
      );
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isBeginSection, timeLeft, dispatch]);

  if (!data?.questions) return null;

  const totalQuestions = data.questions.length;

  return (
    <div className="bg-[#F0E1E4]">
      <Container>
        <div className="flex flex-col lg:flex-row justify-between items-center p-1 gap-2">
          {/* Progress Info */}
          <div className="text-lg font-semibold text-gray-800">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </div>

          {/* Timer */}
          {
            !isSuperQuiz && (
              <div className="text-lg font-bold flex items-center gap-3 text-gray-900">
            <button
              onClick={() => setIsTimerVisible(!isTimerVisible)}
              className="flex items-center gap-1 text-sm bg-white px-3 py-1 rounded-full shadow hover:bg-gray-100 transition"
            >
              <Eye className="w-4 h-4" />
              {isTimerVisible ? "Hide Timer" : "Show Timer"}
            </button>

            {isTimerVisible && (
              <div className="flex items-center gap-1 font-mono text-orange-800">
                {solutionAttempting ? (
                  <p>
                    Taken time:
                    {formatDuration(answers[currentQuestionIndex + 1]?.seconds)}
                  </p>
                ) : (
                  <p> ⏱ {formatTime(timeLeft)}</p>
                )}
              </div>
            )}
          </div>
            )
          }
        </div>
      </Container>
    </div>
  );
}
