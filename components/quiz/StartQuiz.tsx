"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setBegin, setSpeed } from "@/redux/features/quiz/quizControlSlice";
import Accommodations from "./Accommodations";
import BeginSection from "./BeginSection";
import Attempts from "./Attempts";
import SupperQuizIntro from "./SupperQuizIntro";

export default function StartQuiz() {
  const dispatch = useAppDispatch();
  const { isBegin, isSuperQuiz } = useAppSelector((state) => state.quizControl);

  const handleSubmit = (values: { speed: string }) => {
    dispatch(setSpeed(values.speed));
    dispatch(setBegin(true));
  };

  return (
    <div>
      {!isBegin ? (
        <>
          {!isSuperQuiz ? <Attempts /> : <SupperQuizIntro />}
          <div className="flex items-center justify-center pt-6">
            <Accommodations onSubmit={handleSubmit} />
          </div>
        </>
      ) : (
        <BeginSection />
      )}
    </div>
  );
}
