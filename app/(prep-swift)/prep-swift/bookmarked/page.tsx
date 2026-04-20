import { getPrepSwiftBookmarked } from "@/actions/getprepswift";
import Bookmarked from "@/components/pre-swift/Bookmarked";
import Container from "@/components/shared/container/Container";

export default async function page() {
  const data = await getPrepSwiftBookmarked();
  return (
    <Container className="px-2">
      {data && data.length > 0 ? (
        <Bookmarked data={data} />
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center gap-4">
          <h2 className="text-2xl font-semibold">
            You have no bookmarked content.
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Browse courses and bookmark content to access it quickly here.
          </p>
        </div>
      )}
    </Container>
  );
}
