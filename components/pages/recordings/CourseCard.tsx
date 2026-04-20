"use client";

import Image from "next/image";
import Link from "next/link";

const CourseCard = ({ course, size = 4 }: { course: any; size?: number }) => {
  const sizeClass =
    size === 6
      ? "col-span-3"
      : size === 4
        ? "col-span-2"
        : size === 3
          ? "col-span-1"
          : size === 12
            ? "col-span-6"
            : "col-span-2";

  const getSizes = (size: number) =>
    size === 6
      ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      : size === 4
        ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        : size === 3
          ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
          : size === 12
            ? "100vw"
            : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw";

  return (
    <Link
      className={`${sizeClass} aspect-video rounded-lg overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300`}
      href={`/course/${course.slug}`}
    >
      <div className="w-full h-full relative">
        <Image
          src={course?.img || "/default-course-thumbnail.jpg"}
          alt={course?.title}
          fill
          sizes={getSizes(size)}
          className=" group-hover:brightness-90 transition duration-300"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZ..."
          priority={size === 6}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white font-semibold text-sm line-clamp-2">
              {course?.title}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
