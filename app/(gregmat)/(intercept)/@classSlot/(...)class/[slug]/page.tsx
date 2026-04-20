import ClassVideoDialog from "@/components/pages/recordings/ClassVideoDialog";
import fetchWrapper from "@/lib/fetchWrapper";
import LoadingSpinner from "@/utils/LoadingSpinner";
import type { Metadata } from "next";
import { Suspense } from "react";

interface ClassPageModalProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: ClassPageModalProps): Promise<Metadata> {
  const { slug } = await params;

  const res = await fetchWrapper(`/recordings/class/slug/${slug}`, {
    revalidate: 60,
  });

  if (!res.success || !res.data?.current) {
    return { title: "Class Not Found - GregMat" };
  }

  return { title: `${res.data.current.title} - GregMat` };
}

export async function generateStaticParams() {
  const res = await fetchWrapper("/recordings/class/all", {
    revalidate: 300,
  });

  if (!res.success || !res.data) return [];

  return res.data.map((cls: any) => ({
    slug: cls.slug,
  }));
}

const ClassPageModal = async ({ params }: ClassPageModalProps) => {
  const { slug } = await params;

  const res = await fetchWrapper(`/recordings/class/${slug}`, {
    revalidate: 60,
  });
  if (!res.success || !res.data) {
    return (
      <div className="text-center py-20 text-gray-600 text-lg">
        Class not found
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ClassVideoDialog
        classData={res.data.current}
        prevClass={res.data.prev}
        nextClass={res.data.next}
      />
    </Suspense>
  );
};

export default ClassPageModal;
