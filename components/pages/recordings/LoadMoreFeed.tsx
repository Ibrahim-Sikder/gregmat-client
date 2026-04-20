"use client";

import { fetchFeeds, IFeed } from "@/actions/feed";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function FeedLoader() {
  const [feeds, setFeeds] = useState<IFeed["data"]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const loadMoreFeeds = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const newFeeds = await fetchFeeds(page);

      if (newFeeds.data.length === 0) {
        setHasMore(false);
      } else {
        setFeeds((prev) => [...prev, ...newFeeds.data]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to fetch feeds:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);

  // initial load (same behavior as before)
  useEffect(() => {
    loadMoreFeeds();
  }, []);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {feeds.map((feed, idx) => (
          <Link
            href={`/class/${feed.slug}`}
            key={idx}
            className="p-2 flex flex-col"
          >
            <div className="aspect-[3/2] relative w-full overflow-hidden rounded-lg">
              <Image
                src={feed.img || "/image.png"}
                alt={feed.title}
                className="rounded-md object-cover hover:scale-105 transition-transform duration-300"
                fill
              />
            </div>
            <div>
              <p className="text-gray-500 mt-2 text-sm">
                {formatDateTime(feed.createdAt)}
              </p>
              <h2 className="mt-1 font-bold text-lg line-clamp-2 md:text-xl">
                {feed.title}
              </h2>
            </div>
          </Link>
        ))}

        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-2 flex flex-col space-y-3">
              <Skeleton className="aspect-[3/2] w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-full" />
              </div>
            </div>
          ))}
      </div>

      <div ref={loaderRef} className="flex justify-center my-8">
        {!loading && hasMore && (
          <Button onClick={loadMoreFeeds} className="px-8">
            Load More
          </Button>
        )}
        {!loading && !hasMore && feeds.length > 0 && (
          <p className="text-muted-foreground">No more content to load.</p>
        )}
      </div>
    </>
  );
}

export default FeedLoader;
