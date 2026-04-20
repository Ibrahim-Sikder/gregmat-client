import fetchWrapper from "@/lib/fetchWrapper";
import Container from "@/components/shared/container/Container";
import Image from "next/image";

type MiscQuizResponse = {
  success: boolean;
  message?: string;
  data?: {
    title?: string;
    banner?: string;
    description?: string;
    plus_only?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const response = await fetchWrapper<MiscQuizResponse>(`/misc/${slug}`, {
    revalidate: 60,
  });
  const misc = response?.data;

  if (!misc) {
    return (
      <Container className="px-4 py-10">
        <div className="max-w-3xl mx-auto rounded-xl border border-gray-200 bg-white p-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Unable to load quiz
          </h1>
          <p className="mt-2 text-gray-600">
            {response?.message || "Quiz data was not found for this page."}
          </p>
        </div>
      </Container>
    );
  }

  const createdAt = misc.createdAt
    ? new Date(misc.createdAt).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  return (
    <Container className="bg-white px-4 py-8 md:py-10">
      <div className="">
        {misc.banner && (
          <Image
            src={misc.banner}
            alt={misc.title || "Quiz banner"}
            width={1600}
            height={900}
            className="w-full rounded-md object-cover"
            priority
          />
        )}

        <h1 className="mt-6 text-[32px] leading-tight font-semibold text-[#111827]">
          {misc.title || "Misc Quiz"}
        </h1>

        {misc.plus_only && (
          <p className="mt-3 text-[16px] text-[#4b5563]">GregMat+ only</p>
        )}

        {createdAt && (
          <p className="mt-1 text-[14px] text-[#6b7280]">
            Published: {createdAt}
          </p>
        )}

        {misc.description && (
          <div
            className="mt-5 text-[20px] leading-relaxed text-[#111827] [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-8 [&_li]:my-3 [&_iframe]:mt-4 [&_iframe]:w-full [&_iframe]:max-w-full [&_iframe]:border-0 [&_iframe]:bg-transparent"
            dangerouslySetInnerHTML={{ __html: misc.description }}
          />
        )}
      </div>
    </Container>
  );
}
