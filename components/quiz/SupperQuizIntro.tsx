import { useAppSelector } from "@/redux/hooks";

export default function SupperQuizIntro() {
  const { data } = useAppSelector((state) => state.quizData);
  return (
    <div className="flex flex-col justify-center items-center gap-4 pt-10">
      <h1 className="text-2xl font-semibold">Welcome to your Super Quiz!</h1>
      <p className="text-center">The problems that you saved from quizzes will be available for you here to review!</p>
      <p className="text-center">You currently have saved {data?.questions?.length} questions.</p>
    </div>
  )
}
