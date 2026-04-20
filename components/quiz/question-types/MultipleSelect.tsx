import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Viewer } from "react-latex-editor";

interface MultipleSelectProps {
  question: any;
  isSelected: (choiceId: string, groupIndex?: number) => boolean;
  handleSelect: (choiceId: string, groupIndex?: number) => void;
  getChoiceId: (choice: any) => string;
  isCorrectAnswer: boolean;
  questionType: string;
}

export default function MultipleSelect({
  question,
  isSelected,
  handleSelect,
  getChoiceId,
  isCorrectAnswer,
  questionType,
}: MultipleSelectProps) {
  const instructionText =
    questionType === "sentence_equivalence"
      ? "Select the two answer choices that, when used to complete the sentence, fit the meaning of the sentence as a whole and produce completed sentences that are alike in meaning."
      : questionType === "reading_select_all"
      ? "Select all that apply. Consider each of the choices separately and select all that apply."
      : "Consider each of the choices separately and select all that apply.";

  return (
    <div className="flex flex-col items-center">
      <div className="pb-10">
        <Viewer
          contentClassName="viewer-font-size-2xl"
          content={question?.body || ""}
        />
      </div>
      <div>
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
              <span
                className={cn(
                  "w-5 h-5 flex items-center justify-center border border-black",
                )}
              >
                {selectedNow && <X size={20} color="black" />}
              </span>
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
      <p className="w-full p-3 mt-6 bg-gray-100">{instructionText}</p>
    </div>
  );
}
