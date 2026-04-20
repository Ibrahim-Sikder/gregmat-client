"use client";

import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronLeft,
  ChevronRight,
  Calculator,
  Maximize2,
  Minimize2,
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  Circle,
  ExternalLink,
  CheckSquare,
  Square,
} from "lucide-react";
import VideoPlayer from "@/components/pages/recordings/VideoPlayer";
import AppCalculator from "@/components/AppCalculator";
import CopyLink from "@/components/CopyLink";
import { DraggableModal } from "@/components/shared/modal/DraggableModal";
import { Content } from "./prepswift";
import { getContentWithNavigation } from "@/actions/getprepswift";
import { bookMark, watched } from "@/actions/postprepswift";
import { toast } from "sonner";
import Link from "next/link";

interface Props {
  initialSlug: string;
  courseId: string;
  courseSlug?: string;
  categoryId: string;
  showClose?: boolean;
  onClose?: () => void;
  showNavigation?: boolean;
  showBookmark?: boolean;
  showWatched?: boolean;
  showCalculator?: boolean;
  showNewTab?: boolean;
  showFocusMode?: boolean;
  showCopyLink?: boolean;
}

interface NavigationData {
  current: Content;
  prev: { _id: string; title: string; slug: string } | null;
  next: { _id: string; title: string; slug: string } | null;
}

/* ---------------- Skeletons ---------------- */

const HeaderSkeleton = () => (
  <header className="flex items-center justify-between p-4 border-b">
    <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
    <div className="flex gap-2">
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"
        />
      ))}
    </div>
  </header>
);

const VideoSkeleton = () => (
  <div className="aspect-video bg-gray-900 flex items-center justify-center">
    <div className="h-16 w-16 border-4 border-gray-700 border-t-gray-500 rounded-full animate-spin" />
  </div>
);

/* ---------------- Component ---------------- */

