"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ClassCard = ({ cls }: { cls: any }) => {
  const { user, isSubscribed, loading } = useCurrentUser();
  const router = useRouter();

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-200 rounded-lg w-full aspect-video"></div>
    );
  }

  const href =
    cls.plusOnly && !isSubscribed
      ? "/user"
      : `/class/${cls.slug}?isPlus=${
          cls.plusOnly ? "true" : "false"
        }&ref=recordings`;

  return (
    <Link
      className="group block aspect-video rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
      href={href}
    >
      {cls.img ? (
        <div className="relative w-full h-full">
          <Image
            src={cls.img}
            alt={cls.title || "Class thumbnail"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover group-hover:brightness-90 transition duration-300"
            placeholder="blur"
            blurDataURL="/images/placeholder.png"
          />
        </div>
      ) : (
        <div className="w-full h-full bg-linear-to-br from-orange-400 to-orange-500 flex items-center justify-center p-4">
          <div className="text-center">
            <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2">
              {cls.title}
            </h3>
            {cls.classType && (
              <p className="text-xs text-orange-100 mt-1 line-clamp-1">
                {cls.classType}
              </p>
            )}
          </div>
        </div>
      )}
    </Link>
  );
};

export default ClassCard;
