"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Volume2,
  ExternalLink,
  BookOpen,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Viewer } from "react-latex-editor";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setNote,
  moveSelection,
  setSelectedId,
  setSelectedWordData,
  setWordColor,
  setIsModalOpen,
} from "@/redux/features/mountain/mountainControlSlice";
import {
  useSetContentColorMutation,
  useResetContentColorMutation,
} from "@/redux/features/mountain/mountain.api";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface VocabularyModalProps {
  word: {
    _id: string;
    title: string;
    slug: string;
    pronunciation: string;
    tooltip: string;
    description: string;
    plus_only: boolean;
    finalized: boolean;
    unlisted: boolean;
    colors: Record<string, string>;
    order: number;
  };
}

export default function VocabularyModal({ word }: VocabularyModalProps) {
  const dispatch = useAppDispatch();
  const {
    notes,
    categories,
    currentGroupIndex,
    currentWordIndex,
    showFilter,
    orderFilter,
    autoMoveMakingGreen,
    isDefinitionOnNavigate,
  } = useAppSelector((state) => state.mountainControl);

  const [setContentColor] = useSetContentColorMutation();
  const [resetContentColor] = useResetContentColorMutation();

  const [isPlaying, setIsPlaying] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    });
  }, [api]);

  // Helper to replicate logic from VocabularyGroups
  const getProcessedWords = (words: any[]) => {
    let filtered = words;

    if (showFilter === "G" || showFilter === "R") {
      filtered = filtered.filter((w) =>
        Object.values(w.colors || {}).includes(showFilter),
      );
    } else if (showFilter === "Noted") {
      filtered = filtered.filter((w) => !!notes[w._id]);
    }

    switch (orderFilter) {
      case "shuffle-within-groups":
        return filtered; // Fallback to avoid random jump issues
      case "group-by-color": {
        const priority = (w: any) => {
          const color = Object.values(w.colors || {})[0];
          if (color === "R") return 0;
          if (!color) return 1;
          if (color === "G") return 2;
          return 3;
        };
        return [...filtered].sort((a, b) => priority(a) - priority(b));
      }
      case "everything-alphabetically":
        return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
      default:
        return filtered;
    }
  };

  const handleNext = () => {
    const currentGroup = categories[currentGroupIndex];
    if (!currentGroup) return;

    const words = getProcessedWords(currentGroup.mountain_contents);

    if (currentWordIndex < words.length - 1) {
      const nextWord = words[currentWordIndex + 1];
      dispatch(
        moveSelection({
          groupIndex: currentGroupIndex,
          wordIndex: currentWordIndex + 1,
        }),
      );
      dispatch(setSelectedId(nextWord._id));
      dispatch(setSelectedWordData(nextWord));

      if (isDefinitionOnNavigate) {
        dispatch(setIsModalOpen(false));
      }
    } else {
      let nextGroupIdx = currentGroupIndex + 1;
      while (nextGroupIdx < categories.length) {
        const nextGroup = categories[nextGroupIdx];
        const nextWords = getProcessedWords(nextGroup.mountain_contents);
        if (nextWords.length > 0) {
          const nextWord = nextWords[0];
          dispatch(moveSelection({ groupIndex: nextGroupIdx, wordIndex: 0 }));
          dispatch(setSelectedId(nextWord._id));
          dispatch(setSelectedWordData(nextWord));

          if (isDefinitionOnNavigate) {
            dispatch(setIsModalOpen(false));
          }
          return;
        }
        nextGroupIdx++;
      }
    }
  };

  const handlePrev = () => {
    const currentGroup = categories[currentGroupIndex];
    if (!currentGroup) return;
    const words = getProcessedWords(currentGroup.mountain_contents);

    if (currentWordIndex > 0) {
      const prevWord = words[currentWordIndex - 1];
      dispatch(
        moveSelection({
          groupIndex: currentGroupIndex,
          wordIndex: currentWordIndex - 1,
        }),
      );
      dispatch(setSelectedId(prevWord._id));
      dispatch(setSelectedWordData(prevWord));

      if (isDefinitionOnNavigate) {
        dispatch(setIsModalOpen(false));
      }
    } else {
      let prevGroupIdx = currentGroupIndex - 1;
      while (prevGroupIdx >= 0) {
        const prevGroup = categories[prevGroupIdx];
        const prevWords = getProcessedWords(prevGroup.mountain_contents);
        if (prevWords.length > 0) {
          const prevWord = prevWords[prevWords.length - 1];
          dispatch(
            moveSelection({
              groupIndex: prevGroupIdx,
              wordIndex: prevWords.length - 1,
            }),
          );
          dispatch(setSelectedId(prevWord._id));
          dispatch(setSelectedWordData(prevWord));

          if (isDefinitionOnNavigate) {
            dispatch(setIsModalOpen(false));
          }
          return;
        }
        prevGroupIdx--;
      }
    }
  };

  const handleColorChange = async (color: string) => {
    try {
      if (color === "Reset") {
        await resetContentColor({ id: word._id }).unwrap();
        dispatch(setWordColor({ wordId: word._id, color: "" }));
      } else {
        await setContentColor({ id: word._id, color }).unwrap();
        dispatch(setWordColor({ wordId: word._id, color }));
        if (color === "G" && autoMoveMakingGreen) {
          handleNext();
        }
      }
    } catch (err) {
      console.error("Failed to set color", err);
    }
  };

  const playPronunciation = async () => {
    if (!word.pronunciation || isPlaying) return;
    setIsPlaying(true);

    try {
      const audio = new Audio(word.pronunciation);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => setIsPlaying(false);
      await audio.play();
    } catch (error) {
      console.error("Error playing pronunciation:", error);
      setIsPlaying(false);
    }
  };

  const definitions = word?.description
    ? word.description.split(/<hr\s*\/?>/i).filter((d) => d.trim().length > 0)
    : [];

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* === Header Section === */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
          <div className="flex gap-2 items-center">
            <Button
              size="sm"
              variant="outline"
              className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200 transition-colors dark:bg-green-900/30 dark:text-green-200 dark:hover:bg-green-900/50 dark:border-green-700/60"
              onClick={() => handleColorChange("G")}
            >
              <span className="font-bold mr-1.5">G</span>I know
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border-red-200 transition-colors dark:bg-red-900/30 dark:text-red-200 dark:hover:bg-red-900/50 dark:border-red-700/60"
              onClick={() => handleColorChange("R")}
            >
              <span className="font-bold mr-1.5">R</span>I Forgot
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900 border-gray-200 transition-colors dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:border-slate-600"
              onClick={() => handleColorChange("Reset")}
            >
              <span className="font-bold mr-1.5">R</span>
              Reset
            </Button>
            <div className="w-px h-6 bg-gray-200 dark:bg-slate-700 mx-1 hidden sm:block" />
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrev}
              className="text-gray-700 hover:bg-gray-50 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <ArrowUp className="w-4 h-4 mr-1.5" />
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleNext}
              className="text-gray-700 hover:bg-gray-50 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <ArrowDown className="w-4 h-4 mr-1.5" />
              Next
            </Button>
            {word?.pronunciation && (
              <Button
                size="sm"
                variant="outline"
                onClick={playPronunciation}
                disabled={isPlaying}
              >
                <Volume2
                  className={`w-4 h-4 ${isPlaying ? "animate-pulse" : ""}`}
                />
                {isPlaying ? "Playing..." : "Listen"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {definitions.length > 1 ? (
          <div className="w-full px-8">
            <Carousel setApi={setApi} className="w-full">
              <CarouselContent>
                {definitions.map((def, index) => (
                  <CarouselItem key={index}>
                    <div className="select-text cursor-text">
                      <Viewer
                        contentClassName="viewer-font-size-2xl"
                        content={def}
                        enableMath
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div className="flex items-center justify-between mt-6 px-4">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full border-gray-200 hover:bg-gray-50 shrink-0 disabled:opacity-30 dark:border-slate-700 dark:hover:bg-slate-800"
                onClick={() => api?.scrollPrev()}
                disabled={!canScrollPrev}
              >
                <ChevronLeft className="h-5 w-5 text-gray-500 dark:text-slate-400" />
              </Button>

              <div className="flex justify-center gap-2">
                {Array.from({ length: count }).map((_, index) => (
                  <button
                    key={index}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      index + 1 === current
                        ? "bg-[#0f172a] dark:bg-slate-200 w-5"
                        : "bg-[#e2e8f0] dark:bg-slate-700 w-2.5 hover:bg-gray-300 dark:hover:bg-slate-600"
                    }`}
                    onClick={() => api?.scrollTo(index)}
                    aria-label={`Go to definition ${index + 1}`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full border-gray-200 hover:bg-gray-50 shrink-0 disabled:opacity-30 dark:border-slate-700 dark:hover:bg-slate-800"
                onClick={() => api?.scrollNext()}
                disabled={!canScrollNext}
              >
                <ChevronRight className="h-5 w-5 text-gray-500 dark:text-slate-400" />
              </Button>
            </div>
          </div>
        ) : (
          <Viewer
            contentClassName="viewer-font-size-2xl"
            content={word?.description || ""}
            enableMath
          />
        )}
      </div>

      {word?.tooltip && word?.tooltip !== "<p>Placeholder Tooltip</p>" && (
        <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg dark:bg-blue-900/30 dark:border-blue-700">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center text-sm sm:text-base">
            <BookOpen className="w-4 h-4 mr-2" />
            Additional Notes
          </h4>
          <div
            className="text-blue-800 dark:text-blue-200 text-xs sm:text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: word.tooltip }}
          />
        </div>
      )}

      <div>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          placeholder="Write your personal note..."
          rows={6}
          value={notes[word.slug] || ""}
          onChange={(e) =>
            dispatch(setNote({ word: word.slug, note: e.target.value }))
          }
        />
      </div>
      <div className="bg-slate-50 p-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200">
        Please keep in mind that we do not store students' notes in our
        database, and they are stored on your device. The notes may be lost if
        you switch browsers, or clear the browser data.
      </div>
    </div>
  );
}
