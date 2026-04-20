"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { MountainContent } from "./IMountain";
import {
  moveSelection,
  setIsModalOpen,
  setSelectedId,
  setSelectedWordData,
} from "@/redux/features/mountain/mountainControlSlice";
import { Check, X } from "lucide-react";

interface Props {
  word: MountainContent;
  groupIndex: number;
  wordIndex: number;
}

export default function VocabularyCard({ word, groupIndex, wordIndex }: Props) {
  const dispatch = useAppDispatch();
  const { selectedWord, currentPage, isPrevDayColor, isColorBlindMode } =
    useAppSelector((state) => state.mountainControl);

  const handleSelect = () => {
    dispatch(moveSelection({ groupIndex, wordIndex }));
    dispatch(setSelectedId(word._id));
    dispatch(setSelectedWordData(word));
  };

  const handleOpenModal = () => {
    dispatch(setSelectedWordData(word));
    dispatch(setIsModalOpen(true));
  };

  const lastColor = Object.values(word.colors || {}).at(-1);
  const bgColorMap: Record<string, string> = {
    G: isColorBlindMode
      ? "bg-purple-200 dark:bg-purple-900/40"
      : "bg-green-200 dark:bg-green-900/40",
    R: isColorBlindMode
      ? "bg-orange-400 dark:bg-orange-900/50"
      : "bg-red-200 dark:bg-red-900/40",
    Y: isColorBlindMode
      ? "bg-yellow-400 dark:bg-yellow-900/50"
      : "bg-yellow-200 dark:bg-yellow-900/40",
  };
  const bgColor = bgColorMap[lastColor ?? ""] || "";
  const bgColorCurrentGroup =
    groupIndex + 1 === currentPage ? bgColorMap[lastColor ?? ""] : "";

  const isSelected = selectedWord === word._id;

  return (
    <div
      title="Double-click to open details"
      onClick={handleSelect}
      onDoubleClick={handleOpenModal}
      className={`cursor-pointer p-2 rounded border-2 transition-all duration-200
        ${isPrevDayColor ? bgColor : bgColorCurrentGroup}
        ${isSelected ? "border-blue-500" : "border-gray-100 dark:border-slate-700"}
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-800 dark:text-slate-100">
            {word.title}
          </span>
          {word.description &&
            word.description.split(/<hr\s*\/?>/i).length > 1 && (
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-200"
                title={`${
                  word.description.split(/<hr\s*\/?>/i).length
                } definitions`}
              >
                {word.description.split(/<hr\s*\/?>/i).length}
              </span>
            )}
        </div>
        {isColorBlindMode &&
          ((bgColor === "bg-orange-400" && (
            <span className="cursor-pointer rounded-full bg-gray-950">
              <X size={12} color={"red"} />
            </span>
          )) ||
            (bgColor === "bg-purple-200" && (
              <span>
                <Check size={14} />
              </span>
            )))}
      </div>
    </div>
  );
}
