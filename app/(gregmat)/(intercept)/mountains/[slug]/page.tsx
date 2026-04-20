import { getMountainBySlug } from "@/actions/mountain";
import React from "react";
import Container from "@/components/shared/container/Container";
import Mountain from "@/components/mountain/Mountain";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const param = await params;
  const searchParam = await searchParams;

  const parsePositiveInt = (value: string | string[] | undefined) => {
    if (typeof value !== "string") return undefined;
    const parsed = parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) return undefined;
    return parsed;
  };

  const dayParam = parsePositiveInt(searchParam.day);
  const pageParam = parsePositiveInt(searchParam.page);
  const limitParam = parsePositiveInt(searchParam.limit);

  const data = await getMountainBySlug(param.slug, {
    page: dayParam ?? pageParam,
    limit: limitParam,
  });

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Mountain not found</p>
      </div>
    );
  }

  return (
    <Container className="py-5">
      <Mountain param={param} data={data} />
    </Container>
  );
}
