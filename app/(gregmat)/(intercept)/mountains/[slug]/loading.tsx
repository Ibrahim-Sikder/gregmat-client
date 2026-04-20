import Container from "@/components/shared/container/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="py-5">
      <Container>
        <>
          <Skeleton className="h-8 w-1/4 mb-4 rounded-lg" />
          <Skeleton className="h-6 w-full mb-2 rounded-lg" />
          <Skeleton className="h-6 w-full mb-2 rounded-lg" />
          <Skeleton className="h-6 w-3/4 mb-2 rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </>
      </Container>
    </main>
  );
}
