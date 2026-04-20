"use client";

import {
  addColor,
  resetAll,
  resetCategories,
  resetColor,
} from "@/actions/mountain";
import {
  moveSelection,
  setCenterDefinition,
  setDefinitionOnNavigate,
  setIsControlOptionOpen,
  setIsModalOpen,
  setOrderFilter,
  setPrevDayColor,
  setSelectedId,
  setSelectedWordData,
  setShowFilter,
  setWordColor,
  setCategoryColors,
} from "@/redux/features/mountain/mountainControlSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Baseline,
  ChevronsUpDown,
  Funnel,
  Palette,
  RefreshCcw,
  Shuffle,
  StickyNote,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import ModalContainer from "../shared/modal/ModalContainer";
import ControlModalOptions from "./ControlModalOptions";

interface MountainControlProps {
  params: { slug: string };
  data: any;
}

// Keyboard shortcuts configuration
const KEYBOARD_SHORTCUTS = {
  NAVIGATION: {
    UP: "ArrowUp",
    DOWN: "ArrowDown",
    LEFT: "ArrowLeft",
    RIGHT: "ArrowRight",
  },
  ACTIONS: {
    GREEN: "g",
    RED: "r",
    RESET: "w",
    DEFINITION: "d",
    SPEAK: "s",
  },
} as const;

