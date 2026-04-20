import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userAnswer: string;
  solution: string;
  feedback: string;
  score: number | null;
}

export default function FeedbackSidebar({
  isOpen,
  onClose,
  userAnswer,
  solution,
  feedback,
  score,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Feedback</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-gray-700">
              Your Submission:
            </h3>
            {score !== null && (
              <div
                className={`w-8 h-8 flex items-center justify-center text-white font-bold rounded ${
                  score >= 8
                    ? "bg-green-500"
                    : score >= 5
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              >
                {score}
              </div>
            )}
          </div>
          <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded border">
            {userAnswer || "No answer provided"}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Solution:
          </h3>
          <p className="text-sm text-gray-600 italic">{solution}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Feedback:
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">{feedback}</p>
        </div>

        <div className="pt-8 mt-auto">
          <Button
            variant="ghost"
            className="w-full text-red-500 hover:text-red-700 hover:bg-red-50"
            size="sm"
          >
            That doesn't seem right.
          </Button>
        </div>
      </div>
    </div>
  );
}