export default function ContentVideoCore({
  initialSlug,
  courseId,
  courseSlug,
  categoryId,
  showClose = false,
  onClose,
  showNavigation = true,
  showBookmark = true,
  showWatched = true,
  showCalculator = true,
  showNewTab = true,
  showFocusMode = true,
  showCopyLink = true,
}: Props) {
  const [currentSlug, setCurrentSlug] = useState(initialSlug);
  const [navigationData, setNavigationData] = useState<NavigationData | null>(
    null,
  );
  const [currentContent, setCurrentContent] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [isMarking, setIsMarking] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  /* ---------------- Focus Mode Scroll Lock ---------------- */

  useEffect(() => {
    if (isFocusMode) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isFocusMode]);

  /* ---------------- Fetch Content ---------------- */

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      const data = await getContentWithNavigation(currentSlug);
      if (data && mounted) {
        setNavigationData(data);
        setCurrentContent(data.current);
      }
      if (mounted) setIsLoading(false);
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, [currentSlug]);

  /* ---------------- Handlers ---------------- */

  const handleBookmark = async () => {
    if (!currentContent) return;
    setIsBookmarking(true);

    // Store the current state for optimistic update
    const previousSavedState = currentContent.saved;
    const newSavedState = !previousSavedState;

    // Optimistically update immediately
    setCurrentContent((prev) =>
      prev ? { ...prev, saved: newSavedState } : prev,
    );

    try {
      const res = await bookMark({
        courseId,
        categoryId,
        contentId: currentContent._id,
      });

      // Use response state if available, otherwise keep optimistic state
      const finalState =
        typeof res?.saved === "boolean" ? res.saved : newSavedState;

      toast.success(finalState ? "Bookmarked" : "Bookmark removed");

      // Update with the actual server response
      setCurrentContent((prev) =>
        prev ? { ...prev, saved: finalState } : prev,
      );
    } catch {
      // Revert to previous state on error
      setCurrentContent((prev) =>
        prev ? { ...prev, saved: previousSavedState } : prev,
      );
      toast.error("Something went wrong");
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleWatched = async () => {
    if (!currentContent) return;
    setIsMarking(true);

    // Store the current state for optimistic update
    const previousWatchedState = currentContent.watched;
    const newWatchedState = !previousWatchedState;

    // Optimistically update immediately
    setCurrentContent((prev) =>
      prev ? { ...prev, watched: newWatchedState } : prev,
    );

    try {
      const res = await watched({
        courseId,
        categoryId,
        contentId: currentContent._id,
      });

      // Use response state if available, otherwise keep optimistic state
      const finalState =
        typeof res?.watched === "boolean" ? res.watched : newWatchedState;

      toast.success(finalState ? "Marked as watched" : "Marked as unwatched");

      // Update with the actual server response
      setCurrentContent((prev) =>
        prev ? { ...prev, watched: finalState } : prev,
      );
    } catch {
      // Revert to previous state on error
      setCurrentContent((prev) =>
        prev ? { ...prev, watched: previousWatchedState } : prev,
      );
      toast.error("Something went wrong");
    } finally {
      setIsMarking(false);
    }
  };

  /* ---------------- Loading ---------------- */

  if (isLoading) {
    return (
      <div className="rounded-xl bg-white dark:bg-gray-950 shadow my-5 h-full">
        <HeaderSkeleton />
        <VideoSkeleton />
      </div>
    );
  }

  /* ---------------- Render ---------------- */

  return (
    <div
      ref={containerRef}
      // Stop clicks from bubbling up to parents (like dialog backdrops) when in focus mode
      onClick={(e) => isFocusMode && e.stopPropagation()}
      className={`flex flex-col bg-white dark:bg-gray-950 shadow
        ${
          isFocusMode
            ? "fixed inset-0 z-[1000] rounded-none w-screen h-screen overflow-hidden"
            : "relative w-full h-full rounded-xl transition-all duration-300"
        }
      `}
    >
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-950 z-10 flex-shrink-0">
        <div
          className={`flex items-center justify-between p-4 transition-all duration-300 ${
            isFocusMode ? "max-w-7xl mx-auto w-full px-8" : ""
          }`}
        >
          <h2 className="text-lg font-semibold truncate">
            {currentContent?.title}
          </h2>

          <TooltipProvider>
            <div className="flex items-center gap-1">
              {/* Navigation */}
              {showNavigation && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        disabled={!navigationData?.prev}
                        onClick={() =>
                          navigationData?.prev &&
                          setCurrentSlug(navigationData.prev.slug)
                        }
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Previous</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        disabled={!navigationData?.next}
                        onClick={() =>
                          navigationData?.next &&
                          setCurrentSlug(navigationData.next.slug)
                        }
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Next</TooltipContent>
                  </Tooltip>
                </>
              )}

              {/* Bookmark */}
              {showBookmark && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={handleBookmark}
                      disabled={isBookmarking}
                    >
                      {currentContent?.saved ? (
                        <BookmarkCheck className="w-5 h-5" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {currentContent?.saved ? "Remove bookmark" : "Bookmark"}
                  </TooltipContent>
                </Tooltip>
              )}

              {/* Watched */}
              {showWatched && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={handleWatched}
                      disabled={isMarking}
                    >
                      {currentContent?.watched ? (
                        <CheckSquare className="text-green-500 w-5 h-5" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {currentContent?.watched
                      ? "Mark as unwatched"
                      : "Mark as watched"}
                  </TooltipContent>
                </Tooltip>
              )}

              {/* Calculator */}
              {showCalculator && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={() => setIsCalculatorOpen(true)}
                    >
                      <Calculator className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Calculator</TooltipContent>
                </Tooltip>
              )}

              {/* Copy Link */}
              {showCopyLink && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <CopyLink
                        link={`${window.location.href}/${currentSlug}`}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Copy link</TooltipContent>
                </Tooltip>
              )}

              {/* New Tab */}
              {showNewTab && courseSlug && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" asChild>
                      <Link
                        href={`/prep-swift/${courseSlug}/${currentSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Open in new tab</TooltipContent>
                </Tooltip>
              )}

              {/* Focus Mode */}
              {showFocusMode && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={() => setIsFocusMode((p) => !p)}
                    >
                      {isFocusMode ? (
                        <Minimize2 className="w-5 h-5" />
                      ) : (
                        <Maximize2 className="w-5 h-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isFocusMode ? "Exit focus mode" : "Focus mode"}
                  </TooltipContent>
                </Tooltip>
              )}

              {showClose && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={onClose}
                      className="h-9 w-9"
                    >
                      ✕
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Close</TooltipContent>
                </Tooltip>
              )}
            </div>
          </TooltipProvider>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto bg-gray-50/30 dark:bg-gray-900/10 custom-scrollbar">
        <div
          className={`transition-all duration-300 w-full mx-auto bg-white dark:bg-gray-950 ${
            isFocusMode ? "max-w-7xl min-h-full" : "rounded-b-xl"
          }`}
        >
          {/* Video */}
          {currentContent?.video?.url?.trim() ? (
            <div className="aspect-video bg-black w-full overflow-hidden">
              <VideoPlayer videoUrl={currentContent.video.url} />
            </div>
          ) : null}

          {/* Description */}
          {currentContent?.description && (
            <div className="p-8 prose dark:prose-invert max-w-none">
              <div
                dangerouslySetInnerHTML={{
                  __html: currentContent.description,
                }}
              />
            </div>
          )}
        </div>
      </div>

      <DraggableModal
        open={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        title="Calculator"
      >
        <AppCalculator />
      </DraggableModal>
    </div>
  );
}
