import React from "react";
import { useAppSelector } from "@/redux/hooks";
import { Timer } from "lucide-react";
import { useRemoveSuperQuizQuestionMutation } from "@/redux/features/quiz/super-quiz.api";
import { toast } from "sonner";

export default function RemoveFromSupperQuiz() {
  const { data, currentQuestionIndex } = useAppSelector(
    (state) => state.quizData,
  );
  const { isSuperQuiz } = useAppSelector((state) => state.quizControl);
  const [removeSuperQuizQuestion] = useRemoveSuperQuizQuestionMutation();

  const questionId = data?.questions?.[currentQuestionIndex]?._id;

  const handleRemove = async () => {
    console.log(questionId);
    try {
      await removeSuperQuizQuestion(questionId).unwrap();
      toast.success("Question removed from Super Quiz!");
    } catch (error: any) {
      toast.error(
        error.data?.message || "Failed to remove question from Super Quiz.",
      );
    }
  };

  return (
    <div className="flex items-center justify-end p-4">
      {isSuperQuiz && (
        <button
          onClick={handleRemove}
          className="flex gap-1 text-xs rounded-full bg-pink-400 text-white px-2 py-1"
        >
          <Timer size={12} /> <p>Remove from Super Quiz</p>
        </button>
      )}
    </div>
  );
}
