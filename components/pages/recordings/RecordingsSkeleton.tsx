"use client";
import { Skeleton } from "@/components/ui/skeleton";

const RecordingsSkeleton = () => (
  <div className="space-y-8">
    <Skeleton className="h-8 w-1/3" />
    <div className="grid grid-cols-6 gap-6">
      {[...Array(6)].map((_, idx) => (
        <Skeleton key={idx} className="col-span-2 aspect-video rounded-lg" />
      ))}
    </div>
    <Skeleton className="h-8 w-1/3" />
    <div className="grid grid-cols-6 gap-6">
      {[...Array(6)].map((_, idx) => (
        <Skeleton key={idx} className="col-span-2 aspect-video rounded-lg" />
      ))}
    </div>
  </div>
);

export default RecordingsSkeleton;
