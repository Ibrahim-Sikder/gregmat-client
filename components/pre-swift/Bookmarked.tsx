"use client";
import React, { useState } from "react";
import {
  BookmarkCheck,
  BookmarkIcon,
  SquareMousePointer,
  Vault,
} from "lucide-react";
import { toast } from "sonner";
import ModalContainer from "../shared/modal/ModalContainer";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/hooks";
import { bookMark, watched } from "@/actions/postprepswift";
import { BookmarkedContent } from "./prepswift";

interface Props {
  data: BookmarkedContent[];
}

export default function Bookmarked({ data }: Props) {
  const [openVideoId, setOpenVideoId] = useState<string | null>(null);
  const { showAction } = useAppSelector((state) => state.prepSwiftControl);

  const handleBookMark = async (
    courseId: string,
    categoryId: string,
    contentId: string,
  ) => {
    try {
      const res = await bookMark({ courseId, categoryId, contentId });
      toast.success(res.saved ? "Bookmarked!" : "Bookmark removed!");
    } catch {
      toast.error("Something went wrong!");
    }
  };

  const handleWatched = async (
    courseId: string,
    categoryId: string,
    contentId: string,
  ) => {
    try {
      const res = await watched({ courseId, categoryId, contentId });
      toast.success(
        res.watched ? "Marked as watched!" : "Unmarked as watched!",
      );
    } catch {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="py-4">
      {data?.map((category) => (
        <section key={category.categoryId} className="space-y-4">
          <div className="pb-2 border-b">
            <h2 className="font-semibold">{category.categoryTitle}</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {category.contents.map((item) => {
              const isOpen = openVideoId === item._id;

              return (
                <div
                  key={item._id}
                  className="flex items-center gap-3 p-3 transition-all duration-200 group"
                >
                  <div
                    className={cn(
                      `${
                        showAction ? "flex" : "opacity-0"
                      } gap-2 group-hover:opacity-100 transition-opacity`,
                    )}
                  >
                    <button
                      onClick={() =>
                        handleBookMark(
                          item.courseId,
                          item.categoryId,
                          item.contentId,
                        )
                      }
                      className="text-blue-400 transition-colors hover:text-green-600"
                      title={item.saved ? "Undo Bookmark" : "Bookmark"}
                    >
                      {item.saved ? (
                        <BookmarkCheck size={18} />
                      ) : (
                        <BookmarkIcon size={18} />
                      )}
                    </button>
                    <button
                      onClick={() =>
                        handleWatched(
                          item.courseId,
                          item.categoryId,
                          item.contentId,
                        )
                      }
                      className="text-blue-400 transition-colors hover:text-green-600"
                      title={item.watched ? "Undo Watched" : "Mark as Watched"}
                    >
                      {item.watched ? (
                        <Vault size={18} />
                      ) : (
                        <SquareMousePointer size={18} />
                      )}
                    </button>
                  </div>
                  <div className="flex flex-col truncate">
                    <button
                      onClick={() => item.videoUrl && setOpenVideoId(item._id)}
                      className={cn(
                        "text-blue-400  truncate hover:text-red-700 transition-colors",
                      )}
                    >
                      {item.contentTitle}
                    </button>
                  </div>
                  <ModalContainer
                    title={item.contentTitle}
                    open={isOpen}
                    onOpenChange={() => setOpenVideoId(null)}
                  >
                    <div className="w-full">
                      <video
                        src={item.videoUrl as string}
                        controls
                        autoPlay
                        className="w-full rounded-lg aspect-video"
                      />
                    </div>
                  </ModalContainer>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
