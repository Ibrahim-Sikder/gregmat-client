import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface QuizCollectionHeaderProps {
  completedQuizzes: number;
  totalQuizzes: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

export const QuizCollectionHeader = ({
  completedQuizzes,
  totalQuizzes,
  searchQuery,
  onSearchChange,
  onExpandAll,
  onCollapseAll,
}: QuizCollectionHeaderProps) => {
  return (
    <div className="mb-6">
      {/* Top Row: Stats, Buttons, and Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
        {/* Quizzes Completed Box */}
        <div className="rounded-lg px-5 py-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 min-w-fit">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Quizzes Completed
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
            {completedQuizzes} out of {totalQuizzes}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <Button
            onClick={onExpandAll}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Expand All Quiz Groups
          </Button>
          <Button
            onClick={onCollapseAll}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Collapse All Quiz Groups
          </Button>

          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Quizzes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
