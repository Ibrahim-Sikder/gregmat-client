import ChoiceButton from '@/components/shared/button/ChoiceButton';
import { Viewer } from 'react-latex-editor';

interface QuantitativeComparisonProps {
  question: any;
  isSelected: (choiceId: string, groupIndex?: number) => boolean;
  handleSelect: (choiceId: string, groupIndex?: number) => void;
  isCorrectAnswer?: boolean;
}

export default function QuantitativeComparison({
  question,
  isSelected,
  handleSelect,
  isCorrectAnswer,
}: QuantitativeComparisonProps) {
  const quantOptions = [
    { id: 'A', text: 'Quantity A is greater.' },
    { id: 'B', text: 'Quantity B is greater.' },
    { id: 'C', text: 'The two quantities are equal.' },
    {
      id: 'D',
      text: 'The relationship cannot be determined from the information given.',
    },
  ];

  return (
    <div className="mb-10 flex flex-col items-center">
      <div className="mb-8">
        <Viewer contentClassName="viewer-font-size-2xl" content={question?.body || ''} />
      </div>
      <div className="flex justify-between w-full">
        {question?.choice_groups?.[0]?.choices?.map((item: any, idx: number) => (
          <div key={idx} className="flex items-center flex-col max-w-xs px-10">
            <div>
              <h4 className="font-semibold text-black mb-2 border-b-2 w-fit border-gray-500">
                {item.title === 'A' ? 'Quantity A' : item.title === 'B' ? 'Quantity B' : item.title}
              </h4>
            </div>
            <div>
              <Viewer contentClassName="viewer-font-size-2xl" content={item?.body || ''} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 w-full">
        {quantOptions.map((option) => {
          const selectedNow = isSelected(option.id);
          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className="flex gap-3 w-full  items-center  text-left viewer-font-size-2xl transition duration-150"
            >
              <ChoiceButton selectedNow={selectedNow} />
              <span>{option.text}</span>
            </button>
          );
        })}
        <h3 className="p-3 mt-6 bg-gray-100">Select one answer choice.</h3>
      </div>
    </div>
  );
}
