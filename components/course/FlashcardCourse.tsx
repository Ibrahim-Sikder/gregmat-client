"use client";
import RichText from "../pages/study-plan/RichText";
import { FlashCourse, ClassItem, ClassGroup } from "./classgroups";
import FlashcardCourseCard from "./FlashcardCourseCard";

interface FlashcardCourseProps {
  data: FlashCourse;
}

export default function FlashcardCourse({ data }: FlashcardCourseProps) {
  return (
    <div className="py-8 ">
      {data.classgroups.map((classGroup: ClassGroup) => (
        <div key={classGroup._id} className="space-y-6 mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-center lg:text-left">
            {classGroup.title}
          </h2>

          {classGroup.description && <RichText html={classGroup.description} />}

          {/* Course Cards */}
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              gap-4
            "
          >
            {classGroup.classes.map((course: ClassItem, index: number) => (
              <FlashcardCourseCard
                key={course._id}
                course={course}
                courses={classGroup.classes}
                currentIndex={index}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
