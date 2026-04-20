import React from 'react';
import Image from 'next/image';
import { blogs } from './blogData'; // your blog array
import BlogCard from './BlogCard';

interface ViewBlogProps {
  slug: string;
}

export default function ViewDetails({ slug }: ViewBlogProps) {
  const blog = {
    id: 1,
    slug: 'mastering-typescript-2025',
    title: 'Mastering TypeScript in 2025',
    subTitle: 'A Complete Guide for Beginners to Advanced',
    description: `
TypeScript continues to dominate modern web development, offering developers type safety, better tooling, and cleaner code architecture. In 2025, it’s no longer just an optional add-on—it’s become the backbone of many large-scale applications and enterprise solutions.

In this article, we’ll walk through the latest TypeScript features, including new utility types, improved inference, and configuration strategies. You’ll also learn how to integrate TypeScript with frameworks like React, Next.js, and Node.js to unlock its full potential.

By the end, you’ll understand why TypeScript is considered essential for building scalable, maintainable, and production-ready applications—and how you can adopt it in both small projects and enterprise-level systems.
    `,
    image: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=1200',
    author: {
      name: 'Sarah Johnson',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      date: '2025-09-20',
    },
  };

  if (slug !== blog.slug) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Blog not found</h1>
      </div>
    );
  }

  return (
    <div className="py-4 px-4 lg:px-8 max-w-7xl mx-auto">
      <div className="relative w-full h-64 md:h-96 mb-6 rounded-xl overflow-hidden">
        <Image src={blog.image} alt={blog.title} fill className="object-cover" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{blog.title}</h1>
          <h2 className="text-lg md:text-xl text-gray-500 mb-6">{blog.subTitle}</h2>

          <div className="flex items-center gap-3 mb-6">
            <Image
              src={blog.author.image}
              alt={blog.author.name}
              width={50}
              height={50}
              className="rounded-full"
            />
            <div>
              <p className="text-sm md:text-base font-medium">{blog.author.name}</p>
              <p className="text-xs md:text-sm text-gray-500">{blog.author.date}</p>
            </div>
          </div>

          <p className="whitespace-pre-line">{blog.description}</p>
        </div>

        <div className="lg:w-1/3">
          <div className="my-4">
            <div className="border-b-2 mb-4">
              <h2 className="text-2xl font-bold mb-4">More Articles</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              {blogs
                .filter((item) => item.slug !== slug)
                .map((item) => (
                  <BlogCard blog={item} key={item?.id} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
