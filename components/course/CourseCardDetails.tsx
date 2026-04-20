import { ClassItem } from "./classgroups";

interface Props {
  course: ClassItem;
}

export default function CourseCardDetails({ course }: Props) {
  return (
    <div>
      {course.title && (
        <h1 className="text-2xl font-bold mb-4">{course.title}</h1>
      )}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: course.description }}
      />
    </div>
  );
}
