import { CourseSection } from "@/components/pages/recordings/CourseSection";
import Container from "@/components/shared/container/Container";
import fetchWrapper from "@/lib/fetchWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admissions - GregMat",
  description:
    "Admissions course content including dedicated personal statements and related material.",
};

const AdmissionsPage = async () => {
  let res: any = { success: false, data: null };
  const slug = "admissions";

  try {
    res = await fetchWrapper(`/recordings/series/${slug}`, {
      revalidate: 60,
    });
  } catch (error) {
    console.error("Error fetching course data:", error);
  }

  if (!res.success || !res.data) {
    return (
      <Container className="py-10">
        <div className="text-center py-20 text-lg">Course not found</div>
      </Container>
    );
  }

  const series = res.data;
  const course = series.courses?.[0];

  return (
    <Container className="py-10 space-y-10 px-2">
      {course?.groups && course.groups.length > 0 ? (
        course.groups.map((group: any) => (
          <CourseSection key={group._id} group={group} />
        ))
      ) : (
        <div className="italic py-8 text-center text-base border rounded-lg bg-gray-100">
          No groups available in this course.
        </div>
      )}
    </Container>
  );
};

export default AdmissionsPage;
