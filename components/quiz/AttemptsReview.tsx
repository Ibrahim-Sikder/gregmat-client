import { formatDuration } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import React, { useState } from 'react';
import { AttemptItem } from './TQuiz';
import {
  setAttemptReviewModal,
  setBegin,
  setBeginSection,
  setSolutionAttempting,
  setSubmissionModal,
} from '@/redux/features/quiz/quizControlSlice';
import { goToQuestion, saveAnswer, setCurrentQuestionId, } from '@/redux/features/quiz/quizDataSlice';

export default function AttemptsReview() {
  const { attemptReviewModal } = useAppSelector((state) => state.quizControl);
  const { selectedAttemptGroup } = useAppSelector((state) => state.quizData);
  const dispatch = useAppDispatch();


  const [sortConfig, setSortConfig] = useState<{
    key: 'question' | 'status' | 'time';
    direction: 'asc' | 'desc';
  }>({ key: 'question', direction: 'asc' });

  if (!selectedAttemptGroup) {
    return <div className="p-8 text-center text-gray-500">No attempt selected</div>;
  }



  const getStatus = (attempt: any) => {
    if (!attempt.given_answer || attempt.given_answer === '') {
      return 'unanswered';
    }
    return attempt.correct ? 'correct' : 'incorrect';
  };

  const handleAttempt = (attempt: AttemptItem, index: number) => {
    
    dispatch(setSolutionAttempting(true));
    dispatch(setSubmissionModal(false));
    dispatch(saveAnswer(attempt))
    dispatch(setBegin(true));
    dispatch(setBeginSection(true));
    dispatch(setCurrentQuestionId(attempt.question));
    dispatch(goToQuestion({ questionIndex: index }));
    dispatch(setAttemptReviewModal(!attemptReviewModal));
  };


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'correct':
        return (
          <span className="px-4 py-1 bg-green-700 text-white rounded font-medium text-sm">
            Correct Answer
          </span>
        );
      case 'incorrect':
        return (
          <span className="px-4 py-1 bg-red-700 text-white rounded font-medium text-sm">
            Incorrect Answer
          </span>
        );
      case 'unanswered':
        return (
          <span className="px-4 py-1 bg-orange-500 text-white rounded font-medium text-sm">
            Left Unanswered
          </span>
        );
      default:
        return null;
    }
  };

  const sortedAttempts = [...(selectedAttemptGroup.attempts || [])].sort((a, b) => {
    if (sortConfig.key === 'question') {
      return sortConfig.direction === 'asc' ? 1 : -1;
    } else if (sortConfig.key === 'status') {
      const statusA = getStatus(a);
      const statusB = getStatus(b);
      const order = ['correct', 'incorrect', 'unanswered'];
      const comparison = order.indexOf(statusA) - order.indexOf(statusB);
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    } else {
      const timeA = a.seconds || 0;
      const timeB = b.seconds || 0;
      return sortConfig.direction === 'asc' ? timeA - timeB : timeB - timeA;
    }
  });

  const handleSort = (key: 'question' | 'status' | 'time') => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const SortIcon = ({ active, direction }: { active: boolean; direction: string }) => (
    <span className="ml-1 text-xs">{active ? (direction === 'asc' ? '↑' : '↓') : '↕'}</span>
  );

  const totalScore = selectedAttemptGroup.summary?.total_score || 0;
  const totalDenom = selectedAttemptGroup.summary?.total_score_denom || 0;

  return (
    <div>
      <div className="bg-white">
        {/* Header */}
        <div className="flex justify-between items-center py-4 border-b border-gray-200">
          <div className="font-medium text-gray-700">
            Total Score: {totalScore} / {totalDenom}
          </div>
        </div>

        {/* Table */}
        <div>
          <table className="w-full border">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  className="px-2 py-2 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('question')}
                >
                  Question
                  <SortIcon
                    active={sortConfig.key === 'question'}
                    direction={sortConfig.direction}
                  />
                </th>
                <th
                  className="px-2 py-2 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('status')}
                >
                  Status
                  <SortIcon active={sortConfig.key === 'status'} direction={sortConfig.direction} />
                </th>
                <th
                  className="px-2 py-2 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('time')}
                >
                  Time Spent
                  <SortIcon active={sortConfig.key === 'time'} direction={sortConfig.direction} />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedAttempts.map((attempt, index) => (
                <tr onClick={() => handleAttempt(attempt, index)} key={index} className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="px-2 py-2 text-sm text-gray-700">Question {index + 1}</td>
                  <td className="px-2 py-2">
                    <button
                      className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
                    >
                      {getStatusBadge(getStatus(attempt))}
                    </button>
                  </td>
                  <td className="px-2 py-2 text-sm text-gray-700">
                    {formatDuration(attempt.seconds)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
