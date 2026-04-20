import { setPrompt } from '@/redux/features/writing-essay/writingEssaySlice';
import { useAppDispatch } from '@/redux/hooks';

export default function PromptInput() {
  const dispatch = useAppDispatch();

  const handleCustomPrompt = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    dispatch(setPrompt({ body: value }));
  };
  return (
    <div className="space-y-2">
      <textarea
        onChange={handleCustomPrompt}
        placeholder="Start writing your essay..."
        className="w-full min-h-[300px] p-3 border rounded outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
