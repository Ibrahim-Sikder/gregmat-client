import { getCourses } from "@/actions/flashcards";
import { FlashCourse } from "@/components/course/classgroups";
import FlashcardCourse from "@/components/course/FlashcardCourse";
import Container from "@/components/shared/container/Container";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function page({ params }: PageProps) {
  const { slug } = await params;
  const data: FlashCourse = await getCourses(slug);
  return (
    <Container>
      <FlashcardCourse data={data} />
    </Container>
  );
}
