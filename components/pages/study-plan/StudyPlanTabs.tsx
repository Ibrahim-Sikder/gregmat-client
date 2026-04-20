"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import React from "react";

function StudyPlanTabs({ data }: { data: { slug: string; sections?: any[] } }) {
  const pathname = usePathname();

  const tabs = [
    { label: "Home", href: `/study-plans/${data.slug}` },
    ...(data.sections?.map((section: any) => ({
      label: section.description,
      href: `/study-plans/${data.slug}/${section.slug}`,
    })) || []),
  ];

  return (
    <div className="mb-8 border-b border-gray-200 overflow-x-auto">
      <div className="flex gap-1 min-w-max">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link key={tab.href} href={tab.href}>
              <Button
                variant="ghost"
                className={`rounded-none px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "hover:text-blue-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default StudyPlanTabs;
