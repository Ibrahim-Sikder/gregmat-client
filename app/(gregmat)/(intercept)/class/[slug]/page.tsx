import { getCurrentUser } from "@/actions/user";
import CopyLink from "@/components/CopyLink";
import VideoPlayer from "@/components/pages/recordings/VideoPlayer";
import Container from "@/components/shared/container/Container";
import fetchWrapper from "@/lib/fetchWrapper";
import { redirect } from "next/navigation";

interface ClassPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: ClassPageProps): Promise<{ title: string }> {
  try {
    const { slug } = await params;
    const res = await fetchWrapper(`/recordings/class/slug/${slug}`, {
      revalidate: 60,
    });
    if (!res.success || !res.data) {
      return { title: "Class Not Found - GregMat" };
    }
    return { title: `${res.data.title} - GregMat` };
  } catch {
    return { title: "Class Not Found - GregMat" };
  }
}

export async function generateStaticParams() {
  let apiData: any = { success: false, data: [] };

  try {
    apiData = await fetchWrapper(`/recordings/class/all`, {
      revalidate: 3600,
    });
  } catch (error: any) {
    console.error("Error fetching class slugs:", error);
  }

  return apiData?.data?.map((classItem: any) => ({
    slug: classItem?.slug,
  }));
}

const ClassPage = async ({ params }: ClassPageProps) => {
  let res: any = { success: false, data: null };
  const { slug } = await params;
  try {
    res = await fetchWrapper(`/recordings/class/slug/${slug}`, {
      revalidate: 60,
    });
  } catch (error: any) {
    console.error("Error fetching class data:", error);
  }

  if (!res.success || !res.data) {
    return (
      <Container className="py-10">
        <div className="text-center py-20 text-gray-600 text-lg">
          Class not found
        </div>
      </Container>
    );
  }

  const classData = res.data;

  const user = await getCurrentUser();
  if (classData.plusOnly && !user) {
    redirect("/auth");
  }

  return (
    <Container className="py-10 px-2">
      <div className="flex items-center justify-between mb-6">
        <h1 className="lg:text-3xl text-xl text-center font-bold mb-4">
          {classData.title}
        </h1>
        <CopyLink />
      </div>
      {classData.video && (
        <div className="w-full aspect-video">
          <VideoPlayer videoUrl={classData?.video} />
        </div>
      )}

      <section className="rounded border bg-white p-6 mt-5">
        {classData.homeworks ? (
          <div
            className="prose max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: classData.homeworks }}
          />
        ) : (
          <p className="text-gray-500 text-sm">
            No homework or additional resources for this class.
          </p>
        )}
      </section>
    </Container>
  );
};

export default ClassPage;
