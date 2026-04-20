import { Viewer } from 'react-latex-editor';

interface NumericEntryFractionProps {
  numericValue: { numerator: string; denominator: string };
  handleNumericFraction: (key: 'numerator' | 'denominator', value: string) => void;
  question: any;
  isCorrectAnswer: boolean;
}

export default function NumericEntryFraction({
  numericValue,
  handleNumericFraction,
  question,
  isCorrectAnswer
}: NumericEntryFractionProps) {
  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <div className="pb-10">
        <Viewer contentClassName='viewer-font-size-2xl' content={question?.body || ''} />
      </div>

      <div className="flex flex-col items-center gap-1 max-w-md">
        <input
          type="text"
          placeholder="Numerator"
          value={numericValue?.numerator || ''}
          onChange={(e) => handleNumericFraction('numerator', e.target.value)}
          className="border border-gray-400 rounded-lg p-2 w-full text-center"
          readOnly={isCorrectAnswer}
        />
        <div className="w-full border-t border-black"></div>
        <input
          type="text"
          placeholder="Denominator"
          value={numericValue?.denominator || ''}
          onChange={(e) => handleNumericFraction('denominator', e.target.value)}
          className="border border-gray-400 rounded-lg p-2 w-full text-center"
          readOnly={isCorrectAnswer}
        />
      </div>
      <div>
        <h3 className="mt-8 p-4 bg-gray-100 max-w-2xl">
          Enter your answer as a fraction, with the numerator and denominator in their
          respective answer boxes. Backspace to erase.
        </h3>
      </div>
    </div>
  );
}
