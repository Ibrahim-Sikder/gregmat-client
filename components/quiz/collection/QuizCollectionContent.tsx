"use client";

import { useState, useMemo } from "react";
import { QuizCollectionHeader } from "./QuizCollectionHeader";
import { QuizGroupAccordion } from "./QuizGroupAccordion";
import { QuizCollectionContentProps, QuizGroup, QuizItem } from "./types";
import { QuizRow } from "./QuizRow";
import {
  ArrowUpDown,
  ArrowUpNarrowWide,
  ArrowDownWideNarrow,
} from "lucide-react";

export type SortField =
  | "title"
  | "firstScore"
  | "latestScore"
  | "classAvg"
  | "attempts";
export type SortDirection = "asc" | "desc" | null;

// 3 states: null (grouped) -> "flat" (flat list, no sort) -> "asc" -> "desc" -> null
export type SortState = "flat" | "asc" | "desc" | null;

export interface SortConfig {
  field: SortField;
  state: SortState;
}

export default function QuizCollectionContent({
  collectionData,
}: QuizCollectionContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>(
    {},
  );
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: "title",
    state: null,
  });

  // Calculate totals from API data
  const totalQuizzes = collectionData?.quiz_groups.reduce(
    (sum, group) => sum + group.quizzes.length,
    0,
  );

  const completedQuizzes = collectionData.quiz_groups.reduce(
    (sum, group) => sum + (group.statistics?.completed_quizzes || 0),
    0,
  );

  // Handle sorting - 3 click cycle: flat -> asc -> desc -> null (back to groups)
  const handleSort = (field: SortField) => {
    setSortConfig((prev) => {
      // If clicking a different field, start from flat
      if (prev.field !== field) {
        return { field, state: "flat" };
      }
      // Same field - cycle through states
      if (prev.state === null) {
        return { field, state: "flat" };
      }
      if (prev.state === "flat") {
        return { field, state: "asc" };
      }
      if (prev.state === "asc") {
        return { field, state: "desc" };
      }
      // desc -> null (back to grouped view)
      return { field, state: null };
    });
  };

  // Check if we're in flat view mode
  const isFlatView = sortConfig.state !== null;

  // Filter groups based on search
  const filteredGroups = useMemo(() => {
    return collectionData.quiz_groups.map((group) => ({
      ...group,
      quizzes: group.quizzes.filter((item) =>
        item.quiz.title.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }));
  }, [collectionData.quiz_groups, searchQuery]);

  // Get all quizzes flattened and sorted for flat view
  const flattenedQuizzes = useMemo(() => {
    if (!isFlatView) return [];

    // Flatten all quizzes from all groups
    const allQuizzes = filteredGroups.flatMap((group) => group.quizzes);

    // If state is "flat", no sorting, just show flat list
    if (sortConfig.state === "flat") {
      return allQuizzes;
    }

    // Sort if state is "asc" or "desc"
    return [...allQuizzes].sort((a, b) => {
      let aValue: number | string = 0;
      let bValue: number | string = 0;

      const aAttempts = a.quiz.attempts || [];
      const bAttempts = b.quiz.attempts || [];
      const aFirstAttempt = aAttempts.find((att) => att.first === true);
      const bFirstAttempt = bAttempts.find((att) => att.first === true);
      const aLastAttempt =
        aAttempts.length > 0 ? aAttempts[aAttempts.length - 1] : null;
      const bLastAttempt =
        bAttempts.length > 0 ? bAttempts[bAttempts.length - 1] : null;

      switch (sortConfig.field) {
        case "title":
          aValue = a.quiz.title.toLowerCase();
          bValue = b.quiz.title.toLowerCase();
          break;
        case "firstScore":
          aValue = aFirstAttempt?.normalized_score ?? -1;
          bValue = bFirstAttempt?.normalized_score ?? -1;
          break;
        case "latestScore":
          aValue = aLastAttempt?.normalized_score ?? -1;
          bValue = bLastAttempt?.normalized_score ?? -1;
          break;
        case "classAvg":
          aValue = a.quiz.normalized_mean_score ?? -1;
          bValue = b.quiz.normalized_mean_score ?? -1;
          break;
        case "attempts":
          aValue = aAttempts.length;
          bValue = bAttempts.length;
          break;
      }

      if (aValue < bValue) return sortConfig.state === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.state === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredGroups, sortConfig, isFlatView]);

  const toggleGroup = (index: number) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<number, boolean> = {};
    collectionData.quiz_groups.forEach((_, index) => {
      allExpanded[index] = true;
    });
    setExpandedGroups(allExpanded);
  };

  const collapseAll = () => {
    setExpandedGroups({});
  };

  return (
    <div className="space-y-6 w-full mx-auto">
      {/* Content Body */}
      {collectionData.body && (
        <div
          dangerouslySetInnerHTML={{ __html: collectionData.body }}
          className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-700 mt-10"
        />
      )}

      {/* Quiz Section */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 lg:p-8 mb-8 bg-white dark:bg-gray-900">
        <QuizCollectionHeader
          completedQuizzes={completedQuizzes}
          totalQuizzes={totalQuizzes}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onExpandAll={expandAll}
          onCollapseAll={collapseAll}
        />

        {/* Table Header for Sorting */}
        <div className="hidden md:grid grid-cols-[4fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-3 mb-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <SortableHeader
            label="Title"
            field="title"
            sortConfig={sortConfig}
            onSort={handleSort}
          />
          <SortableHeader
            label="My First Score"
            field="firstScore"
            sortConfig={sortConfig}
            onSort={handleSort}
            className="text-center"
          />
          <SortableHeader
            label="My Latest Score"
            field="latestScore"
            sortConfig={sortConfig}
            onSort={handleSort}
            className="text-center"
          />
          <SortableHeader
            label="Class Avg. (First Attempt)"
            field="classAvg"
            sortConfig={sortConfig}
            onSort={handleSort}
            className="text-center"
          />
          <SortableHeader
            label="My Attempts"
            field="attempts"
            sortConfig={sortConfig}
            onSort={handleSort}
            className="text-center"
          />
        </div>

        {/* Flat View - All quizzes in one list */}
        {isFlatView ? (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {flattenedQuizzes.length > 0 ? (
                flattenedQuizzes.map((quizItem) => (
                  <QuizRow
                    key={quizItem.quiz._id}
                    quizItem={quizItem}
                    collectionId={collectionData._id}
                  />
                ))
              ) : (
                <div className="p-12 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    No quizzes found.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Grouped View - Quiz Groups */
          <div className="space-y-4">
            {filteredGroups.map((group, index) => (
              <QuizGroupAccordion
                key={group.slug}
                group={group}
                isExpanded={expandedGroups[index] || false}
                onToggle={() => toggleGroup(index)}
                collectionId={collectionData._id}
                collectionSlug={collectionData.slug}
              />
            ))}
          </div>
        )}

        {/* No Results Message */}
        {filteredGroups.every((group) => group.quizzes.length === 0) &&
          searchQuery && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No quizzes found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                No quizzes match your search for{" "}
                <span className="font-semibold">"{searchQuery}"</span>
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
      </div>
    </div>
  );
}

// Sortable Header Component
interface SortableHeaderProps {
  label: string;
  field: SortField;
  sortConfig: SortConfig;
  onSort: (field: SortField) => void;
  className?: string;
}

function SortableHeader({
  label,
  field,
  sortConfig,
  onSort,
  className = "",
}: SortableHeaderProps) {
  const isActive = sortConfig.field === field && sortConfig.state !== null;
  const isAsc = isActive && sortConfig.state === "asc";
  const isDesc = isActive && sortConfig.state === "desc";
  const isFlat = isActive && sortConfig.state === "flat";

  // Determine which icon to show
  const renderIcon = () => {
    if (isAsc) {
      return <ArrowUpNarrowWide className="w-4 h-4 text-blue-600" />;
    }
    if (isDesc) {
      return <ArrowDownWideNarrow className="w-4 h-4 text-blue-600" />;
    }
    if (isFlat) {
      return <ArrowUpDown className="w-4 h-4 text-orange-500" />;
    }
    return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
  };

  return (
    <button
      onClick={() => onSort(field)}
      className={`flex cursor-pointer items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors ${className}`}
    >
      <span className="truncate">{label}</span>
      {renderIcon()}
    </button>
  );
}
