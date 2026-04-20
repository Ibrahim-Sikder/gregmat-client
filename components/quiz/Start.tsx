"use client";
import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setQuizData, setUserId } from "@/redux/features/quiz/quizDataSlice";
import Quiz from "./Quiz";
import { setIsSuperQuiz } from "@/redux/features/quiz/quizControlSlice";

interface Props {
  data: any;
  user: any;
  search: string | null;
  isSuper?: boolean;
  isSubscribed?: boolean;
}

export default function Start({
  data,
  user,
  search,
  isSuper,
  isSubscribed,
}: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data) {
      dispatch(
        setQuizData({
          ...data,
          collection: search ?? "",
        }),
      );
      dispatch(setIsSuperQuiz(isSuper ?? false));
    }
    if (user) dispatch(setUserId(user._id));
  }, [data, user, search, dispatch, isSuper]);

  return (
    <>
      <Quiz isSubscribed={isSubscribed} user={user} />
    </>
  );
}
