import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { Paragraph } from "./skills";

interface Props {
  paragraph: Paragraph;
  currentIndex: number;
  totalParagraphs: number;
  onPrevious: () => void;
  onNext: () => void;
  onTitleClick: () => void;
}

export default function LeftSideParagraph({
  paragraph,
  currentIndex,
  totalParagraphs,
  onPrevious,
  onNext,
  onTitleClick,
}: Props) {
  return (
    <div className=" rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold ">
            Paragraph {currentIndex + 1} of {totalParagraphs}
          </h3>
          <p
            className="text-sm text-blue-600 cursor-pointer hover:underline"
            onClick={onTitleClick}
          >
            {paragraph.title}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onNext}
            disabled={currentIndex === totalParagraphs - 1}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <p>{paragraph.text}</p>

      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalParagraphs }).map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full ${
              index === currentIndex ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