export default function MountainControl({
  params,
  data,
}: MountainControlProps) {
  const dispatch = useAppDispatch();
  const [isPlaying, setIsPlaying] = useState(false);
  const {
    selectedWord,
    isCenterDefinition,
    isPrevDayColor,
    showFilter,
    orderFilter,
    isDefinitionOnNavigate,
    isOpenModal,
    categories,
    currentGroupIndex,
    currentWordIndex,
    isControlOptionOpen,
    selectedWordData,
    autoMoveMakingGreen,
  } = useAppSelector((state) => state.mountainControl);
  // Memoized derived values
  const currentPage = useMemo(
    () => data.pagination.currentPage,
    [data.pagination.currentPage],
  );
  const currentGroup = useMemo(
    () => data.mountain_categories[currentPage - 1],
    [data.mountain_categories, currentPage],
  );
  const currentGroupId = currentGroup?._id;
  const currentGroupSlug = currentGroup?.slug;

  const ensureSelectedWord = useCallback(() => {
    if (!selectedWord) {
      toast.error("Please select a word first.");
      return false;
    }
    return true;
  }, [selectedWord]);

  // Memoized category data accessor
  const getCategoryData = useCallback(
    (index: number) => {
      return categories[index] || {};
    },
    [categories],
  );

  const handleMove = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      if (!categories.length) return;
      const currentCategory = getCategoryData(currentGroupIndex);
      const currentWords = currentCategory.mountain_contents || [];
      const currentWordCount = currentWords.length;

      // Initialize selection if none exists
      if (!selectedWord && currentWords.length > 0) {
        const firstWord = currentWords[0];
        dispatch(moveSelection({ groupIndex: 0, wordIndex: 0 }));
        dispatch(setSelectedId(firstWord._id));
        dispatch(setSelectedWordData(firstWord));
        return;
      }

      let newGroupIndex = currentGroupIndex;
      let newWordIndex = currentWordIndex;

      // Handle vertical movement
      if (direction === "up" || direction === "down") {
        if (!currentWordCount) return;
        const increment = direction === "up" ? -1 : 1;
        newWordIndex =
          (newWordIndex + increment + currentWordCount) % currentWordCount;
      }

      // Handle horizontal movement
      if (direction === "left" || direction === "right") {
        const increment = direction === "left" ? -1 : 1;
        const totalCategories = categories.length;

        // Find next non-empty category
        let attempts = 0;
        while (attempts < totalCategories) {
          newGroupIndex =
            (newGroupIndex + increment + totalCategories) % totalCategories;
          const nextCategory = getCategoryData(newGroupIndex);
          if (nextCategory.mountain_contents?.length > 0) break;
          attempts++;
        }

        if (attempts >= totalCategories) return;

        const nextWordCount =
          getCategoryData(newGroupIndex).mountain_contents.length;
        newWordIndex = Math.min(newWordIndex, nextWordCount - 1);
      }

      const targetCategory = getCategoryData(newGroupIndex);
      const targetWord = targetCategory.mountain_contents?.[newWordIndex];
      if (!targetWord) return;

      dispatch(
        moveSelection({ groupIndex: newGroupIndex, wordIndex: newWordIndex }),
      );
      dispatch(setSelectedId(targetWord._id));
      dispatch(setSelectedWordData(targetWord));

      if (isDefinitionOnNavigate) {
        dispatch(setIsModalOpen(false));
      }
    },
    [
      categories,
      currentGroupIndex,
      currentWordIndex,
      selectedWord,
      isDefinitionOnNavigate,
      dispatch,
      getCategoryData,
    ],
  );

  const handleDefinition = useCallback(() => {
    if (!ensureSelectedWord()) return;
    dispatch(setIsModalOpen(!isOpenModal));
  }, [ensureSelectedWord, isOpenModal, dispatch]);

  const handleColorChange = useCallback(
    async (color: "G" | "R") => {
      if (!ensureSelectedWord() || !selectedWord) return;

      // Optimistic update
      dispatch(setWordColor({ wordId: selectedWord, color }));

      try {
        await addColor(selectedWord, color, params.slug);
      } catch (error) {
        console.error("Color update failed:", error);
        toast.error("Failed to update color.", {
          toastId: "colorUpdate",
        });
      }
    },
    [ensureSelectedWord, selectedWord, params.slug, dispatch],
  );

  const [confirmationState, setConfirmationState] = useState<
    "WORD" | "DAY" | "ALL" | null
  >(null);

  useEffect(() => {
    if (confirmationState) {
      const timer = setTimeout(() => {
        setConfirmationState(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [confirmationState]);

  const handleReset = useCallback(async () => {
    if (!ensureSelectedWord() || !selectedWord) return;

    // Optimistic update
    dispatch(setWordColor({ wordId: selectedWord, color: "" }));

    try {
      await resetColor(selectedWord, params.slug);
      toast.success("Color reset to default");
    } catch (error) {
      console.error("Reset color failed:", error);
      toast.error("Failed to reset color.");
    }
  }, [ensureSelectedWord, selectedWord, params.slug, dispatch]);

  const handleResetDay = useCallback(async () => {
    if (!currentGroupId) {
      toast.error("No category for current day.");
      return;
    }

    // Optimistic update
    dispatch(setCategoryColors({ categoryId: currentGroupId, color: "" }));

    try {
      await resetCategories(currentGroupId, currentGroupSlug);
      toast.success(`Reset colors for Day ${currentPage}`);
    } catch (error) {
      console.error("Reset day colors failed:", error);
      toast.error("Failed to reset day colors.");
    }
  }, [currentGroupId, currentGroupSlug, currentPage, dispatch]);

  const handleResetEverything = useCallback(async () => {
    if (confirmationState !== "ALL") {
      setConfirmationState("ALL");
      toast.info("Click again to confirm reset ALL colors", {
        autoClose: 2000,
      });
      return;
    }

    try {
      await resetAll(data._id, data.slug);
      toast.success("Reset all colors in the mountain");
      setConfirmationState(null);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Reset all failed:", error);
      toast.error("Failed to reset all colors.");
    }
  }, [data, confirmationState]);

  const handleRefresh = useCallback(() => {
    dispatch(setShowFilter("all"));
    dispatch(setOrderFilter("default"));
    toast.success("List refreshed");
  }, [dispatch]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isEditable =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isEditable) return;

      const { NAVIGATION, ACTIONS } = KEYBOARD_SHORTCUTS;
      const key = event.key;
      const lowerKey = key.toLowerCase();

      // Handle Navigation
      if (Object.values(NAVIGATION).includes(key as any)) {
        event.preventDefault();
        switch (key) {
          case NAVIGATION.UP:
            handleMove("up");
            break;
          case NAVIGATION.DOWN:
            handleMove("down");
            break;
          case NAVIGATION.LEFT:
            handleMove("left");
            break;
          case NAVIGATION.RIGHT:
            handleMove("right");
            break;
        }
        return;
      }

      // Handle Actions
      if (Object.values(ACTIONS).includes(lowerKey as any)) {
        event.preventDefault();
        switch (lowerKey) {
          case ACTIONS.GREEN:
            handleColorChange("G");
            if (autoMoveMakingGreen) {
              handleMove("down");
            }
            break;
          case ACTIONS.RED:
            handleColorChange("R");
            break;
          case ACTIONS.RESET:
            handleReset();
            break;
          case ACTIONS.DEFINITION:
            handleDefinition();
            break;
          case ACTIONS.SPEAK:
            playPronunciation();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleMove, handleColorChange, handleReset, handleDefinition]);

  const playPronunciation = async () => {
    if (!selectedWordData.pronunciation || isPlaying) return;
    setIsPlaying(true);

    try {
      const audio = new Audio(selectedWordData.pronunciation);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => setIsPlaying(false);
      await audio.play();
    } catch (error) {
      console.error("Error playing pronunciation:", error);
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-4 my-4">
      {/* CONTROL PANEL */}
      <div className="flex flex-col lg:flex-row justify-between gap-8">
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-6 w-full lg:w-2/3 border rounded-xl p-6 bg-white border-slate-200/70 dark:border-slate-800 dark:bg-slate-900/80">
          {/* Top Section: Navigation + Actions */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 w-full">
            {/* Navigation Group */}
            <div className="flex flex-col items-center gap-2 mx-auto md:mx-0">
              <Button
                variant="secondary"
                size="icon-lg"
                onClick={() => handleMove("up")}
                className="border border-gray-900 dark:border-slate-400/40 dark:text-slate-200"
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="icon-lg"
                  onClick={() => handleMove("left")}
                  className="border border-gray-900 dark:border-slate-400/40 dark:text-slate-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon-lg"
                  onClick={() => handleMove("down")}
                  className="border border-gray-900 dark:border-slate-400/40 dark:text-slate-200"
                >
                  <ArrowDown className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon-lg"
                  onClick={() => handleMove("right")}
                  className="border border-gray-900 dark:border-slate-400/40 dark:text-slate-200"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Navigation
              </span>
            </div>

            {/* Action Buttons Group */}
            <div className="flex flex-wrap justify-center md:justify-end gap-6 flex-1">
              <div className="flex flex-col items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleDefinition}
                  className="h-10 w-10 p-0 border-slate-800 dark:border-slate-500 font-bold"
                >
                  D
                </Button>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Definition
                </span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <Button
                  className="h-10 w-10 p-0 bg-green-100 text-green-700 hover:bg-green-200 border border-green-300 font-bold"
                  onClick={() => handleColorChange("G")}
                >
                  G
                </Button>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  I knew this
                </span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <Button
                  className="h-10 w-10 p-0 bg-red-100 text-red-700 hover:bg-red-200 border border-red-300 font-bold"
                  onClick={() => handleColorChange("R")}
                >
                  R
                </Button>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  I forgot this
                </span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="h-10 w-10 p-0 border-slate-800 dark:border-slate-500 font-bold"
                >
                  W
                </Button>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Reset
                </span>
              </div>

              {params?.slug !== "quant-mountain" && (
                <div className="flex flex-col items-center gap-2">
                  <Button
                    variant="outline"
                    className="h-10 w-10 p-0 border-orange-400 bg-orange-50 text-orange-600 hover:bg-orange-100 font-bold dark:bg-orange-900/30 dark:text-orange-200 dark:hover:bg-orange-900/50"
                    onClick={playPronunciation}
                    disabled={isPlaying}
                  >
                    S
                  </Button>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Speak
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Section: Filters */}
          <div className="flex flex-col sm:flex-row gap-4 w-full pt-4 border-t border-slate-100 dark:border-slate-800">
            <Select
              value={showFilter}
              onValueChange={(value) => dispatch(setShowFilter(value))}
            >
              <SelectTrigger className="w-full sm:flex-1">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <SelectValue placeholder="Filter Words" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <Funnel className="w-4 h-4 mr-2 inline-block text-slate-500" />
                  Show All
                </SelectItem>
                <SelectItem value="R">
                  <Palette className="w-4 h-4 mr-2 inline-block text-red-500" />
                  Show Red Only
                </SelectItem>
                <SelectItem value="G">
                  <Palette className="w-4 h-4 mr-2 inline-block text-green-500" />
                  Show Green Only
                </SelectItem>
                <SelectItem value="Noted">
                  <StickyNote className="w-4 h-4 mr-2 inline-block text-yellow-500" />
                  Show with noted Only
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={orderFilter}
              onValueChange={(value) => dispatch(setOrderFilter(value))}
            >
              <SelectTrigger className="w-full sm:flex-1">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <SelectValue placeholder="Order" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">
                  <ChevronsUpDown className="w-4 h-4 mr-2 inline-block text-slate-500" />
                  Default Order
                </SelectItem>
                <SelectItem value="shuffle-everything">
                  <Shuffle className="w-4 h-4 mr-2 inline-block text-slate-500" />
                  Shuffle Everything
                </SelectItem>
                <SelectItem value="shuffle-within-groups">
                  <Shuffle className="w-4 h-4 mr-2 inline-block text-slate-500" />
                  Shuffle Within Groups
                </SelectItem>
                <SelectItem value="group-by-color">
                  <Palette className="w-4 h-4 mr-2 inline-block text-slate-500" />
                  Sort Group by Color
                </SelectItem>
                <SelectItem value="everything-alphabetically">
                  <Baseline className="w-4 h-4 mr-2 inline-block text-slate-500" />
                  Sort Everything Alphabetically
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              className="shrink-0 text-slate-400 dark:text-slate-300"
            >
              <RefreshCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col justify-center gap-6 w-full lg:w-1/3 border rounded-xl p-8 bg-white border-slate-200/70 dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
              <Switch
                checked={isDefinitionOnNavigate}
                onCheckedChange={() =>
                  dispatch(setDefinitionOnNavigate(!isDefinitionOnNavigate))
                }
              />
              <span>Close Definition on Navigation</span>
            </div>
            <Button
              variant="destructive"
              onClick={handleResetEverything}
              className="h-9 px-4 bg-red-500 hover:bg-red-600 border-none font-medium text-white shadow-sm"
            >
              Reset Everything
            </Button>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
              <Switch
                checked={isCenterDefinition}
                onCheckedChange={() =>
                  dispatch(setCenterDefinition(!isCenterDefinition))
                }
              />
              <span>Center Definition</span>
            </div>
            <Button
              onClick={() => handleResetDay()}
              className="h-9 px-4 bg-blue-600 hover:bg-blue-700 font-medium text-white shadow-sm"
            >
              Reset Day {data.pagination.currentPage}
            </Button>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
              <Switch
                checked={isPrevDayColor}
                onCheckedChange={() =>
                  dispatch(setPrevDayColor(!isPrevDayColor))
                }
              />
              <span>Show Previous Day Color</span>
            </div>
            <Button
              onClick={() => dispatch(setIsControlOptionOpen(true))}
              className="h-9 px-4 bg-blue-600 hover:bg-blue-700 font-medium text-white shadow-sm"
            >
              Option
            </Button>
          </div>
        </div>
      </div>

      {/* CONTROL MODAL */}
      <ModalContainer
        title="Options"
        width="lg"
        open={isControlOptionOpen}
        onOpenChange={() =>
          dispatch(setIsControlOptionOpen(!isControlOptionOpen))
        }
      >
        <ControlModalOptions />
      </ModalContainer>
    </div>
  );
}
