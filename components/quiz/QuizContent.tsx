"use client";
import { useAppSelector } from "@/redux/hooks";
import { Rss } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Question from "./Question";
import SolutionControls from "./SolutionControls";
import RemoveFromSupperQuiz from "./RemoveFromSupperQuiz";

export default function QuizContent() {
  const { data, currentQuestionIndex } = useAppSelector(
    (state) => state.quizData,
  );

  const { solutionAttempting, isSuperQuiz } = useAppSelector(
    (state) => state.quizControl,
  );
  if (!data?.questions) return null;

  const type = data?.questions[currentQuestionIndex].type;
  const question = data.questions[currentQuestionIndex];

  return (
    <div>
      {solutionAttempting && <SolutionControls questions={data.questions} />}
      <Question questionType={type} question={question} />
      {isSuperQuiz && <RemoveFromSupperQuiz />}
      <div className="flex items-center justify-end p-4">
        <Dialog>
          <DialogTrigger asChild>
            <button className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white shadow-sm transition hover:bg-gray-800 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-pink-400">
              <Rss className="size-3.5" aria-hidden="true" />
              Source
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md gap-0 overflow-hidden p-0">
            <DialogHeader className="border-b px-4 py-3">
              <DialogTitle className="text-sm font-semibold text-slate-800">
                Source
              </DialogTitle>
            </DialogHeader>
            <div className="px-4 py-4">
              <DialogDescription className="text-sm text-slate-600">
                {question.source || "No source provided."}
              </DialogDescription>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
