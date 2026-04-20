import CourseCard from "./CourseCard";

const SeriesSection = ({ series }: { series: any }) => {
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{series.title}</h2>
      {series.description && (
        <div
          dangerouslySetInnerHTML={{ __html: series.description }}
          className="text-gray-700 mb-4"
        />
      )}
      {series.courses && series.courses.length > 0 ? (
        <div className="grid grid-cols-6 gap-6">
          {series.courses.map((course: any) => (
            <CourseCard
              key={course._id}
              course={course}
              size={course.thumbnailSize || 4}
            />
          ))}
        </div>
      ) : (
        <div className="text-gray-400 italic py-8 text-center text-base border rounded-lg bg-gray-100">
          No courses available in this series.
        </div>
      )}
    </div>
  );
};

export default SeriesSection;
