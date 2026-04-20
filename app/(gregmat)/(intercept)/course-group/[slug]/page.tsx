import CourseGroup from "@/components/course/CourseGroup";
import Container from "@/components/shared/container/Container";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function page({ params }: PageProps) {
  const { slug } = await params;
  return (
    <Container>
      <CourseGroup slug={slug} />
    </Container>
  );
}
