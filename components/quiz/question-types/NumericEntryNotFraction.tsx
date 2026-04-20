import { Viewer } from 'react-latex-editor';

interface NumericEntryNotFractionProps {
  question: any;
  numericValue: { value: string };
  handleNumericNotFraction: (value: string) => void;
  isCorrectAnswer: boolean;
}

export default function NumericEntryNotFraction({
  question,
  numericValue,
  handleNumericNotFraction,
  isCorrectAnswer
}: NumericEntryNotFractionProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="pb-10">
        <Viewer contentClassName='viewer-font-size-2xl' content={question?.body || ''} />
      </div>
      <div className="flex justify-center items-center gap-2">
        <input
          type="text"
          placeholder="Your answer"
          value={numericValue.value || ''}
          onChange={(e) => handleNumericNotFraction(e.target.value)}
          className="border border-gray-400 rounded-lg p-2 text-center w-full max-w-md"
          readOnly={isCorrectAnswer}
        />
        <Viewer contentClassName='viewer-font-size-2xl' content={question?.short_meta || ''} />
      </div>
      <div className="w-full p-3 mt-6 bg-gray-100">
        <p>
          Enter your answer as an integer or decimal in the answer box. Backspace to erase.
        </p>
      </div>
    </div>
  );
}
