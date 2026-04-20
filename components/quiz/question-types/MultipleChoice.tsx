import ChoiceButton from "@/components/shared/button/ChoiceButton";
import { Viewer } from "react-latex-editor";

interface MultipleChoiceProps {
  question: any;
  isSelected: (choiceId: string, groupIndex?: number) => boolean;
  handleSelect: (choiceId: string, groupIndex?: number) => void;
  getChoiceId: (choice: any) => string;
  isCorrectAnswer: boolean;
}

export default function MultipleChoice({
  question,
  isSelected,
  handleSelect,
  getChoiceId,
  isCorrectAnswer,
}: MultipleChoiceProps) {
  return (
    <div className="w-full flex flex-col items-center ">
      <div className="pb-10">
        <Viewer
          contentClassName="viewer-font-size-2xl"
          content={question?.body || ""}
        />
      </div>
      <div className="flex flex-col gap-1">
        {question.choice_groups[0]?.choices.map((choice: any) => {
          const choiceId = getChoiceId(choice);
          const selectedNow = isSelected(choiceId);
          return (
            <button
              key={choiceId}
              onClick={() => handleSelect(choiceId)}
              disabled={isCorrectAnswer}
              className="flex justify-center items-center gap-2 transition duration-150 w-full"
            >
              <ChoiceButton selectedNow={selectedNow} />
              <div className="flex-1 text-left">
                <Viewer
                  contentClassName="viewer-font-size-2xl"
                  content={choice.body}
                />
              </div>
            </button>
          );
        })}
      </div>
      <h3 className="w-full p-3 mt-6 bg-gray-100">Select one answer choice.</h3>
    </div>
  );
}
