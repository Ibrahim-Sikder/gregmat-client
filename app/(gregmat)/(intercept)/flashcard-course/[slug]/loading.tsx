import Container from "@/components/shared/container/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Container>
        <div className="space-y-8 py-6">
          {/* Course Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="w-full h-40 rounded-lg" />
                <Skeleton className="w-full h-6 rounded" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
