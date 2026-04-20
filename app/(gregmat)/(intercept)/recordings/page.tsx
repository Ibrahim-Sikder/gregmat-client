import SeriesSection from "@/components/pages/recordings/SeriesSection";
import Container from "@/components/shared/container/Container";
import fetchWrapper from "@/lib/fetchWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recorded Classes - GregMat",
  description: "All series and courses available",
};

const Page = async () => {
  let apiData: any = { success: false, data: [] };

  const params = new URLSearchParams({
    isQuizSeries: "false",
    isAdmissionSeries: "false",
  });

  try {
    apiData = await fetchWrapper(
      `/recordings/series/all?${params.toString()}`,
      {
        revalidate: 60,
      },
    );
  } catch (error: any) {
    console.error("Error fetching recordings series:", error);
  }

  return (
    <Container className="py-10 px-2">
      {!apiData.success || !apiData.data || apiData.data.length === 0 ? (
        <div className="text-center py-20 text-gray-600 text-lg">
          No series available at the moment
        </div>
      ) : (
        apiData?.data.map((series: any) => (
          <SeriesSection key={series._id} series={series} />
        ))
      )}
    </Container>
  );
};

export default Page;
