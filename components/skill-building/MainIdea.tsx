"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowRight, ChevronRight, Info } from "lucide-react";
import ControlsBar from "./ControlsBar";
import SkillsTable from "./SkillsTable";
import type { IMainIdeaPractice } from "@/types/main-idea";
import { Activity } from "./skills";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { UserInfo } from "../auth/UserInfo";
import { Skeleton } from "../ui/skeleton";

interface MainIdeaProps {
  data: IMainIdeaPractice[];
}

export default function MainIdea({ data = [] }: MainIdeaProps) {
  const { isSubscribed, user, loading } = useCurrentUser();

  // Map server data to the format expected by SkillsTable
  const activities: Activity[] = data.map((practice) => ({
    id: practice._id,
    title: practice.title,
    slug: practice.slug,
    details: `${practice.count} Paragraph${practice.count !== 1 ? "s" : ""}`,
    date: new Date(practice.createdAt).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
    done: practice.attempted,
  }));

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-10 bg-gray-200 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link
          href="/skill-building"
          className="font-medium text-gray-500 hover:text-blue-600 transition-colors"
        >
          Skill Building
        </Link>

        <ChevronRight className="h-4 w-4 text-gray-400" />

        <span className="font-semibold text-gray-900">Main Idea</span>
      </div>

      {!isSubscribed && !loading ? (
        <>
          <UserInfo user={user} />
        </>
      ) : (
        <>
          <ControlsBar />
          <SkillsTable data={activities} />
        </>
      )}
    </div>
  );
}
