import { getPrepSwiftQuizzes } from "@/actions/getprepswift";
import QuizCollectionContent from "@/components/quiz/QuizCollectionContent";
import Container from "@/components/shared/container/Container";

export default async function page() {
  const data = await getPrepSwiftQuizzes();
  return (
    <Container className="px-2">
      <div className="pt-6">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          PrepSwift Quizzes
        </h2>
        <QuizCollectionContent collectionData={data[0]} />
      </div>
    </Container>
  );
}
