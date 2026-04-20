"use client";
import Container from "@/components/shared/container/Container";
import Passages from "@/components/skill-building/Passages";
import { getMainIdeaBySlug } from "@/actions/main-idea";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import type { IMainIdeaPractice } from "@/types/main-idea";
import { Skeleton } from "@/components/ui/skeleton";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function Page({ params }: PageProps) {
  const [practice, setPractice] = useState<IMainIdeaPractice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { slug } = await params;
      const data = await getMainIdeaBySlug(slug);

      if (!data) {
        notFound();
      }

      setPractice(data);
      setLoading(false);
    }

    fetchData();
  }, [params]);

  if (loading) {
    return (
      <Container>
        <div className="py-6 my-10 max-w-7xl mx-auto">
          {/* Alert Skeleton */}
          <Skeleton className="h-16 w-full mb-6" />

          {/* Instructions Skeleton */}
          <Skeleton className="h-20 w-full mb-6" />

          {/* 3-column layout skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left - Paragraph */}
            <div className="lg:col-span-4 space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-64 w-full" />
            </div>

            {/* Middle - Inputs */}
            <div className="lg:col-span-5 space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>

            {/* Right - Controls */}
            <div className="lg:col-span-3 space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>

          {/* Submit Button Skeleton */}
          <div className="py-6 flex justify-center">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </Container>
    );
  }

  if (!practice) {
    notFound();
  }

  return (
    <Container className="my-7">
      <Passages practice={practice} />
    </Container>
  );
}
