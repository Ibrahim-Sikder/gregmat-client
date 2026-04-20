import React, { useEffect, useState } from 'react';
import { Viewer } from 'react-latex-editor';
import { stripHtml } from '@/lib/stripHtml';

interface Props {
  question?: any;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  isCorrectAnswer?: boolean;
}

const DELIMITER_PAIR = '&&&';
const DELIMITER_ALL = '___';

const isLetter = (val: string) => /^[A-Z]$/.test(val);

export default function Matching({
  question,
  value,
  disabled = false,
  onChange,
  isCorrectAnswer = false,
}: Props) {
  const leftGroup = question.choice_groups[0];
  const rightGroup = question.choice_groups[1];

  const [matches, setMatches] = useState<Record<number, string>>({});

  /* ---------------- Restore from value ---------------- */

  useEffect(() => {
    if (!value) {
      setMatches({});
      return;
    }
    const restored: Record<number, string> = {};

    value.split(DELIMITER_ALL).forEach(pair => {
      if (!pair.includes(DELIMITER_PAIR)) return;

      const [left, right] = pair.split(DELIMITER_PAIR);

      const leftIndex = leftGroup.choices.findIndex(
        (c: any) => stripHtml(c.body) === left
      );

      if (leftIndex === -1) return;

      // ✅ If right side already contains A–Z
      if (isLetter(right)) {
        restored[leftIndex] = right;
        return;
      }

      // ✅ If right side is a word
      const rightIndex = rightGroup.choices.findIndex(
        (c: any) => stripHtml(c.body) === right
      );

      if (rightIndex !== -1) {
        restored[leftIndex] = String.fromCharCode(65 + rightIndex);
      }
    });

    setMatches(restored);
  }, [value, leftGroup.choices, rightGroup.choices]);

  /* ---------------- Drag handlers ---------------- */
  const handleDragStart = (e: React.DragEvent, letter: string) => {
    if (disabled || isCorrectAnswer) return;
    e.dataTransfer.setData('text/plain', letter);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDrop = (e: React.DragEvent, leftIndex: number) => {
    e.preventDefault();
    if (disabled || isCorrectAnswer) return;

    const letter = e.dataTransfer.getData('text/plain');
    if (!letter) return;

    setMatches(prev => {
      const updated = { ...prev, [leftIndex]: letter };

      const answer = Object.entries(updated)
        .map(([lIdx, rLetter]) => {
          const rIndex = rLetter.charCodeAt(0) - 65;
          return `${stripHtml(
            leftGroup.choices[+lIdx].body
          )}${DELIMITER_PAIR}${stripHtml(
            rightGroup.choices[rIndex].body
          )}`;
        })
        .join(DELIMITER_ALL);

      onChange(answer);
      return updated;
    });
  };

  const indexToLetter = (index: number) =>
    String.fromCharCode(65 + index);

  /* ---------------- UI ---------------- */
  return (
    <div className="p-4 space-y-6">
      <Viewer
        contentClassName="viewer-font-size-2xl"
        content={question.body}
      />

      <div className="flex gap-12">
        {/* LEFT SIDE */}
        <div className="w-1/2 flex flex-col gap-4">
          {leftGroup.choices.map((leftChoice: any, index: number) => (
            <div
              key={index}
              className="flex items-center gap-2"
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDrop(e, index)}
            >
              <div
                className={`h-6 w-6 border-2 border-blue-800 flex items-center justify-center font-semibold
                  ${matches[index] ? 'bg-gray-800 text-white' : 'bg-white'}
                  ${isCorrectAnswer ? 'bg-gray-200 text-black' : ''}
                `}
              >
                {matches[index] || ''}
              </div>

              <Viewer
                contentClassName="viewer-font-size-2xl"
                content={leftChoice.body}
              />
            </div>
          ))}
        </div>

        {/* RIGHT OPTIONS */}
        <div className="w-1/2 flex flex-col gap-3">
          {rightGroup.choices.map((choice: any, idx: number) => {
            const letter = indexToLetter(idx);

            return (
              <div key={choice.order} className="flex items-center">
                <div
                  draggable={!disabled && !isCorrectAnswer}
                  onDragStart={e => handleDragStart(e, letter)}
                  className={`cursor-move select-none viewer-font-size-2xl ${isCorrectAnswer ? 'opacity-60' : ''
                    }`}
                >
                  {letter}. {stripHtml(choice.body)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mt-8 p-4 bg-gray-100">
          Drag the letters on the right into the boxes on the left.
        </h3>
      </div>
    </div>
  );
}
