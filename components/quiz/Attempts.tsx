import { formatDateTime } from "@/lib/utils";
import { setAttemptReviewModal } from "@/redux/features/quiz/quizControlSlice";
import { setSelectedAttemptGroup } from "@/redux/features/quiz/quizDataSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useState } from "react";
import ModalContainer from "../shared/modal/ModalContainer";
import AttemptsReview from "./AttemptsReview";
import { AttemptGroup } from "./TQuiz";

export default function Attempts() {
  const dispatch = useAppDispatch();
  const { data } = useAppSelector((state) => state.quizData);
  const { attemptReviewModal } = useAppSelector((state) => state.quizControl);

  const [sortConfig, setSortConfig] = useState<{
    key: "date" | "raw" | "percent";
    direction: "asc" | "desc";
  }>({ key: "date", direction: "desc" });

  if (!data?.attempts || data.attempts.length === 0) {
    return null;
  }

  const sortedAttempts = [...data.attempts].sort((a, b) => {
    if (sortConfig.key === "date") {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
    } else if (sortConfig.key === "raw") {
      const scoreA = a.summary.total_score;
      const scoreB = b.summary.total_score;
      return sortConfig.direction === "asc" ? scoreA - scoreB : scoreB - scoreA;
    } else {
      const percentA = a.summary.accuracy_percent;
      const percentB = b.summary.accuracy_percent;
      return sortConfig.direction === "asc"
        ? percentA - percentB
        : percentB - percentA;
    }
  });

  const handleSort = (key: "date" | "raw" | "percent") => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  const SortIcon = ({
    active,
    direction,
  }: {
    active: boolean;
    direction: string;
  }) => (
    <span className="ml-1 text-xs">
      {active ? (direction === "asc" ? "↑" : "↓") : "↕"}
    </span>
  );

  const handleSelectAttempt = (attempt: AttemptGroup) => {
    dispatch(setSelectedAttemptGroup(attempt));
    dispatch(setAttemptReviewModal(true));
  };

  return (
    <div className="max-w-4xl m-auto">
      <div className="bg-white overflow-x-auto scroll-auto">
        <p className="pb-4">
          You've attempted this quiz before, to review a previous submission,
          select it below
        </p>
        <table className="w-full border-collapse border">
          <thead>
            <tr>
              <th
                className={`p-2 text-left font-semibold cursor-pointer border transition-colors
              ${
                sortConfig.key === "date"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }
            `}
                onClick={() => handleSort("date")}
              >
                Attempt Date
                <SortIcon
                  active={sortConfig.key === "date"}
                  direction={sortConfig.direction}
                />
              </th>
              <th
                className={`p-2 text-left font-semibold cursor-pointer border  transition-colors
              ${
                sortConfig.key === "raw"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }
            `}
                onClick={() => handleSort("raw")}
              >
                Raw Score
                <SortIcon
                  active={sortConfig.key === "raw"}
                  direction={sortConfig.direction}
                />
              </th>
              <th
                className={`p-2 text-left font-semibold cursor-pointer border  transition-colors
              ${
                sortConfig.key === "percent"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }
            `}
                onClick={() => handleSort("percent")}
              >
                % Score
                <SortIcon
                  active={sortConfig.key === "percent"}
                  direction={sortConfig.direction}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedAttempts.map((attempt, index) => (
              <tr
                key={attempt._id}
                onClick={() => handleSelectAttempt(attempt)}
                className={`hover:bg-blue-50 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="p-2 border border-gray-300 text-blue-600 font-medium">
                  {formatDateTime(attempt.createdAt, true)}
                </td>
                <td className="p-2 border border-gray-300 text-gray-700">
                  {attempt.summary.total_score} out of{" "}
                  {attempt.summary.total_score_denom}
                </td>
                <td className="p-2 border border-gray-300 text-gray-700">
                  {attempt.summary.accuracy_percent.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-center pt-4">
          <p>Or, you can start the quiz again</p>
        </div>
      </div>
      <ModalContainer
        width="min-w-xl"
        title="Attempt Review"
        open={attemptReviewModal}
        onOpenChange={() => dispatch(setAttemptReviewModal(false))}
      >
        <AttemptsReview />
      </ModalContainer>
    </div>
  );
}
