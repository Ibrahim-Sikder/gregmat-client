import SeriesSection from "@/components/pages/recordings/SeriesSection";
import Container from "@/components/shared/container/Container";
import fetchWrapper from "@/lib/fetchWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Class Quizzes - GregMat",
  description:
    "Access live class quizzes to test your knowledge and improve your skills with GregMat.",
};

const CoursePage = async () => {
  let res: any = { success: false, data: null };
  const slug = "live-class-quizzes";

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

  return (
    <Container className="py-10 space-y-10 px-2">
      <SeriesSection key={series._id} series={series} />
    </Container>
  );
};

export default CoursePage;
