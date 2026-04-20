"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DayNavigationProps {
  currentPage: number;
  totalPages: number;
  slug: string;
}

export default function DayNavigation({
  currentPage,
  totalPages,
  slug,
}: DayNavigationProps) {
  const router = useRouter();
  const [page, setPage] = useState(currentPage);

  // handle slider drag
  const handleChange = (value: number[]) => setPage(value[0]);

  // navigate when slider released
  const handleCommit = (value: number[]) => {
    const selected = value[0];
    if (selected !== currentPage) {
      router.push(`/mountains/${slug}?page=${selected}`);
    }
  };

  // handle select change
  const handleSelect = (value: string) => {
    const selected = parseInt(value);
    setPage(selected);
    if (selected !== currentPage) {
      router.push(`/mountains/${slug}?page=${selected}`);
    }
  };

  // handle prev/next
  const handlePrev = () => {
    if (page > 1) {
      const prevPage = page - 1;
      setPage(prevPage);
      router.push(`/mountains/${slug}?page=${prevPage}`);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      router.push(`/mountains/${slug}?page=${nextPage}`);
    }
  };

  return (
    <div className="w-full bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-6 space-y-6">
      <div className="w-full flex flex-col items-center gap-6">
        {/* Navigation Controls */}
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
          <button
            onClick={handlePrev}
            disabled={page <= 1}
            className="p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            aria-label="Previous Day"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 px-2 font-medium text-slate-700 dark:text-slate-200">
            <span className="text-sm text-slate-400 dark:text-slate-400">
              Day
            </span>

            <Select onValueChange={handleSelect} value={String(page)}>
              <SelectTrigger className="h-8 w-[70px] border-none bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 focus:ring-0 text-base font-bold text-center px-0 justify-center">
                <SelectValue placeholder={String(page)} />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <SelectItem key={idx} value={String(idx + 1)}>
                    {idx + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className="text-sm text-slate-400 dark:text-slate-400">
              of {totalPages}
            </span>
          </div>

          <button
            onClick={handleNext}
            disabled={page >= totalPages}
            className="p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            aria-label="Next Day"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Slider Section */}
        <div className="w-full px-4">
          <Slider
            className="cursor-pointer"
            min={1}
            max={totalPages}
            step={1}
            value={[page]}
            onValueChange={handleChange}
            onValueCommit={handleCommit}
          />
          <div className="flex justify-between mt-2 text-xs font-medium text-slate-400 dark:text-slate-400">
            <span>Day 1</span>
            <span>Day {totalPages}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
