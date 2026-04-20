import { getPrepSwiftQuizzes } from "@/actions/getprepswift";
import QuizCollectionContent from "../quiz/QuizCollectionContent";

interface Props {
  data: any | null;
}
export default async function PrepSwiftQuizzes({ data }: Props) {
  const quizData = await getPrepSwiftQuizzes();

  return (
    <div className="pt-6">
      <QuizCollectionContent collectionData={quizData} />
    </div>
  );
}
