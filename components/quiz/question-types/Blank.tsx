import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { stripHtml } from '@/lib/stripHtml';
import { X } from 'lucide-react';
import { Viewer } from 'react-latex-editor';

const DELIMITER = '&&&';

interface Props {
  question?: any;
  value?: string;
  disabled?: boolean;
  onChange?: (answers: string[]) => void;
}

export default function Blank({ question, value = '', disabled = false, onChange }: Props) {
  /**
   * OPTIONS (plain text only)
   */
  const allOptions = useMemo(() => {
    return (question?.choice_groups?.[0]?.choices || []).map((o: any) => stripHtml(o.body));
  }, [question]);

  /**
   * BLANK QUESTIONS (HTML + LaTeX)
   */
  const blanks = question?.choice_groups?.[1]?.choices || [];
  const blankCount = blanks.length;

  const [answers, setAnswers] = useState<string[]>(Array(blankCount).fill(''));

  /**
   * Initialize answers from saved value
   */
  useEffect(() => {
    const parsed = value ? value.split(DELIMITER) : [];
    setAnswers([...parsed, ...Array(blankCount - parsed.length).fill('')]);
  }, [value, blankCount]);

  /**
   * Available options (remove used ones)
   */
  const availableOptions = useMemo(() => {
    const used = new Set(answers.filter(Boolean));
    return allOptions.filter((opt: string) => !used.has(opt));
  }, [allOptions, answers]);

  const emitChange = useCallback(
    (updated: string[]) => {
      setAnswers(updated);
      onChange?.(updated);
    },
    [onChange]
  );

  /**
   * Drag handlers
   */
  const handleDragStart = (e: React.DragEvent, text: string) => {
    if (disabled) return;
    e.dataTransfer.setData('text/plain', text);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (disabled) return;

    const text = e.dataTransfer.getData('text/plain');
    if (!text || answers[index] === text) return;

    emitChange(answers.map((a, i) => (i === index ? text : a)));
  };

  const handleRemove = (index: number) => {
    if (disabled || !answers[index]) return;
    emitChange(answers.map((a, i) => (i === index ? '' : a)));
  };

  console.log(question);

  return (
    <div className="space-y-6">
      <div className='flex justify-center items-center py-2'>
        <Viewer content={question?.body} />
      </div>
      {/* OPTIONS */}
      <div className="flex flex-wrap gap-2">
        {availableOptions.map((text: string) => (
          <div
            key={text}
            draggable={!disabled}
            onDragStart={(e) => handleDragStart(e, text)}
            className={`px-3 py-2 rounded-lg text-sm select-none
              ${
                disabled
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-slate-900 text-white cursor-move'
              }`}
          >
            {text}
          </div>
        ))}
      </div>

      {/* BLANK QUESTIONS */}
      <div className="space-y-4">
        {blanks.map((item: any, index: number) => {
          /**
           * IMPORTANT:
           * Do NOT strip HTML here.
           * Viewer needs LaTeX + HTML intact.
           */
          const parts = item.body.split('____');
          const filled = answers[index];

          return (
            <div
              key={index}
              className="flex items-center gap-1"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, index)}
            >
              <span>{index + 1}.</span>
              <div className="[&_*]:m-0 inline">
                <Viewer content={parts[0] || ''} />
              </div>

              {filled ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-900 text-white">
                  {filled}
                  {!disabled && (
                    <button onClick={() => handleRemove(index)}>
                      <X size={12} className="bg-blue-500 rounded-full cursor-pointer" />
                    </button>
                  )}
                </span>
              ) : (
                <span className="inline-block w-20 h-5 rounded bg-gray-200" />
              )}

              <div className="[&_*]:m-0 inline">
                <Viewer content={parts[1] || ''} />
              </div>
            </div>
          );
        })}
      </div>

      {/* HELP TEXT */}
      <div className="mt-6 p-4 bg-gray-100 rounded text-sm">
        Drag the blue options into the gray boxes below.
      </div>
    </div>
  );
}
