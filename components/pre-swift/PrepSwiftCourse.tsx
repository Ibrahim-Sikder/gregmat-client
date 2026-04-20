"use client";
import CourseGroups from "./CourseGroups";
import PrepControls from "./PrepControls";
import { CourseData, Category } from "./prepswift";
import { useAppSelector } from "@/redux/hooks";

interface Props {
  data: CourseData;
}

export default function PrepSwiftCourse({ data }: Props) {
  const categories = data?.categories || [];

  const { selectedCategory } = useAppSelector(
    (state) => state.prepSwiftControl,
  );

  const filteredCategories =
    selectedCategory.length > 0
      ? categories.filter((c) => selectedCategory.includes(c.title))
      : categories;

  return (
    <div className="space-y-10">
      <PrepControls title={data?.title} categories={categories} />
      <div className="space-y-8">
        {filteredCategories.length > 0 ? (
          filteredCategories?.map((category: Category) => (
            <CourseGroups
              key={category._id}
              group={category}
              courseId={data?._id}
              courseSlug={data?.slug}
            />
          ))
        ) : (
          <p className="italic text-gray-500 dark:text-gray-400">
            No categories found for this course.
          </p>
        )}
      </div>
    </div>
  );
}
