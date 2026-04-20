import { CourseSection } from "@/components/pages/recordings/CourseSection";
import Container from "@/components/shared/container/Container";
import fetchWrapper from "@/lib/fetchWrapper";
import { Metadata } from "next";
import Image from "next/image";

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;

  let res: any = { success: false, data: null };

  try {
    res = await fetchWrapper(`/recordings/course/slug/${slug}`, {
      revalidate: 3600,
    });
  } catch (error: any) {
    console.error("Error fetching course data for metadata:", error);
  }

  const course = res.data;

  return {
    title: `${course.title} - GregMat`,
    description: course.description || "Course details and recordings.",
  };
}

// export async function generateStaticParams() {
//   let apiData: any = { success: false, data: [] };

//   try {
//     apiData = await fetchWrapper(`/recordings/course/all`, {
//       revalidate: 3600,
//     });
//   } catch (error: any) {
//     console.error("Error fetching course slugs:", error);
//   }

//   return apiData?.data?.map((course: any) => ({
//     slug: course?.slug,
//   }));
// }

const CoursePage = async ({ params }: CoursePageProps) => {
  let res: any = { success: false, data: null };

  const { slug } = await params;

  try {
    res = await fetchWrapper(`/recordings/course/slug/${slug}`, {
      revalidate: 60,
    });
  } catch (error: any) {
    console.error("Error fetching course data:", error);
  }

  if (!res.success || !res.data) {
    return (
      <Container className="py-10">
        <div className="text-center py-20  text-lg">Course not found</div>
      </Container>
    );
  }

  const course = res.data;
  return (
    <Container className="py-10 space-y-10 px-2">
      {course.banner && (
        <div className="w-full h-48 md:h-64 lg:h-80 overflow-hidden rounded-lg mb-6">
          <Image
            src={course.banner}
            alt={`${course.title} Banner`}
            className="w-full h-full "
            height={320}
            width={1280}
          />
        </div>
      )}
      {/* Course Header */}
      <div className="flex items-center gap-6 mb-6">
        <h1 className="text-3xl font-bold">{course.title}</h1>
      </div>

      {/* Groups */}
      {course.groups && course.groups.length > 0 ? (
        course.groups.map((group: any) => (
          <CourseSection key={group._id} group={group} />
        ))
      ) : (
        <div className=" italic py-8 text-center text-base border rounded-lg bg-gray-100">
          No groups available in this course.
        </div>
      )}
    </Container>
  );
};

export default CoursePage;
