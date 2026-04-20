"use client";
import Image from "next/image";
import { ClassItem } from "./classgroups";
import { useState, useEffect } from "react";
import { DraggableModal } from "../shared/modal/DraggableModal";
import AppCalculator from "../AppCalculator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calculator,
  Minimize2,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import CopyLink from "../CopyLink";

interface Props {
  course: ClassItem;
  courses: ClassItem[];
  currentIndex: number;
}

export default function FlashcardCourseCard({
  course,
  courses,
  currentIndex,
}: Props) {
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const [isLoading, setIsLoading] = useState(false);

  const activeCourse = courses[activeIndex] || course;
  const hasPrevious = activeIndex > 0;
  const hasNext = activeIndex < courses.length - 1;

  // Fake loading effect when activeIndex changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  // Sync activeIndex when currentIndex changes
  useEffect(() => {
    setActiveIndex(currentIndex);
  }, [currentIndex]);

  // Lock body scroll when open
  useEffect(() => {
    if (isSolutionModalOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isSolutionModalOpen]);

  // Navigation handlers
  const goToPrevious = () => {
    if (hasPrevious) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const goToNext = () => {
    if (hasNext) {
      setActiveIndex(activeIndex + 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isSolutionModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "Escape") {
        setIsSolutionModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSolutionModalOpen, activeIndex, hasPrevious, hasNext]);

  return (
    <div className="">
      <div
        className="border rounded-lg transition cursor-pointer"
        onClick={() => setIsSolutionModalOpen(true)}
      >
        {course.img && (
          <div className="relative w-full h-40">
            <Image
              src={course.img}
              alt={course.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      {isSolutionModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsSolutionModalOpen(false)}
        >
          <div
            className={cn(
              "bg-white dark:bg-gray-900 shadow-2xl flex flex-col transition-all duration-300 overflow-hidden",
              isFullScreen
                ? "w-full h-full max-w-none max-h-none rounded-none"
                : "w-full max-w-4xl max-h-[90vh] rounded-xl",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 shrink-0 bg-white dark:bg-gray-900 sticky top-0 z-10">
              <div className="min-w-0 flex-1">
                {isLoading ? (
                  <Skeleton className="h-6 w-48 mb-1" />
                ) : (
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {activeCourse.title}
                  </h2>
                )}
              </div>

              <div className="flex items-center gap-1 ml-4">
                {/* Counter Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 text-xs font-medium pointer-events-none"
                >
                  {activeIndex + 1} of {courses.length}
                </Button>

                {/* Previous Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={goToPrevious}
                  disabled={!hasPrevious}
                  title="Previous (←)"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>

                {/* Next Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={goToNext}
                  disabled={!hasNext}
                  title="Next (→)"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setIsCalculatorOpen(true)}
                  title="Calculator"
                >
                  <Calculator className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </Button>

                <CopyLink
                  link={`${window.location.origin}/class/${activeCourse.slug}`}
                />

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  title="Focus mode"
                >
                  {isFullScreen ? (
                    <Minimize2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Maximize2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setIsSolutionModalOpen(false)}
                  title="Close"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </Button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Course Content */}
              <div className="space-y-4">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                    <Skeleton className="h-32 w-full mt-4" />
                  </div>
                ) : (
                  activeCourse.description && (
                    <>
                      <div
                        className=""
                        dangerouslySetInnerHTML={{
                          __html: activeCourse.description,
                        }}
                      />
                    </>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
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

export function FlashcardCourseCardSkeleton() {
  return (
    <div className="border rounded-lg p-0 bg-accent/20 animate-pulse">
      <Skeleton className="w-full h-40 rounded-lg" />
    </div>
  );
}
