import Container from "@/components/shared/container/Container";
import { Metadata } from "next";
import FeedLoader from "@/components/pages/recordings/LoadMoreFeed";

export const metadata: Metadata = {
  title: "New Content Feed - GregMat",
  description: "All series and courses available",
};

const ContentFeedPage = () => {
  return (
    <Container className="py-10 px-2">
      <FeedLoader />
    </Container>
  );
};

export default ContentFeedPage;
