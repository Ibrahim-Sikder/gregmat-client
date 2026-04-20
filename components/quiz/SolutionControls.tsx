'use client';
import { cn } from '@/lib/utils';
import { setIsCorrectAnswer } from '@/redux/features/quiz/quizControlSlice';
import { useCreateSuperQuizQuestionMutation } from '@/redux/features/quiz/super-quiz.api';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Bookmark, FileText } from 'lucide-react';
import { useLayoutEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import SolutionVideoModal from './SolutionVideoModal';
import ModalContainer from '../shared/modal/ModalContainer';
import { Viewer } from 'react-latex-editor';

export default function SolutionControls({ questions }: { questions: any[] }) {
  const dispatch = useAppDispatch();
  const { answers, currentQuestionIndex, data, currentQuestionId } = useAppSelector((state) => state.quizData);
  const [createSuperQuizQuestion] = useCreateSuperQuizQuestionMutation();
  const [isSolutionVisible, setIsSolutionVisible] = useState(false);
  const { isCorrectAnswer, isSuperQuiz } = useAppSelector((state) => state.quizControl)


  const currentAnswer = answers.find((answer) => answer.question === currentQuestionId);
  const solutionVideo = data?.questions?.[currentQuestionIndex]?.solution_video;
  const solutionNote = data?.questions?.[currentQuestionIndex]?.note;


  useLayoutEffect(() => {
    dispatch(setIsCorrectAnswer(currentAnswer?.correct as boolean));
  }, [currentAnswer]);

  const handleCreateSuperQuizQuestion = async (questionId: string) => {
    try {
      await createSuperQuizQuestion({ questionId }).unwrap();
      toast.success('Question added to Super Quiz!');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to add question to Super Quiz.');
    }
  };

  let bgColor = '';

  if (currentAnswer?.given_answer === "" || isSuperQuiz) {
    bgColor = 'bg-yellow-100 border-yellow-200';
  } else if (currentAnswer?.correct) {
    bgColor = 'bg-green-100 border-green-200';
  } else {
    bgColor = 'bg-red-100 border-red-200';
  }

  console.log(solutionNote)


  return (
    <div className={cn(bgColor, 'rounded-lg p-4 mb-4')}>
      {
        !isSuperQuiz && (
          <p className={cn('text-red-700 font-semibold mb-3')}>
            {currentAnswer?.given_answer === "" ? "You haven't provided an answer to this question " : currentAnswer?.correct ? "You provided a correct answer to this question." : "You provided an incorrect answer to this question."}
            score: {currentAnswer?.score}/{currentAnswer?.score_denom}
          </p>
        )
      }
      <div className={cn('flex flex-col  items-center gap-4', !isSuperQuiz ? 'lg:flex-row' : 'justify-between')}>

        <div className="flex items-center gap-2">
          <Label htmlFor="answer-toggle" className={cn('text-red-700 font-medium')}>
            My Answer
          </Label>
          <Switch
            id="answer-toggle"
            checked={isCorrectAnswer}
            onCheckedChange={() => dispatch(setIsCorrectAnswer(!isCorrectAnswer))}
          />
          <Label className={cn('text-red-700 font-medium')}>Correct Answer</Label>
        </div>

        {
          !isSuperQuiz && (
            <div className="h-6 w-px bg-red-300" />
          )
        }

        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => setIsSolutionVisible(true)}
            className={isSuperQuiz ? cn('bg-red-900 hover:bg-red-800 text-white') : cn('bg-red-700 hover:bg-red-800 text-white')}
          >
            <FileText className="w-4 h-4 mr-2" />
            View Solution
          </Button>

          {
            !isSuperQuiz && (
              <Button
                disabled={questions.some((q) => q._id === currentAnswer?.question && q.isInSuperQuiz)}
                onClick={() =>
                  currentAnswer?.question && handleCreateSuperQuizQuestion(currentAnswer?.question)
                }
                variant="outline"
                className="border-red-700 text-red-700 hover:bg-red-50"
              >
                <Bookmark className="w-4 h-4 mr-2" />
                Save to Super Quiz
              </Button>
            )
          }
        </div>
      </div>
      {
        data?.notes || solutionNote ? (
          <ModalContainer open={isSolutionVisible} onOpenChange={setIsSolutionVisible}>
            <div className="p-4">
              <Viewer
                content={data?.notes || solutionNote || ''}
              />
            </div>
          </ModalContainer>
        )
          :
          <SolutionVideoModal
            open={isSolutionVisible}
            onClose={() => setIsSolutionVisible(false)}
            videoSrc={solutionVideo || data?.solution}
          />
      }
    </div>
  );
}
