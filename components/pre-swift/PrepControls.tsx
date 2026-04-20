"use client";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { Switch } from "../ui/switch";
import { Category } from "./prepswift";
import {
  setSelectedCategory,
  clearSelectedCategories,
  toggleAutoPlay,
  togglePlayNext,
  toggleShowAction,
  toggleShowVideoDuration,
} from "@/redux/features/prepswift/prepswiftControls";
import { Check, SquareMousePointer } from "lucide-react";

interface Props {
  title: string;
  categories: Category[];
}

export default function PrepControls({ title, categories }: Props) {
  const dispatch = useAppDispatch();
  const {
    autoPlayVideo,
    playNextVideoAutomatic,
    showAction,
    showVideoDuration,
    selectedCategory,
  } = useAppSelector((state) => state.prepSwiftControl);

  return (
    <section className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center py-4 px-2 sm:px-4 lg:px-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
          {title}
        </h2>

        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none">
            <Switch
              checked={autoPlayVideo}
              onCheckedChange={() =>
                dispatch(toggleAutoPlay(), togglePlayNext())
              }
            />
            Autoplay Videos
          </label>

          {autoPlayVideo && (
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none">
              <button
                onClick={() => dispatch(togglePlayNext())}
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                aria-label="Toggle Play Next Automatically"
              >
                {playNextVideoAutomatic ? (
                  <Check size={18} className="text-green-500" />
                ) : (
                  <SquareMousePointer size={18} className="text-blue-500" />
                )}
              </button>
              Play Next Automatically
            </label>
          )}

          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none">
            <Switch
              checked={showAction}
              onCheckedChange={() => dispatch(toggleShowAction())}
            />
            Show Actions
          </label>

          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none">
            <Switch
              checked={showVideoDuration}
              onCheckedChange={() => dispatch(toggleShowVideoDuration())}
            />
            Video Durations
          </label>
        </div>
      </div>

      {categories?.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 px-2 sm:px-4 lg:px-6 py-3">
          <button
            onClick={() => dispatch(clearSelectedCategories())}
            className={`px-3 py-1.5 rounded-full cursor-pointer text-sm font-medium transition ${
              selectedCategory.length === 0
                ? "bg-blue-500 text-white"
                : "bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800"
            }`}
          >
            All
          </button>

          {categories.map((item) => (
            <button
              key={item._id}
              onClick={() => dispatch(setSelectedCategory(item.title))}
              className={`px-4 py-2 rounded-xl cursor-pointer text-sm font-medium transition shadow-sm
            ${
              selectedCategory.includes(item.title)
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
            }
          `}
            >
              {item.title}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
