"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button } from "@/components/ui/button";
import ModalContainer from "../shared/modal/ModalContainer";
import SheetContainer from "../shared/modal/SheetContainer";
import VocabularyCard from "./VocabularyCard";
import VocabularyModal from "./vocabulary-modal";
import { setIsModalOpen } from "@/redux/features/mountain/mountainControlSlice";
import { MountainCategory } from "./IMountain";
import { Viewer } from "react-latex-editor";
import RichText from "../pages/study-plan/RichText";

interface VocabularyGroupsProps {
  categories: MountainCategory[];
}

export default function VocabularyGroups({
  categories,
}: VocabularyGroupsProps) {
  const dispatch = useAppDispatch();
  const {
    selectedWordData,
    isOpenModal,
    isCenterDefinition,
    showFilter,
    orderFilter,
    notes,
    categories: reduxCategories,
  } = useAppSelector((state) => state.mountainControl);

  const displayCategories =
    reduxCategories.length > 0 ? reduxCategories : categories;

  const getProcessedWords = (
    words: (typeof categories)[0]["mountain_contents"],
  ) => {
    let filtered = words;

    if (showFilter === "G" || showFilter === "R") {
      filtered = filtered.filter((word) =>
        Object.values(word.colors || {}).includes(showFilter),
      );
    } else if (showFilter === "Noted") {
      filtered = filtered.filter((word) => !!notes[word._id]);
    }

    switch (orderFilter) {
      case "shuffle-within-groups":
        return [...filtered].sort(() => Math.random() - 0.5);
      case "group-by-color": {
        const priority = (word: any) => {
          const color = Object.values(word.colors || {})[0];
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

  const renderCategory = (
    category: MountainCategory,
    index: number,
    offset = 0,
  ) => {
    const words = getProcessedWords(category.mountain_contents);

    return (
      <div key={category._id} className="space-y-2">
        <div className="text-center">
          <h3 className="font-semibold mb-1">{category?.title}</h3>
          <RichText html={category?.description} />
        </div>

        <div className="space-y-1">
          {words.length > 0 ? (
            words.map((word, idx) => (
              <VocabularyCard
                key={word._id}
                word={word}
                wordIndex={idx}
                groupIndex={index}
              />
            ))
          ) : (
            <p className="text-center text-gray-400 dark:text-slate-400 text-sm">
              No words found
            </p>
          )}
        </div>
      </div>
    );
  };

  const firstSix = displayCategories.slice(0, 5);
  const remaining = displayCategories.slice(5);

  const colorValue = selectedWordData?.colors
    ? Object.values(selectedWordData.colors).at(-1)
    : null;

  const colorClass =
    colorValue === "G"
      ? "text-green-500"
      : colorValue === "R"
        ? "text-red-500"
        : "text-blue-500";

  return (
    <div className="p-6 space-y-8 text-slate-900 dark:text-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {firstSix.map((cat, i) => renderCategory(cat, i))}
      </div>

      {remaining.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {remaining.map((cat, i) => renderCategory(cat, i, 6))}
        </div>
      )}

      {selectedWordData &&
        (isCenterDefinition ? (
          <ModalContainer
            open={isOpenModal}
            onOpenChange={(open) => dispatch(setIsModalOpen(open))}
            title={<h2 className={colorClass}>{selectedWordData?.title}</h2>}
          >
            <VocabularyModal word={selectedWordData} />
          </ModalContainer>
        ) : (
          <SheetContainer
            open={isOpenModal}
            onOpenChange={(open) => dispatch(setIsModalOpen(open))}
            title={<h2 className={colorClass}>{selectedWordData?.title}</h2>}
          >
            <VocabularyModal word={selectedWordData} />
          </SheetContainer>
        ))}
    </div>
  );
}
