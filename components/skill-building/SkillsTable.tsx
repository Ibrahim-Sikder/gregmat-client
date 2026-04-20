"use client";
import { ArrowUpDown, Badge } from "lucide-react";
import React, { useState } from "react";
import { Activity } from "./skills";
import Link from "next/link";

interface Props {
  data?: Activity[];
}

export default function SkillsTable({ data = [] }: Props) {
  const [activities, setActivities] = useState<Activity[]>(data);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Activity | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const toggleDone = (id: string | number) => {
    setActivities(
      activities.map((activity) =>
        activity.id === id ? { ...activity, done: !activity.done } : activity,
      ),
    );
  };

  const handleSort = (key: keyof Activity) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedActivities = [...activities].sort((a, b) => {
      if (a[key] === undefined || b[key] === undefined) return 0;
      if (a[key]! < b[key]!) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key]! > b[key]!) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    setActivities(sortedActivities);
  };

  if (data.length < 0) return <h4>Data is coming soon</h4>;
  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left w-12"></th>
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("title")}
              >
                <div className="flex items-center gap-2 font-semibold text-gray-700">
                  Title
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("details")}
              >
                <div className="flex items-center gap-2 font-semibold text-gray-700">
                  Details
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left bg-blue-100 cursor-pointer hover:bg-blue-200"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center gap-2 font-semibold text-gray-700">
                  Date
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left bg-blue-500 cursor-pointer hover:bg-blue-600"
                onClick={() => handleSort("done")}
              >
                <div className="flex items-center gap-2 font-semibold text-white">
                  Done
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr
                key={activity.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3">
                  <Badge className="bg-blue-600 text-white px-2 py-1 text-xs font-semibold rounded">
                    GregMat
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/skill-building/main-idea/${activity.slug}`}
                    className="text-blue-600 hover:underline"
                  >
                    {activity.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-600 text-sm">
                  {activity.details}
                </td>
                <td className="px-4 py-3 text-gray-600 text-sm">
                  {activity.date}
                </td>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={!!activity.done}
                    onChange={() => toggleDone(activity.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
