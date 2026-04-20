"use client";
import { setClasses } from "@/redux/features/courses/courseClassSlice";
import ClassCard from "./ClassCard";
import { useAppDispatch } from "@/redux/hooks";
import { useEffect } from "react";

export function CourseSection({ group }: { group: any }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (group?.classes) {
      dispatch(setClasses(group.classes));
    }
  }, [group, dispatch]);

  const getGridCols = (classes: any[]) => {
    if (!classes || classes.length === 0) return "grid-cols-1";

    const size = classes[0].thumbnailSize || 3;

    switch (size) {
      case 3:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"; // 4 items per row on large screens
      case 4:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"; // 3 items per row on large screens
      case 6:
        return "grid-cols-1 sm:grid-cols-2"; // 2 items per row
      case 12:
        return "grid-cols-1"; // 1 item per row (full width)
      default:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"; // fallback
    }
  };

  return (
    <div className="pb-16">
      {group.title && (
        <h2 className="text-xl font-semibold mb-6 text-gray-700">
          {group.title}
        </h2>
      )}
      <div className="mb-6">
        {group.description && (
          <div
            dangerouslySetInnerHTML={{ __html: group.description }}
            className="prose"
          />
        )}
      </div>

      {group.classes && group.classes.length > 0 ? (
        <div className={`grid gap-4 ${getGridCols(group.classes)}`}>
          {group.classes.map((cls: any) => (
            <ClassCard key={cls._id} cls={cls} />
          ))}
        </div>
      ) : (
        <div className="italic py-8 text-center text-base border rounded-lg">
          No classes available in this group.
        </div>
      )}
    </div>
  );
}
