import { Viewer } from 'react-latex-editor';
import { X } from 'lucide-react';
import LeftSideContent from './LeftSideContent';
import ChoiceButton from '@/components/shared/button/ChoiceButton';
import { Button } from '@/components/ui/button';

interface ReadingLayoutProps {
  question: any;
  questionType: string;
  isSelected: (choiceId: string, groupIndex?: number) => boolean;
  handleSelect: (choiceId: string, groupIndex?: number) => void;
  getChoiceId: (choice: any) => string;
  isCorrectAnswer: boolean;
}

export default function ReadingLayout({
  question,
  questionType,
  isSelected,
  handleSelect,
  getChoiceId,
  isCorrectAnswer
}: ReadingLayoutProps) {
  const isSelectAll = questionType === 'reading_select_all';
  const instructionText = isSelectAll
    ? "Select all that apply."
    : "Select one answer choice.";

  return (
    <div className="flex flex-col lg:flex-row gap-6">

      <div className="w-1/2 md:grow">
        <LeftSideContent content={question.left_side_text.body} />
      </div>

      <div className="border-r border-gray-400 hidden lg:block"></div>

      <div className="w-1/2 flex flex-col items-center gap-2">
        <div className="mb-10">
          <Viewer contentClassName='viewer-font-size-2xl' content={question?.body || ''} />
        </div>
        <div className="w-full">
          {question.choice_groups?.[0]?.choices?.map((choice: any) => (
            <button
              key={getChoiceId(choice)}
              onClick={() => handleSelect(getChoiceId(choice), 0)}
              disabled={isCorrectAnswer}
              className="flex text-left items-center gap-4 transition duration-150 w-full mb-2"
            >
              {isSelectAll ? (
                <span className="w-5 h-5 flex items-center justify-center border border-black shrink-0">
                  {isSelected(getChoiceId(choice)) && <X size={20} color="black" />}
                </span>
              ) : (
                <ChoiceButton selectedNow={isSelected(getChoiceId(choice))} />
              )}
              <Viewer contentClassName='viewer-font-size-2xl' content={choice.body} />
            </button>
          ))}
        </div>
        <h3 className="w-full p-3 mt-6 bg-gray-100">
          {instructionText}
        </h3>
      </div>
    </div>
  );
}
