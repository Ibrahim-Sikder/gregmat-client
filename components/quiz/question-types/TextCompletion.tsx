import { cn } from '@/lib/utils';
import { Viewer } from 'react-latex-editor';

interface TextCompletionProps {
  question: any;
  isSelected: (choiceId: string, groupIndex?: number) => boolean;
  handleSelect: (choiceId: string, groupIndex?: number) => void;
  getChoiceId: (choice: any) => string;
  isCorrectAnswer: boolean;
  questionType: string;
}

export default function TextCompletion({
  question,
  isSelected,
  handleSelect,
  getChoiceId,
  isCorrectAnswer,
  questionType
}: TextCompletionProps) {
  const instructionText = questionType === 'tc_1_blank'
    ? `Select one entry for the blank. Fill the blank in a way that best completes the text.`
    : `For each blank select one entry from the corresponding column of choices. Fill all blanks in the way that best completes the text.`;

  return (
    <div className="flex flex-col items-center">
      <div className="pb-10">
        <Viewer contentClassName='viewer-font-size-2xl' content={question?.body || ''} />
      </div>
      <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
        {question.choice_groups?.map((group: any, groupIndex: number) => (
          <div key={groupIndex} className="flex flex-col gap-3 min-w-[220px]">
            <h1 className="text-center">
              {questionType === 'tc_1_blank' ? '' : `Blank (${groupIndex + 1})`}
            </h1>
            <table className="w-full border-collapse">
              <tbody>
                {group.choices.map((choice: any) => {
                  const choiceId = getChoiceId(choice);
                  const selectedNow = isSelected(choiceId, groupIndex);
                  return (
                    <tr
                      key={choiceId}
                      onClick={() => !isCorrectAnswer && handleSelect(choiceId, groupIndex)}
                      className={cn(
                        'cursor-pointer transition-all duration-150 text-black',
                        selectedNow ? 'bg-gray-900' : '',
                        isCorrectAnswer && 'cursor-default'
                      )}
                    >
                      <td className="border border-gray-900">
                        <Viewer
                          contentClassName={`viewer-font-size-1xl viewer-text-center ${
                            selectedNow ? 'viewer-text ' : ''
                          }`}
                          content={choice.body}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <div className="p-3 w-full mt-6 bg-gray-100">
        <h3>{instructionText}</h3>
      </div>
    </div>
  );
}
