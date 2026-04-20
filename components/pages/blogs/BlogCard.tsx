import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TBlog } from './TBlog';

interface BlogCardProps {
  blog: TBlog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <Link href={`/more/blogs/${blog.slug}`}>
      <div className="border-1 shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition cursor-pointer flex flex-col h-full">
        <div className="relative w-full h-48 md:h-56 lg:h-60 flex-shrink-0">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw,
                   (max-width: 1200px) 50vw,
                   33vw"
          />
        </div>

        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-1">{blog.title}</h2>
            <h3 className="text-sm text-gray-500 mb-2">{blog.subTitle}</h3>
            <p className="text-sm line-clamp-4">{blog.description}</p>
          </div>

          <div className="flex items-center gap-3 mt-4 pt-4 border-t">
            <Image
              src={blog.author.image}
              alt={blog.author.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <p className="text-sm font-medium">{blog.author.name}</p>
              <p className="text-xs text-gray-500">{blog.author.date}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
