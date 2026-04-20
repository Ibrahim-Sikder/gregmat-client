import PracticeTest from "@/components/quiz/PracticeTest";
import Container from "@/components/shared/container/Container";
import fetchWrapper from "@/lib/fetchWrapper";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  let apiData: any = { success: false, data: [] };

  try {
    const res = await fetchWrapper(`/practice/test/${slug}`, {
      revalidate: 120,
    });
    apiData = res?.data;
  } catch (error) {
    console.error("Error fetching practice test data:", error);
  }

  return (
    <Container className="px-2">
      <PracticeTest data={apiData} />
    </Container>
  );
}
