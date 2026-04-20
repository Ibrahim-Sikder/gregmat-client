import { bookMark, watched } from "@/actions/postprepswift";
import { cn, formatDuration } from "@/lib/utils";
import { useAppSelector } from "@/redux/hooks";
import {
  BookmarkCheck,
  BookmarkIcon,
  SquareMousePointer,
  Vault,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ContentVideoDialog from "./ContentVideoDialog";
import { Category, Content } from "./prepswift";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface Props {
  group: Category;
  courseId: string;
  courseSlug: string;
}

export default function CourseGroups({ group, courseId, courseSlug }: Props) {
  const [openContentSlug, setOpenContentSlug] = useState<string | null>(null);
  const router = useRouter();
  const { showVideoDuration, showAction } = useAppSelector(
    (state) => state.prepSwiftControl,
  );

  const handleBookMark = async (id: string) => {
    try {
      const data = {
        courseId: courseId,
        categoryId: group?._id,
        contentId: id,
      };
      const res = await bookMark(data);
      if (res.saved) {
        toast.success(`Bookmarked`);
      } else {
        toast.success(`Bookmark removed`);
      }
      // Refresh to get updated data
      router.refresh();
    } catch (error) {
      toast.error(`Something wrong!`);
    }
  };

  const handleWatched = async (id: string) => {
    try {
      const data = {
        courseId: courseId,
        categoryId: group?._id,
        contentId: id,
      };
      const res = await watched(data);
      if (res.watched) {
        toast.success("Marked as watched!");
      } else {
        toast.success("Unmarked as watched!");
      }
      // Refresh to get updated data
      router.refresh();
    } catch (error) {
      toast.error(`Something wrong!`);
    }
  };

  const total = group.contents.length;
  const colSize = Math.ceil(total / 3);
  const firstCol = group.contents.slice(0, colSize);
  const secondCol = group.contents.slice(colSize, colSize * 2);
  const thirdCol = group.contents.slice(colSize * 2);

  const { user, isSubscribed } = useCurrentUser();

  const hasPrepSwiftAccess =
    isSubscribed && user?.subscription?.type === "gregmat_prepswift";

  const handleOpenContent = (content: Content) => {
    if (!hasPrepSwiftAccess) {
      toast.info("This content is available for PrepSwift subscribers only.", {
        toastId: "prep-swift-access",
      });
      return;
    }

    setOpenContentSlug(content.slug);
  };

  const guardPrepSwift = (action: () => void) => {
    if (!hasPrepSwiftAccess) {
      toast.error("Upgrade to PrepSwift to use this feature.");
      return;
    }
    action();
  };

  const renderColumn = (items: Content[]) =>
    items.map((content) => {
      return (
        <div
          key={content._id}
          className={`group flex items-center gap-2 transition-all duration-300`}
        >
          <div
            className={cn(
              `${
                showAction ? "block" : "opacity-0"
              } flex gap-2 group-hover:opacity-100 items-center`,
            )}
          >
            <div
              className="text-blue-500 transition-colors hover:text-blue-600"
              aria-label="Bookmark"
              title="Bookmark"
            >
              {content?.saved ? (
                <button
                  title="Undo Bookmark"
                  onClick={() => handleBookMark(content?._id)}
                >
                  <BookmarkCheck size={16} />
                </button>
              ) : (
                <button
                  title="Bookmark"
                  onClick={() =>
                    guardPrepSwift(() => handleBookMark(content._id))
                  }
                >
                  <BookmarkIcon size={16} />
                </button>
              )}
            </div>
            <div
              className="text-blue-500 transition-colors hover:text-green-600"
              aria-label="Check"
            >
              {content?.watched ? (
                <button
                  title="Undo as Complete"
                  onClick={() =>
                    guardPrepSwift(() => handleWatched(content._id))
                  }
                  className="p-1 bg-green-100 rounded-md"
                >
                  <Vault size={16} />
                </button>
              ) : (
                <button
                  title="Mark as Complete"
                  onClick={() =>
                    guardPrepSwift(() => handleWatched(content._id))
                  }
                >
                  <SquareMousePointer size={16} />
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 truncate">
            {showVideoDuration && (
              <>
                <span
                  className={`w-14 text-right font-semibold ${
                    content?.saved ? "text-red-400" : "text-blue-400"
                  }`}
                >
                  {formatDuration(content.video.duration)}
                </span>
                <span className="text-gray-400 select-none">|</span>
              </>
            )}

            <button
              onClick={() => handleOpenContent(content)}
              className={cn(
                `truncate font-bold text-blue-700 text-left cursor-pointer ${
                  content?.saved ? "text-red-400" : "text-blue-400"
                } `,
              )}
            >
              {!content.plus_only && (
                <span className="text-green-400">(FREE) </span>
              )}
              {content.title}
            </button>
          </div>
        </div>
      );
    });

  return (
    <section className="w-full space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 ">{group.title}</h2>
        {group.description && (
          <p className="text-sm text-gray-600">{group.description}</p>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1.5">{renderColumn(firstCol)}</div>
        <div className="space-y-1.5">{renderColumn(secondCol)}</div>
        <div className="space-y-1.5">{renderColumn(thirdCol)}</div>
      </div>

      {/* Single dialog instance */}
      {openContentSlug && (
        <ContentVideoDialog
          contentSlug={openContentSlug}
          courseId={courseId}
          courseSlug={courseSlug}
          categoryId={group._id}
          onClose={() => setOpenContentSlug(null)}
        />
      )}
    </section>
  );
}
