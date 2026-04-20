"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronUp,
  ArrowUpDown,
  ExternalLink,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useRouter } from "next/navigation";
import { getMountains, getMountainBySlug } from "@/actions/mountain";
import { createVocabCheck, getVocabChecks } from "@/actions/vocab-check";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "react-toastify";
import { UserInfo } from "@/components/auth/UserInfo";

export default function VocabCheckHome() {
  const router = useRouter();
  const [mountains, setMountains] = useState<any[]>([]);
  const [selectedMountain, setSelectedMountain] = useState<string>("");
  const [mountainDetails, setMountainDetails] = useState<any>(null);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [wordCount, setWordCount] = useState<string>("20");
  const [pastActivities, setPastActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [groupRange, setGroupRange] = useState<number[]>([1, 5]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { isSubscribed, user, loading: userLoading } = useCurrentUser();

  useEffect(() => {
    if (!mountainDetails || selectedGroups.length === 0) return;

    const selectedCats = mountainDetails.mountain_categories.filter(
      (cat: any) => selectedGroups.includes(cat._id),
    );

    if (selectedCats.length > 0) {
      const orders = selectedCats.map((c: any) => c.order);
      const min = Math.min(...orders);
      const max = Math.max(...orders);
      // Only update if different to avoid potential loops
      if (min !== groupRange[0] || max !== groupRange[1]) {
        setGroupRange([min, max]);
      }
    }
  }, [selectedGroups, mountainDetails]);

  useEffect(() => {
    async function init() {
      const ms = await getMountains();
      const vocabMountains = (ms || []).filter(
        (m: any) => m.mountainType === "vocab" || m.mountainType === "toefl",
      );
      setMountains(vocabMountains);
      if (vocabMountains.length > 0) {
        setSelectedMountain(vocabMountains[0].slug);
      }

      const checks = await getVocabChecks();
      setPastActivities(checks?.results || []);
      setLoading(false);
    }
    init();
  }, []);

  useEffect(() => {
    if (selectedMountain) {
      async function fetchDetails() {
        setDetailsLoading(true);
        const details = await getMountainBySlug(selectedMountain, {
          limit: 100,
        });

        if (details?.mountain_categories) {
          // Check if orders start from 0 and normalize to 1-indexed if necessary
          const firstOrder = Math.min(
            ...details.mountain_categories.map((c: any) => c.order),
          );
          if (firstOrder === 0) {
            details.mountain_categories = details.mountain_categories.map(
              (c: any) => ({
                ...c,
                order: c.order + 1,
              }),
            );
          }
        }

        setMountainDetails(details);
        if (details?.mountain_categories?.length > 0) {
          // Select first 5 groups by default to match gregmat UI
          setSelectedGroups(
            details.mountain_categories.slice(0, 5).map((c: any) => c._id),
          );
          setGroupRange([1, Math.min(5, details.mountain_categories.length)]);
        } else {
          setSelectedGroups([]);
          setGroupRange([1, 1]);
        }
        setDetailsLoading(false);
      }
      fetchDetails();
    }
  }, [selectedMountain]);

  const handleRangeChange = (value: number[]) => {
    setGroupRange(value);
    if (!mountainDetails) return;

    const [start, end] = value;
    const selected = mountainDetails.mountain_categories
      .filter((cat: any) => cat.order >= start && cat.order <= end)
      .map((cat: any) => cat._id);

    setSelectedGroups(selected);
  };

  const handleGroupToggle = (groupId: string) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId],
    );
  };

  const handleStart = async () => {
    if (selectedGroups.length === 0) return;
    setIsCreating(true);
    const newCheck = await createVocabCheck({
      mountainId: mountainDetails._id,
      categoryIds: selectedGroups,
      wordCount: parseInt(wordCount),
    });
    if (newCheck && newCheck._id) {
      router.push(`/skill-building/vocab-check/${newCheck._id}`);
    } else if (newCheck && newCheck.id) {
      router.push(`/skill-building/vocab-check/${newCheck.id}`);
    } else {
      setIsCreating(false);
    }
  };

  const chunks = useMemo(() => {
    if (!mountainDetails?.mountain_categories) return [];
    const sorted = [...mountainDetails.mountain_categories].sort(
      (a, b) => a.order - b.order,
    );
    const result = [];
    for (let i = 0; i < sorted.length; i += 5) {
      result.push(sorted.slice(i, i + 5));
    }
    return result;
  }, [mountainDetails]);

  if (loading || userLoading || detailsLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link
          href="/skill-building"
          className="font-medium text-gray-500 hover:text-blue-600 transition-colors"
        >
          Skill Building
        </Link>

        <ChevronRight className="h-4 w-4 text-gray-400" />

        <span className="font-semibold text-gray-900">Vocab Check</span>
      </div>

      {!isSubscribed ? (
        <>
          <UserInfo user={user} />
        </>
      ) : (
        <>
          <div className="bg-white rounded-xl border p-6 space-y-6 ">
            <div className="flex flex-wrap items-center gap-6">
              <div className="w-64">
                <Select
                  value={selectedMountain}
                  onValueChange={setSelectedMountain}
                >
                  <SelectTrigger className="h-10 border-gray-200">
                    <SelectValue placeholder="Select Mountain" />
                  </SelectTrigger>
                  <SelectContent>
                    {mountains.map((m) => (
                      <SelectItem key={m.slug} value={m.slug}>
                        {m.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <RadioGroup
                value={wordCount}
                onValueChange={setWordCount}
                className="flex items-center gap-4"
              >
                {[10, 15, 20, 30].map((count) => (
                  <div key={count} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={count.toString()}
                      id={`count-${count}`}
                      className="text-blue-600 border-gray-300"
                    />
                    <Label
                      htmlFor={`count-${count}`}
                      className="text-sm font-medium text-gray-600 cursor-pointer"
                    >
                      {count} Words
                    </Label>
                  </div>
                ))}
                <div className="flex items-center gap-2 ml-2">
                  <RadioGroupItem
                    value="custom"
                    id="count-custom"
                    className="text-blue-600 border-gray-300"
                  />
                  <input
                    type="number"
                    className="w-12 h-8 border rounded-md px-1 text-center text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                    defaultValue={20}
                    onChange={(e) => setWordCount(e.target.value)}
                  />
                  <Label
                    htmlFor="count-custom"
                    className="text-sm font-medium text-gray-600 cursor-pointer"
                  >
                    Words
                  </Label>
                </div>
              </RadioGroup>

              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2 ml-auto "
                onClick={handleStart}
                disabled={selectedGroups.length === 0 || isCreating}
              >
                {isCreating ? "Starting..." : "Start"}
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>

            {detailsLoading ? (
              <div className="space-y-6 pt-4 border-t border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-full max-w-xl mx-4" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="h-5 w-16" />
                      <div className="space-y-3">
                        {[...Array(5)].map((_, j) => (
                          <div key={j} className="flex items-center space-x-2">
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-4 w-20" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              mountainDetails && (
                <div className="space-y-6 pt-4 border-t border-gray-100">
                  <div
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    <h3 className="font-semibold text-gray-800 whitespace-nowrap min-w-[120px]">
                      Groups {groupRange[0]} to {groupRange[1]}
                    </h3>

                    <div
                      className="flex-grow max-w-xl mx-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Slider
                        defaultValue={[1, 5]}
                        value={groupRange}
                        min={1}
                        max={mountainDetails.mountain_categories.length}
                        step={1}
                        onValueChange={handleRangeChange}
                        className="[&_[data-slot=slider-range]]:bg-blue-600 [&_[data-slot=slider-thumb]]:border-blue-600"
                      />
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-gray-100/50"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </Button>
                  </div>

                  {isExpanded && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 bg-gray-50/50 p-6 rounded-xl border border-dashed border-gray-200 animate-in fade-in slide-in-from-top-2 duration-300">
                      {chunks.map((chunk, idx) => {
                        const rangeLabel = `${chunk[0].order}-${chunk[chunk.length - 1].order}`;
                        const chunkIds = chunk.map((c: any) => c._id);
                        const isAllSelected =
                          chunkIds.length > 0 &&
                          chunkIds.every((id: string) =>
                            selectedGroups.includes(id),
                          );

                        return (
                          <div key={idx} className="space-y-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`range-${idx}`}
                                checked={isAllSelected}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedGroups((prev) =>
                                      Array.from(
                                        new Set([...prev, ...chunkIds]),
                                      ),
                                    );
                                  } else {
                                    setSelectedGroups((prev) =>
                                      prev.filter(
                                        (id) => !chunkIds.includes(id),
                                      ),
                                    );
                                  }
                                }}
                                className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                              />
                              <Label
                                htmlFor={`range-${idx}`}
                                className="text-sm font-bold text-gray-800 cursor-pointer whitespace-nowrap"
                              >
                                {rangeLabel}
                              </Label>
                            </div>
                            <div className="space-y-3">
                              {chunk.map((cat: any) => (
                                <div
                                  key={cat._id}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={cat._id}
                                    checked={selectedGroups.includes(cat._id)}
                                    onCheckedChange={() =>
                                      handleGroupToggle(cat._id)
                                    }
                                    className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                  />
                                  <Label
                                    htmlFor={cat._id}
                                    className="text-sm text-gray-600 font-medium cursor-pointer whitespace-nowrap"
                                  >
                                    Group {cat.order}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Showing {pastActivities.length} of {pastActivities.length}{" "}
              activities.
            </h2>
            <div className="bg-white rounded-xl border overflow-hidden ">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-6 py-4 font-semibold text-gray-700 text-sm">
                        Title <ArrowUpDown className="inline h-3 w-3 ml-1" />
                      </th>
                      <th className="px-6 py-4 font-semibold text-gray-700 text-sm">
                        Details <ArrowUpDown className="inline h-3 w-3 ml-1" />
                      </th>
                      <th className="px-6 py-4 font-semibold text-white text-sm bg-blue-600">
                        Date <ArrowUpDown className="inline h-3 w-3 ml-1" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pastActivities.map((activity, idx) => (
                      <tr
                        key={activity.id}
                        className="border-b hover:bg-gray-50/80 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <Link
                            href={`/skill-building/vocab-check/${activity.id}`}
                            className="text-blue-600 hover:underline font-medium"
                          >
                            Vocab Check {pastActivities.length - idx}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2 items-center">
                            <Badge
                              variant="secondary"
                              className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-none px-2 py-0.5 font-normal"
                            >
                              {activity.word_count} words
                            </Badge>
                            <span className="text-xs text-gray-400">|</span>
                            <span className="text-sm text-gray-500">
                              Groups{" "}
                              {activity.groups
                                .map((g: any) => g.number)
                                .join(", ")}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 font-medium whitespace-nowrap">
                          {new Date(activity.created_at).toLocaleDateString(
                            undefined,
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}{" "}
                          -{" "}
                          {new Date(activity.created_at).toLocaleTimeString(
                            undefined,
                            {
                              hour: "numeric",
                              minute: "2-digit",
                            },
                          )}
                        </td>
                      </tr>
                    ))}
                    {pastActivities.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-6 py-12 text-center text-gray-400 italic"
                        >
                          No past activities found. Start your first vocab
                          check!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
