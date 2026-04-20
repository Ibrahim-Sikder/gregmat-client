import { getCurrentUser } from "@/actions/user";
import QuizCollectionContent from "@/components/quiz/QuizCollectionContent";
import Container from "@/components/shared/container/Container";
import fetchWrapper from "@/lib/fetchWrapper";
import Image from "next/image";
import { redirect } from "next/navigation";

export const dynamicParams = false;

async function fetchQuizCollectionData(slug: string) {
  const response = await fetchWrapper(`/quiz-collection/${slug}`, {
    revalidate: 60,
  });
  return response;
}

async function fetchSingleGroup(collectionSlug: string, groupSlug: string) {
  const response = await fetchWrapper(
    `/quiz-collection/${collectionSlug}/${groupSlug}`,
    {
      revalidate: 60,
    },
  );
  return response;
}

export default async function QuizCollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth");
  }

  const { slug } = await params;

  let apiResponse;

  if (slug.length === 2) {
    // Fetch single group data
    apiResponse = await fetchSingleGroup(slug[0], slug[1]);
  } else {
    // Fetch quiz collection data
    apiResponse = await fetchQuizCollectionData(slug[0]);
  }
  // Check if the API response is successful
  if (!apiResponse.success || !apiResponse.data) {
    return (
      <Container className="px-2">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Collection Not Found
            </h2>
            <p className="text-gray-600">
              {apiResponse.message ||
                "The quiz collection you're looking for doesn't exist."}
            </p>
          </div>
        </div>
      </Container>
    );
  }

  const collectionData = apiResponse.data;

  return (
    <Container className="px-2">
      {collectionData.img && (
        <div className="w-full h-[220px] md:h-[300px] lg:h-[380px] overflow-hidden rounded-xl my-6 relative">
          <Image
            src={collectionData.img}
            alt={collectionData.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
      )}

      {/* Main Title */}
      <QuizCollectionContent collectionData={collectionData} />
    </Container>
  );
}
