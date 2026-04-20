'use client';
import React from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { goToQuestion } from '@/redux/features/quiz/quizDataSlice';
import { setReviewed } from '@/redux/features/quiz/quizControlSlice';
import { Check } from 'lucide-react';

export default function AnswerReview() {
  const dispatch = useAppDispatch();
  const { data, answers, bookmarkedQuestions, currentQuestionIndex } = useAppSelector(
    (state) => state.quizData
  );

  if (!data?.questions) return null;

  const handleGoToQuestion = (questionIndex: number) => {
    dispatch(goToQuestion({ questionIndex }));
    dispatch(setReviewed(false));
  };

  return (
    <div>
      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-1">Question</th>
            <th className="border p-1">Status</th>
            <th className="border p-1">Marked</th>
          </tr>
        </thead>
        <tbody>
          {data.questions.map((question: any, questionIndex: number) => {
            const answerObj = answers.find((a) => a.question === question._id);

            const isCurrent = currentQuestionIndex === questionIndex;
            const visited = !!answerObj || isCurrent;
            const answered =
              answerObj &&
              answerObj.given_answer !== null &&
              String(answerObj.given_answer).trim().length > 0;

            let status = 'Not Encountered';
            if (visited && !answered) status = 'Not Answered';
            if (answered) status = 'Answered';

            const bookmarked = bookmarkedQuestions.some((b) => b.questionIndex === questionIndex);
            const isDisabled = status === 'Not Encountered';
            return (
              <tr
                onClick={() => {
                  if (!isDisabled) {
                    handleGoToQuestion(questionIndex);
                  }
                }}
                key={question._id}
                className={`hover:bg-gray-100 ${isCurrent ? 'bg-blue-50' : ''}`}
              >
                <td className="border px-2 py-1 text-center">Question {questionIndex + 1}</td>

                <td className="border px-2 py-1 text-center">
                  <span
                    className={`inline-block px-2 py-1 rounded ${
                      status === 'Answered'
                        ? 'text-green-600'
                        : status === 'Not Answered'
                        ? 'text-orange-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {status}
                  </span>
                </td>

                <td className="border px-2 py-1 text-center cursor-pointer">
                  {bookmarked && <Check size={12} className="mx-auto" />}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
