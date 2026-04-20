import React from "react";

interface Props {
  idx: number;
  currentParagraph: number;
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  refCallback: (el: HTMLTextAreaElement | null) => void;
  isGraded?: boolean;
  score?: number | null;
}

export default function MiddleInputs({
  idx,
  currentParagraph,
  value,
  onChange,
  onFocus,
  refCallback,
  isGraded = false,
  score = null,
}: Props) {
  const getBorderColor = () => {
    if (!isGraded) {
      return idx === currentParagraph
        ? "border-blue-500 ring-2 ring-blue-200"
        : "border-gray-300";
    }
    // Graded state colors
    if (score !== null) {
      if (score >= 8) return "border-green-500 bg-green-50";
      if (score >= 5) return "border-yellow-500 bg-yellow-50";
      return "border-red-500 bg-red-50";
    }
    return "border-gray-300 bg-gray-50";
  };

  return (
    <div className="relative">
      <textarea
        ref={refCallback}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        placeholder={`Write for paragraph ${idx + 1}`}
        disabled={isGraded}
        className={`w-full min-h-[180px] p-4 border rounded-lg resize-none transition-all ${getBorderColor()}`}
      />
      {isGraded && score !== null && (
        <div
          className={`absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white font-bold rounded ${
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
  );
}
