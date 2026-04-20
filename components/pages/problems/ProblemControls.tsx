"use client";

import React from "react";
import {
  RefreshCw,
  Shuffle,
  LayoutList,
  LayoutGrid,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MultiSelectFilter from "./MultiSelectFilter";
import {
  DIFFICULTIES,
  DIFFICULTY_DISPLAY,
  STATUSES,
  QUANT_QUESTION_TYPES,
  VERBAL_QUESTION_TYPES,
  QUESTION_TYPE_DISPLAY,
  CATEGORIES,
  TAGS,
} from "@/types/problem.types";

interface ProblemFiltersState {
  difficulties: string[];
  statuses: string[];
  questionTypes: string[];
  categories: string[];
  tags: string[];
  hasSolution: boolean;
  hideDifficulty: boolean;
  search: string;
  viewMode: "list" | "grid";
}

interface ProblemControlsProps {
  filters: ProblemFiltersState;
  onFiltersChange: (filters: ProblemFiltersState) => void;
  onSearch: () => void;
  onRefresh: () => void;
  onRandomProblem: () => void;
  total: number;
  showing: number;
  onLoadMore: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
  title?: string;
  superCategory?: "Quant" | "Verbal";
  hideCategoryFilter?: boolean;
  hideTagsFilter?: boolean;
}

export default function ProblemControls({
  filters,
  onFiltersChange,
  onSearch,
  onRefresh,
  onRandomProblem,
  total,
  showing,
  onLoadMore,
  isLoading = false,
  hasMore = false,
  title = "GRE Quant Problems",
  superCategory = "Quant",
  hideCategoryFilter = false,
  hideTagsFilter = false,
}: ProblemControlsProps) {
  const updateFilter = <K extends keyof ProblemFiltersState>(
    key: K,
    value: ProblemFiltersState[K],
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  // Get question types based on category
  const questionTypes =
    superCategory === "Verbal" ? VERBAL_QUESTION_TYPES : QUANT_QUESTION_TYPES;

  // Convert difficulty values to display names for the filter
  const difficultyOptions = DIFFICULTIES.map((d) => ({
    value: d,
    label: DIFFICULTY_DISPLAY[d] || d,
  }));

  // Convert question type values to display names
  const questionTypeOptions = questionTypes.map((t) => ({
    value: t,
    label: QUESTION_TYPE_DISPLAY[t] || t,
  }));

  return (
    <div className="space-y-5">
      {/* Page Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">
        {title}
      </h1>

      {/* Filter Controls */}
      <div className="space-y-4">
        {/* First Row - Difficulties, Status, Question Types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MultiSelectFilter
            label="Difficulties"
            options={difficultyOptions}
            selected={filters.difficulties}
            onSelectionChange={(selected) =>
              updateFilter("difficulties", selected)
            }
            placeholder="Select difficulties..."
          />
          <MultiSelectFilter
            label="Status"
            options={STATUSES}
            selected={filters.statuses}
            onSelectionChange={(selected) => updateFilter("statuses", selected)}
            placeholder="Select status..."
          />
          <MultiSelectFilter
            label="Question Types"
            options={questionTypeOptions}
            selected={filters.questionTypes}
            onSelectionChange={(selected) =>
              updateFilter("questionTypes", selected)
            }
            placeholder="Select types..."
          />
        </div>

        {/* Second Row - Categories, Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-end gap-4">
            {/* Checkboxes */}

            {!hideCategoryFilter && (
              <MultiSelectFilter
                label="Categories"
                options={CATEGORIES}
                selected={filters.categories}
                onSelectionChange={(selected) =>
                  updateFilter("categories", selected)
                }
                placeholder="Select categories..."
                className="flex-1"
              />
            )}
          </div>
          {!hideTagsFilter && (
            <MultiSelectFilter
              label="Tags"
              options={TAGS}
              selected={filters.tags}
              onSelectionChange={(selected) => updateFilter("tags", selected)}
              placeholder="Select tags..."
              showSearch
            />
          )}
        </div>
        <div className="flex items-center gap-6 pb-1">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="has-solution"
              checked={filters.hasSolution}
              onCheckedChange={(checked) =>
                updateFilter("hasSolution", checked === true)
              }
            />
            <Label
              htmlFor="has-solution"
              className="text-sm font-medium cursor-pointer"
            >
              Has Solution
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hide-difficulty"
              checked={filters.hideDifficulty}
              onCheckedChange={(checked) =>
                updateFilter("hideDifficulty", checked === true)
              }
            />
            <Label
              htmlFor="hide-difficulty"
              className="text-sm font-medium cursor-pointer"
            >
              Hide Difficulty
            </Label>
          </div>
        </div>
      </div>

      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center border-t pt-4">
        {/* Search Box */}
        <div className="relative flex-1 flex gap-2">
          <Input
            type="text"
            placeholder="Search for a question..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            className="flex-1"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Random Problem Button */}
        <Button onClick={onRandomProblem} className="gap-2">
          <Shuffle className="h-4 w-4" />
          Random Problem
        </Button>

        {/* View Mode Selector */}
        <Select
          value={filters.viewMode}
          onValueChange={(value: "list" | "grid") =>
            updateFilter("viewMode", value)
          }
        >
          <SelectTrigger className="w-[100px]">
            {filters.viewMode === "list" ? (
              <LayoutList className="h-4 w-4 mr-2" />
            ) : (
              <LayoutGrid className="h-4 w-4 mr-2" />
            )}
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="list">
              <div className="flex items-center gap-2">
                <LayoutList className="h-4 w-4" />
                List
              </div>
            </SelectItem>
            <SelectItem value="grid">
              <div className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                Grid
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Count and Load More */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>
            Showing {showing} of {total} problems
          </span>
          {hasMore && (
            <Button
              variant="outline"
              size="sm"
              onClick={onLoadMore}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Load More
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export type { ProblemFiltersState };
