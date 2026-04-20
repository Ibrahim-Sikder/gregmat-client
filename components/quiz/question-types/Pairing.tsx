import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { Viewer } from 'react-latex-editor';
import { cn } from '@/lib/utils';
import { stripHtml } from '@/lib/stripHtml';
import { Choice } from '../TQuiz';

interface Props {
  question?: any;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  isCorrectAnswer?: boolean;
}

interface Pair {
  left: Choice;
  right: Choice;
}

export default function Pairing({ question, value, disabled, onChange, isCorrectAnswer }: Props) {
  const [selected, setSelected] = useState<Choice[]>([]);
  const [pairs, setPairs] = useState<Pair[]>([]);

  useEffect(() => {
    if (!value) {
      setPairs([]);
      return;
    }

    const parsedPairs = value
      .split('___')
      .filter(Boolean)
      .map(p => {
        const [leftBody, rightBody] = p.split('&&&');
        const findChoice = (body: string) =>
          question?.choice_groups?.flatMap((g: any) => g.choices)?.find((c: Choice) => stripHtml(c.body) === body);
        return { left: findChoice(leftBody), right: findChoice(rightBody) } as Pair;
      })
      .filter(p => p.left && p.right);

    setPairs(parsedPairs);
  }, [value, question]);

  const isPaired = (choice: Choice) =>
    pairs.some(p =>
      [p.left, p.right].some(c => c.order === choice.order && c.title === choice.title)
    );

  const isSelected = (choice: Choice) =>
    selected.some(c => c.order === choice.order && c.title === choice.title);

  const handleSelect = (choice: Choice) => {
    if (disabled || isPaired(choice)) return;

    setSelected(prev => {
      if (isSelected(choice)) return prev.filter(c => c.order !== choice.order);
      if (prev.length === 2) return prev;
      return [...prev, choice];
    });
  };

  useEffect(() => {
    if (selected.length === 2 && !disabled) {
      const [a, b] = selected;
      const newPairs = [...pairs, { left: a, right: b }];
      setPairs(newPairs);
      setSelected([]);

      const answerString = newPairs
        .map(p => `${stripHtml(p.left.body)}&&&${stripHtml(p.right.body)}`)
        .join('___');

      onChange(answerString);
    }
  }, [selected, disabled, pairs, onChange]);

  const removePair = (index: number) => {
    if (disabled) return;

    const newPairs = pairs.filter((_, i) => i !== index);
    setPairs(newPairs);

    const answerString = newPairs
      .map(p => `${stripHtml(p.left.body)}&&&${stripHtml(p.right.body)}`)
      .join('___');

    onChange(answerString);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <Viewer contentClassName='viewer-font-size-2xl' content={question?.body || ''} />
      </div>

      {pairs.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {pairs.map((p, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1 bg-gray-900 text-white rounded-full"
            >
              {stripHtml(p.left.body)}, {stripHtml(p.right.body)}
              <button onClick={() => removePair(index)} disabled={disabled}>
                <X size={12} className="bg-blue-500 rounded-full" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-8">
        {question?.choice_groups?.map((group: any) => (
          <div key={group.title} className="min-w-[200px]">
            {question.choice_groups.length > 1 && (
              <h3 className="font-semibold mb-3 text-center">{group.title}</h3>
            )}
            {group.choices.map((choice: Choice) => {
              const paired = isPaired(choice);
              const active = isSelected(choice);

              return (
                <Button
                  key={`${choice.order}-${choice.title}`}
                  variant="ghost"
                  disabled={disabled || paired}
                  onClick={() => handleSelect(choice)}
                  className="flex gap-2 w-full justify-start mb-2"
                >
                  <div
                    className={cn(
                      'w-5 h-5 border flex items-center justify-center',
                      paired && 'opacity-40'
                    )}
                  >
                    {active && <Check size={14} />}
                  </div>
                  <Viewer contentClassName='viewer-font-size-2xl' content={choice.body || ''} />
                </Button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
