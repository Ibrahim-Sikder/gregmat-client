import { getPrepSwiftCourses } from "@/actions/getprepswift";
import ContentVideoCore from "@/components/pre-swift/ContentVideoCore";
import { CourseData } from "@/components/pre-swift/prepswift";
import PrepSwiftCourse from "@/components/pre-swift/PrepSwiftCourse";
import Container from "@/components/shared/container/Container";

interface Props {
  params: Promise<{ slug: string[] }>;
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  const courseSlug = slug[0];
  const contentSlug = slug[1]; // may be undefined

  const courses: CourseData = await getPrepSwiftCourses(courseSlug);

  return (
    <Container className="px-2">
      {contentSlug ? (
        <ContentVideoCore
          initialSlug={contentSlug}
          courseId={courses._id}
          courseSlug={courseSlug}
          categoryId={courses.categories[0]._id}
          showNewTab={false}
          showBookmark
          showCalculator={false}
          showNavigation={false}
          showCopyLink={false}
          showFocusMode={false}
        />
      ) : (
        /* ✅ COURSE PAGE */
        <PrepSwiftCourse data={courses} />
      )}
    </Container>
  );
}
