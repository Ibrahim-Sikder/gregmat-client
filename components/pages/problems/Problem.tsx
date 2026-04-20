"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState, useTransition } from "react";
import ProblemControls, { type ProblemFiltersState } from "./ProblemControls";

import { getProblems } from "@/actions/practice";
import type { Problem, ProblemsResponse } from "@/types/problem.types";
import ProblemGrid from "./ProblemGrid";
import ProblemModal from "./ProblemModal";
import ProblemTable from "./ProblemTable";

interface ProblemsNewProps {
  initialData: ProblemsResponse | null;
  superCategory?: "Quant" | "Verbal";
  hideCategoryFilter?: boolean;
  hideTagsFilter?: boolean;
}

const initialFilters: ProblemFiltersState = {
  difficulties: [],
  statuses: [],
  questionTypes: [],
  categories: [],
  tags: [],
  hasSolution: false,
  hideDifficulty: false,
  search: "",
  viewMode: "list",
};

export default function Problems({
  initialData,
  superCategory = "Quant",
  hideCategoryFilter = false,
  hideTagsFilter = false,
}: ProblemsNewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [filters, setFilters] = useState<ProblemFiltersState>(initialFilters);
  const [problems, setProblems] = useState<Problem[]>(initialData?.data || []);
  const [meta, setMeta] = useState(
    initialData?.meta || { limit: 50, page: 1, total: 0, totalPage: 0 },
  );
  const [sortField, setSortField] = useState<string>("difficulty");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(
    null,
  );

  // Map frontend status values to backend values
  const mapStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      "To Do": "ToDo",
      Attempted: "Attempted",
      Solved: "Solved",
    };
    return statusMap[status] || status;
  };

  const fetchProblems = useCallback(
    async (page: number = 1, append: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await getProblems(superCategory, {
          page,
          limit: 50,
          // Difficulties are already in lowercase format (matching backend)
          difficulty:
            filters.difficulties.length > 0 ? filters.difficulties : undefined,
          status:
            filters.statuses.length > 0
              ? filters.statuses.map(mapStatus)
              : undefined,
          // Question types are already in backend format (e.g., "quantitative_comparison")
          type:
            filters.questionTypes.length > 0
              ? filters.questionTypes
              : undefined,
          tag: filters.tags.length > 0 ? filters.tags : undefined,
          category:
            filters.categories.length > 0 ? filters.categories : undefined,
          search: filters.search || undefined,
          has_solution: filters.hasSolution || undefined,
        });

        if (response) {
          if (append) {
            setProblems((prev) => [...prev, ...response.data]);
          } else {
            setProblems(response.data);
          }
          setMeta(response.meta);
        }
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [filters, superCategory],
  );

  // Fetch problems when filters change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      startTransition(() => {
        fetchProblems(1, false);
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    filters.difficulties,
    filters.statuses,
    filters.questionTypes,
    filters.categories,
    filters.tags,
    filters.hasSolution,
  ]);

  const handleSearch = () => {
    fetchProblems(1, false);
  };

  const handleRefresh = () => {
    fetchProblems(1, false);
  };

  const handleLoadMore = () => {
    if (meta.page < meta.totalPage) {
      fetchProblems(meta.page + 1, true);
    }
  };

  const handleRandomProblem = () => {
    if (problems.length > 0) {
      const randomIndex = Math.floor(Math.random() * problems.length);
      const randomProblem = problems[randomIndex];
      handleProblemClick(randomProblem._id);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // Problem click handler - open modal
  const handleProblemClick = (problemId: string) => {
    setSelectedProblemId(problemId);
    setModalOpen(true);
  };

  // Navigate to problem in modal
  const handleNavigateProblem = (problemId: string) => {
    setSelectedProblemId(problemId);
  };

  // Client-side sorting
  const sortedProblems = React.useMemo(() => {
    const sorted = [...problems];

    sorted.sort((a, b) => {
      let comparison = 0;

      if (sortField === "difficulty") {
        // Use lowercase for difficulty ordering
        const difficultyOrder: Record<string, number> = {
          easy: 1,
          medium: 2,
          hard: 3,
          extreme: 4,
          tbd: 0,
        };
        comparison =
          (difficultyOrder[a.difficulty?.toLowerCase()] || 0) -
          (difficultyOrder[b.difficulty?.toLowerCase()] || 0);
      } else if (sortField === "likes") {
        comparison = a.likes - b.likes;
      } else if (sortField === "successRate") {
        comparison = a.successRate - b.successRate;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [problems, sortField, sortOrder]);

  // Get all problem IDs for navigation (must come after sortedProblems)
  const problemIds = React.useMemo(
    () => sortedProblems.map((p) => p._id),
    [sortedProblems],
  );

  const hasMore = meta.page < meta.totalPage;

  const pageTitle =
    superCategory === "Verbal" ? "GRE Verbal Problems" : "GRE Quant Problems";

  // Handle problem update from modal (optimistic update to list)
  const handleProblemUpdate = (updatedProblem: Problem) => {
    setProblems((prevProblems) =>
      prevProblems.map((p) =>
        p._id === updatedProblem._id
          ? {
              ...p,
              // Update fields that might have changed
              status: updatedProblem.status,
              user_answer_attempts: updatedProblem.user_answer_attempts,
              liked: updatedProblem.liked,
              likes: updatedProblem.likes,
              bookmarked: updatedProblem.bookmarked,
              // Keep other list-specific fields or ensure updatedProblem has them
            }
          : p,
      ),
    );
  };

  return (
    <div className="space-y-6 py-6">
      <ProblemControls
        filters={filters}
        onFiltersChange={setFilters}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        onRandomProblem={handleRandomProblem}
        total={meta.total}
        showing={problems.length}
        onLoadMore={handleLoadMore}
        isLoading={isLoading || isPending}
        hasMore={hasMore}
        title={pageTitle}
        superCategory={superCategory}
        hideCategoryFilter={hideCategoryFilter}
        hideTagsFilter={hideTagsFilter}
      />

      {isLoading && problems.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filters.viewMode === "list" ? (
        <ProblemTable
          problems={sortedProblems}
          hideDifficulty={filters.hideDifficulty}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          onProblemClick={handleProblemClick}
        />
      ) : (
        <ProblemGrid
          problems={sortedProblems}
          hideDifficulty={filters.hideDifficulty}
          onProblemClick={handleProblemClick}
        />
      )}

      {/* Load more at bottom */}
      {problems.length > 0 && (
        <div className="flex flex-col items-center gap-2 pt-6 pb-4">
          {hasMore ? (
            <>
              <button
                onClick={handleLoadMore}
                disabled={isLoading || isPending}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg border border-border bg-background hover:bg-muted/50 text-foreground transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {isLoading || isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    Load more problems
                    <span className="text-muted-foreground">
                      ({meta.total - problems.length} remaining)
                    </span>
                  </>
                )}
              </button>
              <p className="text-xs text-muted-foreground">
                Showing {problems.length} of {meta.total} problems
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              All {meta.total} problems loaded
            </p>
          )}
        </div>
      )}

      {/* Problem Modal */}
      <ProblemModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        problemId={selectedProblemId}
        problemIds={problemIds}
        onNavigate={handleNavigateProblem}
        onProblemUpdate={handleProblemUpdate}
      />
    </div>
  );
}
